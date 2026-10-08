import api from './api';

export const blogService = {
  getAllBlogs: async () => {
    const res = await api.get('/api/admin/blogs');
    return res.data?.data || res.data;
  },

  getBlogById: async (id) => {
    const res = await api.get(`/api/admin/blogs/${id}`);
    return res.data?.data || res.data;
  },

  createBlog: async (blogData) => {
    const res = await api.post('/api/admin/blogs', blogData);
    return res.data?.data || res.data;
  },

  updateBlog: async (id, blogData) => {
    const res = await api.put(`/api/admin/blogs/${id}`, blogData);
    return res.data?.data || res.data;
  },

  deleteBlog: async (id) => {
    const res = await api.delete(`/api/admin/blogs/${id}`);
    return res.data?.data || res.data;
  },

  publishBlog: async (id) => {
    const res = await api.post(`/api/admin/blogs/${id}/publish`);
    return res.data?.data || res.data;
  },

  unpublishBlog: async (id) => {
    const res = await api.post(`/api/admin/blogs/${id}/unpublish`);
    return res.data?.data || res.data;
  },
};

export default blogService;
