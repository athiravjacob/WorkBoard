import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useLogout } from '../features/auth/hooks/useLogout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuthStore();
  const logout = useLogout();

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <div className="bg-indigo-600 p-1.5 rounded-lg mr-3">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">WorkBoard</span>
        </div>

        {/* Navigation Placeholder */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="space-y-1">
             <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
             {/* Placeholder items */}
             <div className="h-10 w-full bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center px-3 mb-2">
                <div className="w-4 h-4 bg-slate-200 rounded mr-3" />
                <div className="h-3 bg-slate-100 rounded w-24" />
             </div>
             <div className="h-10 w-full bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center px-3 mb-2">
                <div className="w-4 h-4 bg-slate-200 rounded mr-3" />
                <div className="h-3 bg-slate-100 rounded w-20" />
             </div>
             <div className="h-10 w-full bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center px-3">
                <div className="w-4 h-4 bg-slate-200 rounded mr-3" />
                <div className="h-3 bg-slate-100 rounded w-28" />
             </div>
          </div>
        </nav>
        
        {/* Bottom Sidebar section (Profile short-cut or settings could go here) */}
        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 p-3 rounded-xl flex items-center">
              <div className="flex-1">
                 <p className="text-xs font-medium text-slate-500">Need help?</p>
                 <p className="text-xs text-slate-400">Check documentation</p>
              </div>
           </div>
        </div>
      </aside>

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

          {/* Right Side: User Profile & Logout */}
          <div className="flex items-center space-x-6">
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

            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

            <button 
              onClick={handleLogout}
              disabled={logout.isPending}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Logout"
            >
              <LogOut className={`w-5 h-5 ${logout.isPending ? 'animate-pulse' : ''}`} />
            </button>
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
