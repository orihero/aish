import { Building2, MapPin, Globe, Mail, Phone, Pencil, Trash2, Eye } from 'lucide-react';
import type { Company } from '../../../stores/companies.store';

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
              <div className="flex items-center gap-4 text-gray-600 text-sm mt-1">
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(company)}
                className="p-2 hover:bg-gray-50 rounded-lg"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => onDelete(company.id)}
                className="p-2 hover:bg-gray-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {company.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium">{company.contact.email}</div>
              </div>
            </div>

            {company.contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-500">Phone</div>
                  <div className="font-medium">{company.contact.phone}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                {company.industry}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700">
                {company.size} employees
              </span>
            </div>
            <div className="flex items-center gap-2">
              {company.social && Object.entries(company.social).map(([platform, url]) => (
                url && (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-700"
                  >
                    {platform === 'linkedin' && <i className="fab fa-linkedin" />}
                    {platform === 'twitter' && <i className="fab fa-twitter" />}
                    {platform === 'facebook' && <i className="fab fa-facebook" />}
                    {platform === 'instagram' && <i className="fab fa-instagram" />}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}