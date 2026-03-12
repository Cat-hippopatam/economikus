// Простой тестовый seed файл для проверки работы
import { PrismaClient } from '@prisma/client'

// Проверяем, что переменная окружения доступна
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Попытка создать PrismaClient
try {
  const prisma = new PrismaClient()
  console.log('PrismaClient создан успешно')
} catch (error) {
  console.error('Ошибка создания PrismaClient:', error)
}

console.log('Seed script executed');