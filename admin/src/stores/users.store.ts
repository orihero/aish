import { create } from 'zustand';
import { api } from '../lib/axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employer' | 'employee';
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  plan: 'basic' | 'team' | 'company' | 'enterprise';
  billing: string;
}

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  stats: {
    totalUsers: number;
    paidUsers: number;
    activeUsers: number;
    pendingUsers: number;
  };
  filters: {
    role: string;
    plan: string;
    status: string;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  getUsers: () => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setFilters: (filters: Partial<typeof UsersState['filters']>) => void;
  setPagination: (pagination: Partial<typeof UsersState['pagination']>) => void;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  stats: {
    totalUsers: 0,
    paidUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
  },
  filters: {
    role: '',
    plan: '',
    status: '',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  getUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/auth/users');

      set({
        users: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch users',
        isLoading: false,
      });
    }
  },

  createUser: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/auth/register', userData);
      await get().getUsers();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create user',
        isLoading: false,
      });
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/auth/users/${id}`, userData);
      await get().getUsers();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update user',
        isLoading: false,
      });
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/auth/users/${id}`);
      await get().getUsers();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete user',
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page on filter change
    }));
    get().getUsers();
  },

  setPagination: (newPagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    }));
    get().getUsers();
  },

  clearError: () => set({ error: null }),
}));