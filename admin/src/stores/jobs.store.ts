import { create } from 'zustand';
import { api } from '../lib/axios';

export interface Job {
  id: string;
  title: string;
  creator: string;
  category: string;
  subcategory?: string;
  description: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  workType: 'remote' | 'hybrid' | 'onsite';
  salary: {
    min: string;
    max: string;
    currency: string;
  };
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
  setFilters: (filters: Partial<typeof JobsState['filters']>) => void;
  setPagination: (pagination: Partial<typeof JobsState['pagination']>) => void;
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

      const response = await api.get(`/vacancies?${params}`);
      
      set({
        jobs: response.data.vacancies,
        pagination: {
          ...get().pagination,
          total: response.data.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch jobs',
        isLoading: false,
      });
    }
  },

  createJob: async (jobData) => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/vacancies', jobData);
      await get().getJobs();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create job',
        isLoading: false,
      });
    }
  },

  updateJob: async (id, jobData) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/vacancies/${id}`, jobData);
      await get().getJobs();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update job',
        isLoading: false,
      });
    }
  },

  deleteJob: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/vacancies/${id}`);
      await get().getJobs();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete job',
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