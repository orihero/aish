import { useState, useEffect } from 'react';
import { Search, ArrowUpDown, Download, Plus } from 'lucide-react';
import { useUsersStore } from '../../stores/users.store';
import { StatCard } from './components/StatCard';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { UserForm } from './components/UserForm';

export function Users() {
  const {
    users,
    stats,
    filters,
    pagination,
    isLoading,
    error,
    getUsers,
    setFilters,
    setPagination,
    createUser,
    updateUser,
    deleteUser,
    clearError
  } = useUsersStore();

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        password: '',
        role: editingUser.role,
        status: editingUser.status
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        status: ''
      });
    }
  }, [editingUser]);

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setIsSlideOverOpen(false);
      setEditingUser(null);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Session"
          value={stats.totalUsers}
          change="+29%"
          icon={<div className="w-5 h-5 bg-purple-100 rounded-full" />}
        />
        <StatCard
          title="Paid Users"
          value={stats.paidUsers}
          change="+18%"
          icon={<div className="w-5 h-5 bg-red-100 rounded-full" />}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          change="-14%"
          icon={<div className="w-5 h-5 bg-emerald-100 rounded-full" />}
        />
        <StatCard
          title="Pending Users"
          value={stats.pendingUsers}
          change="+42%"
          icon={<div className="w-5 h-5 bg-amber-100 rounded-full" />}
        />
      </div>

      {/* Filters */}
      <UserFilters
        role={filters.role}
        status={filters.status}
        onFilterChange={(key, value) => setFilters({ [key]: value })}
      />

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={pagination.limit}
              onChange={(e) => setPagination({ limit: Number(e.target.value) })}
              className="appearance-none bg-gray-50 border-0 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search User"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsSlideOverOpen(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-500 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>
      </div>

      {/* Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        onEdit={(user) => {
          setEditingUser(user);
          setIsSlideOverOpen(true);
        }}
        onDelete={deleteUser}
      />

      {/* Form */}
      <UserForm
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSubmit={handleSubmit}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        error={error}
        onClearError={clearError}
      />
    </div>
  );
}