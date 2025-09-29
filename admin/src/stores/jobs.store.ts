import { create } from 'zustand';
import { api } from '../lib/axios';
import { useAuthStore } from './auth.store';
import { AxiosError } from 'axios';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  category: string | {
    _id: string;
    title: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  workType: 'remote' | 'hybrid' | 'on-site';
  location: {
    country: string;
    city: string;
    address?: string;
    type: string;
  };
  company: {
    _id: string;
    name: string;
    logo?: string;
  };
  creator: string;
  status: 'active' | 'closed' | 'draft';
  isApplied?: boolean;
  applicationStatus?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applicationCount?: number;
}

interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    categories: string[];
    employmentType: string[];
    workType: string[];
    salaryRange: {
      min: number;
      max: number;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  getJobs: () => Promise<void>;
  createJob: (jobData: Partial<Job>) => Promise<void>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  setFilters: (filters: Partial<JobsState['filters']>) => void;
  setPagination: (pagination: Partial<JobsState['pagination']>) => void;
  clearError: () => void;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    categories: [],
    employmentType: [],
    workType: [],
    salaryRange: {
      min: 0,
      max: 200000,
    },
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  getJobs: async () => {
    try {
      set({ isLoading: true, error: null });
      const { filters, pagination } = get();
      const { user } = useAuthStore.getState();
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.categories.length && { categories: filters.categories.join(',') }),
        ...(filters.employmentType.length && { employmentType: filters.employmentType.join(',') }),
        ...(filters.workType.length && { workType: filters.workType.join(',') }),
        ...(filters.salaryRange.min > 0 && { salaryMin: filters.salaryRange.min.toString() }),
        ...(filters.salaryRange.max < 200000 && { salaryMax: filters.salaryRange.max.toString() })
      });

      const endpoint = user?.role === 'employer' ? '/vacancies/my' : '/vacancies';
      const response = await api.get(`${endpoint}?${params}`);
      
      set({
        jobs: response.data.vacancies,
        pagination: {
          ...get().pagination,
          total: response.data.total,
        },
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to fetch jobs',
        isLoading: false,
      });
    }
  },

  createJob: async (jobData) => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/vacancies', jobData);
      await get().getJobs();
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to create job',
        isLoading: false,
      });
    }
  },

  updateJob: async (id, jobData) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/vacancies/${id}`, jobData);
      await get().getJobs();
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to update job',
        isLoading: false,
      });
    }
  },

  deleteJob: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/vacancies/${id}`);
      await get().getJobs();
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to delete job',
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 },
    }));
    get().getJobs();
  },

  setPagination: (newPagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    }));
    get().getJobs();
  },

  clearError: () => set({ error: null }),
}));