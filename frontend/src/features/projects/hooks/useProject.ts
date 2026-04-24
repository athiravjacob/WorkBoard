import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';

export const useProject = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectService.getProjectById(projectId!),
    enabled: !!projectId,
  });
};
