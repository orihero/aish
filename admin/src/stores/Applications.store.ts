import { create } from "zustand";
import { api } from "../lib/axios";

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  resumeId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface ApplicationsState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  getApplications: () => Promise<void>;
  createApplication: (jobId: string) => Promise<void>;
  updateApplication: (
    id: string,
    status: Application["status"]
  ) => Promise<void>;
  clearError: () => void;
}

export const useApplicationsStore = create<ApplicationsState>((set) => ({
  applications: [],
  isLoading: false,
  error: null,

  getApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/applications/me");
      set({ applications: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch applications", isLoading: false });
    }
  },

  createApplication: async (jobId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/applications", { jobId });
      set((state) => ({
        applications: [...state.applications, data],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create application", isLoading: false });
      throw error;
    }
  },

  updateApplication: async (id: string, status: Application["status"]) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch(`/applications/${id}`, { status });
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? data : app
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update application", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
