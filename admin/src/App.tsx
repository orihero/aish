import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from './components/AuthLayout'
import { DashboardLayout } from './components/DashboardLayout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Users } from './pages/Users/index'
import { Jobs } from './pages/Jobs/index'
import { CreateJob } from './pages/Jobs/pages/CreateJob'
import { Companies } from './pages/Companies'
import { Categories } from './pages/Categories/index'
import { Dashboard } from './pages/Dashboard'
import { PrivateRoute } from './components/PrivateRoute'

function App() {
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
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
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
          path="/companies"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Companies />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Categories />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App