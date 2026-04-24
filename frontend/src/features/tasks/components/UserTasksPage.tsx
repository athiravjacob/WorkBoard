import React from 'react';
import { useMyTasks } from '../hooks/useMyTasks';
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Layout,
  Trophy,
  ChevronRight,
  Loader2
} from 'lucide-react';

export const UserTasksPage: React.FC = () => {
  const { data: tasks, isLoading } = useMyTasks();
  const { mutate: updateStatus, isPending } = useUpdateTaskStatus();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Done' };
      case 'IN_PROGRESS':
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'In Progress' };
      case 'REVIEW':
        return { icon: AlertCircle, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'In Review' };
      case 'REDO':
        return { icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Needs Changes' };
      default:
        return { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100', label: 'To Do' };
    }
  };

  const handleStatusChange = (taskId: string, currentStatus: string) => {
    if (isPending) return;

    let nextStatus = '';
    if (currentStatus === 'PENDING') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'REVIEW';
    else if (currentStatus === 'REDO') nextStatus = 'IN_PROGRESS';
    
    if (nextStatus) {
      updateStatus({ taskId, status: nextStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Tasks</h1>
        <p className="text-slate-500 font-medium">Manage your daily workflow and update project progress.</p>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center shadow-sm">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">You're all caught up!</h2>
          <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">
            No tasks currently assigned to you. Enjoy your productive day!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const config = getStatusConfig(task.status);
              const StatusIcon = config.icon;
              
              const isActionable = task.status !== 'COMPLETED' && task.status !== 'REVIEW';

              return (
                <div 
                  key={task.id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-slate-50/50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`mt-1 p-2 rounded-xl border ${config.bg} ${config.border}`}>
                      <StatusIcon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900 leading-none">{task.title}</h3>
                        <span className="flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                          <Layout className="w-3 h-3 mr-1" />
                          {task.projectDetails?.title || 'General'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-1 max-w-xl font-medium">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center gap-4">
                    <div className={`flex items-center px-4 py-2 rounded-2xl border ${config.bg} ${config.border} ${config.color} text-xs font-black uppercase tracking-widest`}>
                      {config.label}
                    </div>
                    
                    {isActionable && (
                      <button 
                        onClick={() => handleStatusChange(task.id, task.status)}
                        disabled={isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-indigo-600 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-slate-200"
                      >
                        {task.status === 'PENDING' ? 'Start Task' : 'Submit Review'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
