import React from 'react';
import type { Task } from '../services/taskService';
import { AddProgressNote } from './AddProgressNote';
import { TaskActivityTimeline } from './TaskActivityTimeline';
import { 
  X, 
  Clock, 
  MessageSquare, 
  Layout
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  if (!task || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100 flex items-center">
                <Layout className="w-3 h-3 mr-1" />
                {task.projectDetails?.title || 'Project'}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center ${
                task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-2">{task.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8 custom-scrollbar">
          
          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
              Description
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              {task.description}
            </p>
          </div>

          {/* Timeline / Activity List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-indigo-600" />
              Progress Timeline
            </h3>
            
            <TaskActivityTimeline notes={task.progressNotes} />
          </div>
        </div>

        {/* Footer: Add Note Input */}
        <div className="p-8 pt-4 bg-slate-50/50 border-t border-slate-100">
          <AddProgressNote 
            taskId={task.id} 
            projectId={task.projectId} 
            assignedTo={task.assignedTo} 
          />
        </div>
      </div>
    </div>
  );
};
