import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { logoutUser } from '../utils/authUtils';

import { toast } from 'sonner';


export const useLogout = () => {

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success('Logged out successfully');
      logoutUser();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Logout failed, but clearing local session');
      logoutUser();
    }

  });
};
