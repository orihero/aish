import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, FolderKanban, Plus } from 'lucide-react';
import type { Category } from '../../../stores/categories.store';
import { useCategoriesStore } from '../../../stores/categories.store';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { deleteCategory } = useCategoriesStore();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl">
              {category.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {category.title.find(t => t.language === 'en')?.value}
              </h3>
              <p className="text-sm text-gray-600">{category.subcategories.length} subcategories</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-50 rounded-lg"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Edit Category
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Category
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm text-purple-600 hover:text-purple-500 font-medium"
        >
          {isExpanded ? 'Hide subcategories' : 'Show subcategories'}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-6 space-y-4">
            {category.subcategories.map(sub => (
              <div key={sub.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                    <FolderKanban className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-900">
                    {sub.title.find(t => t.language === 'en')?.value}
                  </span>
                </div>
              </div>
            ))}
            
            <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-purple-500 hover:text-purple-500 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Subcategory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}