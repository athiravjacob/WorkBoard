import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { toast } from 'react-hot-toast';

export const useAddTaskNote = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, note }: { taskId: string; note: string }) => 
      taskService.addTaskNote(taskId, note),
    onSuccess: () => {
      // Invalidate all task related queries to show the new note
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
      queryClient.invalidateQueries({ queryKey: ['tasks', 'me'] });
      toast.success('Note added!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to add note';
      toast.error(message);
    }
  });
};
