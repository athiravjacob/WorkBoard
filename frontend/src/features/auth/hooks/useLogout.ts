import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logoutStore();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: (error: any) => {
      // Even if API fails, we should clear local state
      logoutStore();
      toast.error(error.response?.data?.message || 'Logout API failed, but session cleared locally');
      navigate('/login');
    }
  });
};
