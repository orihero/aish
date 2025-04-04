import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, Download, Plus } from 'lucide-react';
import { useJobsStore } from '../../stores/jobs.store';
import { useCategoriesStore } from '../../stores/categories.store';
import { JobFilters } from './components/JobFilters';
import { JobCard } from './components/JobCard';
import { JobForm } from './components/JobForm';
import { useAuthStore } from '../../stores/auth.store';

export function Jobs() {
  const navigate = useNavigate();
  const {
    jobs,
    filters,
    pagination,
    isLoading,
    error,
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    setFilters,
    setPagination,
    clearError
  } = useJobsStore();

  const { getCategories } = useCategoriesStore();
  const { user } = useAuthStore();

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
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <JobFilters
          filters={filters}
          onFilterChange={(key, value) => setFilters({ [key]: value })}
        />
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
          {(user?.role === 'admin' || user?.role === 'employer') && (
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-medium flex items-center gap-2"
              onClick={() => navigate('/jobs/create')}
            >
              <Plus className="w-4 h-4" />
              Add New Job
            </button>
          )}
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={pagination.limit}
                onChange={(e) => setPagination({ limit: Number(e.target.value) })}
                className="appearance-none bg-gray-50 border-0 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ search: e.target.value })
                }
                className="pl-9 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No jobs found</div>
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