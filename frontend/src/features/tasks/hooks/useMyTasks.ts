import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export const useMyTasks = () => {
  return useQuery({
    queryKey: ['userTasks'],
    queryFn: taskService.getMyTasks
  });
};
