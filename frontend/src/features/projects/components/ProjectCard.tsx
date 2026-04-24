import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User as UserIcon } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  pmId: string;
  teamMemberIds: string[];
}

interface ProjectCardProps {
  project: Project;
  pmName: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, pmName }) => {
  return (
    <Link 
      to={`/projects/${project.id}`}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/30 flex flex-col relative"
    >
      {/* Indigo Accent Bar */}
      <div className="h-1.5 w-full bg-indigo-600" />
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
            {project.title}
          </h3>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1 text-pretty">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
               <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">PM</span>
              <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">
                {pmName}
              </span>
            </div>
          </div>
          
          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-500">
            <Users className="w-4 h-4 mr-1.5" />
            <span className="text-xs font-bold">{project.teamMemberIds?.length || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col h-[200px]">
      <div className="h-1.5 w-full bg-slate-100" />
      <div className="p-6 flex flex-col flex-1 animate-pulse">
        <div className="h-6 w-2/3 bg-slate-100 rounded-md mb-3" />
        <div className="h-4 w-full bg-slate-100 rounded-md mb-2" />
        <div className="h-4 w-1/2 bg-slate-100 rounded-md mb-6" />
        
        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100" />
            <div className="space-y-1">
              <div className="h-2 w-8 bg-slate-100 rounded" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="h-8 w-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
