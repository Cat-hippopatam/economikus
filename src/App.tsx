import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute } from './components/auth'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import { AdminLayout, AdminDashboard, AdminCourses, AdminLessons, AdminTags, AdminUsers, AdminApplications } from './pages/admin'
import { AdminModeration } from './pages/admin/AdminModeration'
import { ProfilePage } from './pages/profile/ProfilePage'
import { ProfileSettingsPage } from './pages/profile/ProfileSettingsPage'
import { BecomeAuthorPage } from './pages/profile/BecomeAuthorPage'
import { AuthorDashboardPage } from './pages/author/AuthorDashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Основные страницы с Header и Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<div style={{ padding: 40 }}>Каталог (в разработке)</div>} />
          <Route path="/courses" element={<div style={{ padding: 40 }}>Курсы (в разработке)</div>} />
          <Route path="/calculators" element={<div style={{ padding: 40 }}>Калькуляторы (в разработке)</div>} />
          <Route path="/user/:nickname" element={<ProfilePage />} />
          
          {/* Защищённые роуты профиля */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Navigate to="/profile/settings" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/settings" 
            element={
              <ProtectedRoute>
                <ProfileSettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/become-author" 
            element={
              <ProtectedRoute>
                <BecomeAuthorPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Панель автора */}
          <Route 
            path="/author/dashboard" 
            element={
              <ProtectedRoute roles={['AUTHOR', 'ADMIN']}>
                <AuthorDashboardPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Страницы авторизации (только Header) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Админ-панель */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute roles={['ADMIN', 'MODERATOR']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="applications" element={<AdminApplications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
