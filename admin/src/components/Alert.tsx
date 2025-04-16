import { cn } from '../lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

const variants = {
  info: 'bg-blue-50 text-blue-800',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error: 'bg-red-50 text-red-800',
};

export const Alert = ({
  variant = 'info',
  title,
  children,
  className,
}: AlertProps) => {
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg p-4',
        variants[variant],
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        {title && <h3 className="mb-1 font-medium">{title}</h3>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}; 