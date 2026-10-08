import api from './api';

export const messageService = {
  getAllMessages: async () => {
    const res = await api.get('/api/admin/messages');
    return res.data?.data || res.data;
  },

  getMessageById: async (id) => {
    const res = await api.get(`/api/admin/messages/${id}`);
    return res.data?.data || res.data;
  },

  markMessageAsRead: async (id, isRead = true) => {
    const res = await api.patch(`/api/admin/messages/${id}/read`, { read: isRead });
    return res.data?.data || res.data;
  },

  deleteMessage: async (id) => {
    const res = await api.delete(`/api/admin/messages/${id}`);
    return res.data?.data || res.data;
  },
};

export default messageService;
