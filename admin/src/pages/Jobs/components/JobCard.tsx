import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Eye, Trash2, Pencil } from 'lucide-react';
import type { Job } from '../../../stores/jobs.store';
import type { Resume } from '../../../stores/resumes.store';
import { useCategoriesStore } from '../../../stores/categories.store';
import { useResumesStore } from '../../../stores/resumes.store';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuthStore } from '../../../stores/auth.store';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onApply?: () => Promise<void>;
  showApplyButton?: boolean;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const { categories } = useCategoriesStore();
  const { user } = useAuthStore();
  const { resumes, getMyResumes } = useResumesStore();
  const { t } = useTranslation();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'employee') {
      getMyResumes();
    }
  }, [user]);

  const handleApply = async () => {
    if (!selectedResume) return;
    
    setIsSubmitting(true);
    try {
      await applyToJob(selectedResume.id, job.id);
      setIsApplyModalOpen(false);
      // Show success message
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

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
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-900">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </div>
              {user?.role === 'employee' && (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-500 font-medium"
                >
                  Apply Now
                </button>
              )}
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
      
      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Apply to {job.title}
            </h3>
            
            {resumes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  You need to create a resume first to apply for this job.
                </p>
                <Link
                  to="/profile"
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  Create Resume
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Resume
                  </label>
                  <select
                    className="w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                    value={selectedResume?.id || ''}
                    onChange={(e) => setSelectedResume(resumes.find(r => r.id === e.target.value) || null)}
                  >
                    <option value="">Select a resume</option>
                    {resumes.map(resume => (
                      <option key={resume.id} value={resume.id}>
                        {resume.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!selectedResume || isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}