import { create } from 'zustand';

export interface Resume {
  id: string;
  name: string;
  file: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ResumesState {
  resumes: Resume[];
  loading: boolean;
  error: string | null;
  getMyResumes: () => Promise<void>;
}

export const useResumesStore = create<ResumesState>((set) => ({
  resumes: [],
  loading: false,
  error: null,
  getMyResumes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/resumes/me');
      const data = await response.json();
      set({ resumes: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch resumes', loading: false });
    }
  }
}));