# Конфигурация хранилища медиа-файлов

## Обзор

Система поддерживает два режима хранения медиа-файлов:
1. **Локальное хранилище** - файлы сохраняются в папке на сервере
2. **CDN** - файлы сохраняются на внешнем CDN (по умолчанию)

## Типы медиа-файлов

| Тип | Поля в БД | Описание |
|-----|-----------|----------|
| **Аватары** | `profiles.avatar_url` | Аватары пользователей |
| **Обложки курсов** | `courses.cover_image` | Обложки курсов |
| **Обложки уроков** | `lessons.cover_image` | Обложки уроков |
| **Обложки профилей** | `profiles.cover_image` | Обложки профилей |
| **Аудио** | `audio_contents.audio_url` | Аудио уроки |
| **Видео** | `video_contents.video_url` | Видео уроки |
| **Сертификаты** | `certificates.image_url`, `certificates.pdf_url` | Изображения и PDF сертификатов |

## Конфигурация

### Переменные окружения

```env
# Режим хранилища: 'local' | 'cdn'
MEDIA_STORAGE_MODE=local

# Для локального хранилища
MEDIA_LOCAL_PATH=./public/media

# Для CDN
MEDIA_CDN_BASE_URL=https://cdn.economikus.ru

# Максимальные размеры файлов (в байтах)
MEDIA_MAX_SIZE_AVATAR=2097152        # 2MB
MEDIA_MAX_SIZE_COVER=5242880         # 5MB
MEDIA_MAX_SIZE_AUDIO=52428800        # 50MB
MEDIA_MAX_SIZE_VIDEO=524288000       # 500MB
MEDIA_MAX_SIZE_CERTIFICATE=10485760  # 10MB

# Опционально: конвертация изображений в WebP
MEDIA_CONVERT_TO_WEBP=true
MEDIA_WEBP_QUALITY=80
```

## Структура папок локального хранилища

```
public/media/
├── avatars/          # Аватары пользователей
│   └── {uuid}.webp
├── covers/           # Обложки курсов и уроков
│   └── {uuid}.webp
├── audio/            # Аудио файлы
│   └── {uuid}.mp3
├── video/            # Видео файлы
│   └── {uuid}.mp4
└── certificates/     # Сертификаты
    ├── {uuid}.png
    └── {uuid}.pdf
```

## API для работы с медиа

### Загрузка файла

```typescript
import { mediaStorage } from '@/lib/mediaStorage'

// Загрузка аватара
const avatarUrl = await mediaStorage.upload(file, 'avatars')

// Загрузка обложки
const coverUrl = await mediaStorage.upload(file, 'covers')

// Загрузка с указанием подпапки
const audioUrl = await mediaStorage.upload(file, 'audio/lessons')
```

### Удаление файла

```typescript
// Удаление по URL
await mediaStorage.delete(avatarUrl)

// Удаление по пути
await mediaStorage.deleteByPath('avatars/avatar-uuid.webp')
```

### Получение URL

```typescript
// Для локального режима - возвращает относительный путь
const url = mediaStorage.getUrl('avatars/avatar-uuid.webp')
// → '/media/avatars/avatar-uuid.webp'

// Для CDN режима - возвращает полный URL
const url = mediaStorage.getUrl('avatars/avatar-uuid.webp')
// → 'https://cdn.economikus.ru/avatars/avatar-uuid.webp'
```

## Миграция с CDN на локальное хранилище

### Скрипт миграции

```bash
npm run migrate:media:download
```

Этот скрипт:
1. Находит все записи с URL CDN
2. Скачивает файлы
3. Сохраняет локально
4. Обновляет записи в БД

## Серверная конфигурация

### Раздача статических файлов

```typescript
// server/index.ts
import { serveStatic } from '@hono/node-server/serve-static'

app.use('/media/*', serveStatic({
  root: './public',
  rewriteRequestPath: (path) => path.replace(/^\/media/, '/media')
}))
```

### Заголовки кэширования

```typescript
app.use('/media/*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'public, max-age=31536000, immutable')
})
```

## Безопасность

1. **Валидация типов файлов** - проверяется MIME type
2. **Ограничение размера** - макс. размер для каждого типа
3. **Санитизация имён** - используются UUID вместо оригинальных имён
4. **Доступ к папкам** - файлы доступны только в разрешённых подпапках

## Производительность

### Рекомендации

1. **WebP конвертация** - для изображений (аватары, обложки)
2. **Thumbnails** - генерация превью для больших изображений
3. **CDN для продакшена** - для лучшего кэширования и раздачи
4. **Lazy loading** - на клиенте для изображений

## Мониторинг

### Метрики для отслеживания

- Размер хранилища по типам файлов
- Количество загруженных файлов
- Ошибки загрузки/удаления
- Время загрузки файлов

## Расширение

### Добавление нового типа хранилища

```typescript
// server/lib/storage/s3.storage.ts
import { MediaStorage } from './mediaStorage'

export class S3Storage implements MediaStorage {
  async upload(file: File, category: string): Promise<string> {
    // S3 реализация
  }
  
  async delete(url: string): Promise<void> {
    // S3 реализация
  }
  
  getUrl(path: string): string {
    // S3 URL
  }
}
```

## Troubleshooting

### Проблема: Файлы не загружаются

**Решение:**
1. Проверьте права доступа к папке `public/media`
2. Проверьте переменную `MEDIA_STORAGE_MODE`
3. Проверьте логи сервера

### Проблема: Не работают URL после миграции

**Решение:**
1. Проверьте что файлы существуют в папке
2. Проверьте настройки раздачи статики в `server/index.ts`
3. Очистите кэш браузера
