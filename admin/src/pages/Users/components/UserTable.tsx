import { ArrowUpDown, Eye, Trash2, Pencil } from 'lucide-react';
import type { User } from '../../../stores/users.store';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserTable({ users, isLoading, onEdit, onDelete }: UserTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-emerald-50 text-emerald-700';
      case 'inactive': return 'bg-gray-50 text-gray-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-12 px-6 py-3">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              <button className="flex items-center gap-2">
                USER
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ROLE</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">STATUS</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">CREATED AT</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 text-sm font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">{user.role}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}