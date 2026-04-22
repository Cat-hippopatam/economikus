# MediaImage - Универсальный компонент для изображений с fallback

Компонент `MediaImage` предназначен для безопасного отображения изображений с автоматической обработкой ошибок загрузки и отсутствующих файлов.

## Возможности

- ✅ Автоматический fallback при ошибке загрузки
- ✅ Поддержка разных типов медиа (аватар, обложка, курс, урок, сертификат)
- ✅ Уникальные градиенты и иконки для каждого типа
- ✅ Полная совместимость с Mantine ImageProps
- ✅ TypeScript поддержка

## Использование

### Базовое использование

```tsx
import { MediaImage } from '@/components/common'

// Изображение с fallback
<MediaImage 
  src="https://example.com/image.jpg"
  mediaType="cover"
  alt="Описание"
/>
```

### Типы медиа

```tsx
// Аватар пользователя (фиолетовый градиент, иконка пользователя)
<MediaImage src={avatarUrl} mediaType="avatar" />

// Обложка профиля (зелёный градиент, иконка изображения)
<MediaImage src={coverUrl} mediaType="cover" />

// Обложка курса (зелёный градиент, иконка книги)
<MediaImage src={courseCover} mediaType="course" />

// Обложка урока (розовый градиент, иконка документа)
<MediaImage src={lessonCover} mediaType="lesson" />

// Сертификат (золотой градиент, иконка награды)
<MediaImage src={certificateUrl} mediaType="certificate" />
```

### Кастомизация стилей

```tsx
<MediaImage
  src={imageUrl}
  mediaType="course"
  alt="Курс"
  style={{
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 8,
  }}
  placeholderSize={48}
/>
```

### Использование без изображения

```tsx
// Если src не указан, автоматически показывается placeholder
<MediaImage mediaType="avatar" />
```

## Пропсы

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `src` | `string` | - | URL изображения |
| `mediaType` | `'avatar' \| 'cover' \| 'course' \| 'lesson' \| 'certificate' \| 'default'` | `'default'` | Тип медиа для выбора placeholder'а |
| `alt` | `string` | `'Media'` | Альтернативный текст |
| `placeholderSize` | `number` | `48` | Размер иконки placeholder'а (в пикселях) |
| `className` | `string` | - | Дополнительный CSS класс |
| `style` | `React.CSSProperties` | - | Стили компонента |

## Градиенты по умолчанию

- **avatar**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (фиолетовый)
- **cover**: `linear-gradient(135deg, #264653 0%, #2A9D8F 100%)` (зелёный)
- **course**: `linear-gradient(135deg, #264653 0%, #2A9D8F 100%)` (зелёный)
- **lesson**: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` (розовый)
- **certificate**: `linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)` (золотой)
- **default**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (фиолетовый)

## Примеры использования в проекте

### Карточка курса
```tsx
<MediaImage
  src={course.coverImage}
  mediaType="course"
  alt={course.title}
  style={{ width: '100%', height: 160, objectFit: 'cover' }}
/>
```

### Аватар пользователя
```tsx
<MediaImage
  src={user.avatarUrl}
  mediaType="avatar"
  style={{ width: 40, height: 40, borderRadius: '50%' }}
  placeholderSize={24}
/>
```

### Обложка профиля
```tsx
<MediaImage
  src={profile.coverImage}
  mediaType="cover"
  style={{ width: '100%', height: 200, objectFit: 'cover' }}
/>
```

## Миграция

### До
```tsx
{course.coverImage ? (
  <img src={course.coverImage} alt={course.title} />
) : (
  <Box>Placeholder</Box>
)}
```

### После
```tsx
<MediaImage
  src={course.coverImage}
  mediaType="course"
  alt={course.title}
/>
```

## Серверная поддержка

Для полной поддержки рекомендуется настроить серверный fallback (см. `server/index.ts`), который будет возвращать placeholder изображения при отсутствии файла.
