import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { ApplicationsChart } from './components/ApplicationsChart';
import { RecentApplications } from './components/RecentApplications';
import { VacancyStats } from './components/VacancyStats';
import { useAuthStore } from '../../stores/auth.store';
import { useDashboardStore } from '../../stores/dashboard.store';
import { useEffect } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function EmployerDashboard() {
  const { user } = useAuthStore();
  const { company, stats, isLoading, getEmployerDashboard } = useDashboardStore();

  useEffect(() => {
    getEmployerDashboard();
  }, []);

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
        <StatCard
          title="Total Vacancies"
          value={stats.totalVacancies}
          subtitle={`${stats.activeVacancies} active`}
          icon={<Briefcase className="h-6 w-6" />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FileText className="h-6 w-6" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Accepted"
          value={stats.applicationsByStatus.accepted}
          icon={<CheckCircle className="h-6 w-6" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pending Review"
          value={stats.applicationsByStatus.pending}
          icon={<Clock className="h-6 w-6" />}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ApplicationsChart
          data={stats.monthlyApplications.map((value, index) => ({
            name: months[index],
            value
          }))}
        />
        <RecentApplications applications={stats.recentApplications} />
        <VacancyStats stats={stats.vacancyStats} />
      </div>
    </div>
  );
}