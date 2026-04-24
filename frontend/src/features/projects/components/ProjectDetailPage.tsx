import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { taskService } from '../../tasks/services/taskService';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { CreateTaskModal } from '../../tasks/components/CreateTaskModal';
import { TaskDetailModal } from '../../tasks/components/TaskDetailModal';
import { RedoFeedbackModal } from '../../tasks/components/RedoFeedbackModal';
import type{ Task as TaskInterface } from '../../tasks/services/taskService';
import { 
  Folder, 
  Users, 
  Plus, 
  ChevronRight, 
  User as UserIcon,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  pmId: string;
  pmDetails?: {
    name: string;
    email: string;
  };
  teamMembers?: {
    id: string;
    name: string;
    email: string;
  }[];
  createdAt: string;
}

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<TaskInterface | null>(null);
  const [isRedoModalOpen, setIsRedoModalOpen] = useState(false);
  const [taskToRedo, setTaskToRedo] = useState<TaskInterface | null>(null);

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ taskId, status, note }: { taskId: string, status: string, note?: string }) => 
      taskService.updateTaskStatus(taskId, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', projectId] });
      toast.success('Task updated successfully');
      setIsRedoModalOpen(false);
      setTaskToRedo(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update task');
    }
  });

  // 1. Fetch Project Details
  const { data: project, isLoading: isProjectLoading } = useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    }
  });

  // 2. Fetch Tasks
  const { data: tasks, isLoading: isTasksLoading } = useQuery<TaskInterface[]>({
    queryKey: ['projectTasks', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/tasks`);
      return response.data.data;
    }
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'REVIEW': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'REDO': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case 'IN_PROGRESS': return <Clock className="w-3 h-3 mr-1" />;
      default: return <AlertCircle className="w-3 h-3 mr-1" />;
    }
  };

  if (isProjectLoading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Building your workspace...</p>
    </div>
  );

  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <nav className="flex items-center space-x-2 text-sm font-medium text-slate-400">
            <Link to="/admin/projects" className="hover:text-indigo-600 transition-colors">Projects</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-bold">{project.title}</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{project.title}</h1>
        </div>
        
        {/* Only PM can create tasks */}
        {(user?.role === 'PM') && (
           <button 
             onClick={() => setIsTaskModalOpen(true)}
             className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:-translate-y-0.5 transition-all active:scale-95 shadow-xl shadow-slate-200"
           >
             <Plus className="w-5 h-5 mr-2" />
             Create New Task
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Column: Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900">Project Tasks</h2>
              <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-100">
                {tasks?.length || 0} Total
              </span>
            </div>

            {isTasksLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
              </div>
            ) : tasks?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Folder className="w-8 h-8 text-slate-200" />
                 </div>
                 <p className="text-slate-400 font-medium italic">No tasks created for this project yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks?.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="space-y-2">
                       <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                         {task.title}
                       </h3>
                      <div className="flex items-center text-xs text-slate-400 font-medium">
                        <UserIcon className="w-3 h-3 mr-1" />
                        {task.assignedToDetails?.name || 'Unassigned'}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                      {/* PM Decision Buttons */}
                      {task.status === 'REVIEW' && (user?.role === 'PM' || user?.role === 'ADMIN') && (
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => statusMutation.mutate({ taskId: task.id, status: 'COMPLETED' })}
                            disabled={statusMutation.isPending}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100"
                            title="Approve Task"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setTaskToRedo(task);
                              setIsRedoModalOpen(true);
                            }}
                            disabled={statusMutation.isPending}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                            title="Request Redo"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <span className={`flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(task.status)} uppercase tracking-wider`}>
                        {getStatusIcon(task.status)}
                        {(task.status || '').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Project Info */}
        <div className="space-y-8">
           {/* PM Info */}
           <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                Project Manager
              </h3>
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                    {project.pmDetails?.name.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <p className="font-bold text-slate-900 leading-tight">{project.pmDetails?.name}</p>
                    <div className="flex items-center text-slate-400 text-xs mt-1">
                       <Mail className="w-3 h-3 mr-1" />
                       {project.pmDetails?.email}
                    </div>
                 </div>
              </div>
           </section>

           {/* Team Members */}
           <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                Team Members
              </h3>
              <div className="space-y-4">
                 {project.teamMembers?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between group">
                       <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 text-xs font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                             {member.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{member.name}</p>
                       </div>
                    </div>
                 ))}
                 {!project.teamMembers?.length && (
                    <p className="text-sm text-slate-400 italic">No members assigned.</p>
                 )}
              </div>
           </section>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId!}
      />

      <TaskDetailModal 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <RedoFeedbackModal 
        isOpen={isRedoModalOpen}
        onClose={() => {
          setIsRedoModalOpen(false);
          setTaskToRedo(null);
        }}
        onConfirm={(note) => {
          if (taskToRedo) {
            statusMutation.mutate({ taskId: taskToRedo.id, status: 'REDO', note });
          }
        }}
        isSubmitting={statusMutation.isPending}
      />
    </div>
  );
};
