import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from './components/AuthLayout'
import { DashboardLayout } from './components/DashboardLayout'
import { useAuthStore } from './stores/auth.store'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Applications } from './pages/Applications'
import { Profile } from './pages/Profile'
import { Users } from './pages/Users/index'
import { Jobs } from './pages/Jobs/index'
import { CreateJob } from './pages/Jobs/pages/CreateJob'
import { Companies } from './pages/Companies'
import { EmployerCompany } from './pages/Companies/pages/EmployerCompany'
import { Categories } from './pages/Categories/index'
import { Dashboard } from './pages/Dashboard'
import { PrivateRoute } from './components/PrivateRoute'

function App() {
  const { user } = useAuthStore();
  const { role } = user || {};
  const isAdmin = role === 'admin';
  const isEmployer = role === 'employer';
  const isEmployee = role === 'employee';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {isAdmin && <Route
          path="/users"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            </PrivateRoute>
          }
        />}
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Jobs />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs/create"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <CreateJob />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/company"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <EmployerCompany />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Companies />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {isAdmin && <Route
          path="/categories"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Categories />
              </DashboardLayout>
            </PrivateRoute>
          }
        />}
        {isEmployee && (
          <>
            <Route
              path="/applications"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Applications />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App