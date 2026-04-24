/**
 * Миграция данных Kakebo v1.0 → v2.0
 * 
 * Задачи:
 * 1. Создать системные категории (LIFE, CULTURE, EXTRA, UNEXPECTED)
 * 2. Перенести все записи в новые категории
 * 3. Проверить целостность данных
 */

import { PrismaClient, CategoryType } from '@prisma/client'

const prisma = new PrismaClient()

interface LegacyEntry {
  id: string
  category: string
  profileId: string
}

async function migrate() {
  console.log('🚀 Начало миграции Kakebo v1.0 → v2.0')

  try {
    // 1. Создать системные категории
    console.log('\n📁 Создание системных категорий...')
    
    const systemCategories = [
      { id: 'sys-life', name: 'LIFE', isEssential: true, order: 1, icon: 'Home', color: '#339af0' },
      { id: 'sys-culture', name: 'CULTURE', isEssential: true, order: 2, icon: 'Book', color: '#228be6' },
      { id: 'sys-extra', name: 'EXTRA', isEssential: false, order: 3, icon: 'ShoppingCart', color: '#e03131' },
      { id: 'sys-unexpected', name: 'UNEXPECTED', isEssential: false, order: 4, icon: 'AlertCircle', color: '#fa5252' },
    ]

    const createdCategories = await Promise.all(
      systemCategories.map(cat => 
        prisma.kakeboCategory.upsert({
          where: { id: cat.id },
          create: {
            id: cat.id,
            name: cat.name,
            type: CategoryType.SYSTEM,
            isEssential: cat.isEssential,
            order: cat.order,
            icon: cat.icon,
            color: cat.color,
          },
          update: {},
        })
      )
    )

    console.log(`✅ Создано ${createdCategories.length} системных категорий`)

    // 2. Перенести все записи
    console.log('\n📝 Перенос записей в новые категории...')
    
    const entries = await prisma.kakeboEntry.findMany({
      select: {
        id: true,
        categoryOld: true,
        profileId: true,
        categoryId: true,
      }
    })

    const categoryMap: Record<string, string> = {
      'LIFE': 'sys-life',
      'CULTURE': 'sys-culture',
      'EXTRA': 'sys-extra',
      'UNEXPECTED': 'sys-unexpected',
    }

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const entry of entries) {
      try {
        // Если запись уже имеет categoryId - пропускаем
        if (entry.categoryId) {
          skippedCount++
          continue
        }

        const targetCategoryId = categoryMap[entry.categoryOld]
        
        if (!targetCategoryId) {
          console.warn(`⚠️  Неподдерживаемая категория для записи ${entry.id}: ${entry.categoryOld}`)
          errorCount++
          continue
        }

        await prisma.kakeboEntry.update({
          where: { id: entry.id },
          data: { categoryId: targetCategoryId },
        })

        migratedCount++
      } catch (error) {
        console.error(`❌ Ошибка при миграции записи ${entry.id}:`, error)
        errorCount++
      }
    }

    console.log(`✅ Мигрировано: ${migratedCount}`)
    console.log(`⏭️  Пропущено (уже мигрировано): ${skippedCount}`)
    console.log(`❌ Ошибок: ${errorCount}`)

    // 3. Проверить целостность
    console.log('\n🔍 Проверка целостности данных...')

    const entriesWithoutCategory = await prisma.kakeboEntry.count({
      where: { categoryId: null },
    })

    if (entriesWithoutCategory > 0) {
      console.warn(`⚠️  ВНИМАНИЕ: ${entriesWithoutCategory} записей без categoryId!`)
    } else {
      console.log('✅ Все записи имеют categoryId')
    }

    const totalEntries = await prisma.kakeboEntry.count()
    console.log(`📊 Всего записей: ${totalEntries}`)

    const categoryStats = await Promise.all(
      createdCategories.map(cat => 
        prisma.kakeboEntry.count({
          where: { categoryId: cat.id },
        }).then(count => ({
          category: cat.name,
          count,
        }))
      )
    )

    console.log('\n📈 Распределение по категориям:')
    categoryStats.forEach(stat => {
      console.log(`  - ${stat.category}: ${stat.count} записей`)
    })

    console.log('\n✅ Миграция завершена успешно!')

  } catch (error) {
    console.error('\n❌ Ошибка миграции:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Запуск
migrate()
  .then(() => {
    console.log('\n✨ Готово!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Критическая ошибка:', error)
    process.exit(1)
  })
