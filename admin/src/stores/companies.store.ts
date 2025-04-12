import { create } from 'zustand';
import { api } from '../lib/axios';

export interface Company {
  id: string;
  name: string;
  logo?: string;
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
  creator: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

interface CompanyWithVacancies {
  company: Company;
  vacancies: Array<{
    title: string;
    status: string;
    createdAt: string;
  }>;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CompaniesState {
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    industry: string;
    size: string;
    country: string;
    status: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  getCompanies: () => Promise<void>;
  getCurrentCompany: () => Promise<void>;
  createCompany: (companyData: Partial<Company>) => Promise<void>;
  updateCompany: (id: string | undefined, companyData: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  setFilters: (filters: Partial<CompaniesState['filters']>) => void;
  setPagination: (pagination: Partial<CompaniesState['pagination']>) => void;
  clearError: () => void;
}

export const useCompaniesStore = create<CompaniesState>((set, get) => ({
  companies: [],
  currentCompany: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    industry: '',
    size: '',
    country: '',
    status: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },

  getCurrentCompany: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<CompanyWithVacancies>('/companies/my');
      set({
        currentCompany: response.data.company,
        isLoading: false
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to fetch company',
        isLoading: false,
        currentCompany: null
      });
    }
  },

  getCompanies: async () => {
    try {
      set({ isLoading: true, error: null });
      const { filters, pagination } = get();
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.industry && { industry: filters.industry }),
        ...(filters.size && { size: filters.size }),
        ...(filters.country && { country: filters.country }),
        ...(filters.status && { status: filters.status })
      });

      const response = await api.get(`/companies?${params}`);
      
      set({
        companies: response.data.companies,
        pagination: {
          ...get().pagination,
          total: response.data.total
        },
        isLoading: false
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to fetch companies',
        isLoading: false
      });
    }
  },

  createCompany: async (companyData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Handle file upload if logo is a File object
      const updatedData = { ...companyData };
      if (typeof companyData.logo === 'object' && companyData.logo !== null) {
        const formData = new FormData();
        formData.append('logo', companyData.logo);
        
        const uploadResponse = await api.post('/companies/upload-logo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        updatedData.logo = uploadResponse.data.url;
      }

      await api.post('/companies', updatedData);
      await get().getCurrentCompany();
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to create company',
        isLoading: false
      });
    }
  },

  updateCompany: async (id: string | undefined, companyData: Partial<Company>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use current company ID if no ID is provided
      const currentState = get();
      const companyId = id || currentState.currentCompany?.id;
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      // Handle file upload if logo is a File object
      const updatedData = { ...companyData };
      if (typeof companyData.logo === 'object' && companyData.logo !== null) {
        const formData = new FormData();
        formData.append('logo', companyData.logo);
        
        const uploadResponse = await api.post('/companies/upload-logo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        updatedData.logo = uploadResponse.data.url;
      }

      await api.put(`/companies/${companyId}`, updatedData);
      await get().getCurrentCompany();
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to update company',
        isLoading: false
      });
    }
  },

  deleteCompany: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/companies/${id}`);
      await get().getCompanies();
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.response?.data?.message || 'Failed to delete company',
        isLoading: false
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }
    }));
    get().getCompanies();
  },

  setPagination: (newPagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination }
    }));
    get().getCompanies();
  },

  clearError: () => set({ error: null })
}));