import React from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { AdminDashboard } from './AdminDashboard';
import { PMDashboard } from './PMDashboard';
import { UserDashboard } from './UserDashboard';
import type { Role } from '../../../types';

export const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  // Fallback / Loading State
  if (!user || !user.role) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Dashboard component mapping
  const dashboardMap: Record<Role, React.ReactNode> = {
    ADMIN: <AdminDashboard />,
    PM: <PMDashboard />,
    USER: <UserDashboard />,
  };

  return (
    <div className="w-full h-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back, <span className="text-indigo-600 font-semibold">{user.name}</span>. 
          You are currently viewing the <span className="lowercase">{user.role}</span> workspace.
        </p>
      </div>

      <div className="w-full">
        {dashboardMap[user.role]}
      </div>
    </div>
  );
};
