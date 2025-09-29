import { useNotificationStore } from '../stores/notification.store';

export const useNotifications = () => {
  const { addNotification, removeNotification, clearAll } = useNotificationStore();

  const showSuccess = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  };

  const showError = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
  };
};
