import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { useLanguageStore } from '../stores/language.store';

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
  { to: '/applications', label: 'My Applications', icon: <Icons.FileText className="h-5 w-5" /> },
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

const sidebarWidth = 'w-64';
const sidebarCollapsedWidth = 'w-20';

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { role } = user || {};
  const [showLanguages, setShowLanguages] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { currentLanguage, languages, setLanguage } = useLanguageStore();

  const navItems = getNavItems(role);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      {role === 'admin' && (
        <div className={`bg-white border-r border-gray-100 transition-all duration-300 ${isSidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Icons.Heart className="h-7 w-7 text-purple-500 fill-purple-500" />
            {!isSidebarCollapsed && <span className="text-xl font-semibold text-[#625F6E]">Vuexy</span>}
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
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between h-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center px-4">
              {role === 'admin' && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-500"
                >
                  <Icons.Menu className="h-5 w-5" />
                </button>
              )}
              <Icons.Heart className="h-7 w-7 text-purple-500 fill-purple-500" />
              <span className="ml-2 text-xl font-semibold text-[#625F6E]">Vuexy</span>
            </div>
            
            {/* Navigation */}
            {role !== 'admin' && navItems.length > 0 && (
              <div className="flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.to}
                    to={item.to}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                      location.pathname === item.to
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex-1 max-w-xl px-6">
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#625F6E]" />
                <input
                  type="text"
                  placeholder="Search (Ctrl+/)"
                  className="w-full pl-10 pr-4 py-2 bg-[#F8F8F8] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 px-6">
              <div className="relative">
                <button
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="p-2 text-[#625F6E] hover:bg-[#F8F8F8] rounded-lg flex items-center gap-2"
                >
                  <span className="text-lg">{currentLanguage.flag}</span>
                  <Icons.Languages className="h-5 w-5 stroke-[1.5]" />
                </button>
                
                {showLanguages && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setLanguage(language.code);
                          setShowLanguages(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 ${
                          currentLanguage.code === language.code ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        {language.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="h-9 w-9 rounded-full bg-[#F8F8F8] flex items-center justify-center hover:bg-gray-100"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Icons.Bell className="w-4 h-4" />
                        Notifications
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Icons.Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Icons.Moon className="w-4 h-4" />
                        Dark Mode
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Icons.LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}