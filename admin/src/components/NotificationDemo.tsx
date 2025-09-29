import { useNotifications } from '../hooks/useNotifications';

export function NotificationDemo() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-semibold mb-4">Notification Demo</h3>
      <div className="space-x-2">
        <button
          onClick={() => showSuccess('Success!', 'Operation completed successfully')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Show Success
        </button>
        <button
          onClick={() => showError('Error!', 'Something went wrong')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Error
        </button>
        <button
          onClick={() => showWarning('Warning!', 'Please check your input')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Show Warning
        </button>
        <button
          onClick={() => showInfo('Info', 'Here is some useful information')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Info
        </button>
      </div>
    </div>
  );
}
