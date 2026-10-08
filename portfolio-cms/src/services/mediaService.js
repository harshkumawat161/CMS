import api from './api';

export const mediaService = {
  getAllMedia: async () => {
    const res = await api.get('/api/admin/media');
    return res.data?.data || res.data;
  },

  getMediaById: async (id) => {
    const res = await api.get(`/api/admin/media/${id}`);
    return res.data?.data || res.data;
  },

  uploadMedia: async (file, altText = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }
    const res = await api.post('/api/admin/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data?.data || res.data;
  },

  deleteMedia: async (id) => {
    const res = await api.delete(`/api/admin/media/${id}`);
    return res.data?.data || res.data;
  },
};

export default mediaService;
