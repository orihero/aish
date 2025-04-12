import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, User, FileText, Check, X } from 'lucide-react';
import { useJobsStore } from '../../../stores/jobs.store';
import { useApplicationsStore } from '../../../stores/Applications.store';

export function JobApplications() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, getJobs } = useJobsStore();
  const { applications, getApplications, updateApplication } = useApplicationsStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    getJobs();
    getApplications();
  }, []);

  const job = jobs.find(j => j._id === id);
  const jobApplications = applications.filter(app => app.jobId === id);

  const filteredApplications = jobApplications.filter(app => {
    const matchesSearch = app.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await updateApplication(applicationId, newStatus);
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  if (!job) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Job not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
          <p className="text-gray-600">{jobApplications.length} applications</p>
        </div>
        <button
          onClick={() => navigate('/jobs')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to Jobs
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search applicants..."
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
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredApplications.map((application) => (
          <div
            key={application.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{application.userName}</h3>
                    <span className="text-sm text-gray-600">
                      Applied {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    application.status === 'accepted' 
                      ? 'bg-green-50 text-green-700'
                      : application.status === 'rejected'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => handleStatusChange(application.id, 'accepted')}
                    disabled={application.status === 'accepted'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                      application.status === 'accepted'
                        ? 'bg-green-50 text-green-700 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(application.id, 'rejected')}
                    disabled={application.status === 'rejected'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                      application.status === 'rejected'
                        ? 'bg-red-50 text-red-700 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => navigate(`/resumes/${application.resumeId}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 