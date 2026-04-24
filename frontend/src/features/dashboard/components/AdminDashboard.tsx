import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800">Administrator Console</h2>
      <p className="text-slate-500 mt-2">Manage system-wide settings, user roles, and organization projects.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p className="text-indigo-700 font-semibold">User Management</p>
          <p className="text-indigo-600/70 text-sm">Review recently registered users.</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-emerald-700 font-semibold">System Audit</p>
          <p className="text-emerald-600/70 text-sm">Check system activity logs.</p>
        </div>
      </div>
    </div>
  );
};
