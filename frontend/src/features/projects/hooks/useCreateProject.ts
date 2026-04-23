import { useMutation } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useCreateProject = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      toast.success('Project created successfully!');
      navigate('/admin/projects');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create project');
    }
  });
};
