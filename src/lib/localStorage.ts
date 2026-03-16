// src/lib/localStorage.ts
/**
 * Сервис для работы с localStorage
 * 
 * Правила использования:
 * 1. НЕ хранить чувствительные данные (пароли, токены авторизации, личные данные)
 * 2. Устанавливать TTL для кэшируемых данных
 * 3. Валидировать данные при чтении
 * 
 * Что можно хранить:
 * - Настройки пользователя (тема, язык)
 * - Кэш справочников (теги, категории)
 * - Кэш списка курсов (превью)
 * - Навигационные данные
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
  
  // Временные данные
  LAST_SEARCH: 'economikus_last_search',
  SIDEBAR_COLLAPSED: 'economikus_sidebar_collapsed',
} as const

// TTL по умолчанию (в миллисекундах)
export const DEFAULT_TTL = {
  TAGS: 10 * 60 * 1000,                      // 10 минут
  COURSES: 5 * 60 * 1000,                    // 5 минут
  AUTHORS: 15 * 60 * 1000,                   // 15 минут
  PREFERENCES: 365 * 24 * 60 * 60 * 1000,    // 1 год
  SEARCH: 24 * 60 * 60 * 1000,               // 1 день
} as const

// Настройки пользователя по умолчанию
export const DEFAULT_PREFERENCES = {
  theme: 'light' as const,
  fontSize: 'medium' as const,
  language: 'ru' as const,
  notifications: {
    email: true,
    push: true,
    telegram: false,
  },
} as const

type UserPreferences = typeof DEFAULT_PREFERENCES

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
      console.error('[LocalStorage] set error:', error)
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
      console.error('[LocalStorage] get error:', error)
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
      console.error('[LocalStorage] remove error:', error)
    }
  }

  /**
   * Очистить весь кэш (кроме настроек)
   */
  clearCache(): void {
    const preserveKeys = [STORAGE_KEYS.USER_PREFERENCES]
    
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!preserveKeys.includes(key)) {
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

  /**
   * Получить настройки пользователя
   */
  getPreferences(): UserPreferences {
    const stored = this.get<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES)
    return stored ? { ...DEFAULT_PREFERENCES, ...stored } : DEFAULT_PREFERENCES
  }

  /**
   * Сохранить настройки пользователя
   */
  setPreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences()
    this.set(STORAGE_KEYS.USER_PREFERENCES, { ...current, ...preferences }, DEFAULT_TTL.PREFERENCES)
  }

  /**
   * Проверить, есть ли кэш для ключа
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Получить размер хранилища в байтах
   */
  getSize(): number {
    let size = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('economikus_')) {
        const value = localStorage.getItem(key)
        if (value) {
          size += key.length + value.length
        }
      }
    }
    return size * 2 // UTF-16 = 2 байта на символ
  }

  /**
   * Получить информацию о хранилище
   */
  getInfo(): { used: number; keys: string[] } {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('economikus_')) {
        keys.push(key)
      }
    }
    return { used: this.getSize(), keys }
  }
}

// Экспорт singleton экземпляра
export const storage = new LocalStorageService()

// Хук для React (опционально)
import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.get<T>(key)
    return item !== null ? item : initialValue
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value
      storage.set(key, newValue)
      return newValue
    })
  }, [key])

  return [storedValue, setValue]
}

// Хук для настроек пользователя
export function useUserPreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => 
    storage.getPreferences()
  )

  const setPreferences = useCallback((updates: Partial<UserPreferences>) => {
    storage.setPreferences(updates)
    setPreferencesState(prev => ({ ...prev, ...updates }))
  }, [])

  return { preferences, setPreferences }
}
