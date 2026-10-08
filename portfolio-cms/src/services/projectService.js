import api from './api';

export const projectService = {
  getAllProjects: async () => {
    const res = await api.get('/api/admin/projects');
    return res.data?.data || res.data;
  },

  getProjectById: async (id) => {
    const res = await api.get(`/api/admin/projects/${id}`);
    return res.data?.data || res.data;
  },

  createProject: async (projectData) => {
    const res = await api.post('/api/admin/projects', projectData);
    return res.data?.data || res.data;
  },

  updateProject: async (id, projectData) => {
    const res = await api.put(`/api/admin/projects/${id}`, projectData);
    return res.data?.data || res.data;
  },

  deleteProject: async (id) => {
    const res = await api.delete(`/api/admin/projects/${id}`);
    return res.data?.data || res.data;
  },

  publishProject: async (id) => {
    const res = await api.post(`/api/admin/projects/${id}/publish`);
    return res.data?.data || res.data;
  },

  unpublishProject: async (id) => {
    const res = await api.post(`/api/admin/projects/${id}/unpublish`);
    return res.data?.data || res.data;
  },
};

export default projectService;
