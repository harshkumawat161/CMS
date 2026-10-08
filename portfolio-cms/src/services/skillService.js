import api from './api';

export const skillService = {
  getAllSkills: async () => {
    const res = await api.get('/api/admin/skills');
    return res.data?.data || res.data;
  },

  getSkillById: async (id) => {
    const res = await api.get(`/api/admin/skills/${id}`);
    return res.data?.data || res.data;
  },

  createSkill: async (skillData) => {
    const res = await api.post('/api/admin/skills', skillData);
    return res.data?.data || res.data;
  },

  updateSkill: async (id, skillData) => {
    const res = await api.put(`/api/admin/skills/${id}`, skillData);
    return res.data?.data || res.data;
  },

  deleteSkill: async (id) => {
    const res = await api.delete(`/api/admin/skills/${id}`);
    return res.data?.data || res.data;
  },
};

export default skillService;
