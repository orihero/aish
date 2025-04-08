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

const TEST_ACCOUNTS = {
  admin: {
    email: 'admin@admin.com',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const
  },
  employer: {
    email: 'employer@test.com',
    password: 'employer',
    firstName: 'John',
    lastName: 'Employer',
    role: 'employer' as const
  },
  employee: {
    email: 'employee@test.com',
    password: 'employee',
    firstName: 'Jane',
    lastName: 'Employee',
    role: 'employee' as const
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // Development mode test accounts
      if (isDev) {
        const testAccount = Object.values(TEST_ACCOUNTS).find(
          account => account.email === email && account.password === password
        );

        if (testAccount) {
          const tempToken = 'temp-token';
          localStorage.setItem('token', tempToken);
          set({
            user: {
              id: '1',
              ...testAccount
            },
            token: tempToken,
            isLoading: false
          });
          return;
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
          throw new Error('Please use one of the test accounts for development');
        }
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