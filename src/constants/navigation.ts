// src/constants/navigation.ts
/**
 * Навигационные ссылки для Header, Footer и AdminLayout
 * Вынесены в константы для избежания дублирования
 */

import { 
 Folder, BookOpen, Calculator, 
 LayoutDashboard, GraduationCap, Tags, Users, Shield, FileText, Wrench, Lightbulb, Info, Trash2
} from 'lucide-react'

// Навигация Header (публичная часть)
export const NAV_LINKS = [
  { to: '/catalog', label: 'Каталог', icon: Folder },
  { to: '/calculators', label: 'Калькуляторы', icon: Calculator },
  { to: '/tools', label: 'Инструменты', icon: Wrench },
  { to: '/postulates', label: 'Постулаты', icon: Lightbulb },
  { to: '/info', label: 'Информация', icon: Info },
] as const

// Ссылки Footer
export const FOOTER_LINKS = {
  platform: [
    { to: '/catalog', label: 'Каталог курсов' },
    { to: '/calculators', label: 'Калькуляторы' },
    { to: '/tools', label: 'Инструменты' },
    { to: '/postulates', label: 'Постулаты' },
  ],
  company: [
    { to: '/info#about', label: 'О нас' },
    { to: '/info#team', label: 'Команда' },
    { to: '/info#contacts', label: 'Контакты' },
    { to: '/info#news', label: 'Новости' },
  ],
  legal: [
    { to: '/terms', label: 'Условия использования' },
    { to: '/privacy', label: 'Политика конфиденциальности' },
    { to: '/cookies', label: 'Политика cookie' },
  ],
} as const

// Навигация Admin-панели
export const ADMIN_NAV_LINKS = [
 { to: '/admin', label: 'Дашборд', icon: LayoutDashboard },
 { to: '/admin/courses', label: 'Курсы', icon: BookOpen },
 { to: '/admin/lessons', label: 'Уроки', icon: GraduationCap },
 { to: '/admin/tags', label: 'Теги', icon: Tags },
 { to: '/admin/users', label: 'Пользователи', icon: Users },
 { to: '/admin/moderation', label: 'Модерация', icon: Shield },
 { to: '/admin/content', label: 'Контент', icon: FileText },
 { to: '/admin/applications', label: 'Заявки авторов', icon: FileText },
 { to: '/admin/deletion-requests', label: 'Удаление аккаунтов', icon: Trash2 },
] as const

// Типы для TypeScript
export type NavLink = typeof NAV_LINKS[number]
export type FooterLinkSection = typeof FOOTER_LINKS[keyof typeof FOOTER_LINKS]
export type AdminNavLink = typeof ADMIN_NAV_LINKS[number]
