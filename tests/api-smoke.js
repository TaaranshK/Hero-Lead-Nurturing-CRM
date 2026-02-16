const axios = require('axios');
const fs = require('fs');

const BASE = process.env.BASE_URL || 'http://localhost:9091';

async function request(config) {
  try {
    const res = await axios(config);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err.response) return { ok: false, status: err.response.status, data: err.response.data };
    return { ok: false, status: null, error: err.message };
  }
}

async function login(username, password) {
  const res = await request({ method: 'post', url: `${BASE}/auth/login`, data: { username, password }, headers: { 'Content-Type': 'application/json' } });
  if (res.ok && res.data?.token) return res.data.token;
  throw new Error(`login failed for ${username}: ${JSON.stringify(res)}`);
}

(async () => {
  console.log('\nAPI smoke tests (target = ' + BASE + ')\n');
  const results = [];

  // 1) unauthenticated access to /api/leads (should be 401)
  results.push({ name: 'GET /api/leads (unauthenticated)', result: await request({ method: 'get', url: `${BASE}/api/leads` }) });

  // 2) login as HO and DA
  let hoToken, daToken;
  try { hoToken = await login('ho_admin', '1234'); results.push({ name: 'POST /auth/login (ho_admin)', ok: true }); } catch (e) { results.push({ name: 'POST /auth/login (ho_admin)', ok: false, error: e.message }); }
  try { daToken = await login('da_agent', '1234'); results.push({ name: 'POST /auth/login (da_agent)', ok: true }); } catch (e) { results.push({ name: 'POST /auth/login (da_agent)', ok: false, error: e.message }); }

  const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

  // 3) Create a lead (HO)
  const leadPayload = {
    contactNumber: `9999${Math.floor(Math.random()*9000)+1000}`,
    firstName: 'Smoke',
    lastName: 'Tester',
    email: 'smoke@test.local',
    city: 'Mumbai',
    address: 'Test address',
    modelName: 'Model-X',
    leadSource: 'WEB',
    leadMode: 'ONLINE',
    followUpDate: '2026-02-20',
    governmentId: `GOV-${Date.now()}`,
    status: 'NEW'
  };

  const createRes = await request({ method: 'post', url: `${BASE}/api/leads`, data: leadPayload, headers: { ...authHeader(hoToken), 'Content-Type': 'application/json' } });
  results.push({ name: 'POST /api/leads', result: createRes });

  let createdId = null;
  if (createRes.ok && createRes.data?.data?.id) createdId = createRes.data.data.id;

  // 4) GET /api/leads (authenticated)
  results.push({ name: 'GET /api/leads', result: await request({ method: 'get', url: `${BASE}/api/leads`, headers: authHeader(hoToken) }) });

  // 5) GET /api/leads/{id}
  if (createdId) results.push({ name: `GET /api/leads/${createdId}`, result: await request({ method: 'get', url: `${BASE}/api/leads/${createdId}`, headers: authHeader(hoToken) }) });

  // 6) PUT /api/leads/{id}
  if (createdId) {
    const updatePayload = { ...leadPayload, firstName: 'SmokeUpdated', city: 'Pune' };
    results.push({ name: `PUT /api/leads/${createdId}`, result: await request({ method: 'put', url: `${BASE}/api/leads/${createdId}`, data: updatePayload, headers: { ...authHeader(hoToken), 'Content-Type': 'application/json' } }) });
  }

  // 7) GET /api/leads/{id}/modifications
  if (createdId) results.push({ name: `GET /api/leads/${createdId}/modifications`, result: await request({ method: 'get', url: `${BASE}/api/leads/${createdId}/modifications`, headers: authHeader(hoToken) }) });

  // 8) GET filters
  results.push({ name: 'GET /api/leads/filter/status?status=NEW', result: await request({ method: 'get', url: `${BASE}/api/leads/filter/status?status=NEW`, headers: authHeader(hoToken) }) });
  results.push({ name: 'GET /api/leads/filter/city?city=Mumbai', result: await request({ method: 'get', url: `${BASE}/api/leads/filter/city?city=Mumbai`, headers: authHeader(hoToken) }) });
  results.push({ name: 'GET /api/leads/filter/date', result: await request({ method: 'get', url: `${BASE}/api/leads/filter/date?fromDate=2020-01-01T00:00:00&toDate=2030-01-01T00:00:00`, headers: authHeader(hoToken) }) });

  // 9) Chat endpoints (send + get) — send message as HO
  if (createdId) {
    const chatSend = await request({ method: 'post', url: `${BASE}/api/chat/${createdId}`, data: 'Hello from smoke test', headers: { ...authHeader(hoToken), 'Content-Type': 'text/plain' } });
    results.push({ name: `POST /api/chat/${createdId}`, result: chatSend });
    results.push({ name: `GET /api/chat/${createdId}`, result: await request({ method: 'get', url: `${BASE}/api/chat/${createdId}`, headers: authHeader(hoToken) }) });
  }

  // 10) Dashboard access: HO should succeed, DA should be forbidden
  results.push({ name: 'GET /api/dashboard (HO)', result: await request({ method: 'get', url: `${BASE}/api/dashboard`, headers: authHeader(hoToken) }) });
  results.push({ name: 'GET /api/dashboard (DA)', result: await request({ method: 'get', url: `${BASE}/api/dashboard`, headers: authHeader(daToken) }) });

  // 11) Upload — will be tested with a small CSV (endpoint reachable and returns a JSON response)
  // (We upload tests/leads.csv created separately)
  try {
    if (fs.existsSync('tests/leads.csv')) {
      const FormData = require('form-data');
      const fd = new FormData();
      fd.append('file', fs.createReadStream('tests/leads.csv'));
      const uploadRes = await axios.post(`${BASE}/api/upload`, fd, { headers: { ...fd.getHeaders(), Authorization: `Bearer ${hoToken}` }, maxBodyLength: Infinity });
      results.push({ name: 'POST /api/upload (csv)', result: { ok: true, status: uploadRes.status, data: uploadRes.data } });
    } else {
      results.push({ name: 'POST /api/upload (csv)', result: { ok: false, error: 'tests/leads.csv not found — create tests/leads.csv to run upload test' } });
    }
  } catch (e) {
    results.push({ name: 'POST /api/upload (csv)', result: e.response ? { ok: false, status: e.response.status, data: e.response.data } : { ok: false, error: e.message } });
  }

  // 12) DELETE lead
  if (createdId) results.push({ name: `DELETE /api/leads/${createdId}`, result: await request({ method: 'delete', url: `${BASE}/api/leads/${createdId}`, headers: authHeader(hoToken) }) });

  // 13) Ensure DA cannot delete HO-only resources (basic RBAC smoke) — try to create lead as DA
  const createAsDa = await request({ method: 'post', url: `${BASE}/api/leads`, data: leadPayload, headers: { ...authHeader(daToken), 'Content-Type': 'application/json' } });
  results.push({ name: 'POST /api/leads (as DA)', result: createAsDa });

  // Print summary
  console.log('\n=== Test results ===');
  results.forEach(r => {
    const name = r.name || r;
    const res = r.result || r;
    if (res === undefined) { console.log(name, JSON.stringify(r)); return; }
    const status = res.status ?? (res.ok ? 200 : 'ERR');
    const ok = res.ok === true || (name.startsWith('GET /api/leads') && res.status == 200);
    console.log(`${name} => status=${status} ok=${res.ok === true}`);
  });

  // Exit with non-zero if any critical failures
  const criticalFailures = results.filter(r => { const rr = r.result || r; return rr && rr.ok === false && (r.name && !r.name.includes('POST /api/upload')); });
  process.exit(criticalFailures.length > 0 ? 2 : 0);
})();
