# Быстрый тест загрузки медиа

## 1. Запуск проекта

```bash
# Терминал 1: Frontend + Backend (dev режим)
npm run dev
```

## 2. Проверка переменных окружения

Убедитесь, что в `.env` установлены:

```env
MEDIA_STORAGE_MODE=local
MEDIA_LOCAL_PATH=./public/media
MEDIA_CONVERT_TO_WEBP=true
```

## 3. Тестирование загрузки аватара

1. Откройте http://localhost:5173
2. Войдите в систему
3. Перейдите в настройки профиля
4. Нажмите "Выбрать" для загрузки аватара
5. Выберите изображение (JPG, PNG, GIF, WebP, макс. 2MB)

**Ожидаемый результат:**
- Аватар загружается
- В консоли сервера видите:
  ```
  [Avatar Upload] File received: image.png, size: 12345, type: image/png
  [MediaStorage] Mode: local, Local path: C:\...\public\media
  [MediaStorage] Converted to WebP: C:\...\public\media\avatars\uuid.webp
  [MediaStorage] File saved: C:\...\public\media\avatars\uuid.webp
  [Avatar Upload] File uploaded to: /media/avatars/uuid.webp
  ```

## 4. Проверка файла

Проверьте, что файл создан в папке:
```
public/media/avatars/{uuid}.webp
```

## 5. Проверка отображения

Откройте в браузере:
```
http://localhost:3000/media/avatars/{uuid}.webp
```

Изображение должно отобразиться.

## 6. Тест удаления

1. Нажмите кнопку удаления аватара
2. Проверьте, что файл удалён из папки
3. Проверьте, что в консоли есть лог:
   ```
   [Avatar Delete] File deleted: /media/avatars/uuid.webp
   ```

## Возможные проблемы

### Ошибка "Файл не загружен"

**Причина:** Неправильный Content-Type

**Решение:** Убедитесь, что отправляете FormData:
```javascript
const formData = new FormData()
formData.append('avatar', file)
fetch('/api/user/avatar', {
  method: 'POST',
  body: formData,
  credentials: 'include'
})
```

### Ошибка WebP конвертации

**Причина:** Не установлен sharp

**Решение:** `npm install sharp`

### Изображение не отображается

**Причина:** Неправильный путь к файлу

**Решение:** Проверьте, что сервер запущен из корневой директории проекта

### CORS ошибка

**Причина:** Неправильные настройки CORS

**Решение:** Проверьте FRONTEND_URL в .env
