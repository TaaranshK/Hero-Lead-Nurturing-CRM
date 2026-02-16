import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/hero.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const toggle = () => setCollapsed((s) => !s);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
        <div className="sidebar-top">
          <svg width="26" height="20" viewBox="0 0 28 22" fill="none"><rect width="12" height="22" rx="2" fill="#E8192C"/><rect x="14" y="0" width="14" height="10" rx="2" fill="#E8192C"/><rect x="14" y="12" width="14" height="10" rx="2" fill="#E8192C"/></svg>
          <span className="logo-text">Hero</span>
          <button className="toggle-btn" onClick={toggle} title="Collapse"> 
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
          </button>
        </div>

        <div className="sidebar-section-label">Main Menu</div>
        <div className={`nav-item ${window.location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
          <span className="nav-icon">🏠</span> Dashboard
        </div>
        <div className={`nav-item ${window.location.pathname.startsWith('/leads') ? 'active' : ''}`} onClick={() => navigate('/leads')}>
          <span className="nav-icon">👥</span> Lead List
        </div>
        <div className="nav-item" onClick={() => navigate('/chat')}>
          <span className="nav-icon">💬</span> Chat History
        </div>

        <div className="sidebar-spacer" />
        <div className="helpdesk-box">
          <div className="hd-title">Helpdesk</div>
          <div className="hd-phone">1800-266-0018</div>
          <div className="hd-email">helpdesk@heromotocorp.com</div>
        </div>
        <button className="signout-btn" onClick={handleLogout}>Sign Out</button>
      </aside>

      <div className={`main-wrap ${collapsed ? 'collapsed' : ''}`}>
        <header className="topbar">
          <span className="topbar-title">Lead Nurturing Application</span>
          <div className="topbar-spacer" />
          <div className="topbar-actions">
            <button className="lang-sel">Eng (US) ▾</button>
            <button className="notif-btn">🔔<span className="notif-badge">4</span></button>
            <button className="user-pill"><span className="user-avatar">{user?.username?.charAt(0) ?? 'U'}</span> {user?.username || 'User'} ▾</button>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
