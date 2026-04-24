import { Link, Navigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useUsers } from '../../users/hooks/useUsers';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Plus, LayoutGrid } from 'lucide-react';
import { ProjectCard, ProjectCardSkeleton } from './ProjectCard';

export const ProjectList = () => {
  const { user: currentUser } = useAuthStore();
  const { data: projects, isLoading, isError } = useProjects();
  const { data: users } = useUsers();

  // Role Safety: Ensure only ADMIN can access this list
  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const getPMName = (id: string | null | undefined) => {
    if (!id) return 'Unassigned';
    const pm = users?.find(u => u.id === id);
    return pm ? pm.name : 'Unknown Manager';
  };

  if (isError) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl text-center max-w-lg mx-auto mt-10">
        <p className="text-rose-600 font-bold mb-2">Error Loading Projects</p>
        <p className="text-rose-500 text-sm">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and monitor all active workspace initiatives.</p>
        </div>
        <Link
          to="/admin/projects/create"
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Project
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {projects.map((project: any) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              pmName={getPMName(project.pmId)} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
             <LayoutGrid className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">No active projects</h3>
          <p className="text-slate-500 mt-3 mb-10 max-w-sm mx-auto text-base leading-relaxed">
            It looks like your project board is empty. Click the button below to launch your first initiative.
          </p>
          <Link
            to="/admin/projects/create"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Launch New Project
          </Link>
        </div>
      )}
    </div>
  );
};
