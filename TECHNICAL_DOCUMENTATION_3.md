# Техническая документация 3 часть
## Комплексный анализ, оптимизация и безопасность

> Детальный анализ постоянных данных, оптимизация аутентификации, тестирование безопасности, модерация

---

## Содержание

1. [Анализ постоянных данных (LocalStorage)](#1-анализ-постоянных-данных-localstorage)
2. [Оптимизация аутентификации](#2-оптимизация-аутентификации)
3. [Тестирование безопасности](#3-тестирование-безопасности)
4. [Панель модератора](#4-панель-модератора)
5. [Рекомендации по развитию](#5-рекомендации-по-развитию)

---

## 1. Анализ постоянных данных (LocalStorage)

### 1.1 Концепция

Для снижения нагрузки на сервер и улучшения UX, постоянные неизменяемые данные должны кэшироваться в localStorage. Это данные, которые:
- Не являются чувствительными (НЕ пароли, токены, личные данные)
- Редко меняются
- Используются на множестве страниц

### 1.2 Выявленные постоянные данные

#### Категория: Навигация и структура

| Данные | Где используются | Частота изменений |
|--------|------------------|-------------------|
| Ссылки Footer | Footer.tsx | Редко |
| Ссылки Header | Header.tsx | Редко |
| Навигация админки | AdminLayout.tsx | Редко |

#### Категория: UI константы

| Данные | Где используются | Частота изменений |
|--------|------------------|-------------------|
| Цветовая палитра | Все компоненты | Редко |
| Текущий год | Footer.tsx | Ежегодно |
| Название сайта | Header, Footer | Редко |

#### Категория: Справочники

| Данные | Где используются | Частота изменений |
|--------|------------------|-------------------|
| Список тегов | AdminTags, Courses, Lessons | Средняя |
| Уровни сложности | AdminCourses, Filters | Редко |
| Типы уроков | AdminLessons, Filters | Редко |
| Статусы контента | Admin панель | Редко |

#### Категория: Настройки пользователя (нечувствительные)

| Данные | Где используются | Частота изменений |
|--------|------------------|-------------------|
| Тема оформления | Все страницы | При смене |
| Язык интерфейса | Все страницы | При смене |
| Размер шрифта | Все страницы | При смене |
| Настройки уведомлений | Profile | Редко |

#### Категория: Кэш контента

| Данные | Где используются | TTL |
|--------|------------------|-----|
| Список курсов (превью) | Catalog, Home | 5 минут |
| Список тегов | Filters, Admin | 10 минут |
| Профили авторов | Course, Lesson | 15 минут |

### 1.3 Реализация LocalStorage Service

```typescript
// src/lib/localStorage.ts

/**
 * Сервис для работы с localStorage
 * Правила:
 * 1. НЕ хранить чувствительные данные (пароли, токены)
 * 2. Устанавливать TTL для кэшируемых данных
 * 3. Валидировать данные при чтении
 */

interface StorageItem<T> {
  value: T
  expiresAt?: number
  version?: string
}

const STORAGE_VERSION = '1.0.0'

// Ключи хранения
export const STORAGE_KEYS = {
  // Константы (без TTL)
  NAV_LINKS: 'economikus_nav_links',
  FOOTER_LINKS: 'economikus_footer_links',
  APP_CONFIG: 'economikus_config',
  
  // Справочники (с TTL)
  TAGS: 'economikus_tags',
  DIFFICULTY_LEVELS: 'economikus_difficulty_levels',
  LESSON_TYPES: 'economikus_lesson_types',
  
  // Настройки пользователя
  USER_PREFERENCES: 'economikus_preferences',
  
  // Кэш контента (с TTL)
  COURSES_CACHE: 'economikus_courses_cache',
  AUTHORS_CACHE: 'economikus_authors_cache',
} as const

// TTL по умолчанию (в миллисекундах)
export const DEFAULT_TTL = {
  TAGS: 10 * 60 * 1000,           // 10 минут
  COURSES: 5 * 60 * 1000,         // 5 минут
  AUTHORS: 15 * 60 * 1000,        // 15 минут
  PREFERENCES: 365 * 24 * 60 * 60 * 1000, // 1 год
} as const

class LocalStorageService {
  /**
   * Сохранить данные
   */
  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        version: STORAGE_VERSION,
        expiresAt: ttl ? Date.now() + ttl : undefined
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('LocalStorage set error:', error)
    }
  }

  /**
   * Получить данные
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null

      const item: StorageItem<T> = JSON.parse(raw)

      // Проверка версии
      if (item.version && item.version !== STORAGE_VERSION) {
        this.remove(key)
        return null
      }

      // Проверка TTL
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(key)
        return null
      }

      return item.value
    } catch (error) {
      console.error('LocalStorage get error:', error)
      this.remove(key)
      return null
    }
  }

  /**
   * Удалить данные
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('LocalStorage remove error:', error)
    }
  }

  /**
   * Очистить весь кэш
   */
  clearCache(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key.includes('cache')) {
        this.remove(key)
      }
    })
  }

  /**
   * Очистить всё
   */
  clear(): void {
    localStorage.clear()
  }
}

export const storage = new LocalStorageService()
```

### 1.4 Страницы для внедрения LocalStorage

#### HomePage.tsx
```typescript
// Кэширование списка курсов для превью
const { data: courses } = useQuery({
  queryKey: ['courses', 'featured'],
  queryFn: async () => {
    // Сначала проверяем localStorage
    const cached = storage.get<Course[]>(STORAGE_KEYS.COURSES_CACHE)
    if (cached) return cached

    // Если нет — загружаем с сервера
    const response = await api.get('/courses', { params: { limit: 6 } })
    const data = response.data.items
    
    // Кэшируем на 5 минут
    storage.set(STORAGE_KEYS.COURSES_CACHE, data, DEFAULT_TTL.COURSES)
    
    return data
  },
  staleTime: 5 * 60 * 1000
})
```

#### Header.tsx / Footer.tsx
```typescript
// Навигационные ссылки (константы)
const NAV_LINKS = [
  { to: '/catalog', label: 'Каталог', icon: Folder },
  { to: '/courses', label: 'Курсы', icon: BookOpen },
  { to: '/calculators', label: 'Калькуляторы', icon: Calculator },
]

const FOOTER_LINKS = {
  platform: [
    { to: '/catalog', label: 'Каталог курсов' },
    // ...
  ],
  // ...
}

// Можно вынести в отдельный файл констант
// src/constants/navigation.ts
```

#### AdminTags.tsx
```typescript
// Кэширование списка тегов
const { data: tags } = useQuery({
  queryKey: ['tags'],
  queryFn: async () => {
    const cached = storage.get<Tag[]>(STORAGE_KEYS.TAGS)
    if (cached) return cached

    const response = await api.get('/admin/tags')
    const data = response.data.items
    
    storage.set(STORAGE_KEYS.TAGS, data, DEFAULT_TTL.TAGS)
    return data
  },
  staleTime: DEFAULT_TTL.TAGS
})
```

### 1.5 Структура папки для локальных данных

```
src/
├── constants/              # Постоянные данные (импортируются напрямую)
│   ├── navigation.ts       # Навигационные ссылки
│   ├── colors.ts           # Цветовая палитра
│   ├── enums.ts            # Enums для UI
│   ├── config.ts           # Конфигурация приложения
│   └── index.ts
│
├── lib/
│   ├── localStorage.ts     # Сервис localStorage
│   └── api.ts
│
└── hooks/
    ├── useLocalStorage.ts  # Хук для localStorage
    └── useCachedData.ts    # Хук для кэшированных данных
```

### 1.6 Пример файла констант

```typescript
// src/constants/navigation.ts

import { Folder, BookOpen, Calculator, Users, Award } from 'lucide-react'

export const NAV_LINKS = [
  { to: '/catalog', label: 'Каталог', icon: Folder },
  { to: '/courses', label: 'Курсы', icon: BookOpen },
  { to: '/calculators', label: 'Калькуляторы', icon: Calculator },
] as const

export const FOOTER_LINKS = {
  platform: [
    { to: '/catalog', label: 'Каталог курсов' },
    { to: '/courses', label: 'Все курсы' },
    { to: '/calculators', label: 'Калькуляторы' },
    { to: '/faq', label: 'FAQ' },
  ],
  company: [
    { to: '/about', label: 'О нас' },
    { to: '/contacts', label: 'Контакты' },
    { to: '/team', label: 'Команда' },
  ],
  legal: [
    { to: '/terms', label: 'Условия использования' },
    { to: '/privacy', label: 'Политика конфиденциальности' },
    { to: '/cookies', label: 'Политика cookie' },
  ],
} as const

export const ADMIN_NAV_LINKS = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/admin/courses', label: 'Курсы', icon: BookOpen },
  { to: '/admin/lessons', label: 'Уроки', icon: GraduationCap },
  { to: '/admin/tags', label: 'Теги', icon: Tags },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
] as const
```

```typescript
// src/constants/config.ts

export const APP_CONFIG = {
  name: 'Экономикус',
  nameEn: 'Economikus',
  description: 'Образовательная платформа для изучения финансов и инвестиций',
  url: 'https://economikus.ru',
  version: '1.0.0',
  
  social: {
    telegram: 'https://t.me/economikus',
    email: 'hello@economikus.ru',
    github: 'https://github.com/Cat-hippopatam/fin',
  },
  
  defaults: {
    avatarService: 'https://ui-avatars.com/api/',
    currency: 'RUB',
    language: 'ru',
  },
} as const
```

```typescript
// src/constants/enums.ts

export const DIFFICULTY_LEVELS = {
  BEGINNER: { label: 'Начинающий', color: 'green' },
  INTERMEDIATE: { label: 'Средний', color: 'yellow' },
  ADVANCED: { label: 'Продвинутый', color: 'red' },
} as const

export const LESSON_TYPES = {
  ARTICLE: { label: 'Статья', icon: 'FileText' },
  VIDEO: { label: 'Видео', icon: 'Video' },
  AUDIO: { label: 'Аудио', icon: 'Headphones' },
  QUIZ: { label: 'Тест', icon: 'HelpCircle' },
  CALCULATOR: { label: 'Калькулятор', icon: 'Calculator' },
} as const

export const CONTENT_STATUS = {
  DRAFT: { label: 'Черновик', color: 'gray' },
  PENDING_REVIEW: { label: 'На модерации', color: 'yellow' },
  PUBLISHED: { label: 'Опубликован', color: 'green' },
  ARCHIVED: { label: 'В архиве', color: 'blue' },
  DELETED: { label: 'Удалён', color: 'red' },
} as const

export const ROLES = {
  USER: { label: 'Пользователь', color: 'gray' },
  AUTHOR: { label: 'Автор', color: 'blue' },
  MODERATOR: { label: 'Модератор', color: 'yellow' },
  ADMIN: { label: 'Администратор', color: 'red' },
} as const
```

---

## 2. Оптимизация аутентификации

### 2.1 Проблема: Рост таблицы Session

При текущей реализации таблица `Session` растёт бесконтрольно:

```
Формула роста:
Пользователи × Устройства × Дней активность = Записей

Пример:
100 000 пользователей × 3 устройства × 365 дней = ~1 095 000 записей/год
```

**Последствия:**
1. Замедление поиска сессии (без индексов — full table scan)
2. Увеличение памяти БД
3. Замедление бэкапов
4. Риск DDoS через создание множества сессий

### 2.2 Решение 1: Ограничение сессий

```typescript
// server/routes/auth.routes.ts

const MAX_SESSIONS_PER_USER = 5

async function createSession(userId: string, c: Context) {
  // Подсчёт существующих сессий
  const existingCount = await prisma.session.count({
    where: { userId }
  })

  // Удаление старых при превышении лимита
  if (existingCount >= MAX_SESSIONS_PER_USER) {
    const oldSessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
      take: existingCount - MAX_SESSIONS_PER_USER + 1
    })
    
    await prisma.session.deleteMany({
      where: { id: { in: oldSessions.map(s => s.id) } }
    })
  }

  // Создание новой
  return prisma.session.create({
    data: {
      sessionToken: crypto.randomUUID(),
      userId,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })
}
```

### 2.3 Решение 2: Автоочистка просроченных сессий

```typescript
// server/jobs/session-cleanup.ts

import { prisma } from '../db'

/**
 * Удаляет просроченные сессии
 * Рекомендуется запускать по cron или при каждом входе
 */
export async function cleanupExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: {
      expires: { lt: new Date() }
    }
  })
  
  console.log(`[Session Cleanup] Удалено ${result.count} просроченных сессий`)
  return result.count
}

// Вариант A: Запуск при каждом входе (простой)
// Добавить в auth.routes.ts после успешного входа:
// await cleanupExpiredSessions()

// Вариант B: Cron job (рекомендуется для продакшена)
// setInterval(() => cleanupExpiredSessions(), 24 * 60 * 60 * 1000)
```

### 2.4 Решение 3: Индексация таблицы Session

```prisma
// prisma/schema.prisma

model Session {
  id           String   @id @default(uuid()) @map("session_id") @db.Char(36)
  sessionToken String   @unique @map("session_token") @db.VarChar(255)  // UNIQUE INDEX
  userId       String   @map("user_id") @db.Char(36)
  expires      DateTime
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @default(now()) @updatedAt @map("updated_at")
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])           // Для поиска сессий пользователя
  @@index([expires])          // Для очистки просроченных
  @@map("sessions")
}
```

**Проверка индексов в MySQL:**
```sql
SHOW INDEX FROM sessions;
```

### 2.5 Решение 4: Централизованный middleware

```typescript
// server/middleware/auth.ts

import type { MiddlewareHandler } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'

interface UserWithProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'AUTHOR' | 'MODERATOR' | 'ADMIN'
  profile: {
    id: string
    nickname: string
    displayName: string
    avatarUrl: string | null
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    user: UserWithProfile
    profile: UserWithProfile['profile']
  }
}

/**
 * Middleware для проверки авторизации
 * Устанавливает c.var.user и c.var.profile
 */
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const cookie = c.req.header('Cookie')
  const sessionToken = cookie?.match(/session=([^;]+)/)?.[1]

  if (!sessionToken) {
    throw new AppError(401, 'Необходима авторизация', 'UNAUTHORIZED')
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: {
          profile: {
            select: { id: true, nickname: true, displayName: true, avatarUrl: true }
          }
        }
      }
    }
  })

  if (!session || session.expires < new Date()) {
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }

  c.set('user', session.user as UserWithProfile)
  c.set('profile', session.user.profile)

  await next()
}

/**
 * Middleware для проверки роли
 * Использовать после requireAuth
 */
export const requireRole = (...roles: string[]): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user')
    
    if (!user || !roles.includes(user.role)) {
      throw new AppError(403, 'Доступ запрещён', 'FORBIDDEN')
    }

    await next()
  }
}
```

**Использование:**
```typescript
// server/routes/user.routes.ts

import { requireAuth } from '../middleware/auth'

const user = new Hono()

// Все роуты требуют авторизации
user.use('*', requireAuth)

user.get('/me', async (c) => {
  const user = c.get('user')  // Доступно благодаря middleware
  return c.json({ user })
})

user.patch('/profile', async (c) => {
  const profile = c.get('profile')
  // ...
})
```

### 2.6 Решение 5: Функция "Выйти со всех устройств"

```typescript
// server/routes/auth.routes.ts

// POST /api/auth/logout-all
auth.post('/logout-all', requireAuth, async (c) => {
  const user = c.get('user')

  // Удаляем все сессии пользователя
  await prisma.session.deleteMany({
    where: { userId: user.id }
  })

  // Очищаем cookie
  c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')

  return c.json({ message: 'Все сессии завершены' })
})
```

### 2.7 Итоговые рекомендации по аутентификации

| Приоритет | Действие | Эффект |
|-----------|----------|--------|
| 🔴 Высокий | Добавить индексы на Session | Ускорение поиска в 10-100x |
| 🔴 Высокий | Ограничить сессии (5 на юзера) | Контролируемый рост |
| 🟡 Средний | Cleanup просроченных сессий | Очистка мусора |
| 🟡 Средний | Централизованный middleware | Упрощение кода |
| 🟢 Низкий | "Выйти со всех устройств" | UX улучшение |

---

## 3. Тестирование безопасности

### 3.1 SQL-инъекции

#### Защита Prisma

Prisma автоматически экранирует параметры, поэтому SQL-инъекции через Prisma практически невозможны:

```typescript
// ✅ БЕЗОПАСНО — Prisma экранирует параметры
const user = await prisma.user.findUnique({
  where: { email: userInput }  // Даже если userInput = "'; DROP TABLE users; --"
})

// ✅ БЕЗОПАСНО — Prisma использует параметризованные запросы
const courses = await prisma.course.findMany({
  where: { title: { contains: searchInput } }
})
```

#### Потенциальные уязвимости

**Raw queries (если используются):**
```typescript
// ❌ ОПАСНО — Raw query без экранирования
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = '${userInput}'
`

// ✅ БЕЗОПАСНО — Параметризованный raw query
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`
```

**Проверка:**
```bash
# Поиск raw queries в проекте
grep -r "\$queryRaw" server/
grep -r "\$executeRaw" server/
```

#### Тесты на SQL-инъекции

```typescript
// tests/security/sql-injection.test.ts

import { describe, it, expect } from 'vitest'
import { prisma } from '../server/db'

describe('SQL Injection Protection', () => {
  it('should handle malicious email input', async () => {
    const maliciousInputs = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "admin'--",
      "' UNION SELECT * FROM users--",
    ]

    for (const input of maliciousInputs) {
      // Не должно выбросить ошибку и не должно удалить таблицу
      const result = await prisma.user.findUnique({
        where: { email: input }
      })
      expect(result).toBeNull()
    }
  })

  it('should handle malicious search input', async () => {
    const maliciousInputs = [
      "'; DELETE FROM courses WHERE '1'='1",
      "' OR 1=1 --",
    ]

    for (const input of maliciousInputs) {
      const result = await prisma.course.findMany({
        where: { title: { contains: input } }
      })
      expect(Array.isArray(result)).toBe(true)
    }
  })
})
```

### 3.2 XSS-атаки

#### Потенциальные векторы XSS

1. **Поля пользователя:** firstName, lastName, nickname, displayName, bio
2. **Контент:** description курсов/уроков, textContent.body
3. **Комментарии:** text

#### Защита на уровне валидации

```typescript
// src/shared/types.ts

import DOMPurify from 'isomorphic-dompurify'

// Функция очистки HTML
function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],  // Удаляем все HTML теги
    ALLOWED_ATTR: [] 
  })
}

// Обновлённая схема регистрации
export const RegisterSchema = z.object({
  email: z.string()
    .email('Некорректный формат email')
    .transform((val) => val.toLowerCase().trim()),
  
  firstName: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .transform(sanitizeHtml)  // Очистка от HTML
    .regex(/^[\p{L}\s'-]+$/u, 'Имя может содержать только буквы'),
  
  lastName: z.string()
    .min(2)
    .max(100)
    .transform(sanitizeHtml)
    .regex(/^[\p{L}\s'-]+$/u),
  
  nickname: z.string()
    .min(3)
    .max(50)
    .transform(sanitizeHtml)
    .regex(/^[a-zA-Z0-9_]+$/, 'Только латинские буквы, цифры и подчёркивание'),
  
  password: z.string()
    .min(6)
    .max(100)
    .regex(/[A-Z]/, 'Заглавная буква')
    .regex(/[a-z]/, 'Строчная буква')
    .regex(/[0-9]/, 'Цифра'),
  
  acceptTerms: z.boolean().refine((val) => val === true)
})
```

#### Защита на уровне отображения

```typescript
// Компонент для безопасного отображения HTML
import DOMPurify from 'isomorphic-dompurify'

interface SafeHtmlProps {
  html: string
  className?: string
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  })

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
```

#### Тесты на XSS

```typescript
// tests/security/xss.test.ts

import { describe, it, expect } from 'vitest'
import { RegisterSchema } from '../src/shared/types'

describe('XSS Protection', () => {
  it('should reject HTML in firstName', async () => {
    const maliciousInputs = [
      '<script>alert("XSS")</script>Иван',
      '<img src=x onerror=alert("XSS")>Иван',
      'Иван<script>document.location="http://evil.com"</script>',
    ]

    for (const input of maliciousInputs) {
      const result = RegisterSchema.safeParse({
        email: 'test@test.com',
        firstName: input,
        lastName: 'Петров',
        nickname: 'test123',
        password: 'Password123',
        acceptTerms: true
      })

      // Либо валидация не пройдёт, либо HTML будет удалён
      if (result.success) {
        expect(result.data.firstName).not.toContain('<script>')
        expect(result.data.firstName).not.toContain('<img')
      }
    }
  })

  it('should reject HTML in nickname', async () => {
    const maliciousInputs = [
      '<script>alert(1)</script>',
      'test<img onerror=alert(1)>',
      'test" onclick="alert(1)',
    ]

    for (const input of maliciousInputs) {
      const result = RegisterSchema.safeParse({
        email: 'test@test.com',
        firstName: 'Иван',
        lastName: 'Петров',
        nickname: input,
        password: 'Password123',
        acceptTerms: true
      })

      expect(result.success).toBe(false)
    }
  })
})
```

### 3.3 Дополнительные меры безопасности

#### Rate Limiting

```typescript
// server/middleware/rate-limit.ts

import rateLimit from 'hono-rate-limiter'
import { getConnInfo } from 'hono/bun'

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 минут
  max: 5,                     // 5 попыток
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (c) => {
    return getConnInfo(c).remote.address || 'unknown'
  }
})

// Использование
auth.post('/login', authRateLimit, async (c) => { ... })
auth.post('/register', authRateLimit, async (c) => { ... })
```

#### Content Security Policy

```typescript
// server/index.ts

app.use('*', async (c, next) => {
  await next()
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'")
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
})
```

---

## 4. Панель модератора

### 4.1 Приоритет и статус

**Приоритет:** Низкий

**Статус:** На данном этапе роль модератора выполняет администратор. Отдельная панель модератора будет реализована позже при росте нагрузки на модерацию.

**Обоснование:**
- На старте проекта объём контента небольшой
- Администратор может выполнять функции модератора
- Ресурсы лучше направить на основной функционал

### 4.2 Текущая реализация

```typescript
// Роли в системе
enum Role {
  USER      // Пользователь
  AUTHOR    // Автор контента
  MODERATOR // Модератор (резерв)
  ADMIN     // Администратор (выполняет функции модератора)
}

// Проверка в admin.routes.ts
async function requireAdmin(c: Context) {
  // ...
  if (session.user.role !== 'ADMIN') {
    throw new AppError(403, 'Доступ запрещён', 'FORBIDDEN')
  }
}
```

### 4.3 Планируемая архитектура (будущее)

```
Модератор имеет доступ к:
├── /admin/moderation          # Очередь модерации
├── /admin/comments            # Модерация комментариев
├── /admin/reports             # Жалобы пользователей
└── /admin/content             # Модерация контента

Модератор НЕ имеет доступа к:
├── /admin/users               # Управление пользователями
├── /admin/settings            # Настройки системы
└── /admin/stats               # Полная статистика
```

### 4.4 Реализация middleware для модератора

```typescript
// server/middleware/auth.ts

export const requireModerator: MiddlewareHandler = async (c, next) => {
  const user = c.get('user')
  
  if (!user || !['MODERATOR', 'ADMIN'].includes(user.role)) {
    throw new AppError(403, 'Доступ запрещён', 'FORBIDDEN')
  }

  await next()
}
```

---

## 5. Рекомендации по развитию

### 5.1 Приоритеты разработки

| Приоритет | Задача | Оценка времени |
|-----------|--------|----------------|
| 🔴 P0 | Индексы на Session | 1 час |
| 🔴 P0 | Ограничение сессий | 2 часа |
| 🔴 P0 | XSS защита форм | 3 часа |
| 🟡 P1 | LocalStorage сервис | 4 часа |
| 🟡 P1 | Централизованный auth middleware | 3 часа |
| 🟡 P1 | Cleanup просроченных сессий | 2 часа |
| 🟢 P2 | Тесты безопасности | 8 часов |
| 🟢 P2 | Rate limiting | 4 часа |
| ⏳ P3 | Панель модератора | Отложено |

### 5.2 Чеклист перед продакшеном

- [ ] Индексы на таблицу Session (sessionToken, userId, expires)
- [ ] Ограничение сессий (5 на пользователя)
- [ ] Cleanup просроченных сессий
- [ ] XSS защита (DOMPurify на входе)
- [ ] Rate limiting на /auth/login и /auth/register
- [ ] Content Security Policy headers
- [ ] Тесты на SQL-инъекции
- [ ] Тесты на XSS
- [ ] Централизованный auth middleware
- [ ] Функция "Выйти со всех устройств"

### 5.3 Мониторинг в продакшене

```typescript
// server/utils/monitoring.ts

export function logAuthEvent(event: {
  type: 'login' | 'logout' | 'register' | 'session_expired'
  userId?: string
  ip?: string
  userAgent?: string
}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    ...event
  }))
}

// Использование
auth.post('/login', async (c) => {
  // ...
  logAuthEvent({
    type: 'login',
    userId: user.id,
    ip: c.req.header('CF-Connecting-IP'),
    userAgent: c.req.header('User-Agent')
  })
})
```

---

## 6. Итоги

### Реализовано в документации:

1. ✅ Анализ постоянных данных для LocalStorage
2. ✅ Структура папки constants/
3. ✅ Примеры файлов констант
4. ✅ Оптимизация аутентификации (5 решений)
5. ✅ Тестирование безопасности (SQL, XSS)
6. ✅ План модераторской панели (отложено)
7. ✅ Приоритеты развития

### Следующие шаги:

1. Создать папку `src/constants/` и вынести константы
2. Реализовать `src/lib/localStorage.ts`
3. Добавить индексы на Session
4. Реализовать ограничение сессий
5. Добавить XSS защиту в схемы валидации
6. Написать тесты безопасности

---

*Документация создана: июль 2025*
*Версия: 3.0*
*Статус: Актуальная*
