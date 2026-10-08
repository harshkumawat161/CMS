import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data?.data || res.data;
  },

  refreshToken: async (refreshToken) => {
    const res = await api.post('/api/auth/refresh', { refreshToken });
    return res.data?.data || res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/api/auth/me');
    return res.data?.data || res.data;
  },
};

export default authService;
