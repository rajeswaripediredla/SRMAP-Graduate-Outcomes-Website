import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF8F5' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        <Topbar onToggleSidebar={() => setIsCollapsed(c => !c)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6 py-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
