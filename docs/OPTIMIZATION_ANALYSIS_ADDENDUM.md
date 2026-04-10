# Дополнение к плану оптимизации Economikus

> Дата: Июль 2025
> Версия дополнения: 1.1

---

## ИТОГОВАЯ ТАБЛИЦА РИСКОВ

| Изменение | Общий риск | Сложность | Рекомендация |
|-----------|------------|-----------|--------------|
| Gzip сжатие | 🟢 Низкий | Просто | **Сделать первым** |
| Code splitting | 🟡 Средний | Средне | Сделать с Suspense |
| Динамические импорты | 🟡 Средний | Средне | Для тяжёлых страниц |
| Кэширование | 🟡 Средний | Средне | После статики |
| **Аватары в файлы** | 🔴 Высокий | Сложно | **Последним, с миграцией** |
| Смена запуска | 🟢 Низкий | Просто | Сделать перед деплоем |
| Защита phpmyadmin | 🟡 Средний | Средне | Настроить в nginx |
| Rate limiting | 🟡 Средний | Средне | После стабилизации |
| CSP заголовки | 🟡 Средний | Средне | После тестирования |

---

## ТЕХНИЧЕСКИЕ ДЕТАЛИ РЕАЛИЗАЦИИ

### 1. Vite config — Code Splitting

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: 'server/index.ts',
      exclude: [/^\/(?!api).*/],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 500,  // Уменьшено с 1500
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mantine': ['@mantine/core', '@mantine/hooks'],
          'vendor-charts': ['recharts'],
          'vendor-md': ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
})
```

### 2. Gzip сжатие в Hono

```typescript
// server/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { serve } from '@hono/node-server'

const app = new Hono()

// Сжатие — должно быть ОДНИМ из первых middleware
app.use('*', compress())

// Остальные middleware
app.use('*', logger())
app.use('*', cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))

// ... роуты
```

### 3. ErrorBoundary для динамических компонентов

```tsx
// src/components/common/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'
import { Button, Stack, Text, Center } from '@mantine/core'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Center p="xl" style={{ minHeight: 200 }}>
          <Stack align="center" gap="md">
            <Text size="lg" fw={500}>Не удалось загрузить контент</Text>
            <Text size="sm" c="dimmed">Попробуйте обновить страницу</Text>
            <Button 
              variant="light" 
              onClick={() => this.setState({ hasError: false })}
            >
              Попробовать снова
            </Button>
          </Stack>
        </Center>
      )
    }

    return this.props.children
  }
}
```

### 4. Пример Lazy Loading для тяжёлых страниц

```tsx
// src/App.tsx
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LoadingState } from '@/components/common'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Тяжёлые страницы — загружаются по требованию
const CourseAnalytics = lazy(() => 
  import('@/pages/author/AuthorAnalyticsPage').catch(() => ({
    default: () => (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Ошибка загрузки аналитики
      </div>
    )
  }))
)

const AdminDashboard = lazy(() => 
  import('@/pages/admin/AdminDashboard').catch(() => ({
    default: () => (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Ошибка загрузки админ-панели
      </div>
    )
  }))
)

// Легкие страницы — загружаются сразу
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/catalog/CatalogPage'

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState text="Загрузка..." />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          {/* Тяжёлые страницы */}
          <Route path="/author/analytics" element={<CourseAnalytics />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
```

### 5. Кэширование статических файлов

```typescript
// server/index.ts

// Раздача медиафайлов с долгим кэшированием
app.get('/public/media/*', async (c) => {
  const path = c.req.path.replace('/public/', '')
  const filePath = `./public/media/${path}`
  
  // Проверяем существование файла
  const fs = await import('fs/promises')
  try {
    await fs.access(filePath)
  } catch {
    return c.notFound()
  }
  
  // Определяем content-type
  const ext = path.split('.').pop()?.toLowerCase() || ''
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
  }
  
  const contentType = contentTypes[ext] || 'application/octet-stream'
  const file = await fs.readFile(filePath)
  
  // Заголовки кэширования
  // public — можно кэшировать на прокси и клиенте
  // max-age=31536000 — 1 год
  // immutable — контент не меняется
  c.header('Content-Type', contentType)
  c.header('Cache-Control', 'public, max-age=31536000, immutable')
  c.header('X-Content-Type-Options', 'nosniff')
  
  return c.body(file)
})

// API — без кэша
app.use('/api/*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'no-store, must-revalidate')
  c.header('Pragma', 'no-cache')
})
```

### 6. Production запуск сервера

```bash
# package.json — добавить скрипт
{
  "scripts": {
    "build:server": "node build-server.mjs",
    "start:server": "node --env-file=.env dist-server/index.js",
    "start:dev": "vite",
    "build": "tsc -b && vite build"
  }
}

# Команда запуска на сервере вместо:
# npx tsx server/index.ts

# Использовать:
npm run build:server && node --env-file=.env dist-server/index.js
```

---

## ЧЕКЛИСТ ТЕСТИРОВАНИЯ

### После изменений обязательно проверить:

- [ ] `npm run build` — без ошибок TypeScript
- [ ] `npm run build:server` — сервер собирается
- [ ] `npm run lint` — без критических ошибок
- [ ] Frontend загружается без ошибок в консоли
- [ ] Backend отвечает на запросы
- [ ] Авторизация работает
- [ ] Загрузка аватара работает (если менялось)
- [ ] Страницы с lazy loading показывают fallback

### Тестирование на мобильных устройствах:

- [ ] Страница каталога загружается < 3 сек (3G)
- [ ] Страница курса загружается < 5 сек (3G)
- [ ] Нет "белого экрана" при навигации
- [ ] Изображения не вызывают ошибок

---

## ЖУРНАЛ ИЗМЕНЕНИЙ

| Дата | Версия | Автор | Изменения |
|------|--------|-------|-----------|
| Июль 2025 | 1.0 | Koda | Первая версия документа |
| Июль 2025 | 1.1 | Koda | Добавлены технические детали реализации, чеклист тестирования |

---

*Дополнение к docs/OPTIMIZATION_ANALYSIS.md*
