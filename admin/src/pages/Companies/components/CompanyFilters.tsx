
interface CompanyFiltersProps {
  filters: {
    industry: string;
    size: string;
    country: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
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

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Japan',
  'Singapore'
];

export function CompanyFilters({ filters, onFilterChange }: CompanyFiltersProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-medium text-gray-900 mb-4">Filters</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            value={filters.industry}
            onChange={(e) => onFilterChange('industry', e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Size
          </label>
          <select
            value={filters.size}
            onChange={(e) => onFilterChange('size', e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Sizes</option>
            {companySizes.map(size => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
}