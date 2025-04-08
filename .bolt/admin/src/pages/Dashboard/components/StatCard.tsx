import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
  trend
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.value}
              </p>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}