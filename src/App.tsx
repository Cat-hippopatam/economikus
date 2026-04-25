import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute } from './components/auth'
import { AuthorLayout } from './components/author'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingState } from './components/common'

// Lazy loading для страниц (default exports)
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const CatalogPage = lazy(() => import('./pages/catalog/CatalogPage'))
const CoursePage = lazy(() => import('./pages/courses/CoursePage'))
const LessonPage = lazy(() => import('./pages/lessons/LessonPage'))
const ToolsPage = lazy(() => import('./pages/tools/ToolsPage'))
const KakeboPage = lazy(() => import('./pages/tools/KakeboPage'))
const KakeboDashboardPage = lazy(() => import('./pages/tools/KakeboDashboardPage'))
const InfoPage = lazy(() => import('./pages/info/InfoPage'))
const PostulatesPage = lazy(() => import('./pages/postulates/PostulatesPage'))
const TermsPage = lazy(() => import('./pages/legal/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'))
const CookiesPage = lazy(() => import('./pages/legal/CookiesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Lazy loading для страниц с named exports
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses').then(m => ({ default: m.AdminCourses })))
const AdminLessons = lazy(() => import('./pages/admin/AdminLessons').then(m => ({ default: m.AdminLessons })))
const AdminTags = lazy(() => import('./pages/admin/AdminTags').then(m => ({ default: m.AdminTags })))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })))
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications').then(m => ({ default: m.AdminApplications })))
const AdminDeletionRequests = lazy(() => import('./pages/admin/AdminDeletionRequests').then(m => ({ default: m.AdminDeletionRequests })))
const AdminModeration = lazy(() => import('./pages/admin/AdminModeration').then(m => ({ default: m.AdminModeration })))
const AdminContentModerationPage = lazy(() => import('./pages/admin/AdminContentModerationPage').then(m => ({ default: m.AdminContentModerationPage })))

const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })))
const ProfileSettingsPage = lazy(() => import('./pages/profile/ProfileSettingsPage').then(m => ({ default: m.ProfileSettingsPage })))
const BecomeAuthorPage = lazy(() => import('./pages/profile/BecomeAuthorPage').then(m => ({ default: m.BecomeAuthorPage })))

const AuthorDashboardPage = lazy(() => import('./pages/author/AuthorDashboardPage').then(m => ({ default: m.AuthorDashboardPage })))
const AuthorCoursesPage = lazy(() => import('./pages/author/AuthorCoursesPage').then(m => ({ default: m.AuthorCoursesPage })))
const AuthorCourseFormPage = lazy(() => import('./pages/author/AuthorCourseFormPage').then(m => ({ default: m.AuthorCourseFormPage })))
const AuthorLessonsPage = lazy(() => import('./pages/author/AuthorLessonsPage').then(m => ({ default: m.AuthorLessonsPage })))
const AuthorLessonFormPage = lazy(() => import('./pages/author/AuthorLessonFormPage').then(m => ({ default: m.AuthorLessonFormPage })))
const AuthorCourseModulesPage = lazy(() => import('./pages/author/AuthorCourseModulesPage').then(m => ({ default: m.AuthorCourseModulesPage })))
const AuthorAnalyticsPage = lazy(() => import('./pages/author/AuthorAnalyticsPage').then(m => ({ default: m.AuthorAnalyticsPage })))

// Калькуляторы (из index.ts)
const CalculatorsPage = lazy(() => import('./pages/calculators').then(m => ({ default: m.CalculatorsPage })))
const CalculatorPage = lazy(() => import('./pages/calculators').then(m => ({ default: m.CalculatorPage })))

