import React, { useState } from 'react';
import { X, Loader2, UserPlus, FileText, AlignLeft } from 'lucide-react';
import { useCreateTask } from '../hooks/useCreateTask';
import { useUsers } from '../../users/hooks/useUsers';

interface CreateTaskModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ projectId, isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const { data: users, isLoading: isUsersLoading } = useUsers();
  const { mutate: createTask, isPending } = useCreateTask(projectId);

  // Filter only regular users (no ADMIN or PM)
  const availableUsers = users?.filter(user => user.role === 'USER') || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedTo) return;

    createTask(
      { title, description, assignedTo },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setAssignedTo('');
          onClose();
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create New Task</h2>
              <p className="text-sm text-slate-500 font-medium">Assign work to your team members</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <AlignLeft className="w-4 h-4 mr-2 text-indigo-600" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                rows={3}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 resize-none"
                required
              />
            </div>

            {/* Assign To */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <UserPlus className="w-4 h-4 mr-2 text-indigo-600" />
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={isUsersLoading}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 disabled:opacity-50 appearance-none"
                required
              >
                <option value="">Select a team member</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  'Create Project Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
