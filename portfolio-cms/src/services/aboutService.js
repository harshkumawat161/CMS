import api from './api';

export const aboutService = {
  getAbout: async () => {
    const res = await api.get('/api/about');
    return res.data?.data || res.data;
  },

  updateAbout: async (data) => {
    const res = await api.put('/api/admin/about', data);
    return res.data?.data || res.data;
  },
};

export default aboutService;
