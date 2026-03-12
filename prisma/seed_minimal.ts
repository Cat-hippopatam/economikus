// Минимальный seed файл для проверки
import { PrismaClient } from '@prisma/client'

// Простая проверка, что Prisma работает
console.log('Запуск seed файла...')

// Попытка создать клиент с опциями
try {
  const prisma = new PrismaClient({
    // Пустой объект - это должно быть достаточно для Prisma 7.5.0
  })
  console.log('PrismaClient создан успешно')
} catch (error) {
  console.error('Ошибка создания PrismaClient:', error.message)
}

console.log('Seed завершен')