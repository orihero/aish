import React from 'react';
import * as LucideIcons from 'lucide-react';
import { X, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    title: {
      language: string;
      value: string;
    }[];
    icon: string;
    parentId: string | null;
  };
  setFormData: (data: any) => void;
  error: string | null;
  onClearError: () => void;
  isEditing: boolean;
  categories: Category[];
}

function IconPreview({ iconName }: { iconName: string }) {
  const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
  
  if (!Icon) {
    return (
      <div className="flex items-center gap-2 text-amber-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Icon not found</span>
      </div>
    );
  }
  
  return <Icon className="w-5 h-5 text-gray-600" />;
}

export function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  error,
  onClearError,
  isEditing,
  categories
}: CategoryFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 h-0 overflow-y-auto">
                <div className="px-6 py-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {isEditing ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <button
                      onClick={onClose}
                      className="ml-3 h-7 flex items-center"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="px-6 py-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category Names
                      </label>
                      <div className="mt-2 space-y-3">
                        {formData.title.map((translation, index) => (
                          <div key={index} className="flex gap-2">
                            <select
                              value={translation.language}
                              onChange={(e) => {
                                const newTitles = [...formData.title];
                                newTitles[index].language = e.target.value;
                                setFormData({ ...formData, title: newTitles });
                              }}
                              className="w-24 bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="uz">Uzbek</option>
                              <option value="ru">Russian</option>
                              <option value="uk">Ukrainian</option>
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="it">Italian</option>
                            </select>
                            <input
                              type="text"
                              value={translation.value}
                              onChange={(e) => {
                                const newTitles = [...formData.title];
                                newTitles[index].value = e.target.value;
                                setFormData({ ...formData, title: newTitles });
                              }}
                              placeholder="Enter category name"
                              className="flex-1 bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newTitles = formData.title.filter((_, i) => i !== index);
                                setFormData({ ...formData, title: newTitles });
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              title: [...formData.title, { language: 'en', value: '' }]
                            });
                          }}
                          className="w-full mt-2 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-purple-500 hover:text-purple-500 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Translation
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Parent Category (Optional)
                      </label>
                      <select
                        className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                        value={formData.parentId || ''}
                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                      >
                        <option value="">None (Create as main category)</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.title.find(t => t.language === 'en')?.value}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        Select a parent category to create this as a subcategory
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter icon name (e.g. Folder, Box, Star)"
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <IconPreview iconName={formData.icon} />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Enter a valid Lucide icon name. The icon will preview if it exists.
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-6 py-6 border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={onSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                      >
                        {isEditing ? 'Save Changes' : 'Add Category'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="absolute bottom-4 right-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <span>{error}</span>
              <button onClick={onClearError} className="text-red-800 hover:text-red-900">×</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}