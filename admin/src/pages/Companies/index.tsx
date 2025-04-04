import { Search, X, Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { useCompaniesStore } from '../../stores/companies.store';
import { CompanyCard } from './components/CompanyCard';
import { CompanyForm } from './components/CompanyForm';

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Media'
];

const companySizes = [
  '1-50',
  '51-200',
  '201-1000',
  '1000-5000',
  '5000+'
];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function Companies() {
  const {
    companies,
    filters,
    isLoading,
    error,
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    setFilters,
    clearError
  } = useCompaniesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    industry: '',
    size: '',
    founded: undefined,
    website: '',
    location: {
      country: '',
      city: '',
      address: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    social: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    benefits: []
  });

  const handleIndustryToggle = (industry: string) => {
    setFilters(prev => ({
      ...prev,
      industry: prev.industry === industry ? '' : industry
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFilters(prev => ({
      ...prev,
      size: prev.size === size ? '' : size
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, formData);
      } else {
        await createCompany(formData);
      }
      setIsFormOpen(false);
      setEditingCompany(null);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setFilters({})}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Industries */}
          <FilterSection title="Industries">
            <div className="space-y-2">
              {industries.map(industry => (
                <label key={industry} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.industry === industry}
                    onChange={() => handleIndustryToggle(industry)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{industry}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Company Size */}
          <FilterSection title="Company Size">
            <div className="space-y-2">
              {companySizes.map(size => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.size === size}
                    onChange={() => handleSizeToggle(size)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
            <p className="mt-1 text-gray-600">
              Browse and manage company profiles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => {
                setEditingCompany(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Company
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No companies found</div>
          ) : (
            companies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onEdit={(company) => {
                  setEditingCompany(company);
                  setIsFormOpen(true);
                }}
                onDelete={deleteCompany}
              />
            ))
          )}
        </div>

        <CompanyForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          editingCompany={editingCompany}
          formData={formData}
          setFormData={setFormData}
          error={error}
          onClearError={clearError}
        />
      </div>
    </div>
  );
}