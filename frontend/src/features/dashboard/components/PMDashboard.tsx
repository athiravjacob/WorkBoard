import React from 'react';

export const PMDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800">Project Manager Workspace</h2>
      <p className="text-slate-500 mt-2">Oversee project timelines, assign tasks, and monitor team progress.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-amber-700 font-semibold">Active Boards</p>
          <p className="text-amber-600/70 text-sm">Review status of ongoing projects.</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-700 font-semibold">Resource Planning</p>
          <p className="text-blue-600/70 text-sm">Balance workload across team members.</p>
        </div>
      </div>
    </div>
  );
};
