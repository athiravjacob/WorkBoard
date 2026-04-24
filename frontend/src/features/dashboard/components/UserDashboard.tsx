import React from 'react';

export const UserDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800">My Task Center</h2>
      <p className="text-slate-500 mt-2">View your assigned tasks, update progress, and collaborate with your team.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-slate-700 font-semibold">Today's Focus</p>
          <p className="text-slate-600/70 text-sm">Priority tasks needing attention today.</p>
        </div>
        <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
          <p className="text-rose-700 font-semibold">Upcoming Deadlines</p>
          <p className="text-rose-600/70 text-sm">Tasks due in the next 48 hours.</p>
        </div>
      </div>
    </div>
  );
};
