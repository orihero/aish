import { Building2, MapPin, Eye, Trash2, Pencil } from 'lucide-react';
import type { Job } from '../../../stores/jobs.store';
import { useCategoriesStore } from '../../../stores/categories.store';
import { useAuthStore } from '../../../stores/auth.store';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const { categories } = useCategoriesStore();
  const { user } = useAuthStore();

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return 'Unknown';
    
    const mainTitle = category.title.find(t => t.language === 'en')?.value;
    if (job.subcategory) {
      const subcategory = category.subcategories.find(s => s.id === job.subcategory);
      const subTitle = subcategory?.title.find(t => t.language === 'en')?.value;
      return subTitle ? `${mainTitle} / ${subTitle}` : mainTitle;
    }
    return mainTitle;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start gap-6">
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <span className="text-sm text-gray-600">
                {getCategoryName(job.category)}
              </span>
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
              <span className={`px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700`}>
                {job.workType.charAt(0).toUpperCase() + job.workType.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-900">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </div>
              {(user?.role === 'admin' || user?.id === job.creator) && (
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDelete(job.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onEdit(job)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}