import { Link, Navigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useUsers } from '../../users/hooks/useUsers';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Plus, Eye, Trash2, LayoutGrid, User as UserIcon } from 'lucide-react';

export const ProjectList = () => {
  const { user: currentUser } = useAuthStore();
  const { data: projects, isLoading, isError } = useProjects();
  const { data: users } = useUsers();

  // Role Safety: Ensure only ADMIN can access this list
  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPMName = (id: string | null | undefined) => {
    if (!id) return 'Unassigned';
    const pm = users?.find(u => u.id === id);
    return pm ? pm.name : 'Unknown Manager';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Fetching projects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl text-center max-w-lg mx-auto">
        <p className="text-rose-600 font-bold mb-2">Oops! Something went wrong.</p>
        <p className="text-rose-500 text-sm">We couldn't load the projects list. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Portfolio</h1>
          <p className="text-slate-500 mt-1">Manage, monitor, and assign resources across all active initiatives.</p>
        </div>
        <Link
          to="/admin/projects/create"
          className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Project Name</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Project Manager</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Created Date</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{project.title}</span>
                        <span className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-sm">{project.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          {getPMName(project.pmId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-medium text-slate-500">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200" 
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                          title="Delete Project"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <LayoutGrid className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">No projects found</h3>
          <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
            Your project portfolio is currently empty. Start by initializing a new project and assigning a manager.
          </p>
          <Link
            to="/admin/projects/create"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Project
          </Link>
        </div>
      )}
    </div>
  );
};
