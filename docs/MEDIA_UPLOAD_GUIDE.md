# Руководство по загрузке медиа-файлов

## Обзор

Система медиа-хранилища поддерживает загрузку и хранение различных типов файлов:
- Аватары пользователей
- Обложки курсов и уроков
- Аудио и видео контент
- Сертификаты
- Документы

## Быстрый старт

### 1. Настройка переменных окружения

```env
# .env
MEDIA_STORAGE_MODE=local
MEDIA_LOCAL_PATH=./public/media
MEDIA_CONVERT_TO_WEBP=true
MEDIA_WEBP_QUALITY=80
```

### 2. Загрузка аватара (клиент)

```tsx
import { useAvatarUpload } from '@/hooks'
import { AvatarUploader } from '@/components/common'

function ProfilePage() {
  const { uploading, uploadAvatar, deleteAvatar } = useAvatarUpload()
  
  const handleFileChange = async (file: File | null) => {
    if (!file) return
    const url = await uploadAvatar(file)
    console.log('Avatar URL:', url)
  }
  
  return (
    <AvatarUploader 
      currentAvatar={user.avatarUrl}
      onUploadSuccess={(url) => console.log('Uploaded:', url)}
    />
  )
}
```

### 3. Загрузка обложки курса (автор)

```tsx
async function uploadCourseCover(file: File) {
  const formData = new FormData()
  formData.append('cover', file)
  
  const response = await fetch('/api/author/courses/cover', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  
  const data = await response.json()
  return data.coverUrl // /media/covers/uuid.webp
}
```

### 4. Отображение изображений

```tsx
import { MediaImage } from '@/components/common'

// Аватар
<MediaImage 
  src={user.avatarUrl} 
  mediaType="avatar"
  alt="User avatar"
/>

// Обложка курса
<MediaImage 
  src={course.coverImage} 
  mediaType="course"
  alt={course.title}
/>
```

## API Endpoints

### Загрузка аватара

**POST** `/api/user/avatar`

Content-Type: `multipart/form-data`

```typescript
// Request
FormData {
  avatar: File
}

// Response 200
{
  message: "Аватар загружен",
  avatarUrl: "/media/avatars/uuid.webp"
}
```

### Удаление аватара

**DELETE** `/api/user/avatar`

```typescript
// Response 200
{
  message: "Аватар удалён"
}
```

## Серверное использование

### MediaStorage сервис

```typescript
import { mediaStorage } from '@/lib/mediaStorage'

// Загрузка файла
const url = await mediaStorage.upload(file, 'avatars')
// или с подпапкой
const url = await mediaStorage.upload(file, 'covers', 'courses/uuid')

// Удаление файла
await mediaStorage.delete(url)

// Получение URL
const url = mediaStorage.getUrl('avatars/uuid.webp')
```

### Категории файлов

| Категория | MIME типы | Макс. размер |
|-----------|-----------|--------------|
| avatars | image/jpeg, image/png, image/gif, image/webp | 2 MB |
| covers | image/jpeg, image/png, image/webp | 5 MB |
| audio | audio/mpeg, audio/mp3, audio/wav, audio/ogg | 50 MB |
| video | video/mp4, video/webm, video/quicktime | 500 MB |
| certificates | image/jpeg, image/png, image/webp, application/pdf | 10 MB |
| documents | application/pdf, application/msword | 20 MB |

## Структура хранилища

```
public/media/
├── avatars/          # Аватары пользователей
│   └── {uuid}.webp
├── covers/           # Обложки
│   ├── courses/      # Обложки курсов
│   └── lessons/      # Обложки уроков
├── audio/            # Аудио файлы
├── video/            # Видео файлы
├── certificates/     # Сертификаты
└── documents/        # Документы
```

## WebP конвертация

При включённой опции `MEDIA_CONVERT_TO_WEBP=true` все изображения автоматически конвертируются в формат WebP для оптимизации размера.

Требования:
- Установлен пакет `sharp`: `npm install sharp`
- Поддерживаются форматы: JPEG, PNG, GIF

## Кэширование

Медиа-файлы раздаются с заголовками кэширования:
```
Cache-Control: public, max-age=31536000, immutable
```

Это означает, что браузеры будут кэшировать файлы на 1 год.

## Безопасность

1. **Валидация типа** - проверяется MIME type файла
2. **Ограничение размера** - макс. размер для каждой категории
3. **UUID имена** - файлы сохраняются с уникальными именами
4. **Защищённые пути** - файлы доступны только в разрешённых папках

## Troubleshooting

### Файлы не загружаются

1. Проверьте права доступа к папке `public/media`
2. Проверьте переменную `MEDIA_STORAGE_MODE` в `.env`
3. Посмотрите логи сервера на наличие ошибок

### Изображения не отображаются

1. Проверьте что сервер раздаёт статику `/media/*`
2. Очистите кэш браузера
3. Проверьте что файл существует в папке

### Ошибка WebP конвертации

1. Убедитесь что установлен `sharp`: `npm install sharp`
2. Проверьте что оригинальный файл валидный

## Миграция на продакшен

Для продакшена рекомендуется использовать CDN:

```env
MEDIA_STORAGE_MODE=cdn
MEDIA_CDN_BASE_URL=https://cdn.economikus.ru
```

Реализация CDN хранилища находится в `server/lib/mediaStorage.ts` (метод `uploadCdn`).
