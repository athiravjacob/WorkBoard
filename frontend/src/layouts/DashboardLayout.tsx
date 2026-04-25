import React from 'react';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { Sidebar } from './Sidebar';
import { NotificationBell } from '../features/notifications/components/NotificationBell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuthStore();

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Role-Based Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        {/* Global Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm shadow-slate-100/50">
          {/* Left Side: Breadcrumb Placeholder */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-400">Pages</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-800">Overview</span>
          </div>

          {/* Right Side: User Profile & Logout Link */}
          <div className="flex items-center space-x-6">
            <NotificationBell />
            
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'Loading...'}</span>
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {user?.role || 'User'}
                </span>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md transition-transform group-hover:scale-105">
                  {getInitial(user?.name || 'U')}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
            </div>


            
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
