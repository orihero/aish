import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { role } = user || {};
  const isEmployee = role === 'employee';

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/jobs', label: isEmployee ? 'Find Jobs' : 'Manage Jobs' },
    { path: '/companies', label: 'Companies' },
    { path: '/resumes', label: 'Resumes' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded-md ${
                  location.pathname === item.path
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}; 