import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { useProjectTasks } from '../../tasks/hooks/useProjectTasks';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  User as UserIcon, 
  Mail, 
  Users,
  Layout
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user: currentUser } = useAuthStore();
  
  const { data: project, isLoading: isProjectLoading, isError: isProjectError } = useProject(projectId);
  const { data: tasks, isLoading: isTasksLoading } = useProjectTasks(projectId);

  const isPM = currentUser?.role === 'PM' || currentUser?.role === 'ADMIN';

  if (isProjectLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-1/4 bg-slate-100 rounded-md" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 h-[400px] bg-slate-50 rounded-2xl" />
          <div className="lg:w-1/3 h-[300px] bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isProjectError || !project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Project not found</h2>
        <Link to="/dashboard" className="text-indigo-600 font-medium mt-4 inline-block hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <Circle className="w-4 h-4 text-slate-300" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center space-x-2 text-sm font-medium text-slate-400">
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-600 truncate max-w-[150px]">{project.title}</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{project.title}</h1>
        </div>

        {isPM && (
          <button className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95">
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Column: Tasks */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center">
                <Layout className="w-5 h-5 mr-2.5 text-indigo-600" />
                Project Tasks
              </h2>
              <span className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100">
                {tasks?.length || 0} Total
              </span>
            </div>

            {isTasksLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : tasks && tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="group bg-white border border-slate-100 p-5 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                          {task.title}
                        </h3>
                        <div className="flex items-center text-xs text-slate-400 font-medium">
                           <UserIcon className="w-3 h-3 mr-1" />
                           {task.assignedTo?.name || 'Unassigned'}
                        </div>
                      </div>
                      <span className={`flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(task.status)} uppercase tracking-wider`}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1.5">{task.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Layout className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No tasks created yet</h3>
                <p className="text-slate-500 text-sm mt-1">Start by creating the first task for this project.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Project Info */}
        <div className="lg:w-1/3 space-y-6">
          {/* Project Manager Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Project Manager</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{project.pmId?.name || 'Unassigned'}</p>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  <Mail className="w-3 h-3 mr-1" />
                  {project.pmId?.email || 'No email provided'}
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Team Members</h3>
              <Users className="w-4 h-4 text-slate-300" />
            </div>
            <div className="space-y-4">
              {project.teamMemberIds && project.teamMemberIds.length > 0 ? (
                project.teamMemberIds.map((member: any) => (
                  <div key={member._id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{member.name}</span>
                      <span className="text-[10px] text-slate-400">{member.email}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No team members assigned yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
