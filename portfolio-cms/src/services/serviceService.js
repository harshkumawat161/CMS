import api from './api';

export const serviceService = {
  getAllServices: async () => {
    const res = await api.get('/api/admin/services');
    return res.data?.data || res.data;
  },

  getServiceById: async (id) => {
    const res = await api.get(`/api/admin/services/${id}`);
    return res.data?.data || res.data;
  },

  createService: async (data) => {
    const res = await api.post('/api/admin/services', data);
    return res.data?.data || res.data;
  },

  updateService: async (id, data) => {
    const res = await api.put(`/api/admin/services/${id}`, data);
    return res.data?.data || res.data;
  },

  deleteService: async (id) => {
    const res = await api.delete(`/api/admin/services/${id}`);
    return res.data?.data || res.data;
  },
};

export default serviceService;
