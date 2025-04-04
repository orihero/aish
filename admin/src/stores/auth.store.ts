import { create } from 'zustand';

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

const isDev = import.meta.env.DEV;
const TEMP_EMAIL = 'admin@admin.com';
const TEMP_PASSWORD = 'admin';

const TEMP_USER = {
  id: '1',
  email: TEMP_EMAIL,
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin' as const
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // Development mode temporary login
      if (isDev && email === TEMP_EMAIL && password === TEMP_PASSWORD) {
        const tempToken = 'temp-token';
        localStorage.setItem('token', tempToken);
        set({ user: TEMP_USER, token: tempToken, isLoading: false });
        return;
      }

      // In development, simulate a delay and error for non-temp credentials
      if (isDev) {
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('Please use the temporary admin account for development');
      }

      // Production login logic (disabled in development)
      if (!isDev) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        set({ user: data.user, token: data.token, isLoading: false });
      }
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