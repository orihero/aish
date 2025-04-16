import { create } from "zustand";
import { api } from "../lib/axios";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: {
      name: string;
    };
  };
  resume: {
    _id: string;
    name: string;
  };
  status: "pending" | "reviewed" | "accepted" | "rejected";
  chat: {
    _id: string;
    messages: Message[];
  };
  appliedAt: string;
  updatedAt: string;
}

interface ApplicationsState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  getApplications: () => Promise<void>;
  createApplication: (resumeId: string, jobId: string) => Promise<void>;
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

  createApplication: async (resumeId: string, jobId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/applications/resumes/${resumeId}/apply/${jobId}`);
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
          app._id === id ? data : app
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update application", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
