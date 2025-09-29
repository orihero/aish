import { X, HelpCircle } from 'lucide-react';
import { useEffect } from 'react';
import type { Job } from '../../../stores/jobs.store';
import { useCategoriesStore } from '../../../stores/categories.store';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingJob: Job | null;
  formData: {
    title: string;
    category: string;
    subcategory?: string;
    description: string;
    employmentType: string;
    workType: string;
    aiAssist: boolean;
    salary: {
      min: number;
      max: number;
      currency: string;
    }
  };
  setFormData: (data: any) => void;
  error: string | null;
  onClearError: () => void;
}

const employmentTypes = ['full-time', 'part-time', 'contract'];
const workTypes = ['remote', 'hybrid', 'onsite'];
const currencies = ['USD', 'EUR', 'GBP', 'UZS', 'RUB', 'UAH'];

export function JobForm({
  isOpen,
  onClose,
  onSubmit,
  editingJob,
  formData,
  setFormData,
  error,
  onClearError
}: JobFormProps) {
  const { categories, getCategories } = useCategoriesStore();

  useEffect(() => {
    if (isOpen) {
      getCategories();
    }
  }, [isOpen, getCategories]);

  if (!isOpen) return null;

  const selectedCategory = categories.find(c => c._id === formData.category);

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
                      {editingJob ? 'Edit Job' : 'Add New Job'}
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
                        Job Title
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter job title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                        rows={4}
                        placeholder="Enter job description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                        value={formData.category}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            category: e.target.value,
                            subcategory: '' // Reset subcategory when category changes
                          });
                        }}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.title.find(t => t.language === 'en')?.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCategory && selectedCategory.subcategories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subcategory
                        </label>
                        <select
                          className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        >
                          <option value="">Select Subcategory</option>
                          {selectedCategory.subcategories.map(sub => (
                              <option key={sub._id} value={sub._id}>
                                {sub.title.find(t => t.language === 'en')?.value}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Employment Type
                        </label>
                        <select
                          className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          value={formData.employmentType}
                          onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        >
                          <option value="">Select Type</option>
                          {employmentTypes.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Work Type
                        </label>
                        <select
                          className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          value={formData.workType}
                          onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                        >
                          <option value="">Select Type</option>
                          {workTypes.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Salary Range
                      </label>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <input
                          type="number"
                          className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          placeholder="Min salary"
                          value={formData.salary.min}
                          onChange={(e) => setFormData({
                            ...formData,
                            salary: { ...formData.salary, min: Number(e.target.value) }
                          })}
                        />
                        <input
                          type="number"
                          className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          placeholder="Max salary"
                          value={formData.salary.max}
                          onChange={(e) => setFormData({
                            ...formData,
                            salary: { ...formData.salary, max: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div className="mt-2">
                        <select
                          className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          value={formData.salary.currency}
                          onChange={(e) => setFormData({
                            ...formData,
                            salary: { ...formData.salary, currency: e.target.value }
                          })}
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.aiAssist}
                              onChange={(e) => setFormData({ ...formData, aiAssist: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                          <span className="text-sm font-medium text-gray-700">Enable AI assist</span>
                          <div className="relative">
                            <button
                              type="button"
                              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none group"
                            >
                              <HelpCircle className="w-4 h-4" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block shadow-lg">
                                <p className="font-medium mb-2">AI-Powered Recruitment Assistant</p>
                                <ul className="space-y-1.5">
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Conducts initial AI-powered screening interviews with candidates</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Automatically evaluates and ranks candidates based on qualifications and experience</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Filters out unqualified candidates to save your time</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Performs preliminary technical assessments and personality fit analysis</span>
                                  </li>
                                </ul>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
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
                        disabled={!formData.title || !formData.category || !formData.description || !formData.employmentType || !formData.workType || !formData.salary.min || !formData.salary.max}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingJob ? 'Save Changes' : 'Add Job'}
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