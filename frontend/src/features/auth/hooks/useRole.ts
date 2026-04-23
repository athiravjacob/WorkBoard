import { useAuthStore } from '../store/useAuthStore';

export const useRole = () => {
  const user = useAuthStore((state) => state.user);

  return {
    isAdmin: user?.role === 'Admin',
    isPM: user?.role === 'Project Manager',
    isUser: user?.role === 'User',
    role: user?.role,
  };
};
