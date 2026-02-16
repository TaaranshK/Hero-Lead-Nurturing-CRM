import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, breadcrumb }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left - Title and Breadcrumb */}
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary-600">{title}</h1>
          {breadcrumb && (
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span>HOME</span>
              <span>›</span>
              <span className="text-primary-600 font-medium">{breadcrumb}</span>
            </div>
          )}
        </div>

        {/* Right - Language, Notifications, User */}
        <div className="flex items-center gap-6">
          {/* Language Selector */}
          <div className="flex items-center gap-2 text-sm">
            <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-5 h-4" />
            <span>Eng (US)</span>
            <ChevronDown size={16} />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{user?.username}</span>
              <ChevronDown size={16} className="group-hover:transform group-hover:rotate-180 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
