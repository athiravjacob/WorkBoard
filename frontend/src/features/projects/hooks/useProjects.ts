import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const useProjects = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['projects', user?.id, user?.role],
    queryFn: () => {
      if (user?.role === 'PM') {
        return projectService.getManagedProjects();
      }
      return projectService.getProjects();
    },
    enabled: !!user
  });
};
