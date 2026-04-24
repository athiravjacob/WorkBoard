import api from '../../../lib/axios';

export interface CreateProjectParams {
  title: string;
  description: string;
  pmId: string;
}

export const projectService = {
  createProject: async (data: CreateProjectParams) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getManagedProjects: async () => {
    console.log("frontend managed project service")
    const response = await api.get('/projects/managed');
    console.log(response)
    return response.data;
  }
};
