import { create } from 'zustand';
import { api } from '../lib/axios';

export interface Category {
  _id: string;
  parentId?: string | null;
  title: {
    language: string;
    value: string;
  }[];
  icon: string;
  subcategories: {
    _id?: string;
    title: {
      language: string;
      value: string;
    }[];
    icon: string;
  }[];
}

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  getCategories: () => Promise<void>;
  createCategory: (categoryData: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, categoryData: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  getCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/categories');
      set({ categories: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  createCategory: async (categoryData) => {
    try {
      set({ isLoading: true, error: null });
      
      // If this is a subcategory
      if (categoryData.parentId) {
        const parentCategory = get().categories.find(c => c._id === categoryData.parentId);
        if (!parentCategory) {
          throw new Error('Parent category not found');
        }
        
        // Add as subcategory
        await api.post(`/categories/${categoryData.parentId}/subcategories`, {
          title: categoryData.title,
          icon: categoryData.icon
        });
      } else {
        // Create as main category
        await api.post('/categories', {
          title: categoryData.title,
          icon: categoryData.icon,
          subcategories: []
        });
      }
      
      await get().getCategories();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create category',
        isLoading: false,
      });
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/categories/${id}`, categoryData);
      await get().getCategories();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update category',
        isLoading: false,
      });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/categories/${id}`);
      await get().getCategories();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete category',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));