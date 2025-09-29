import { create } from 'zustand';
import { api } from '../lib/axios';
import { ResumeData } from '../pages/Register';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employer' | 'employee';
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'employer' | 'employee';
  resumeData?: ResumeData;
  resumeFile?: {
    url: string;
    filename: string;
  };
}

interface BusinessRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  company: {
    name: string;
    description: string;
    industry: string;
    size: '1-50' | '51-200' | '201-1000' | '1000-5000' | '5000+';
    founded?: number;
    website?: string;
    location: {
      country: string;
      city: string;
      address?: string;
    };
    contact: {
      email: string;
      phone?: string;
    };
    social?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
    benefits: string[];
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  registerBusiness: (data: BusinessRegistrationData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  validateToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true, // Start with loading true to check token
  error: null,

  validateToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data } = await api.get('/auth/profile');
      set({ user: data, token, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      // Error notifications are now handled globally by axios interceptor
    }
  },

  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register', data);
      localStorage.setItem('token', response.data.token);
      set({ user: response.data.user, token: response.data.token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      // Error notifications are now handled globally by axios interceptor
    }
  },

  registerBusiness: async (data: BusinessRegistrationData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register-business', data);
      localStorage.setItem('token', response.data.token);
      set({ user: response.data.user, token: response.data.token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      // Error notifications are now handled globally by axios interceptor
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null })
}));