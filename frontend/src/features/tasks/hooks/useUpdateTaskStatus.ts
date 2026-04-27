import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { toast } from 'sonner';


export const useUpdateTaskStatus = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status, note }: { taskId: string; status: string; note?: string }) => 
      taskService.updateTaskStatus(taskId, status, note),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
      queryClient.invalidateQueries({ queryKey: ['tasks', 'me'] });
      toast.success('Task status updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update task status';
      toast.error(message);
    }
  });
};
