import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useCategoriesStore, type Category } from '../../stores/categories.store';
import { CategoryCard } from './components/CategoryCard';
import { CategoryForm } from './components/CategoryForm';
import { useTranslation } from '../../hooks/useTranslation';

export function Categories() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    title: [{ language: 'en', value: '' }],
    icon: 'Folder',
    parentId: null as string | null
  });

  const { categories, isLoading, error, getCategories, createCategory, updateCategory, clearError } = useCategoriesStore();

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      const categoryData = {
        parentId: formData.parentId,
        title: formData.title,
        icon: formData.icon,
        subcategories: []
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      setIsSlideOverOpen(false);
      setEditingCategory(null);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('categories.title')}</h1>
          <p className="mt-1 text-gray-600">
            {t('categories.manage')}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsSlideOverOpen(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('categories.addNew')}
        </button>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      <CategoryForm
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        error={error}
        onClearError={clearError}
        isEditing={!!editingCategory}
        categories={categories.filter(c => !formData.parentId || c.id !== formData.parentId)}
      />
    </div>
  );
}