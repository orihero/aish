import { create } from 'zustand';
import { api } from '../lib/axios';

interface DashboardStats {
  totalVacancies: number;
  activeVacancies: number;
  totalApplications: number;
  applicationsByStatus: {
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
  recentApplications: Array<{
    candidate: {
      name: string;
      email: string;
    };
    status: string;
    appliedAt: string;
    vacancy: string;
  }>;
  vacancyStats: Array<{
    id: string;
    title: string;
    totalApplications: number;
    status: string;
    applicationsByStatus: {
      pending: number;
      reviewed: number;
      accepted: number;
      rejected: number;
    };
  }>;
  monthlyApplications: number[];
}

interface DashboardState {
  company: {
    id: string;
    name: string;
    logo?: string;
    status: string;
  } | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  getEmployerDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  company: null,
  stats: null,
  isLoading: false,
  error: null,

  getEmployerDashboard: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/dashboard/employer');
      set({
        company: response.data.company,
        stats: response.data.stats,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch dashboard data',
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null })
}));