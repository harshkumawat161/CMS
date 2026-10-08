import api from './api';

export const testimonialService = {
  getAllTestimonials: async () => {
    const res = await api.get('/api/admin/testimonials');
    return res.data?.data || res.data;
  },

  getTestimonialById: async (id) => {
    const res = await api.get(`/api/admin/testimonials/${id}`);
    return res.data?.data || res.data;
  },

  createTestimonial: async (data) => {
    const res = await api.post('/api/admin/testimonials', data);
    return res.data?.data || res.data;
  },

  updateTestimonial: async (id, data) => {
    const res = await api.put(`/api/admin/testimonials/${id}`, data);
    return res.data?.data || res.data;
  },

  deleteTestimonial: async (id) => {
    const res = await api.delete(`/api/admin/testimonials/${id}`);
    return res.data?.data || res.data;
  },
};

export default testimonialService;
