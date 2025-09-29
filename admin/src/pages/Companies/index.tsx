import { useState, useEffect } from 'react';
import { Search, ArrowUpDown, Download, Plus } from 'lucide-react';
import { useCompaniesStore, type Company } from '../../stores/companies.store';
import { CompanyFilters } from './components/CompanyFilters';
import { CompanyCard } from './components/CompanyCard';
import { CompanyForm } from './components/CompanyForm';
import { useTranslation } from '../../hooks/useTranslation';

export function Companies() {
  const { t } = useTranslation();
  const {
    companies,
    filters,
    pagination,
    isLoading,
    error,
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    setFilters,
    setPagination,
    clearError
  } = useCompaniesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    industry: '',
    size: '1-50' as '1-50' | '51-200' | '201-1000' | '1000-5000' | '5000+',
    founded: undefined as number | undefined,
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
    benefits: [] as string[]
  });

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    if (editingCompany) {
      setFormData({
        name: editingCompany.name,
        logo: editingCompany.logo || '',
        description: editingCompany.description,
        industry: editingCompany.industry,
        size: editingCompany.size,
        founded: editingCompany.founded,
        website: editingCompany.website || '',
        location: {
          ...editingCompany.location,
          address: editingCompany.location.address || ''
        },
        contact: {
          ...editingCompany.contact,
          phone: editingCompany.contact.phone || ''
        },
        social: {
          linkedin: editingCompany.social?.linkedin || '',
          twitter: editingCompany.social?.twitter || '',
          facebook: editingCompany.social?.facebook || '',
          instagram: editingCompany.social?.instagram || ''
        },
        benefits: editingCompany.benefits
      });
    } else {
      setFormData({
        name: '',
        logo: '',
        description: '',
        industry: '',
        size: '1-50' as '1-50' | '51-200' | '201-1000' | '1000-5000' | '5000+',
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
    }
  }, [editingCompany]);

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
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t('companies.title')}</h1>
        <p className="mt-1 text-gray-600">
          {t('companies.manage')}
        </p>
      </div>

      {/* Filters */}
      <CompanyFilters
        filters={filters}
        onFilterChange={(key, value) => setFilters({ [key]: value })}
      />

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={pagination.limit}
              onChange={(e) => setPagination({ limit: Number(e.target.value) })}
              className="appearance-none bg-gray-50 border-0 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Company"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
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
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-500 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Company
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center py-12 text-gray-500">Loading...</div>
        ) : companies.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">No companies found</div>
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

      {/* Form */}
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
  );
}