import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  UserCircle,
  Calendar,
  Settings,
  FileText,
  File,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const menuItems = [
    {
      title: 'MAIN MENU',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ROLE_HO'] },
        { name: 'Lead List', icon: Users, path: '/leads', roles: ['ROLE_HO', 'ROLE_DA'] },
        { name: 'Chat History', icon: MessageSquare, path: '/chat', roles: ['ROLE_HO', 'ROLE_DA'] },
      ]
    },
    {
      title: 'GENERAL',
      items: [
        { name: 'Settings', icon: Settings, path: '/settings', roles: ['ROLE_HO', 'ROLE_DA'] },
        { name: 'Reports', icon: FileText, path: '/reports', roles: ['ROLE_HO'] },
        { name: 'Documents', icon: File, path: '/documents', roles: ['ROLE_HO', 'ROLE_DA'] },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-dark-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-dark-700">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold">H</span>
        </div>
        <span className="font-display text-xl font-semibold">Hero</span>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items
                .filter(item => item.roles.includes(user?.role))
                .map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`sidebar-item ${
                        active ? 'sidebar-item-active' : 'sidebar-item-inactive'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
            </nav>
          </div>
        ))}
      </div>

      {/* Helpdesk Info */}
      <div className="p-4 border-t border-dark-700">
        <div className="bg-dark-800 rounded-lg p-4 text-center">
          <h4 className="font-semibold mb-2">Helpdesk</h4>
          <p className="text-sm text-gray-400 mb-1">1800-266-0018</p>
          <p className="text-xs text-gray-500 break-all">helpdesk@heromotocorp.com</p>
        </div>
        
        {/* Sign Out */}
        <button
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
