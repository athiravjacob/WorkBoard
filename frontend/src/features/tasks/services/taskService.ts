import api from '../../../lib/axios';

export interface Task {
  assignedToDetails?: {
    name: string;
    email: string;
  };
  projectDetails?: {
    title: string;
  };
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEW' | 'REDO';
  assignedTo?: string;
  projectId: string;
  createdAt: string;
  progressNotes?: {
    userId: string;
    userName?: string;
    note: string;
    createdAt: string;
  }[];
}

export interface CreateTaskParams {
  title: string;
  description: string;
  assignedTo: string;
}

export const taskService = {
  getProjectTasks: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data.data;
  },

  getMyTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks/me');
    return response.data.data;
  },

  createTask: async (projectId: string, data: CreateTaskParams) => {
    const response = await api.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTaskStatus: async (taskId: string, status: string, redoNote?: string) => {
    const response = await api.patch(`/tasks/${taskId}/status`, { status, redoNote });
    return response.data;
  },

  addTaskNote: async (taskId: string, note: string) => {
    const response = await api.post(`/tasks/${taskId}/notes`, { note });
    return response.data;
  }
};
