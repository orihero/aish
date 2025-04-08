import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, Download, Plus } from 'lucide-react';
import { useJobsStore } from '../../stores/jobs.store';
import { useCategoriesStore } from '../../stores/categories.store';
import { JobFilters } from './components/JobFilters';
import { JobCard } from './components/JobCard';
import { JobForm } from './components/JobForm';
import { useAuthStore } from '../../stores/auth.store';
import { useTranslation } from '../../hooks/useTranslation';

export function Jobs() {
  const navigate = useNavigate();
  const {
    jobs,
    pagination,
    isLoading,
    error,
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    setPagination,
    clearError
  } = useJobsStore();

  const { getCategories } = useCategoriesStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<typeof jobs[0] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    employmentType: '',
    workType: '',
    salary: {
      min: 0,
      max: 0,
      currency: 'USD'
    }
  });

  useEffect(() => {
    getJobs();
    getCategories();
  }, []);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title,
        category: editingJob.category,
        subcategory: editingJob.subcategory,
        description: editingJob.description,
        employmentType: editingJob.employmentType,
        workType: editingJob.workType,
        salary: editingJob.salary
      });
    } else {
      setFormData({
        title: '',
        category: '',
        subcategory: '',
        description: '',
        employmentType: '',
        workType: '',
        salary: {
          min: 0,
          max: 0,
          currency: 'USD'
        }
      });
    }
  }, [editingJob]);

  const handleSubmit = async () => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, formData);
      } else {
        await createJob(formData);
      }
      setIsSlideOverOpen(false);
      setEditingJob(null);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div>
      {/* Main Content */}
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{t('jobs.title')}</h1>
            <p className="mt-1 text-gray-600">
              {t('jobs.manage')}
            </p>
          </div>
          {(user?.role === 'admin' || user?.role === 'employer') && (
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-medium flex items-center gap-2"
              onClick={() => navigate('/jobs/create')}
            >
              <Plus className="w-4 h-4" />
              {t('jobs.postNew')}
            </button>
          )}
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('jobs.searchPlaceholder')}
                className="pl-9 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">{t('jobs.noJobsFound')}</div>
          ) : (
            jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={(job) => {
                  setEditingJob(job);
                  setIsSlideOverOpen(true);
                }}
                onDelete={deleteJob}
              />
            ))
          )}
        </div>

        {/* Form */}
        <JobForm
          isOpen={isSlideOverOpen}
          onClose={() => setIsSlideOverOpen(false)}
          onSubmit={handleSubmit}
          editingJob={editingJob}
          formData={formData}
          setFormData={setFormData}
          error={error}
          onClearError={clearError}
        />
      </div>
    </div>
  )
}