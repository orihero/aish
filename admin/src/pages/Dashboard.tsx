import { Briefcase, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from '../hooks/useTranslation';
import { useAuthStore } from '../stores/auth.store';
import { useDashboardStore } from '../stores/dashboard.store';
import { useJobsStore } from '../stores/jobs.store';
import { JobCard } from './Jobs/components/JobCard';
import { JobFilters } from './Jobs/components/JobFilters';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function Dashboard() {
  const { user } = useAuthStore();
  const { company, stats, isLoading, getEmployerDashboard } = useDashboardStore();
  const { jobs, filters, setFilters } = useJobsStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.role === 'employer') {
      getEmployerDashboard();
    }
  }, [user?.role]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600">
            {payload[0].name}: {payload[0].value} applications
          </p>
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'reviewed': return 'bg-blue-50 text-blue-700';
      case 'accepted': return 'bg-emerald-50 text-emerald-700';
      case 'rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
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

  if (user?.role === 'employee') {
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
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('dashboard.welcome')}, {user?.firstName}! 👋
            </h1>
            <p className="mt-1 text-gray-600">
              {t('jobs.matchingOpportunities')}
            </p>
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
                  onEdit={() => { }}
                  onDelete={() => { }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!company || !stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">No Company Profile</h2>
        <p className="mt-2 text-gray-600">Please create your company profile first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your job postings
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Vacancies</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVacancies}</p>
                <p className="ml-2 text-sm font-medium text-emerald-600">
                  {stats.activeVacancies} active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Accepted</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.applicationsByStatus.accepted}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.applicationsByStatus.pending}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#625F6E]">Applications Overview</h2>
              <p className="text-sm text-gray-500">Monthly application trends</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.monthlyApplications.map((value, index) => ({
                  name: months[index],
                  value
                }))}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7367F0" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#7367F0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7367F0"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#625F6E]">Recent Applications</h2>
              <p className="text-sm text-gray-500">Latest candidates</p>
            </div>
          </div>
          <div className="space-y-4">
            {stats.recentApplications.map((application, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{application.candidate.name}</h3>
                  <p className="text-sm text-gray-500">{application.candidate.email}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(application.status)}`}>
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{application.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vacancy Stats */}
        <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#625F6E]">Vacancy Statistics</h2>
              <p className="text-sm text-gray-500">Applications by vacancy</p>
            </div>
          </div>
          <div className="space-y-4">
            {stats.vacancyStats.map((vacancy) => (
              <div key={vacancy.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{vacancy.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${vacancy.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-700'
                    }`}>
                    {vacancy.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-medium">{vacancy.totalApplications}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-amber-500">Pending</div>
                    <div className="font-medium">{vacancy.applicationsByStatus.pending}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-blue-500">Reviewed</div>
                    <div className="font-medium">{vacancy.applicationsByStatus.reviewed}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-emerald-500">Accepted</div>
                    <div className="font-medium">{vacancy.applicationsByStatus.accepted}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}