import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <Icons.Home className="h-5 w-5" /> },
  { to: '/users', label: 'Users', icon: <Icons.Users className="h-5 w-5" /> },
  { to: '/jobs', label: 'Jobs', icon: <Icons.Briefcase className="h-5 w-5" /> },
  { to: '/companies', label: 'Companies', icon: <Icons.Building2 className="h-5 w-5" /> },
  { to: '/categories', label: 'Categories', icon: <Icons.FolderTree className="h-5 w-5" /> }
];

const employerNavItems = [
  { to: '/dashboard', label: 'Home', icon: <Icons.Briefcase className="h-5 w-5" /> },
  { to: '/jobs', label: 'My Vacancies', icon: <Icons.Briefcase className="h-5 w-5" /> },
  { to: '/company', label: 'Company', icon: <Icons.Building2 className="h-5 w-5" /> }
];

const employeeNavItems = [
  { to: '/dashboard', label: 'Home', icon: <Icons.Briefcase className="h-5 w-5" /> },
  { to: '/jobs/my-applications', label: 'My Applications', icon: <Icons.FileText className="h-5 w-5" /> },
  { to: '/profile', label: 'Profile', icon: <Icons.User className="h-5 w-5" /> }
];

const getNavItems = (role: string | undefined) => {
  switch (role) {
    case 'admin':
      return adminNavItems;
    case 'employer':
      return employerNavItems;
    case 'employee':
      return employeeNavItems;
    default:
      return [];
  }
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { role } = user || {};

  const navItems = getNavItems(role);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      {role === 'admin' && (
        <div className="bg-white border-r border-gray-100 w-64">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Icons.Heart className="h-7 w-7 text-purple-500 fill-purple-500" />
              <span className="text-xl font-semibold text-[#625F6E]">Vuexy</span>
            </div>
          </div>
          <div className="p-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 ${
                  location.pathname === item.to
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}