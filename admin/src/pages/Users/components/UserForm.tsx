import { X, ArrowUpDown } from 'lucide-react';
import type { User } from '../../../stores/users.store';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingUser: User | null;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    status: string;
  };
  setFormData: (data: any) => void;
  error: string | null;
  onClearError: () => void;
}

export function UserForm({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  formData,
  setFormData,
  error,
  onClearError
}: UserFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 h-0 overflow-y-auto">
                <div className="px-6 py-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {editingUser ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button
                      onClick={onClose}
                      className="ml-3 h-7 flex items-center"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="px-6 py-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <input
                          type="text"
                          className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <input
                          type="text"
                          className="block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    {!editingUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          type="password"
                          className="mt-1 block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <div className="relative mt-1">
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="appearance-none block w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
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
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-6 py-6 border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={onSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                      >
                        {editingUser ? 'Save Changes' : 'Add User'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="absolute bottom-4 right-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <span>{error}</span>
              <button onClick={onClearError} className="text-red-800 hover:text-red-900">×</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}