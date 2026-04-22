// server/lib/mediaStorage.ts
/**
 * Сервис для управления медиа-файлами
 * Поддерживает два режима: локальное хранилище и CDN
 */

import { existsSync, mkdirSync, writeFileSync, unlinkSync, readdirSync, statSync } from 'fs'
import { join, resolve, basename, dirname } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Типы хранилищ
export type StorageMode = 'local' | 'cdn'

// Категории файлов
export type MediaCategory = 
  | 'avatars'
  | 'covers'
  | 'audio'
  | 'video'
  | 'certificates'
  | 'documents'

// Конфигурация
interface MediaStorageConfig {
  mode: StorageMode
  localPath: string
  cdnBaseUrl: string
  maxSizes: Record<MediaCategory, number>
  convertToWebP: boolean
  webpQuality: number
}

// Максимальные размеры по умолчанию (в байтах)
const DEFAULT_MAX_SIZES: Record<MediaCategory, number> = {
  avatars: 2 * 1024 * 1024,        // 2MB
  covers: 5 * 1024 * 1024,         // 5MB
  audio: 50 * 1024 * 1024,         // 50MB
  video: 500 * 1024 * 1024,        // 500MB
  certificates: 10 * 1024 * 1024,  // 10MB
  documents: 20 * 1024 * 1024,     // 20MB
}

