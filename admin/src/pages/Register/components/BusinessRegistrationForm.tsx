import React, { useState } from 'react';
import { ArrowRight, Building2, Eye, EyeOff, Globe, MapPin, Phone, Upload, X } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

interface BusinessRegistrationFormProps {
  onSubmit: (data: BusinessRegistrationData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export interface BusinessRegistrationData {
  // User account details
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  
  // Company details
  company: {
    name: string;
    description: string;
    industry: string;
    size: '1-50' | '51-200' | '201-1000' | '1000-5000' | '5000+';
    founded?: number;
    website?: string;
    location: {
      country: string;
      city: string;
      address?: string;
    };
    contact: {
      email: string;
      phone?: string;
    };
    social?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
    benefits: string[];
  };
}

const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Consulting',
  'Media & Entertainment',
  'Transportation',
  'Energy',
  'Government',
  'Non-profit',
  'Other'
];

const COMPANY_SIZE_OPTIONS = [
  { value: '1-50', label: '1-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-1000', label: '201-1000 employees' },
  { value: '1000-5000', label: '1000-5000 employees' },
  { value: '5000+', label: '5000+ employees' }
];

const COUNTRY_OPTIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Australia',
  'New Zealand',
  'Japan',
  'South Korea',
  'Singapore',
  'India',
  'Brazil',
  'Mexico',
  'Argentina',
  'South Africa',
  'Nigeria',
  'Egypt',
  'Other'
];

export function BusinessRegistrationForm({ onSubmit, isLoading, error, onClearError }: BusinessRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<'account' | 'company'>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BusinessRegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    company: {
      name: '',
      description: '',
      industry: '',
      size: '1-50',
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
    }
  });

  const [benefitInput, setBenefitInput] = useState('');

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('company.')) {
      const companyField = field.replace('company.', '');
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          [companyField]: value
        }
      }));
    } else if (field.startsWith('company.location.')) {
      const locationField = field.replace('company.location.', '');
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          location: {
            ...prev.company.location,
            [locationField]: value
          }
        }
      }));
    } else if (field.startsWith('company.contact.')) {
      const contactField = field.replace('company.contact.', '');
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          contact: {
            ...prev.company.contact,
            [contactField]: value
          }
        }
      }));
    } else if (field.startsWith('company.social.')) {
      const socialField = field.replace('company.social.', '');
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          social: {
            ...prev.company.social,
            [socialField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    // setLogoFile(null);
    setLogoPreview(null);
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !formData.company.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          benefits: [...prev.company.benefits, benefitInput.trim()]
        }
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        benefits: prev.company.benefits.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('company');
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const isAccountValid = formData.firstName && formData.lastName && formData.email && formData.password;
  const isCompanyValid = formData.company.name && formData.company.industry;

  if (currentStep === 'account') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's start with your personal information
          </p>
        </div>

        <form onSubmit={handleAccountSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isAccountValid}
              className="w-full"
            >
              Continue to Company Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <button
            onClick={() => setCurrentStep('account')}
            className="hover:text-gray-900"
          >
            ← Back to Account
          </button>
          <span>•</span>
          <span>Company Details</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Company Information</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your company
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
          {onClearError && (
            <button
              onClick={onClearError}
              className="float-right text-red-800 hover:text-red-900"
            >
              ×
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleCompanySubmit} className="space-y-6">
        {/* Company Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label
                htmlFor="logo"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Company Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <Input
              type="text"
              value={formData.company.name}
              onChange={(e) => handleInputChange('company.name', e.target.value)}
              required
              placeholder="Acme Corporation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry *
            </label>
            <select
              value={formData.company.industry}
              onChange={(e) => handleInputChange('company.industry', e.target.value)}
              required
              className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
            >
              <option value="">Select Industry</option>
              {INDUSTRY_OPTIONS.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Size *
            </label>
            <select
              value={formData.company.size}
              onChange={(e) => handleInputChange('company.size', e.target.value)}
              required
              className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
            >
              {COMPANY_SIZE_OPTIONS.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founded Year
            </label>
            <Input
              type="number"
              value={formData.company.founded || ''}
              onChange={(e) => handleInputChange('company.founded', parseInt(e.target.value) || undefined)}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Description
            </label>
            <textarea
              value={formData.company.description}
              onChange={(e) => handleInputChange('company.description', e.target.value)}
              rows={4}
              className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
              placeholder="Describe your company, its mission, and what makes it unique..."
            />
          </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <Input
              type="url"
              value={formData.company.website}
              onChange={(e) => handleInputChange('company.website', e.target.value)}
              placeholder="https://www.company.com"
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={formData.company.location.country}
                onChange={(e) => handleInputChange('company.location.country', e.target.value)}
                className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
              >
                <option value="">Select Country</option>
                {COUNTRY_OPTIONS.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                type="text"
                value={formData.company.location.city}
                onChange={(e) => handleInputChange('company.location.city', e.target.value)}
                placeholder="New York"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={formData.company.location.address}
                onChange={(e) => handleInputChange('company.location.address', e.target.value)}
                placeholder="123 Main Street, Suite 100"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <Input
                type="email"
                value={formData.company.contact.email}
                onChange={(e) => handleInputChange('company.contact.email', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <Input
                  type="tel"
                  value={formData.company.contact.phone}
                  onChange={(e) => handleInputChange('company.contact.phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Social Media (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <Input
                type="url"
                value={formData.company.social?.linkedin || ''}
                onChange={(e) => handleInputChange('company.social.linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <Input
                type="url"
                value={formData.company.social?.twitter || ''}
                onChange={(e) => handleInputChange('company.social.twitter', e.target.value)}
                placeholder="https://twitter.com/company"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <Input
                type="url"
                value={formData.company.social?.facebook || ''}
                onChange={(e) => handleInputChange('company.social.facebook', e.target.value)}
                placeholder="https://facebook.com/company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <Input
                type="url"
                value={formData.company.social?.instagram || ''}
                onChange={(e) => handleInputChange('company.social.instagram', e.target.value)}
                placeholder="https://instagram.com/company"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Company Benefits</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              placeholder="e.g., Health Insurance, Remote Work"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
            />
            <Button type="button" onClick={addBenefit} variant="outline">
              Add
            </Button>
          </div>
          {formData.company.benefits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.company.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {benefit}
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isCompanyValid || isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </div>
      </form>
    </div>
  );
}
