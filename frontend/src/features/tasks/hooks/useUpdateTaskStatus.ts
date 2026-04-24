import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { toast } from 'react-hot-toast';

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) => 
      taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); 
      toast.success('Task status updated!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update status';
      toast.error(message);
    }
  });
};