// MIME типы для каждой категории
const ALLOWED_MIME_TYPES: Record<MediaCategory, string[]> = {
  avatars: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  covers: ['image/jpeg', 'image/png', 'image/webp'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  certificates: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}

// Расширения файлов
const FILE_EXTENSIONS: Record<MediaCategory, string> = {
  avatars: '.webp',
  covers: '.webp',
  audio: '.mp3',
  video: '.mp4',
  certificates: '.png',
  documents: '.pdf',
}

class MediaStorageService {
  private config: MediaStorageConfig

  constructor(config?: Partial<MediaStorageConfig>) {
    this.config = {
      mode: (process.env.MEDIA_STORAGE_MODE as StorageMode) || 'local',
      // Используем абсолютный путь для надёжности
      localPath: process.env.MEDIA_LOCAL_PATH 
        ? resolve(process.env.MEDIA_LOCAL_PATH)
        : resolve('./public/media'),
      cdnBaseUrl: process.env.MEDIA_CDN_BASE_URL || 'https://cdn.economikus.ru',
      maxSizes: { ...DEFAULT_MAX_SIZES },
      convertToWebP: process.env.MEDIA_CONVERT_TO_WEBP !== 'false',
      webpQuality: parseInt(process.env.MEDIA_WEBP_QUALITY || '80'),
      ...config,
    }

    console.log(`[MediaStorage] Mode: ${this.config.mode}, Local path: ${this.config.localPath}`)

    // Инициализация локального хранилища
    if (this.config.mode === 'local') {
      this.ensureDirectories()
    }
  }

  /**
   * Создание директорий для хранения
   */
  private ensureDirectories(): void {
    const categories: MediaCategory[] = ['avatars', 'covers', 'audio', 'video', 'certificates', 'documents']
    
    for (const category of categories) {
      const dirPath = join(this.config.localPath, category)
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }
    }
  }

  /**
   * Валидация файла
   */
  private validateFile(file: File, category: MediaCategory): void {
    // Проверка размера
    const maxSize = this.config.maxSizes[category]
    if (file.size > maxSize) {
      throw new Error(`Файл слишком большой. Максимум: ${this.formatBytes(maxSize)}`)
    }

    // Проверка типа
    const allowedTypes = ALLOWED_MIME_TYPES[category]
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Недопустимый тип файла. Разрешены: ${allowedTypes.join(', ')}`)
    }
  }

  /**
   * Генерация уникального имени файла
   */
  private generateFilename(category: MediaCategory): string {
    const uuid = uuidv4()
    const extension = FILE_EXTENSIONS[category]
    return `${uuid}${extension}`
  }

  /**
   * Загрузка файла
   * @param file - File объект из FormData
   * @param category - Категория файла
   * @param subFolder - Опциональная подпапка (например, 'lessons/uuid')
   * @returns URL файла
   */
  async upload(file: File, category: MediaCategory, subFolder?: string): Promise<string> {
    // Валидация
    this.validateFile(file, category)

    // Генерация имени файла
    const filename = this.generateFilename(category)
    const subPath = subFolder ? join(subFolder, filename) : filename

    if (this.config.mode === 'local') {
      return this.uploadLocal(file, category, subPath)
    } else {
      return this.uploadCdn(file, category, subPath)
    }
  }

  /**
   * Загрузка в локальное хранилище
   */
  private async uploadLocal(file: File, category: MediaCategory, subPath: string): Promise<string> {
    console.log(`[MediaStorage] uploadLocal called: category=${category}, subPath=${subPath}`)
    console.log(`[MediaStorage] Local path config: ${this.config.localPath}`)
    
    // Нормализуем пути для кроссплатформенности
    const normalizedSubPath = subPath.replace(/\\/g, '/')
    const filePath = join(this.config.localPath, category, normalizedSubPath)
    
    console.log(`[MediaStorage] Full file path: ${filePath}`)
    
    // Проверяем существование директории
    const categoryDir = join(this.config.localPath, category)
    console.log(`[MediaStorage] Category directory exists: ${existsSync(categoryDir)}`)
    
    // Создаём директорию если нужно (когда есть подпапка)
    const dirPath = join(this.config.localPath, category, dirname(normalizedSubPath))
    if (normalizedSubPath.includes('/') && !existsSync(dirPath)) {
      console.log(`[MediaStorage] Creating directory: ${dirPath}`)
      mkdirSync(dirPath, { recursive: true })
      console.log(`[MediaStorage] Created directory: ${dirPath}`)
    }

    // Читаем файл
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    console.log(`[MediaStorage] Buffer size: ${buffer.length} bytes`)

    // Конвертация в WebP для изображений (опционально)
    let finalBuffer = buffer
    if (this.config.convertToWebP && ['avatars', 'covers', 'certificates'].includes(category)) {
      console.log(`[MediaStorage] Attempting WebP conversion for ${category}`)
      try {
        finalBuffer = await this.convertToWebP(buffer, this.config.webpQuality)
        console.log(`[MediaStorage] Converted to WebP: ${filePath}, new size: ${finalBuffer.length} bytes`)
      } catch (error) {
        console.warn('[MediaStorage] WebP конвертация не удалась, сохраняем оригинал:', error)
      }
    }

    // Сохраняем файл с обработкой ошибок
    try {
      console.log(`[MediaStorage] Writing file to: ${filePath}`)
      writeFileSync(filePath, finalBuffer)
      console.log(`[MediaStorage] ✓ File saved successfully: ${filePath}`)
      
      // Проверяем что файл действительно записался
      if (existsSync(filePath)) {
        const stats = statSync(filePath)
        console.log(`[MediaStorage] File size on disk: ${stats.size} bytes`)
      } else {
        console.error(`[MediaStorage] ✗ ERROR: File does not exist after write: ${filePath}`)
      }
    } catch (writeError) {
      console.error(`[MediaStorage] ✗ ERROR writing file:`, writeError)
      throw writeError
    }

    // Возвращаем URL с прямыми слэшами
    const relativePath = `${category}/${normalizedSubPath}`
    const url = this.getUrl(relativePath)
    console.log(`[MediaStorage] Returning URL: ${url}`)
    return url
  }

  /**
   * Загрузка на CDN (заглушка - реализовать при необходимости)
   */
  private async uploadCdn(file: File, category: MediaCategory, subPath: string): Promise<string> {
    // Здесь должна быть логика загрузки на CDN
    // Для сейчас возвращаем URL CDN с путём
    const url = `${this.config.cdnBaseUrl}/${category}/${subPath}`
    console.log('[MediaStorage] CDN upload (mock):', url)
    return url
  }

  /**
   * Конвертация изображения в WebP
   */
  private async convertToWebP(buffer: Buffer, quality: number): Promise<Buffer> {
    // Попытка использовать sharp если доступен
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      // @ts-expect-error sharp is optional
      const sharp = (await import('sharp')).default
      return await sharp(buffer).webp({ quality }).toBuffer()
    } catch (error) {
      // Если sharp недоступен, возвращаем оригинал
      // В продакшене лучше установить sharp: npm install sharp
      console.warn('Sharp не установлен, WebP конвертация недоступна')
      return buffer
    }
  }

  /**
   * Удаление файла по URL
   */
  async delete(url: string): Promise<void> {
    if (this.config.mode === 'local') {
      await this.deleteLocal(url)
    } else {
      await this.deleteCdn(url)
    }
  }

  /**
   * Удаление из локального хранилища
   */
  private async deleteLocal(url: string): Promise<void> {
    // Преобразуем URL в путь
    const relativePath = this.urlToRelativePath(url)
    if (!relativePath) {
      throw new Error('Не удалось определить путь к файлу')
    }

    const filePath = join(this.config.localPath, relativePath)
    
    if (existsSync(filePath)) {
      unlinkSync(filePath)
      console.log('[MediaStorage] File deleted:', filePath)
    } else {
      console.warn('[MediaStorage] File not found:', filePath)
    }
  }

  /**
   * Удаление с CDN (заглушка)
   */
  private async deleteCdn(url: string): Promise<void> {
    console.log('[MediaStorage] CDN delete (mock):', url)
  }

  /**
   * Удаление файла по пути
   */
  async deleteByPath(category: MediaCategory, subPath: string): Promise<void> {
    const url = this.getUrl(join(category, subPath))
    await this.delete(url)
  }

  /**
   * Получение URL для файла
   */
  getUrl(relativePath: string): string {
    // Нормализуем слэши к Unix-стилю
    const normalizedPath = relativePath.replace(/\\/g, '/')
    
    if (this.config.mode === 'local') {
      // Для локального режима возвращаем относительный путь
      return `/media/${normalizedPath}`
    } else {
      // Для CDN возвращаем полный URL
      return `${this.config.cdnBaseUrl}/${normalizedPath}`
    }
  }

  /**
   * Конвертация URL в относительный путь
   */
  private urlToRelativePath(url: string): string | null {
    try {
      if (this.config.mode === 'local') {
        // Убираем домен и /media/ префикс
        const parsed = new URL(url, 'http://localhost')
        return parsed.pathname.replace(/^\/media\//, '').replace(/\//g, '/')
      } else {
        // Убираем CDN базовый URL
        if (url.startsWith(this.config.cdnBaseUrl)) {
          return url.replace(`${this.config.cdnBaseUrl}/`, '')
        }
        // Если URL относительный (начинается с /media/)
        if (url.startsWith('/media/')) {
          return url.replace(/^\/media\//, '')
        }
        return null
      }
    } catch (error) {
      console.error('[MediaStorage] Error parsing URL:', url, error)
      return null
    }
  }

  /**
   * Получение статистики хранилища
   */
  getStorageStats(): Record<MediaCategory, { count: number; size: number }> {
    const stats: Record<MediaCategory, { count: number; size: number }> = {
      avatars: { count: 0, size: 0 },
      covers: { count: 0, size: 0 },
      audio: { count: 0, size: 0 },
      video: { count: 0, size: 0 },
      certificates: { count: 0, size: 0 },
      documents: { count: 0, size: 0 },
    }

    if (this.config.mode === 'local') {
      for (const category of Object.keys(stats) as MediaCategory[]) {
        const dirPath = join(this.config.localPath, category)
        if (existsSync(dirPath)) {
          const files = readdirSync(dirPath, { recursive: true }) as string[]
          for (const file of files) {
            const filePath = join(dirPath, file)
            const stat = existsSync(filePath) ? statSync(filePath) : null
            if (stat?.isFile()) {
              stats[category].count++
              stats[category].size += (stat as { size: number }).size
            }
          }
        }
      }
    }

    return stats
  }

  /**
   * Форматирование размера в человекочитаемый вид
   */
  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  /**
   * Проверка режима хранилища
   */
  isLocalMode(): boolean {
    return this.config.mode === 'local'
  }

  /**
   * Проверка CDN режима
   */
  isCdnMode(): boolean {
    return this.config.mode === 'cdn'
  }
}

// Singleton экземпляр
export const mediaStorage = new MediaStorageService()

// Экспорт для тестирования
export { MediaStorageService }
