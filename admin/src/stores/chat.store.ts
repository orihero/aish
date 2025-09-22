import { create } from 'zustand';
import { api } from '../lib/axios';

export interface Message {
  _id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  messageType?: 'normal' | 'apply' | 'vacancy_ready' | 'vacancy_creation_start' | 'vacancy_creation_progress' | 'vacancy_creation_complete';
  metadata?: any;
  timestamp: string;
}

interface Company {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  company: Company;
}

interface Application {
  _id: string;
  user: string;
  job: Job;
}

export interface Chat {
  _id: string;
  application?: Application;
  vacancy?: string;
  candidate?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  chatType?: 'application_screening' | 'vacancy_creation';
  messages: Message[];
  status: string;
  score?: number;
  feedback?: string;
  vacancyData?: any;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
  getChats: () => Promise<void>;
  getChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, message: string) => Promise<void>;
  // Vacancy Creation Chat Methods
  startVacancyCreationChat: () => Promise<Chat>;
  continueVacancyCreationChat: (chatId: string, message: string, messageType?: string) => Promise<Chat>;
  finishVacancyCreation: (chatId: string) => Promise<{ chat: Chat; vacancy: any; message: string }>;
  // AI Content Generation Methods
  generateContentFromDescription: (description: string, contentType: 'requirements' | 'responsibilities' | 'salary' | 'title', currency?: string) => Promise<string[] | string>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChat: null,
  isLoading: false,
  error: null,

  getChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/chats');
      set({ chats: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch chats', isLoading: false });
    }
  },

  getChat: async (chatId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/chats/${chatId}`);
      set({ currentChat: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch chat', isLoading: false });
    }
  },

  sendMessage: async (chatId: string, message: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/chats/${chatId}/messages`, { message });
      set({ currentChat: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to send message', isLoading: false });
    }
  },

  // Vacancy Creation Chat Methods
  startVacancyCreationChat: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/chats/vacancy-creation/start');
      set({ currentChat: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: 'Failed to start vacancy creation chat', isLoading: false });
      throw error;
    }
  },

  continueVacancyCreationChat: async (chatId: string, message: string, messageType = 'normal') => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/chats/vacancy-creation/${chatId}/continue`, { 
        message, 
        messageType 
      });
      set({ currentChat: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: 'Failed to continue vacancy creation chat', isLoading: false });
      throw error;
    }
  },

  finishVacancyCreation: async (chatId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/chats/vacancy-creation/${chatId}/finish`);
      set({ currentChat: data.chat, isLoading: false });
      return data;
    } catch (error) {
      set({ error: 'Failed to finish vacancy creation', isLoading: false });
      throw error;
    }
  },

  // AI Content Generation Methods
  generateContentFromDescription: async (description: string, contentType: 'requirements' | 'responsibilities' | 'salary' | 'title', currency?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/ai/generate-content', {
        description,
        contentType,
        currency
      });
      set({ isLoading: false });
      return data.content;
    } catch (error) {
      set({ error: `Failed to generate ${contentType}`, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
})); 