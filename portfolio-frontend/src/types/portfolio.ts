export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface AboutProfile {
  id?: number;
  name: string;
  email: string;
  headline: string;
  bio: string;
  location?: string;
  resumeUrl?: string;
  profileImage?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  displayOrder: number;
  published: boolean;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  featured: boolean;
  displayOrder: number;
  status: 'DRAFT' | 'PUBLISHED' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  technologies: string[];
  displayOrder: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  message: string;
  image?: string;
  displayOrder: number;
  published: boolean;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
  published: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  publishedAt?: string;
  status: 'DRAFT' | 'PUBLISHED' | string;
  createdAt?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

