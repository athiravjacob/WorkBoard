import React from 'react';

export const UserDashboard: React.FC = () => {
  return (
    <div className="p-12 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[400px]">
      <h2 className="text-4xl font-black text-slate-800 tracking-tight">Hello <span className="text-indigo-600">User</span></h2>
    </div>
  );
};
