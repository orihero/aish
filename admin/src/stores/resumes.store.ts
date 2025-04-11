import { create } from 'zustand';

export interface Resume {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  parsedData: {
    basics: {
      name: string;
      label: string;
      image?: string;
      email: string;
      phone: string;
      url?: string;
      summary?: string;
      location?: {
        address?: string;
        postalCode?: string;
        city?: string;
        region?: string;
        countryCode?: string;
      };
      profiles?: {
        network: string;
        username: string;
        url: string;
      }[];
    };
    work?: {
      name: string;
      position: string;
      url?: string;
      startDate: string;
      endDate?: string;
      summary?: string;
      highlights?: string[];
      location?: string;
    }[];
    education?: {
      institution: string;
      url?: string;
      area: string;
      studyType: string;
      startDate: string;
      endDate?: string;
      gpa?: string;
      courses?: string[];
    }[];
    skills?: {
      name: string;
      level?: string;
      keywords?: string[];
    }[];
    languages?: {
      language: string;
      fluency: string;
    }[];
    projects?: {
      name: string;
      description?: string;
      highlights?: string[];
      keywords?: string[];
      startDate?: string;
      url?: string;
    }[];
  };
}

interface ResumesState {
  resumes: Resume[];
  loading: boolean;
  error: string | null;
  getMyResumes: () => Promise<void>;
  createResume: (data: Partial<Resume>) => Promise<void>;
  analyzeResume: (file: File) => Promise<Resume['parsedData']>;
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
  },

  createResume: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const resume = await response.json();
      set(state => ({
        resumes: [...state.resumes, resume],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create resume', loading: false });
    }
  },

  analyzeResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/resumes/analyze', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }
    
    return response.json();
  }
}));