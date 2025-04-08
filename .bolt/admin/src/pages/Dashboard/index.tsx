import { useAuthStore } from '../../stores/auth.store';
import { AdminDashboard } from './AdminDashboard';
import { EmployerDashboard } from './EmployerDashboard';

export function Dashboard() {
  const { user } = useAuthStore();
  
  return user?.role === 'admin' ? <AdminDashboard /> : <EmployerDashboard />;
}