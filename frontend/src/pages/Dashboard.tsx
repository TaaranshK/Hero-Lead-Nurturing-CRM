import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import type { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getStats();
      if (response.data.success) setStats(response.data.data);
    } catch (err: any) { setError('Failed to load dashboard stats'); console.error(err); }
    finally { setIsLoading(false); }
  };

  if (isLoading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div id="page-dashboard" className="page active">
      <div className="page-hdr">
        <h2>Dashboard</h2>
        <div className="breadcrumb">HOME &gt; <span>DASHBOARD</span></div>
      </div>

      <div className="filter-bar">
        <div>
          <label>Date (From)</label>
          <input type="text" placeholder="DD/MM/YYYY" />
        </div>
        <div>
          <label>Date (To)</label>
          <input type="text" placeholder="DD/MM/YYYY" />
        </div>
        <div className="spacer" />
        <button className="btn-clear">✕ Clear</button>
        <button className="btn-search">Search</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="s-label">All Leads</div>
          <div className="s-value" style={{color:'var(--green)'}}>{stats?.totalLeads ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Qualified Leads</div>
          <div className="s-value" style={{color:'var(--blue)'}}>{stats?.qualifiedLeads ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Unqualified Leads</div>
          <div className="s-value" style={{color:'var(--orange)'}}>{stats?.unqualifiedLeads ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Pending Leads</div>
          <div className="s-value" style={{color:'var(--yellow)'}}>{stats?.pendingLeads ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="s-label">Lost Leads</div>
          <div className="s-value" style={{color:'var(--hero-red)'}}>{stats?.lostLeads ?? 0}</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Total vs Qualified Leads</h3>
          <div className="donut-wrap">
            <svg className="donut-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#22C55E" strokeWidth="18" strokeDasharray="238.76 0"/>
              <text x="50" y="46" textAnchor="middle" fontSize="13" fontWeight={700} fill="#1A1D2E">{stats?.totalLeads ?? 0}</text>
              <text x="50" y="57" textAnchor="middle" fontSize="6" fill="#6b7280">Total Leads</text>
            </svg>
            <div className="donut-legend">
              <span><span className="dot" style={{background:'#22C55E'}}></span> Total</span>
              <span><span className="dot" style={{background:'#F59E0B'}}></span> Qualified</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Total vs Lost Leads</h3>
          <div className="donut-wrap">
            <svg className="donut-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="18" strokeDasharray="238.76 0"/>
              <text x="50" y="46" textAnchor="middle" fontSize="13" fontWeight={700} fill="#1A1D2E">{stats?.totalLeads ?? 0}</text>
              <text x="50" y="57" textAnchor="middle" fontSize="6" fill="#6b7280">Total Leads</text>
            </svg>
            <div className="donut-legend">
              <span><span className="dot" style={{background:'#3B82F6'}}></span> Total</span>
              <span><span className="dot" style={{background:'#F97316'}}></span> Lost</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Lead Sub-Source</h3>
          <div className="bar-legend">
            <span><span className="leg-dot" style={{background:'#ec4899'}}></span> Website</span>
            <span><span className="leg-dot" style={{background:'#3B82F6'}}></span> Facebook</span>
            <span><span className="leg-dot" style={{background:'#22C55E'}}></span> WhatsApp</span>
          </div>
          <svg className="bar-chart-svg" viewBox="0 0 340 130" preserveAspectRatio="xMidYMid meet">
            {/* static chart placeholders (kept simple) */}
            <line x1="30" y1="5" x2="30" y2="105" stroke="#e5e7eb" strokeWidth="1"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
