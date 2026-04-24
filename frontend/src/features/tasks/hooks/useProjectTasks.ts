import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export const useProjectTasks = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => taskService.getProjectTasks(projectId!),
    enabled: !!projectId,
  });
};
