import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';

export const useManagedProjects = () => {
  return useQuery({
    queryKey: ['projects', 'managed'],
    queryFn: projectService.getManagedProjects
  });
};
