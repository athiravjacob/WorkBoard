import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import type { Task } from '../services/taskService';

export const useProjectTasks = (projectId: string | undefined) => {
  return useQuery<Task[]>({
    queryKey: ['projects', projectId, 'tasks'],
    queryFn: async () => {
      return taskService.getProjectTasks(projectId!);
    },
    enabled: !!projectId,
  });
};
