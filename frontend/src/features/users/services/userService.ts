import api from '../../../lib/axios';
import type { User } from '../../../types';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  }
};
