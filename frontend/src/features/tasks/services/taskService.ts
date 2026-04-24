import api from '../../../lib/axios';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo?: {
    id: string;
    name: string;
  };
  projectId: string;
  createdAt: string;
}

export const taskService = {
  getProjectTasks: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data.data; // Backend returns { success: true, data: tasks }
  }
};
