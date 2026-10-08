import axios from 'axios';
import {
  AboutProfile,
  Skill,
  Project,
  Experience,
  Testimonial,
  ServiceItem,
  BlogPost,
  ContactSubmission,
  ContactResult,
} from '@/types/portfolio';
import { API_BASE_URL } from './utils';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

function unwrap<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export const portfolioApi = {
  getAbout: async (): Promise<AboutProfile | null> => {
    try {
      const res = await apiClient.get('/api/about');
      return unwrap<AboutProfile>(res.data);
    } catch (err: any) {
      console.error('Failed to fetch about data:', err.message);
      return null;
    }
  },

  getSkills: async (): Promise<Skill[]> => {
    try {
      const res = await apiClient.get('/api/skills');
      const data = unwrap<Skill[]>(res.data);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error('Failed to fetch skills:', err.message);
      return [];
    }
  },

  getProjects: async (): Promise<Project[]> => {
    try {
      const res = await apiClient.get('/api/projects');
      const data = unwrap<Project[]>(res.data);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error('Failed to fetch projects:', err.message);
      return [];
    }
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    try {
      const res = await apiClient.get(`/api/projects/${slug}`);
      return unwrap<Project>(res.data);
    } catch (err: any) {
      console.error(`Failed to fetch project by slug [${slug}]:`, err.message);
      return null;
    }
  },

  getExperiences: async (): Promise<Experience[]> => {
    try {
      const res = await apiClient.get('/api/experience');
      const data = unwrap<Experience[]>(res.data);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error('Failed to fetch experience:', err.message);
      return [];
    }
  },

  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const res = await apiClient.get('/api/testimonials');
      const data = unwrap<Testimonial[]>(res.data);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error('Failed to fetch testimonials:', err.message);
      return [];
    }
  },

  getServices: async (): Promise<ServiceItem[]> => {
    try {
      const res = await apiClient.get('/api/services');
      const data = unwrap<ServiceItem[]>(res.data);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error('Failed to fetch services:', err.message);
      return [];
    }
  },

  getBlogs: async (page = 0, size = 10): Promise<{ content: BlogPost[]; totalElements: number }> => {
    try {
      const res = await apiClient.get('/api/blogs', {
        params: { page, size },
      });
      const data = unwrap<any>(res.data);
      if (Array.isArray(data)) {
        return { content: data, totalElements: data.length };
      }
      if (data && Array.isArray(data.content)) {
        return {
          content: data.content,
          totalElements: data.totalElements || data.content.length,
        };
      }
      return { content: [], totalElements: 0 };
    } catch (err: any) {
      console.error('Failed to fetch blogs:', err.message);
      return { content: [], totalElements: 0 };
    }
  },

  getBlogBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const res = await apiClient.get(`/api/blogs/${slug}`);
      return unwrap<BlogPost>(res.data);
    } catch (err: any) {
      console.error(`Failed to fetch blog by slug [${slug}]:`, err.message);
      return null;
    }
  },

  submitContact: async (submission: ContactSubmission): Promise<ContactResult> => {
    try {
      const res = await apiClient.post('/api/contact', submission);
      return {
        success: true,
        message:
          res.data?.message ||
          'Thank you! Your message has been sent successfully.',
      };
    } catch (err: any) {
      const backendData = err.response?.data;
      const status = err.response?.status;

      // Server validation failure (HTTP 400 with field errors map)
      if (status === 400 && backendData?.errors && typeof backendData.errors === 'object') {
        return {
          success: false,
          message: 'Please review and correct the errors highlighted below.',
          fieldErrors: backendData.errors as Record<string, string>,
        };
      }

      // Friendly sanitized message for bad request or rate limits without raw technical details
      if (status && status >= 400 && status < 500) {
        const msg = backendData?.message;
        if (msg && typeof msg === 'string' && msg.length < 150 && !msg.toLowerCase().includes('exception') && !msg.toLowerCase().includes('sql')) {
          return {
            success: false,
            message: msg,
          };
        }
        return {
          success: false,
          message: 'Invalid submission data. Please verify your inputs and try again.',
        };
      }

      // Never expose technical internal server or network errors to users
      return {
        success: false,
        message: 'Could not deliver your inquiry right now due to a network or server issue. Please try again in a moment or reach out directly via email.',
      };
    }
  },
};

export default portfolioApi;