// Компонент загрузки для lazy страниц
function PageLoader() {
  return <LoadingState centered text="Загрузка..." />
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
        {/* Основные страницы с Header и Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
          <Route path="/catalog" element={<Suspense fallback={<PageLoader />}><CatalogPage /></Suspense>} />
          <Route path="/courses/:slug" element={<Suspense fallback={<PageLoader />}><CoursePage /></Suspense>} />
          <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<Suspense fallback={<PageLoader />}><LessonPage /></Suspense>} />
          <Route path="/calculators" element={<Suspense fallback={<PageLoader />}><CalculatorsPage /></Suspense>} />
          <Route path="/calculators/:slug" element={<Suspense fallback={<PageLoader />}><CalculatorPage /></Suspense>} />
          <Route path="/tools" element={<Suspense fallback={<PageLoader />}><ToolsPage /></Suspense>} />
          <Route path="/tools/kakebo" element={<Suspense fallback={<PageLoader />}><KakeboPage /></Suspense>} />
          <Route path="/tools/kakebo/dashboard" element={<Suspense fallback={<PageLoader />}><KakeboDashboardPage /></Suspense>} />
          <Route path="/info" element={<Suspense fallback={<PageLoader />}><InfoPage /></Suspense>} />
          <Route path="/postulates" element={<Suspense fallback={<PageLoader />}><PostulatesPage /></Suspense>} />
          <Route path="/terms" element={<Suspense fallback={<PageLoader />}><TermsPage /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />
          <Route path="/cookies" element={<Suspense fallback={<PageLoader />}><CookiesPage /></Suspense>} />
          <Route path="/user/:nickname" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
          
          {/* Защищённые роуты профиля */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}><Navigate to="/profile?tab=subscriptions" replace /></Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/settings" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}><ProfileSettingsPage /></Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/become-author" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}><BecomeAuthorPage /></Suspense>
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Страницы авторизации (только Header) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />
        </Route>

        {/* Админ-панель */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute roles={['ADMIN', 'MODERATOR']}>
              <Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          <Route path="courses" element={<Suspense fallback={<PageLoader />}><AdminCourses /></Suspense>} />
          <Route path="lessons" element={<Suspense fallback={<PageLoader />}><AdminLessons /></Suspense>} />
          <Route path="tags" element={<Suspense fallback={<PageLoader />}><AdminTags /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsers /></Suspense>} />
          <Route path="moderation" element={<Suspense fallback={<PageLoader />}><AdminModeration /></Suspense>} />
          <Route path="content" element={<Suspense fallback={<PageLoader />}><AdminContentModerationPage /></Suspense>} />
          <Route path="applications" element={<Suspense fallback={<PageLoader />}><AdminApplications /></Suspense>} />
          <Route path="deletion-requests" element={<Suspense fallback={<PageLoader />}><AdminDeletionRequests /></Suspense>} />
        </Route>

        {/* Панель автора */}
        <Route 
          path="/author" 
          element={
            <ProtectedRoute roles={['AUTHOR', 'ADMIN']}>
              <Suspense fallback={<PageLoader />}><AuthorLayout /></Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/author/dashboard" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AuthorDashboardPage /></Suspense>} />
          <Route path="courses" element={<Suspense fallback={<PageLoader />}><AuthorCoursesPage /></Suspense>} />
          <Route path="courses/new" element={<Suspense fallback={<PageLoader />}><AuthorCourseFormPage /></Suspense>} />
          <Route path="courses/:id" element={<Suspense fallback={<PageLoader />}><AuthorCourseFormPage /></Suspense>} />
          <Route path="courses/:id/modules" element={<Suspense fallback={<PageLoader />}><AuthorCourseModulesPage /></Suspense>} />
          <Route path="lessons" element={<Suspense fallback={<PageLoader />}><AuthorLessonsPage /></Suspense>} />
          <Route path="lessons/new" element={<Suspense fallback={<PageLoader />}><AuthorLessonFormPage /></Suspense>} />
          <Route path="lessons/:id" element={<Suspense fallback={<PageLoader />}><AuthorLessonFormPage /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AuthorAnalyticsPage /></Suspense>} />
        </Route>

        {/* Страница 404 */}
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
