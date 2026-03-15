import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import { AdminLayout, AdminDashboard, AdminCourses, AdminLessons, AdminTags, AdminUsers } from './pages/admin'

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
          <Route path="/profile" element={<div style={{ padding: 40 }}>Профиль (в разработке)</div>} />
        </Route>

        {/* Страницы авторизации (только Header) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Админ-панель */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
