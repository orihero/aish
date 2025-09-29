import { X } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Company } from '../../../stores/companies.store';

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingCompany: Company | null;
  formData: {
    name: string;
    logo?: string;
    description: string;
    industry: string;
    size: string;
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
  setFormData: (data: any) => void;
  error: string | null;
  onClearError: () => void;
}

function getFilePreview(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Media',
  'Construction',
  'Transportation',
  'Agriculture'
];

const companySizes = [
  '1-50',
  '51-200',
  '201-1000',
  '1000-5000',
  '5000+'
];

export function CompanyForm({
  isOpen,
  onClose,
  onSubmit,
  editingCompany,
  formData,
  setFormData,
  error,
  onClearError
}: CompanyFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Preview the image
    const preview = await getFilePreview(file);
    setLogoPreview(preview);

    // Update form data
    setFormData({
      ...formData,
      logo: file
    });
  };

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
                      {editingCompany ? 'Edit Company' : 'Add New Company'}
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
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Company Name
                          </label>
                          <input
                            type="text"
                            required
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter company name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Company Logo
                          </label>
                          <div className="mt-1 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {logoPreview ? (
                                <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                              ) : (formData.logo as any) instanceof File ? (
                                <img src={URL.createObjectURL(formData.logo as unknown as File)} alt="Preview" className="w-full h-full object-cover" />
                              ) : formData.logo ? (
                                <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  No logo
                                </div>
                              )}
                            </div>
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg"
                              >
                                {formData.logo ? 'Change Logo' : 'Upload Logo'}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            required
                            rows={4}
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter company description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Industry
                            </label>
                            <select
                              required
                              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                              value={formData.industry}
                              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            >
                              <option value="">Select Industry</option>
                              {industries.map(industry => (
                                <option key={industry} value={industry}>
                                  {industry}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Company Size
                            </label>
                            <select
                              required
                              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                              value={formData.size}
                              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            >
                              <option value="">Select Size</option>
                              {companySizes.map(size => (
                                <option key={size} value={size}>
                                  {size} employees
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Founded Year
                            </label>
                            <input
                              type="number"
                              min="1800"
                              max={new Date().getFullYear()}
                              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter founded year"
                              value={formData.founded}
                              onChange={(e) => setFormData({ ...formData, founded: Number(e.target.value) })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Website
                            </label>
                            <input
                              type="url"
                              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter website URL"
                              value={formData.website}
                              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Location</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Country
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter country"
                              value={formData.location.country}
                              onChange={(e) => setFormData({
                                ...formData,
                                location: { ...formData.location, country: e.target.value }
                              })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              City
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter city"
                              value={formData.location.city}
                              onChange={(e) => setFormData({
                                ...formData,
                                location: { ...formData.location, city: e.target.value }
                              })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <input
                            type="text"
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter address"
                            value={formData.location.address}
                            onChange={(e) => setFormData({
                              ...formData,
                              location: { ...formData.location, address: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter email"
                            value={formData.contact.email}
                            onChange={(e) => setFormData({
                              ...formData,
                              contact: { ...formData.contact, email: e.target.value }
                            })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            type="tel"
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter phone number"
                            value={formData.contact.phone}
                            onChange={(e) => setFormData({
                              ...formData,
                              contact: { ...formData.contact, phone: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Social Links</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter LinkedIn URL"
                            value={formData.social?.linkedin}
                            onChange={(e) => setFormData({
                              ...formData,
                              social: { ...formData.social, linkedin: e.target.value }
                            })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Twitter
                          </label>
                          <input
                            type="url"
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter Twitter URL"
                            value={formData.social?.twitter}
                            onChange={(e) => setFormData({
                              ...formData,
                              social: { ...formData.social, twitter: e.target.value }
                            })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Facebook
                          </label>
                          <input
                            type="url"
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter Facebook URL"
                            value={formData.social?.facebook}
                            onChange={(e) => setFormData({
                              ...formData,
                              social: { ...formData.social, facebook: e.target.value }
                            })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Instagram
                          </label>
                          <input
                            type="url"
                            className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter Instagram URL"
                            value={formData.social?.instagram}
                            onChange={(e) => setFormData({
                              ...formData,
                              social: { ...formData.social, instagram: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Benefits</h3>
                      <div className="space-y-2">
                        {formData.benefits.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter benefit"
                              value={benefit}
                              onChange={(e) => {
                                const newBenefits = [...formData.benefits];
                                newBenefits[index] = e.target.value;
                                setFormData({ ...formData, benefits: newBenefits });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newBenefits = formData.benefits.filter((_, i) => i !== index);
                                setFormData({ ...formData, benefits: newBenefits });
                              }}
                              className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            benefits: [...formData.benefits, '']
                          })}
                          className="w-full mt-2 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-purple-500 hover:text-purple-500"
                        >
                          Add Benefit
                        </button>
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
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                      >
                        {editingCompany ? 'Save Changes' : 'Add Company'}
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