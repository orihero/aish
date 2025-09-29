import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only show notifications for certain HTTP status codes
    const status = error.response?.status;
    const shouldShowNotification = status && [400, 401, 403, 404, 422, 429, 500, 502, 503, 504].includes(status);
    
    if (shouldShowNotification && error.response?.data?.message) {
      // Import notification store dynamically to avoid circular dependency
      import('../stores/notification.store').then(({ useNotificationStore }) => {
        const { addNotification } = useNotificationStore.getState();
        
        // Determine notification type based on status code
        let type: 'success' | 'error' | 'warning' | 'info' = 'error';
        if (status >= 400 && status < 500) {
          type = 'warning';
        } else if (status >= 500) {
          type = 'error';
        }

        addNotification({
          type,
          title: getErrorTitle(status),
          message: error.response.data.message,
          duration: 7000, // Show for 7 seconds for errors
        });
      });
    }

    return Promise.reject(error);
  }
);

// Helper function to get appropriate error titles
function getErrorTitle(status: number): string {
  switch (status) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Authentication Required';
    case 403:
      return 'Access Denied';
    case 404:
      return 'Not Found';
    case 422:
      return 'Validation Error';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    case 504:
      return 'Gateway Timeout';
    default:
      return 'Error';
  }
}

export { api };