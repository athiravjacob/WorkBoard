import api from '../../../lib/axios';
import { socketService } from '../../../lib/socketService';
import { queryClient } from '../../../lib/queryClient';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Comprehensive logout utility to clear all session-related data
 * and reset connection states to prevent cross-user data leakage.
 */
export const logoutUser = () => {
  // 1. Socket.io: Explicitly disconnect to prevent reusing connection
  socketService.disconnect();

  // 2. TanStack Query: Clear entire cache to wipe previous user's data
  queryClient.clear();

  // 3. Axios: Remove Authorization header and clear local storage tokens
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
  localStorage.removeItem('auth-storage'); // Zustand persist key

  // 4. Zustand: Reset auth store state
  // We can't use hooks here, so we access the store directly
  useAuthStore.getState().logout();

  // 5. Redirect: Force a full page reload to /login to wipe in-memory variables
  window.location.href = '/login';
};
