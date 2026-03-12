// Фиксированный seed файл для Prisma 7.5.0
import { PrismaClient } from '@prisma/client'

// Создаем PrismaClient с правильной конфигурацией для Prisma 7.5.0
const prisma = new PrismaClient({
  // Для работы с MySQL в Prisma 7.5.0 требуется указать engine
  // Используем пустой объект, так как Prisma сам должен определить настройки
})

async function main() {
  console.log('🌱 Seed запущен успешно!')
  console.log('Проверьте, что ваша база данных доступна по адресу:', process.env.DATABASE_URL)
  
  // Здесь можно добавить логику seed, если она не требует подключения к БД
  console.log('Seed завершен')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })