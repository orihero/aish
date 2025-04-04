import { X, ArrowUpDown } from 'lucide-react';
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
  const { categories } = useCategoriesStore();

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
                            subcategory: undefined // Reset subcategory when category changes
                          });
                        }}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.title.find(t => t.language === 'en')?.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.category && (
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
                          {categories
                            .find(c => c.id === formData.category)
                            ?.subcategories.map(sub => (
                              <option key={sub.id} value={sub.id}>
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
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
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