import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Briefcase, Plus, Eye, Users, X, MessageSquare } from 'lucide-react';
import { useJobsStore, Job } from '../../stores/jobs.store';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/ui/button';
import { VacancyCreationChat } from '../../components/VacancyCreationChat';
import { Card, CardContent } from '../../components/ui/card';

export function MyVacancies() {
  const navigate = useNavigate();
  const { jobs, isLoading, error, getJobs } = useJobsStore();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showVacancyChat, setShowVacancyChat] = useState(false);
  const [createdVacancy, setCreatedVacancy] = useState<unknown>(null);
  useEffect(() => {
    getJobs();
  }, [getJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getApplicationCount = (job: Job) => {
    return job.applicationCount || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'closed':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'draft':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const handleVacancyCreated = (vacancy: unknown) => {
    setCreatedVacancy(vacancy);
    setShowVacancyChat(false);
    // Refresh the jobs list to show the new vacancy
    getJobs();
  };

  const handleCreateVacancy = () => {
    setShowVacancyChat(true);
    setCreatedVacancy(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Vacancies</h1>
          <p className="text-gray-600 mt-1">Manage and track your job postings</p>
        </div>
        <div className="flex gap-2">
          {/* <Button 
            onClick={handleCreateVacancy}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Create with AI Assistant
          </Button> */}
          <Button 
            onClick={() => navigate('/jobs/create')}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Vacancy
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vacancies</p>
              <p className="text-2xl font-semibold text-gray-900">{jobs.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-green-600">
                {jobs.filter(job => job.status === 'active').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-semibold text-blue-600">
                {jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {jobs.filter(job => job.status === 'draft').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
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

      {/* Vacancies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vacancies found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedStatus 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first vacancy'
              }
            </p>
            {!searchTerm && !selectedStatus && (
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={handleCreateVacancy}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create with AI Assistant
                </Button>
                <Button 
                  onClick={() => navigate('/jobs/create')}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Traditional Form
                </Button>
              </div>
            )}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <span className="text-sm text-gray-600">
                        {typeof job.category === 'object' 
                          ? 'Information Technology'
                          : job.category}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(job.status)}`}>
                      {t(`jobs.status.${job.status}`)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700">
                        {job.workType === 'on-site' ? 'On-site' : job.workType === 'remote' ? 'Remote' : 'Hybrid'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {getApplicationCount(job)} applications
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job._id}/applications`)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Applications
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job._id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vacancy Creation Chat Modal */}
      {showVacancyChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Create New Vacancy with AI Assistant
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVacancyChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <VacancyCreationChat onVacancyCreated={handleVacancyCreated} />
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {createdVacancy !== null && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="border-green-200 bg-green-50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Vacancy Created Successfully!</p>
                  <p className="text-sm text-green-600">Vacancy has been added to your vacancies.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCreatedVacancy(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
