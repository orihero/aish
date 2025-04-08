import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  icon: ReactNode;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <span className={`text-sm ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">Last Week Analytics</p>
    </div>
  );
}