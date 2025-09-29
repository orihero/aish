import { useCategoriesStore } from '../../../stores/categories.store';
import { useTranslation } from '../../../hooks/useTranslation';

interface JobFiltersProps {
  filters: {
    categories: string[];
    employmentType: string[];
    workType: string[];
    salaryRange: {
      min: number;
      max: number;
    };
  };
  onFilterChange: (key: string, value: any) => void;
}

const employmentTypes = ['full-time', 'part-time', 'contract'];
const workTypes = ['remote', 'hybrid', 'onsite'];

export function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const { t } = useTranslation();
  const { categories } = useCategoriesStore();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{t('jobs.filters')}</h2>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('jobs.filters.categories')}
        </label>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category._id} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category._id)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category._id]
                    : filters.categories.filter(id => id !== category._id);
                  onFilterChange('categories', newCategories);
                }}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {category.title.find(t => t.language === 'en')?.value}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Employment Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('jobs.filters.employmentType')}
        </label>
        <div className="space-y-2">
          {employmentTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.employmentType.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.employmentType, type]
                    : filters.employmentType.filter(t => t !== type);
                  onFilterChange('employmentType', newTypes);
                }}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {t(`jobs.employmentType.${type}` as any)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('jobs.filters.workType')}
        </label>
        <div className="space-y-2">
          {workTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.workType.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.workType, type]
                    : filters.workType.filter(t => t !== type);
                  onFilterChange('workType', newTypes);
                }}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {t(`jobs.workType.${type}` as any)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('jobs.filters.salaryRange')}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="200000"
            step="10000"
            value={filters.salaryRange.max}
            onChange={(e) => onFilterChange('salaryRange', {
              ...filters.salaryRange,
              max: Number(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.salaryRange.max.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}