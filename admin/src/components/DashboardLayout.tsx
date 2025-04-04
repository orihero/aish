import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  LogOut,
  Search,
  Moon,
  Bell,
  Grid,
  Languages,
  Briefcase,
  Building2,
  Users2,
  FolderKanban,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
}

function NavItem({ to, icon, label, active, hasSubmenu }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-lg text-sm ${
        active
          ? 'text-purple-600 bg-purple-50'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="ml-3 flex-1">{label}</span>
      {hasSubmenu && <ChevronDown className="h-4 w-4" />}
    </Link>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6">
          <div className="flex items-center">
            <Heart className="h-7 w-7 text-purple-500 fill-purple-500" />
            <span className="ml-2 text-xl font-semibold text-[#625F6E]">Vuexy</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem
            to="/dashboard"
            icon={<Grid className="h-5 w-5 stroke-[1.5]" />}
            label="Dashboard"
            active={location.pathname === '/dashboard'}
          />
          <NavItem
            to="/jobs"
            icon={<Briefcase className="h-5 w-5 stroke-[1.5]" />}
            label="Jobs"
            hasSubmenu
          />
          <NavItem
            to="/companies"
            icon={<Building2 className="h-5 w-5" />}
            label="Companies"
          />
          <NavItem
            to="/users"
            icon={<Users2 className="h-5 w-5" />}
            label="Users"
          />
          <NavItem
            to="/categories"
            icon={<FolderKanban className="h-5 w-5" />}
            label="Categories"
            hasSubmenu
          />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 max-w-[1400px] pl-20">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between px-6 h-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#625F6E]" />
                <input
                  type="text"
                  placeholder="Search (Ctrl+/)"
                  className="w-full pl-10 pr-4 py-2 bg-[#F8F8F8] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#625F6E] hover:bg-[#F8F8F8] rounded-lg">
                <Languages className="h-5 w-5 stroke-[1.5]" />
              </button>
              <button className="p-2 text-[#625F6E] hover:bg-[#F8F8F8] rounded-lg">
                <Moon className="h-5 w-5 stroke-[1.5]" />
              </button>
              <button className="p-2 text-[#625F6E] hover:bg-[#F8F8F8] rounded-lg">
                <Settings className="h-5 w-5 stroke-[1.5]" />
              </button>
              <button className="p-2 text-[#625F6E] hover:bg-[#F8F8F8] rounded-lg">
                <Bell className="h-5 w-5 stroke-[1.5]" />
              </button>
              <div className="h-9 w-9 rounded-full bg-[#F8F8F8] flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-6 pb-6 pr-20">
          {children}
        </main>
      </div>
    </div>
  );
}