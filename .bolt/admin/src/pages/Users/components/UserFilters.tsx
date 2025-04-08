import { ArrowUpDown } from 'lucide-react';

interface UserFiltersProps {
  role: string;
  status: string;
  onFilterChange: (key: string, value: string) => void;
}

export function UserFilters({ role, status, onFilterChange }: UserFiltersProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-medium text-gray-900 mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <select
            value={role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="appearance-none w-full bg-gray-50 border-0 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employer">Employer</option>
            <option value="employee">Employee</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="appearance-none w-full bg-gray-50 border-0 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}