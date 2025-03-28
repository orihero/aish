import { create } from 'zustand';
import { api } from '../lib/axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employer' | 'employee';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'An error occurred',
        isLoading: false
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null })
}));