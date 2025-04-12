import { useAuthStore } from '../../stores/auth.store';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Building2, Search, Languages } from 'lucide-react';

const Header = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const mainNavigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'My Vacancies', href: '/jobs', icon: Briefcase },
    { name: 'Company', href: '/company', icon: Building2 },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-purple-600 text-xl">♥</span>
              <span className="font-semibold text-xl">Vuexy</span>
            </Link>
            <nav className="flex space-x-6">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href ||
                  (item.href === '/jobs' && location.pathname.startsWith('/jobs'));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 text-sm font-medium ${
                      isActive ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search (Ctrl+/)"
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="p-1.5 text-gray-600 hover:text-gray-900">
              <Languages className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 