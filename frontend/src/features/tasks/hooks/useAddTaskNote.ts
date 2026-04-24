import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { toast } from 'react-hot-toast';

export const useAddTaskNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, note }: { taskId: string; note: string }) => 
      taskService.addTaskNote(taskId, note),
    onSuccess: () => {
      // Invalidate all task related queries to show the new note
      queryClient.invalidateQueries({ queryKey: ['projectTasks'] });
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Catch-all for any task list
      toast.success('Note added!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to add note';
      toast.error(message);
    }
  });
};
