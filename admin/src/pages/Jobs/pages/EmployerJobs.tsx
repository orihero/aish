import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Briefcase } from 'lucide-react';
import { useJobsStore } from '../../../stores/jobs.store';
import { useTranslation } from '../../../hooks/useTranslation';
import { api } from '../../../lib/axios';

export function EmployerJobs() {
  const navigate = useNavigate();
  const { jobs, isLoading, error, getJobs } = useJobsStore();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getJobs();
    fetchApplicationCounts();
  }, [getJobs]);

  const fetchApplicationCounts = async () => {
    try {
      // Get all jobs first
      const jobsResponse = await api.get('/vacancies/my');
      const jobsData = jobsResponse.data;
      
      // Fetch application counts for each job
      const counts: Record<string, number> = {};
      for (const job of jobsData) {
        try {
          const applicationsResponse = await api.get(`/applications/job/${job._id}`);
          counts[job._id] = applicationsResponse.data?.length || 0;
        } catch (error) {
          console.error(`Failed to fetch applications for job ${job._id}:`, error);
          counts[job._id] = 0;
        }
      }
      setApplicationCounts(counts);
    } catch (error) {
      console.error('Failed to fetch application counts:', error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getApplicationCount = (jobId: string) => {
    return applicationCounts[jobId] || 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Vacancies</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search vacancies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            onClick={() => navigate(`/jobs/${job._id}/applications`)}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className="text-sm text-gray-600">
                      {typeof job.category === 'object' 
                        ? job.category.title
                        : job.category}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    job.status === 'active' ? 'bg-green-50 text-green-600' :
                    job.status === 'closed' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {t(`jobs.status.${job.status}`)}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700`}>
                      {job.workType === 'on-site' ? 'On-site' : job.workType === 'remote' ? 'Remote' : 'Hybrid'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {getApplicationCount(job._id)} applications
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 