import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/auth.store';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { EmployeeJobs } from './pages/Jobs/pages/EmployeeJobs';
import { EmployerJobs } from './pages/Jobs/pages/EmployerJobs';
import { JobApplications } from './pages/Jobs/pages/JobApplications';
import { ApplicationChat } from './pages/Jobs/pages/ApplicationChat';
import { ApplicationEvaluations } from './pages/Jobs/pages/ApplicationEvaluations';
import { Companies } from './pages/Companies';
import { EmployerCompany } from './pages/Companies/pages/EmployerCompany';
import { Resumes } from './pages/Resumes';
import { ResumePreview } from './pages/Resumes/ResumePreview';
import { Settings } from './pages/Settings';
import { DashboardLayout } from './components/DashboardLayout';
import { PrivateRoute } from './components/PrivateRoute';
import { NotificationContainer } from './components/NotificationContainer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { Profile } from './pages/Profile';
import { MyVacancies } from './pages/MyVacancies';
import { CreateJob } from './pages/Jobs/pages/CreateJob';
import { CreateVacancy } from './pages/CreateVacancy';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, isLoading, validateToken } = useAuthStore();
  const { role } = user || {};
  const isEmployee = role === 'employee';

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
            
            <Route
              path="/"
              element={
                user ? (
                  <DashboardLayout>
                    <Outlet />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="jobs" element={
                <PrivateRoute>
                  {isEmployee ? <EmployeeJobs /> : <EmployerJobs />}
                </PrivateRoute>
              } />
              <Route path="my-vacancies" element={
                <PrivateRoute>
                  {isEmployee ? <Navigate to="/jobs" replace /> : <MyVacancies />}
                </PrivateRoute>
              } />
              <Route path="jobs/my-applications" element={
                <PrivateRoute>
                  {isEmployee ? <JobApplications /> : <Navigate to="/jobs" replace />}
                </PrivateRoute>
              } />
              <Route path="jobs/:id/applications" element={
                <PrivateRoute>
                  <JobApplications />
                </PrivateRoute>
              } />
              <Route path="jobs/create" element={
                <PrivateRoute>
                  {isEmployee ? <Navigate to="/jobs" replace /> : <CreateJob />}
                </PrivateRoute>
              } />
              <Route path="vacancies/create" element={
                <PrivateRoute>
                  {isEmployee ? <Navigate to="/jobs" replace /> : <CreateVacancy />}
                </PrivateRoute>
              } />
              <Route path="jobs/:id/edit" element={
                <PrivateRoute>
                  {isEmployee ? <Navigate to="/jobs" replace /> : <CreateJob />}
                </PrivateRoute>
              } />
              <Route path="chats/:chatId" element={
                <PrivateRoute>
                  <ApplicationChat />
                </PrivateRoute>
              } />
              <Route path="applications/:applicationId/evaluations" element={
                <PrivateRoute>
                  <ApplicationEvaluations />
                </PrivateRoute>
              } />
              <Route path="companies" element={
                <PrivateRoute>
                  <Companies />
                </PrivateRoute>
              } />
              <Route path="company" element={
                <PrivateRoute>
                  <EmployerCompany />
                </PrivateRoute>
              } />
              <Route path="resumes" element={
                <PrivateRoute>
                  <Resumes />
                </PrivateRoute>
              } />
              <Route path="resumes/:id" element={
                <PrivateRoute>
                  <ResumePreview />
                </PrivateRoute>
              } />
              <Route path="settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
          <NotificationContainer />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;