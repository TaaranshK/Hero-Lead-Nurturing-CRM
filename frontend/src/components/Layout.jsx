import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title, breadcrumb }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
