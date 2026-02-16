import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('bhushan.dashpute');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ username, password });
      const payload = response.data as any;

      if (payload && payload.token) {
        login(payload as any);
        navigate('/dashboard');
        return;
      }

      if (payload && payload.success && payload.data) {
        login(payload.data);
        navigate('/dashboard');
        return;
      }

      setError(payload?.message || 'Login failed');
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="page-login" className="page active">
      <div className="auth-root">
        <div className="auth-topbar">
          <div className="auth-topbar-brand">
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none"><rect width="12" height="22" rx="2" fill="#E8192C"/><rect x="14" y="0" width="14" height="10" rx="2" fill="#E8192C"/><rect x="14" y="12" width="14" height="10" rx="2" fill="#E8192C"/></svg>
            Hero &nbsp;<span style={{fontWeight:400,color:'#6b7280'}}>Lead Nurturing Application</span>
          </div>
          <button className="lang-sel">Eng (US) ▾</button>
        </div>

        <div className="auth-body">
          <div className="auth-card">
            <div className="auth-left">
              <h1>Hero</h1>
              <p>Lead Nurturing Application</p>
              <div className="auth-illustration" aria-hidden>
                {/* decorative SVG kept minimal for performance */}
                <svg width="320" height="200" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
                  <rect x="60" y="55" width="210" height="130" rx="8" fill="#1e2235"/>
                  <rect x="68" y="62" width="194" height="116" rx="4" fill="#fff"/>
                </svg>
              </div>
            </div>

            <div className="auth-right">
              <div className="hero-logo">
                <svg width="32" height="26" viewBox="0 0 28 22" fill="none"><rect width="12" height="22" rx="2" fill="#E8192C"/><rect x="14" y="0" width="14" height="10" rx="2" fill="#E8192C"/><rect x="14" y="12" width="14" height="10" rx="2" fill="#E8192C"/></svg>
                <span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'1.3rem',fontWeight:700}}>Hero</span>
              </div>

              <h2>Sign In To Your Account</h2>
              <p className="subtitle">Enter your credentials to continue</p>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label>Username</label>
                  <div className="field-wrap">
                    <span className="field-icon">👤</span>
                    <input id="login-username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="field-wrap">
                    <span className="field-icon">🔒</span>
                    <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="button" className="eye-btn" aria-label="toggle visibility">👁️</button>
                  </div>
                </div>

                {error && <div className="info-box" style={{background:'#ffeef0',color:'#611'}}>{error}</div>}

                <button className="btn-red" type="submit">{isLoading ? 'Signing in...' : 'Sign In'}</button>
              </form>

              <div className="forgot-box">Forgot password? <button className="lang-sel" onClick={() => navigate('/login')}>click here</button></div>
            </div>
          </div>
        </div>

        <div className="auth-footer">
          <span>Copyright Hero MotoCorp Ltd. 2025 . All Rights Reserved.</span>
          <span>For Assistance Call: 1800-266-0018 Email: helpdesk@heromotocorp.com</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
