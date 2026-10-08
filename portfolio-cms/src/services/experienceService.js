import api from './api';

export const experienceService = {
  getAllExperience: async () => {
    const res = await api.get('/api/admin/experience');
    return res.data?.data || res.data;
  },

  getExperienceById: async (id) => {
    const res = await api.get(`/api/admin/experience/${id}`);
    return res.data?.data || res.data;
  },

  createExperience: async (data) => {
    const res = await api.post('/api/admin/experience', data);
    return res.data?.data || res.data;
  },

  updateExperience: async (id, data) => {
    const res = await api.put(`/api/admin/experience/${id}`, data);
    return res.data?.data || res.data;
  },

  deleteExperience: async (id) => {
    const res = await api.delete(`/api/admin/experience/${id}`);
    return res.data?.data || res.data;
  },
};

export default experienceService;
