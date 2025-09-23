import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { HelpCircle, Bot, Loader2, Sparkles, Plus, X } from 'lucide-react';
import { useJobsStore, Job } from '../../../stores/jobs.store';
import { useCategoriesStore } from '../../../stores/categories.store';
import { useCompaniesStore } from '../../../stores/companies.store';
import { useChatStore } from '../../../stores/chat.store';

const employmentTypes = ['full-time', 'part-time', 'contract', 'internship'];
const workTypes = ['remote', 'hybrid', 'on-site'];
const currencies = ['USD', 'EUR', 'GBP', 'UZS', 'RUB', 'UAH'];


function CreateJob() {
  const navigate = useNavigate();
  const { createJob, error, clearError } = useJobsStore();
  const { categories, getCategories } = useCategoriesStore();
  const { currentCompany, getCurrentCompany } = useCompaniesStore();
  const { generateContentFromDescription, error: aiError, clearError: clearAiError } = useChatStore();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    aiAssist: false,
    employmentType: '',
    workType: '',
    location: {
      country: '',
      city: '',
      address: ''
    },
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    }
  });

  const [generatingContent, setGeneratingContent] = useState<string | null>(null);

  useEffect(() => {
    getCategories();
    getCurrentCompany();
  }, [getCategories, getCurrentCompany]);

  // Helper functions for dynamic arrays
  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const updateResponsibility = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) => i === index ? value : resp)
    }));
  };

  // AI Content Generation Functions
  const generateTitle = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a job description first');
      return;
    }

    try {
      setGeneratingContent('title');
      const result = await generateContentFromDescription(formData.description, 'title');
      setFormData(prev => ({ ...prev, title: result.content as string }));
      
      // Log language detection for debugging
      if (result.detectedLanguage && result.languageName) {
        console.log(`Generated title in ${result.languageName} (${result.detectedLanguage})`);
      }
    } catch (error) {
      console.error('Error generating title:', error);
    } finally {
      setGeneratingContent(null);
    }
  };

  const generateRequirements = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a job description first');
      return;
    }

    try {
      setGeneratingContent('requirements');
      const result = await generateContentFromDescription(formData.description, 'requirements');
      setFormData(prev => ({ ...prev, requirements: result.content as string[] }));
      
      // Log language detection for debugging
      if (result.detectedLanguage && result.languageName) {
        console.log(`Generated requirements in ${result.languageName} (${result.detectedLanguage})`);
      }
    } catch (error) {
      console.error('Error generating requirements:', error);
    } finally {
      setGeneratingContent(null);
    }
  };

  const generateResponsibilities = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a job description first');
      return;
    }

    try {
      setGeneratingContent('responsibilities');
      const result = await generateContentFromDescription(formData.description, 'responsibilities');
      setFormData(prev => ({ ...prev, responsibilities: result.content as string[] }));
      
      // Log language detection for debugging
      if (result.detectedLanguage && result.languageName) {
        console.log(`Generated responsibilities in ${result.languageName} (${result.detectedLanguage})`);
      }
    } catch (error) {
      console.error('Error generating responsibilities:', error);
    } finally {
      setGeneratingContent(null);
    }
  };

  const generateSalary = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a job description first');
      return;
    }

    try {
      setGeneratingContent('salary');
      const result = await generateContentFromDescription(formData.description, 'salary', formData.salary.currency);
      const [min, max] = (result.content as string).split('-').map(s => s.trim());
      setFormData(prev => ({ 
        ...prev, 
        salary: { 
          ...prev.salary, 
          min: min || '', 
          max: max || '' 
        } 
      }));
      
      // Log language detection for debugging
      if (result.detectedLanguage && result.languageName) {
        console.log(`Generated salary in ${result.languageName} (${result.detectedLanguage})`);
      }
    } catch (error) {
      console.error('Error generating salary:', error);
    } finally {
      setGeneratingContent(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCompany) {
      alert('Please create a company profile first before creating vacancies.');
      return;
    }

    try {
      // Filter out empty requirements and responsibilities
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        responsibilities: formData.responsibilities.filter(resp => resp.trim() !== ''),
        company: currentCompany.id, // Add company ID
        employmentType: formData.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship',
        workType: formData.workType as 'remote' | 'hybrid' | 'on-site',
        salary: {
          ...formData.salary,
          min: Number(formData.salary.min.replace(/[^0-9.-]+/g, '')),
          max: Number(formData.salary.max.replace(/[^0-9.-]+/g, ''))
        },
        location: {
          ...formData.location,
          type: formData.workType // Set location type based on work type
        }
      };

      await createJob(cleanedData as unknown as Partial<Job>);
      navigate('/my-vacancies');
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <button
                type="button"
                onClick={generateTitle}
                disabled={!formData.description.trim() || generatingContent === 'title'}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingContent === 'title' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-1" />
                )}
                Generate with AI
              </button>
            </div>
            <input
              type="text"
              required
              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
              placeholder="Enter job title or generate from description"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              required
              className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
              rows={6}
              placeholder="Enter detailed job description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              This description will be used by AI to generate requirements, responsibilities, salary, and title.
            </p>
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
                  <option key={category._id} value={category._id}>
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
                    .find(c => c._id === formData.category)
                    ?.subcategories.map(sub => (
                      <option key={sub._id} value={sub._id}>
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

          {/* Requirements Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <button
                type="button"
                onClick={generateRequirements}
                disabled={!formData.description.trim() || generatingContent === 'requirements'}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingContent === 'requirements' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Bot className="w-3 h-3 mr-1" />
                )}
                Generate from Description
              </button>
            </div>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter a requirement"
                  value={requirement}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded-lg"
                  disabled={formData.requirements.length === 1}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Requirement
            </button>
          </div>

          {/* Responsibilities Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities
              </label>
              <button
                type="button"
                onClick={generateResponsibilities}
                disabled={!formData.description.trim() || generatingContent === 'responsibilities'}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingContent === 'responsibilities' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Bot className="w-3 h-3 mr-1" />
                )}
                Generate from Description
              </button>
            </div>
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter a responsibility"
                  value={responsibility}
                  onChange={(e) => updateResponsibility(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded-lg"
                  disabled={formData.responsibilities.length === 1}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResponsibility}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Responsibility
            </button>
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  required
                  className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                  placeholder="Country"
                  value={formData.location.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value }
                  })}
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                  placeholder="City"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                  placeholder="Address (Optional)"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                />
              </div>
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Salary Range
              </label>
              <button
                type="button"
                onClick={generateSalary}
                disabled={!formData.description.trim() || generatingContent === 'salary'}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingContent === 'salary' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Bot className="w-3 h-3 mr-1" />
                )}
                Generate from Description
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
                    ...prev.salary,
                    currency: e.target.value
                    // Keep min and max values - don't clear them
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

      {(error || aiError) && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-between">
          <span>{error || aiError}</span>
          <button 
            onClick={() => {
              clearError();
              clearAiError();
            }} 
            className="text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export { CreateJob }