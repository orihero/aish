import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-purple-500 fill-purple-500" />
              <span className="ml-2 text-xl font-semibold">Vuexy</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}