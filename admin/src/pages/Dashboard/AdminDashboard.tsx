import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { useTranslation } from '../../hooks/useTranslation';

export function AdminDashboard() {
  const { t } = useTranslation();

  const stats = {
    totalUsers: 1240,
    paidUsers: 640,
    activeUsers: 860,
    pendingUsers: 42
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('dashboard.welcome')} 👋
          </h1>
          <p className="mt-1 text-gray-600">
            {t('dashboard.businessOverview')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          trend={{ value: "+29%", isPositive: true }}
          icon={<Users className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Active Companies"
          value={stats.paidUsers}
          trend={{ value: "+18%", isPositive: true }}
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeUsers}
          trend={{ value: "+42%", isPositive: true }}
          icon={<Briefcase className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Applications"
          value={stats.pendingUsers}
          trend={{ value: "+32%", isPositive: true }}
          icon={<FileText className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Companies</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div>
                    <div className="font-medium text-gray-900">Company {i + 1}</div>
                    <div className="text-sm text-gray-500">Technology</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div>
                    <div className="font-medium text-gray-900">Job Title {i + 1}</div>
                    <div className="text-sm text-gray-500">Company Name</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  New
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}