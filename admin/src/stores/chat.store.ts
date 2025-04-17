import { create } from 'zustand';
import { api } from '../lib/axios';

export interface Message {
  _id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
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
  candidate?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  messages: Message[];
  status: string;
  score?: number;
  feedback?: string;
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

  clearError: () => set({ error: null }),
})); 