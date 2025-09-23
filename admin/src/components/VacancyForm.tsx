import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Sparkles, 
  MapPin,
  Plus,
  X
} from 'lucide-react';
import { useChatStore } from '../stores/chat.store';
import { useJobsStore } from '../stores/jobs.store';
import { useCategoriesStore } from '../stores/categories.store';
import { useCompaniesStore } from '../stores/companies.store';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const employmentTypes = ['full-time', 'part-time', 'contract', 'internship'];
const workTypes = ['remote', 'hybrid', 'on-site'];
const currencies = ['USD', 'EUR', 'GBP', 'UZS', 'RUB', 'UAH'];

interface VacancyFormProps {
  onVacancyCreated?: (vacancy: any) => void;
}

export const VacancyForm = ({ onVacancyCreated }: VacancyFormProps) => {
  const navigate = useNavigate();
  const { generateContentFromDescription, isLoading: aiLoading, error: aiError, clearError } = useChatStore();
  const { createJob, error: jobError, clearError: clearJobError } = useJobsStore();
  const { categories, getCategories } = useCategoriesStore();
  const { currentCompany, getCurrentCompany } = useCompaniesStore();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
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

  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [generatingContent, setGeneratingContent] = useState<string | null>(null);

  useEffect(() => {
    getCategories();
    getCurrentCompany();
  }, []);

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

  const handleCurrencyChange = (newCurrency: string) => {
    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        currency: newCurrency
        // Keep min and max values - don't clear them
      }
    }));
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
        company: currentCompany.id,
        employmentType: formData.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship',
        workType: formData.workType as 'remote' | 'hybrid' | 'on-site',
        salary: {
          ...formData.salary,
          min: Number(formData.salary.min.toString().replace(/[^0-9.-]+/g, '')),
          max: Number(formData.salary.max.toString().replace(/[^0-9.-]+/g, ''))
        },
        location: {
          ...formData.location,
          type: formData.workType
        }
      };

      const result = await createJob(cleanedData);
      if (onVacancyCreated) {
        onVacancyCreated(result);
      }
      navigate('/my-vacancies');
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Vacancy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateTitle}
                disabled={!formData.description.trim() || generatingContent === 'title'}
                className="text-xs"
              >
                {generatingContent === 'title' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-1" />
                )}
                Generate with AI
              </Button>
            </div>
            <input
              type="text"
              required
              className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
              placeholder="Enter job title or generate from description"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
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

          {/* Requirements Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateRequirements}
                disabled={!formData.description.trim() || generatingContent === 'requirements'}
                className="text-xs"
              >
                {generatingContent === 'requirements' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Bot className="w-3 h-3 mr-1" />
                )}
                Generate from Description
              </Button>
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                  disabled={formData.requirements.length === 1}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addRequirement}
              className="text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Requirement
            </Button>
          </div>

          {/* Responsibilities Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateResponsibilities}
                disabled={!formData.description.trim() || generatingContent === 'responsibilities'}
                className="text-xs"
              >
                {generatingContent === 'responsibilities' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Bot className="w-3 h-3 mr-1" />
                )}
                Generate from Description
              </Button>
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeResponsibility(index)}
                  disabled={formData.responsibilities.length === 1}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addResponsibility}
              className="text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Responsibility
            </Button>
          </div>

          {/* Salary Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Salary Range
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSalary}
                disabled={!formData.description.trim() || generatingContent === 'salary'}
                className="text-xs"
              >
                {generatingContent === 'salary' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Bot className="w-3 h-3 mr-1" />
                )}
                Generate from Description
              </Button>
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
                onChange={(e) => handleCurrencyChange(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Basic Required Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                required
                className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                value={formData.category}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    subcategory: ''
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                required
                className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Type
              </label>
              <select
                required
                className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
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

          {/* Optional Fields Section */}
          <div className="border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <MapPin className="w-4 h-4" />
              <span>Location & Additional Details</span>
              {showOptionalFields ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {showOptionalFields && (
              <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                      placeholder="Country"
                      value={formData.location.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, country: e.target.value }
                      })}
                    />
                    <input
                      type="text"
                      className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                      placeholder="City"
                      value={formData.location.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value }
                      })}
                    />
                    <input
                      type="text"
                      className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                      placeholder="Address"
                      value={formData.location.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, address: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/jobs')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={aiLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Vacancy'
              )}
            </Button>
          </div>

          {/* Error Messages */}
          {(aiError || jobError) && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-between">
              <span>{aiError || jobError}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  clearError();
                  clearJobError();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
