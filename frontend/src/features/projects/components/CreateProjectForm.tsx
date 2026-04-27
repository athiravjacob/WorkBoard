import React, { useState } from 'react';
import { useUsers } from '../../users/hooks/useUsers';
import { useCreateProject } from '../hooks/useCreateProject';
import { toast } from 'sonner';


export const CreateProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pmId, setPmId] = useState('');
  
  // 1. Fetch Users using custom hook
  const { data: users, isLoading: usersLoading, isError: usersError } = useUsers();

  // 2. Push Project using custom hook
  const createMutation = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !pmId) {
      toast.error('All fields are required');
      return;
    }
    
    createMutation.mutate({ title, description, pmId });
  };

  const isFormValid = title.trim() !== '' && description.trim() !== '' && pmId !== '';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Create New Project</h2>
          <p className="text-slate-500 text-sm mt-1">Fill in the details below to initialize a new WorkBoard project.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Mobile App Development"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the scope and goals of this project..."
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Project Manager Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Assign Project Manager
            </label>
            <div className="relative">
              <select
                value={pmId}
                onChange={(e) => setPmId(e.target.value)}
                disabled={usersLoading}
                className={`w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 transition-all appearance-none cursor-pointer ${
                  !pmId ? 'text-slate-400' : 'text-slate-800'
                }`}
                required
              >
                <option value="" disabled>Select a manager from the team</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id} className="text-slate-800">
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Conditional feedback states */}
            {usersLoading && (
              <p className="text-blue-500 text-xs mt-2 flex items-center">
                <svg className="animate-spin h-3 w-3 mr-2" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Loading team members...
              </p>
            )}
            {usersError && <p className="text-rose-500 text-xs mt-2 font-medium">Failed to load managers. Please refresh the page.</p>}
            {!usersLoading && users?.length === 0 && (
              <p className="text-amber-600 text-xs mt-2 font-bold flex items-center">
                <span className="mr-1">⚠️</span> A Project Manager must be registered in the system first.
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid || createMutation.isPending}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transform transition-all active:scale-[0.98] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {createMutation.isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Initialing Project...</span>
                </>
              ) : (
                <span>Create Project</span>
              )}
            </button>
            <p className="text-center text-slate-400 text-xs mt-4">
              All team members assigned will be notified immediately of the new project creation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
