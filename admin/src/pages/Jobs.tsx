import { Building2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  workType: 'remote' | 'hybrid' | 'onsite';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  categories: string[];
  logo?: string;
}

interface Filters {
  search: string;
  categories: string[];
  employmentType: string[];
  workType: string[];
  salaryRange: {
    min: number;
    max: number;
  };
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Email Marketing',
    company: 'Revolut',
    location: 'Madrid, Spain',
    description: 'Revolut is looking for Email Marketing to help team ma...',
    employmentType: 'full-time',
    workType: 'hybrid',
    salary: {
      min: 50000,
      max: 75000,
      currency: 'USD'
    },
    categories: ['Marketing', 'Design'],
    logo: 'https://images.unsplash.com/photo-1662947995689-ec5165848bcd?q=80&w=50&h=50&auto=format&fit=crop'
  },
  // Add more mock jobs as needed
];

const categories = [
  'Marketing',
  'Design',
  'Development',
  'Sales',
  'Customer Service',
  'Finance',
  'HR',
  'Legal',
];

const employmentTypes = ['full-time', 'part-time', 'contract'];
const workTypes = ['remote', 'hybrid', 'onsite'];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start gap-6">
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <div className="flex items-center text-gray-600 text-sm">
                <span>{job.company}</span>
                <span className="mx-2">·</span>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              job.employmentType === 'full-time' 
                ? 'bg-purple-50 text-purple-700'
                : job.employmentType === 'contract'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-green-50 text-green-700'
            }`}>
              {job.employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {job.categories.map((category, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index % 2 === 0
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Jobs() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    categories: [],
    employmentType: [],
    workType: [],
    salaryRange: {
      min: 0,
      max: 200000,
    },
  });

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleEmploymentTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter(t => t !== type)
        : [...prev.employmentType, type],
    }));
  };

  const handleWorkTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      workType: prev.workType.includes(type)
        ? prev.workType.filter(t => t !== type)
        : [...prev.workType, type],
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      employmentType: [],
      workType: [],
      salaryRange: {
        min: 0,
        max: 200000,
      },
    });
  };

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Salary Range */}
          <FilterSection title="Salary Range">
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={filters.salaryRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  salaryRange: { ...prev.salaryRange, max: Number(e.target.value) }
                }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${filters.salaryRange.max.toLocaleString()}</span>
              </div>
            </div>
          </FilterSection>

          {/* Categories */}
          <FilterSection title="Categories">
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Employment Type */}
          <FilterSection title="Employment Type">
            <div className="space-y-2">
              {employmentTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.employmentType.includes(type)}
                    onChange={() => handleEmploymentTypeToggle(type)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Work Type */}
          <FilterSection title="Work Type">
            <div className="space-y-2">
              {workTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workType.includes(type)}
                    onChange={() => handleWorkTypeToggle(type)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
            <p className="mt-1 text-gray-600">
              Manage and monitor all job listings
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-medium">
            Add New Job
          </button>
        </div>

        <div className="space-y-4">
          {mockJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}