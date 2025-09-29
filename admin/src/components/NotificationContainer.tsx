import { useNotificationStore } from '../stores/notification.store';
import { Notification } from './Notification';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}
