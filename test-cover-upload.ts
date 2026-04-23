/**
 * Тест загрузки обложек на локальное хранилище
 * 
 * Этот скрипт тестирует:
 * 1. Загрузку обложки курса
 * 2. Загрузку обложки урока
 * 3. Проверку создания файлов в папке public/media/covers/
 * 
 * Запуск:
 *   npm run dev              # Сначала запустите сервер
 *   npx tsx test-cover-upload.ts
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Конфигурация
const API_URL = process.env.API_URL || 'http://localhost:3000'
const TEST_COVER_PATH = process.env.TEST_COVER_PATH || './test-data/cover.jpg'

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Тестовая функция для загрузки файла
async function testCoverUpload(type: 'course' | 'lesson'): Promise<void> {
  log(`\n🧪 Тест: Загрузка обложки ${type === 'course' ? 'курса' : 'урока'}`, 'cyan')
  
  // Проверка что файл существует
  if (!existsSync(TEST_COVER_PATH)) {
    log(`❌ Файл обложки не найден: ${TEST_COVER_PATH}`, 'red')
    log('💡 Создайте тестовый файл или укажите путь через TEST_COVER_PATH', 'yellow')
    return
  }

  // Создаём FormData
  const formData = new FormData()
  const file = new File([readFileSync(TEST_COVER_PATH)], 'test-cover.jpg', { type: 'image/jpeg' })
  formData.append('cover', file)

  try {
    // Отправляем запрос
    const endpoint = `/api/author/${type === 'course' ? 'courses' : 'lessons'}/upload-cover`
    log(`📤 Отправка запроса: POST ${endpoint}`, 'blue')
    
    const response = await fetch(API_URL + endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (!response.ok) {
      const errorText = await response.text()
      log(`❌ Ошибка сервера: ${response.status} ${response.statusText}`, 'red')
      log(`📝 Ответ: ${errorText}`, 'red')
      return
    }

    const data = await response.json()
    log(`✅ Успешно! Обложка загружена: ${data.coverUrl}`, 'green')

    // Проверяем что файл существует
    const relativePath = data.coverUrl.replace('/media/', '')
    const fullPath = join(process.cwd(), 'public', 'media', relativePath)
    
    if (existsSync(fullPath)) {
      log(`✅ Файл создан: ${fullPath}`, 'green')
      const stats = await import('fs').then(m => m.statSync(fullPath))
      log(`📊 Размер файла: ${(stats.size / 1024).toFixed(2)} KB`, 'green')
    } else {
      log(`⚠️  Файл не найден по пути: ${fullPath}`, 'yellow')
    }

  } catch (error) {
    log(`❌ Ошибка запроса: ${(error as Error).message}`, 'red')
  }
}

// Основной тест
async function main(): Promise<void> {
  log('\n═══════════════════════════════════════════', 'cyan')
  log('  ТЕСТ ЗАГРУЗКИ ОБЛОЖЕК', 'cyan')
  log('═══════════════════════════════════════════', 'cyan')
  
  log(`\n🌐 API URL: ${API_URL}`, 'blue')
  log(`📁 Тестовый файл: ${TEST_COVER_PATH}`, 'blue')

  // Проверяем что сервер запущен
  try {
    const checkResponse = await fetch(API_URL + '/api/health', { method: 'GET' })
    if (!checkResponse.ok) {
      log('⚠️  Сервер может быть недоступен', 'yellow')
    } else {
      log('✅ Сервер доступен', 'green')
    }
  } catch (error) {
    log('❌ Сервер недоступен. Запустите сервер: npm run dev', 'red')
    return
  }

  // Запускаем тесты
  await testCoverUpload('course')
  await testCoverUpload('lesson')

  log('\n═══════════════════════════════════════════', 'cyan')
  log('  ТЕСТЫ ЗАВЕРШЕНЫ', 'cyan')
  log('═══════════════════════════════════════════\n', 'cyan')
}

// Запуск
main().catch(console.error)
