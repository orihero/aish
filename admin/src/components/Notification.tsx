import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Notification as NotificationType } from '../stores/notification.store';

interface NotificationProps {
  notification: NotificationType;
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-400',
    title: 'text-green-800',
    message: 'text-green-700',
    button: 'text-green-400 hover:text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-400',
    title: 'text-red-800',
    message: 'text-red-700',
    button: 'text-red-400 hover:text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    button: 'text-yellow-400 hover:text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    message: 'text-blue-700',
    button: 'text-blue-400 hover:text-blue-500',
  },
};

export function Notification({ notification, onRemove }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = icons[notification.type];
  const colorScheme = colors[notification.type];

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  return (
    <div
      className={`
        max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
        ${colorScheme.bg} ${colorScheme.border}
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${colorScheme.icon}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${colorScheme.title}`}>
              {notification.title}
            </p>
            <p className={`mt-1 text-sm ${colorScheme.message}`}>
              {notification.message}
            </p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`
                      text-sm font-medium underline
                      ${action.variant === 'primary' 
                        ? `${colorScheme.title} hover:opacity-80` 
                        : `${colorScheme.message} hover:opacity-80`
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`bg-transparent rounded-md inline-flex ${colorScheme.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={handleRemove}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
