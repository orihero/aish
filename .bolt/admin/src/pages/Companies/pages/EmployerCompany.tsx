import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Globe, Mail, Phone, Camera, Plus, Pencil } from 'lucide-react';
import { useCompaniesStore } from '../../../stores/companies.store';
import { CompanyForm } from '../components/CompanyForm';
import { useAuthStore } from '../../../stores/auth.store';

export function EmployerCompany() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    companies,
    isLoading,
    error,
    getCompanies,
    createCompany,
    updateCompany,
    clearError
  } = useCompaniesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [company, setCompany] = useState<any>(null);
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

  useEffect(() => {
    const fetchCompany = async () => {
      await getCompanies();
    };
    fetchCompany();
  }, []);

  useEffect(() => {
    // Find the employer's company
    const myCompany = companies.find(c => c.creator === user?.id);
    if (myCompany) {
      setCompany(myCompany);
      setFormData({
        name: myCompany.name,
        logo: myCompany.logo,
        description: myCompany.description,
        industry: myCompany.industry,
        size: myCompany.size,
        founded: myCompany.founded,
        website: myCompany.website,
        location: myCompany.location,
        contact: myCompany.contact,
        social: myCompany.social || {},
        benefits: myCompany.benefits
      });
    }
  }, [companies, user]);

  const handleSubmit = async () => {
    try {
      if (company) {
        await updateCompany(company.id, formData);
      } else {
        await createCompany(formData);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Company Profile</h1>
          <p className="mt-1 text-gray-600">
            Create your company profile to start posting jobs
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No company profile</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your company profile
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Company
            </button>
          </div>
        </div>

        <CompanyForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          editingCompany={null}
          formData={formData}
          setFormData={setFormData}
          error={error}
          onClearError={clearError}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Company Profile</h1>
        <p className="mt-1 text-gray-600">
          Manage your company information and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover & Logo */}
        <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg bg-white p-1">
                <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Company Content */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {company.location.city}, {company.location.country}
                </div>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-purple-600"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{company.contact.email}</span>
                </div>
                {company.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{company.contact.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Industry</span>
                  <p className="mt-1">{company.industry}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Company Size</span>
                  <p className="mt-1">{company.size} employees</p>
                </div>
                {company.founded && (
                  <div>
                    <span className="text-sm text-gray-500">Founded</span>
                    <p className="mt-1">{company.founded}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600">{company.description}</p>
          </div>

          {company.benefits && company.benefits.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {company.benefits.map((benefit: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {company.social && Object.values(company.social).some(Boolean) && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
              <div className="flex gap-4">
                {Object.entries(company.social).map(([platform, url]) => (
                  url && (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-700"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CompanyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        editingCompany={company}
        formData={formData}
        setFormData={setFormData}
        error={error}
        onClearError={clearError}
      />
    </div>
  );
}