import { useAuthStore } from '../stores/auth.store';

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, {user?.firstName}! 👋
      </h1>
      <p className="mt-2 text-gray-600">
        You are logged in as {user?.role}
      </p>
    </div>
  );
}