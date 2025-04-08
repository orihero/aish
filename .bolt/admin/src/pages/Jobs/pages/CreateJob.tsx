import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { HelpCircle } from 'lucide-react';
import { useJobsStore } from '../../../stores/jobs.store';
import { useCategoriesStore } from '../../../stores/categories.store';

const employmentTypes = ['full-time', 'part-time', 'contract'];
const workTypes = ['remote', 'hybrid', 'onsite'];
const currencies = ['USD', 'EUR', 'GBP', 'UZS', 'RUB', 'UAH'];

function CreateJob() {
  const navigate = useNavigate();
  const { createJob, error, clearError } = useJobsStore();
  const { categories, getCategories } = useCategoriesStore();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    aiAssist: false,
    employmentType: '',
    workType: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    }
  });

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        ...formData,
        salary: {
          ...formData.salary,
          min: Number(formData.salary.min.replace(/[^0-9.-]+/g, '')),
          max: Number(formData.salary.max.replace(/[^0-9.-]+/g, ''))
        }
      });
      navigate('/jobs');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Job</h1>
        <p className="mt-1 text-gray-600">
          Fill in the details below to create a new job listing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              required
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
              required
              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
              rows={8}
              placeholder="Enter job description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                required
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
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Type
              </label>
              <select
                required
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
                required
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary Range
            </label>
            <div className="grid grid-cols-3 gap-4 mt-1">
              <NumericFormat
                required
                thousandSeparator=","
                prefix={formData.salary.currency + " "}
                className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                placeholder="Min salary"
                value={formData.salary.min}
                onValueChange={(values) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, min: values.value }
                })}
              />
              <NumericFormat
                required
                thousandSeparator=","
                prefix={formData.salary.currency + " "}
                className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                placeholder="Max salary"
                value={formData.salary.max}
                onValueChange={(values) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, max: values.value }
                })}
              />
              <select
                required
                className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                value={formData.salary.currency}
                onChange={(e) => setFormData((prev) => ({
                  ...formData,
                  salary: {
                    min: '',
                    max: '',
                    currency: e.target.value
                  }
                }))}
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

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
          >
            Create Job
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-800 hover:text-red-900">×</button>
        </div>
      )}
    </div>
  );
}

export { CreateJob }