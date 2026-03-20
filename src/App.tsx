import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute } from './components/auth'
import { AuthorLayout } from './components/author'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import { AdminLayout, AdminDashboard, AdminCourses, AdminLessons, AdminTags, AdminUsers, AdminApplications } from './pages/admin'
import { AdminModeration } from './pages/admin/AdminModeration'
import { AdminContentModerationPage } from './pages/admin/AdminContentModerationPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { ProfileSettingsPage } from './pages/profile/ProfileSettingsPage'
import { BecomeAuthorPage } from './pages/profile/BecomeAuthorPage'
import { AuthorDashboardPage } from './pages/author/AuthorDashboardPage'
import { AuthorCoursesPage } from './pages/author/AuthorCoursesPage'
import { AuthorCourseFormPage } from './pages/author/AuthorCourseFormPage'
import { AuthorLessonsPage } from './pages/author/AuthorLessonsPage'
import { AuthorLessonFormPage } from './pages/author/AuthorLessonFormPage'
import { AuthorCourseModulesPage } from './pages/author/AuthorCourseModulesPage'
import { AuthorAnalyticsPage } from './pages/author/AuthorAnalyticsPage'
import CatalogPage from './pages/catalog/CatalogPage'
import CoursePage from './pages/courses/CoursePage'
import LessonPage from './pages/lessons/LessonPage'
import { CalculatorsPage, CalculatorPage } from './pages/calculators'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Основные страницы с Header и Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/courses/:slug" element={<CoursePage />} />
          <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/calculators/:slug" element={<CalculatorPage />} />
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
          <Route path="content" element={<AdminContentModerationPage />} />
          <Route path="applications" element={<AdminApplications />} />
        </Route>

        {/* Панель автора */}
        <Route 
          path="/author" 
          element={
            <ProtectedRoute roles={['AUTHOR', 'ADMIN']}>
              <AuthorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/author/dashboard" replace />} />
          <Route path="dashboard" element={<AuthorDashboardPage />} />
          <Route path="courses" element={<AuthorCoursesPage />} />
          <Route path="courses/new" element={<AuthorCourseFormPage />} />
          <Route path="courses/:id" element={<AuthorCourseFormPage />} />
          <Route path="courses/:id/modules" element={<AuthorCourseModulesPage />} />
          <Route path="lessons" element={<AuthorLessonsPage />} />
          <Route path="lessons/new" element={<AuthorLessonFormPage />} />
          <Route path="lessons/:id" element={<AuthorLessonFormPage />} />
          <Route path="analytics" element={<AuthorAnalyticsPage />} />
        </Route>

        {/* Страница 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
