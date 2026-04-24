import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useCreateProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully!');
      navigate('/admin/projects');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create project');
    }
  });
};
