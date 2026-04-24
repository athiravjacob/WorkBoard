import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import type { CreateTaskParams } from '../services/taskService';
import { toast } from 'react-hot-toast';

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskParams) => taskService.createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create task';
      toast.error(message);
    }
  });
};
