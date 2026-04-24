import React from 'react';
import { useManagedProjects } from '../../projects/hooks/useManagedProjects';
import { ProjectCard, ProjectCardSkeleton } from '../../projects/components/ProjectCard';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Briefcase } from 'lucide-react';

export const PMDashboard: React.FC = () => {
  const { data: projects, isLoading, isError } = useManagedProjects();
  const { user } = useAuthStore();

  if (isError) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl text-center max-w-lg mx-auto">
        <p className="text-rose-600 font-bold mb-2">Failed to load projects</p>
        <p className="text-rose-500 text-sm">Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">


      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              pmName={user?.name || 'You'} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
             <Briefcase className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Access Restricted</h3>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto text-base leading-relaxed font-medium">
            You are not assigned to any projects yet. Please contact the Admin.
          </p>
        </div>
      )}
    </div>
  );
};
