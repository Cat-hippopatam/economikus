// src/constants/author.ts
/**
 * Константы для панели автора
 * Единая точка изменения всех статических элементов
 */

import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react'

// Навигация панели автора
export const AUTHOR_NAVIGATION = [
  { 
    label: 'Дашборд', 
    path: '/author/dashboard', 
    icon: LayoutDashboard,
    description: 'Обзор статистики'
  },
  { 
    label: 'Мои курсы', 
    path: '/author/courses', 
    icon: BookOpen,
    description: 'Управление курсами'
  },
  { 
    label: 'Мои уроки', 
    path: '/author/lessons', 
    icon: FileText,
    description: 'Управление уроками'
  },
  { 
    label: 'Аналитика', 
    path: '/author/analytics', 
    icon: BarChart3,
    description: 'Статистика и графики'
  },
] as const

// Дополнительные ссылки
export const AUTHOR_LINKS = {
  settings: { label: 'Настройки', path: '/profile/settings', icon: Settings },
  help: { label: 'Помощь', path: '/help', icon: HelpCircle },
} as const

// Статусы курса для селекта (автор не может публиковать, только админ)
export const COURSE_STATUSES = [
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'PENDING_REVIEW', label: 'На модерации' },
] as const

// Статусы курса для фильтров (показываем все, включая опубликованные)
export const AUTHOR_COURSE_STATUSES = [
  { value: '', label: 'Все статусы' },
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'PENDING_REVIEW', label: 'На модерации' },
  { value: 'PUBLISHED', label: 'Опубликован' },
] as const

// Типы уроков для фильтров
export const AUTHOR_LESSON_TYPES = [
  { value: '', label: 'Все типы' },
  { value: 'ARTICLE', label: 'Статья' },
  { value: 'VIDEO', label: 'Видео' },
  { value: 'AUDIO', label: 'Аудио' },
  { value: 'QUIZ', label: 'Тест' },
  { value: 'CALCULATOR', label: 'Калькулятор' },
] as const

// Статусы урока для селекта (автор не может публиковать, только админ)
export const AUTHOR_LESSON_STATUSES_SELECT = [
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'PENDING_REVIEW', label: 'На модерации' },
] as const

// Статусы урока для фильтров (показываем все, включая опубликованные)
export const AUTHOR_LESSON_STATUSES = [
  { value: '', label: 'Все статусы' },
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'PENDING_REVIEW', label: 'На модерации' },
  { value: 'PUBLISHED', label: 'Опубликован' },
] as const

// Быстрые действия на дашборде
export const AUTHOR_QUICK_ACTIONS = [
  { 
    label: 'Создать курс', 
    path: '/author/courses/new', 
    icon: BookOpen, 
    color: 'blue' 
  },
  { 
    label: 'Создать урок', 
    path: '/author/lessons/new', 
    icon: FileText, 
    color: 'orange' 
  },
] as const

// Текст для пустых состояний
export const AUTHOR_EMPTY_STATES = {
  courses: {
    title: 'Нет курсов',
    description: 'Создайте свой первый курс для обучения студентов',
    action: 'Создать курс',
    actionPath: '/author/courses/new',
  },
  lessons: {
    title: 'Нет уроков',
    description: 'Создайте свой первый урок',
    action: 'Создать урок',
    actionPath: '/author/lessons/new',
  },
  drafts: {
    title: 'Нет черновиков',
    description: 'Все ваши материалы опубликованы',
  },
} as const

// Лейблы для формы курса
export const COURSE_FORM_LABELS = {
  title: 'Название курса',
  titlePlaceholder: 'Например: Основы инвестирования',
  slug: 'URL-адрес',
  slugPlaceholder: 'osnovy-investirovaniya',
  description: 'Описание',
  descriptionPlaceholder: 'О чём этот курс?',
  coverImage: 'Обложка',
  difficulty: 'Уровень сложности',
  isPremium: 'Премиум курс',
  tags: 'Теги',
  status: 'Статус',
} as const

// Лейблы для формы урока
export const LESSON_FORM_LABELS = {
  title: 'Название урока',
  titlePlaceholder: 'Например: Введение в акции',
  slug: 'URL-адрес',
  slugPlaceholder: 'vvedenie-v-akcii',
  description: 'Описание',
  descriptionPlaceholder: 'О чём этот урок?',
  lessonType: 'Тип урока',
  module: 'Модуль',
  duration: 'Длительность (минуты)',
  isPremium: 'Премиум урок',
  tags: 'Теги',
  status: 'Статус',
} as const
