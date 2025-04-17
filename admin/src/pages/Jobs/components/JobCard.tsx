import { Building2, Eye, Pencil, Trash2, Clock, FileText, CheckCircle, XCircle, Users, Calendar } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuthStore } from '../../../stores/auth.store';
import type { Job } from '../../../stores/jobs.store';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (id: string) => void;
  onApply?: (job: Job) => void;
  showApplyButton?: boolean;
}

export function JobCard({ job, onEdit, onDelete, onApply, showApplyButton }: JobCardProps) {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  const getCategoryName = (category: Job['category']) => {
    if (typeof category === 'string') return category;
    return category.title;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <FileText className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{job.company.name}</span>
                <span className="text-gray-400">•</span>
                <span>{job.company.size}</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              job.employmentType === 'full-time' 
                ? 'bg-purple-50 text-purple-700'
                : job.employmentType === 'contract'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-green-50 text-green-700'
            }`}>
              {t(`jobs.employmentType.${job.employmentType}`)}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700`}>
                {t(`jobs.workType.${job.workType}`)}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                <Users className="w-4 h-4" />
                {job.applicationsCount || 0} {t('jobs.applicants')}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-50 text-gray-700">
                <Calendar className="w-4 h-4" />
                {format(new Date(job.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-900">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </div>
              {user?.role === 'employee' && (
                job.isApplied ? (
                  <div className="flex items-center gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                      job.applicationStatus === 'pending' ? 'bg-amber-50 text-amber-700' :
                      job.applicationStatus === 'reviewed' ? 'bg-blue-50 text-blue-700' :
                      job.applicationStatus === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
                      job.applicationStatus === 'rejected' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {getStatusIcon(job.applicationStatus || 'pending')}
                      {t(`applications.status.${job.applicationStatus || 'pending'}`)}
                    </div>
                  </div>
                ) : showApplyButton && (
                  <button
                    onClick={() => onApply?.(job)}
                    className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-500 font-medium"
                  >
                    Apply Now
                  </button>
                )
              )}
              {(user?.role === 'admin' || user?.id === job.creator) && (
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDelete?.(job._id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onEdit?.(job)}
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