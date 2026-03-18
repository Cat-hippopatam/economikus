// src/constants/config.ts
/**
 * Глобальная конфигурация приложения
 * Неизменяемые данные о приложении
 */

export const APP_CONFIG = {
  // Основная информация
  name: 'Экономикус',
  nameEn: 'Economikus',
  description: 'Образовательная платформа для изучения финансов и инвестиций',
  url: 'https://economikus.ru',
  version: '1.0.0',
  apiUrl: import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || 'https://api.economikus.ru/api')
    : '/api',
  
  // Контакты и соцсети
  social: {
    telegram: 'https://t.me/economikus',
    email: 'hello@economikus.ru',
    github: 'https://github.com/Cat-hippopatam/fin',
  },
  
  // Настройки по умолчанию
  defaults: {
    avatarService: 'https://ui-avatars.com/api/',
    currency: 'RUB',
    language: 'ru',
    timezone: 'Europe/Moscow',
  },
  
  // Лимиты
  limits: {
    maxSessionsPerUser: 5,
    maxLoginAttempts: 5,
    loginLockoutDuration: 15 * 60 * 1000, // 15 минут
    sessionDuration: 30 * 24 * 60 * 60 * 1000, // 30 дней
  },
  
  // Пагинация
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const

// Цветовая палитра
export const COLORS = {
  primary: '#2A9D8F',      // Бирюзовый
  secondary: '#264653',    // Тёмно-синий
  accent: '#F4A261',       // Оранжевый
  background: '#F8F6F3',   // Светлый фон
  foreground: '#264653',   // Основной текст
  muted: '#6C757D',        // Приглушённый
  destructive: '#FF6B6B',  // Ошибка/удаление
  border: '#E9ECEF',       // Границы
} as const

// API endpoints (для справки)
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  courses: '/api/courses',
  lessons: '/api/lessons',
  user: '/api/user',
  tags: '/api/tags',
  reactions: '/api/reactions',
  comments: '/api/comments',
  admin: '/api/admin',
} as const
