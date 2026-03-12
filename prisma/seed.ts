// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Создаем PrismaClient с минимальной конфигурацией
const prisma = new PrismaClient({})

async function main() {
  console.log('🌱 Starting seed for MySQL...')
  console.log('📦 Using database from .env')

  try {
    // ============================================
    // 1. Очистка существующих данных (для MySQL)
    // ============================================
    console.log('🧹 Cleaning existing data...')
    
    // Отключаем проверку внешних ключей
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`
    
    // Получаем список всех таблиц
    const tables = await prisma.$queryRaw<Array<{TABLE_NAME: string}>>`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `
    
    // Очищаем каждую таблицу (кроме _prisma_migrations)
    for (const { TABLE_NAME } of tables) {
      if (TABLE_NAME !== '_prisma_migrations') {
        try {
          await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${TABLE_NAME}\`;`)
          console.log(`  ✅ Truncated ${TABLE_NAME}`)
        } catch {
          console.log(`  ⚠️ Could not truncate ${TABLE_NAME}, trying DELETE...`)
          try {
            await prisma.$executeRawUnsafe(`DELETE FROM \`${TABLE_NAME}\`;`)
            console.log(`  ✅ Deleted all from ${TABLE_NAME}`)
          } catch {
            console.log(`  ❌ Failed to clear ${TABLE_NAME}`)
          }
        }
      }
    }
    
    // Включаем обратно проверку внешних ключей
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`
    
    console.log('✅ Cleaned existing data')

    // ============================================
    // 2. Создание пользователя и профиля
    // ============================================
    const passwordHash = await bcrypt.hash('password123', 10)
    
    const user = await prisma.user.create({
      data: {
        email: 'demo@economikus.ru',
        firstName: 'Александр',
        lastName: 'Иванов',
        passwordHash,
        role: Role.USER,
        profile: {
          create: {
            nickname: 'alexivanov',
            displayName: 'Александр Иванов',
            avatarUrl: '/images/avatars/default.jpg',
            coverImage: '/images/covers/default.jpg',
            bio: 'Интересуюсь инвестициями и финансовой грамотностью',
            website: 'https://example.com',
            telegram: '@alexivanov',
          }
        }
      },
      include: {
        profile: true
      }
    })
    console.log(`✅ Created user: ${user.email} (password: password123)`)

    // Создаем еще одного пользователя для тестов
    const user2 = await prisma.user.create({
      data: {
        email: 'maria@economikus.ru',
        firstName: 'Мария',
        lastName: 'Петрова',
        passwordHash,
        role: Role.AUTHOR,
        profile: {
          create: {
            nickname: 'mariapetrova',
            displayName: 'Мария Петрова',
            avatarUrl: '/images/avatars/maria.jpg',
            bio: 'Финансовый консультант, автор курсов',
          }
        }
      },
      include: {
        profile: true
      }
    })

    // ... (весь остальной код создания данных без изменений)
    // Продолжайте с того места, где у вас создаются теги, курсы и т.д.
    
    // ============================================
    // 3. Создание тегов
    // ============================================
    const tags = await Promise.all([
      prisma.tag.create({ data: { name: 'Инвестиции', slug: 'investitsii', color: '#F4A261' } }),
      prisma.tag.create({ data: { name: 'Недвижимость', slug: 'nedvizhimost', color: '#2A9D8F' } }),
      prisma.tag.create({ data: { name: 'Пенсия', slug: 'pensiya', color: '#264653' } }),
      prisma.tag.create({ data: { name: 'Бюджет', slug: 'byudzhet', color: '#E76F51' } }),
      prisma.tag.create({ data: { name: 'Криптовалюта', slug: 'kriptovalyuta', color: '#9B59B6' } }),
    ])
    console.log(`✅ Created ${tags.length} tags`)

    // ============================================
    // 4. Создание курсов
    // ============================================
    const course1 = await prisma.course.create({
      data: {
        title: 'Основы финансовой грамотности',
        slug: 'osnovy-finansovoy-gramotnosti',
        description: 'Научитесь управлять личными финансами, составлять бюджет и планировать расходы',
        coverImage: '/images/courses/finance-basics.jpg',
        difficultyLevel: DifficultyLevel.BEGINNER,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        isPremium: false,
        authorProfileId: user.profile!.id,
        viewsCount: 1250,
        likesCount: 89,
      }
    })

    const course2 = await prisma.course.create({
      data: {
        title: 'Инвестиции для начинающих',
        slug: 'investitsii-dlya-nachinayushchikh',
        description: 'Разберитесь в основах инвестирования: акции, облигации, ETF и диверсификация',
        coverImage: '/images/courses/investing.jpg',
        difficultyLevel: DifficultyLevel.BEGINNER,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        isPremium: true,
        authorProfileId: user2.profile!.id,
        viewsCount: 2340,
        likesCount: 167,
      }
    })

    const course3 = await prisma.course.create({
      data: {
        title: 'Налоговая грамотность',
        slug: 'nalogovaya-gramotnost',
        description: 'Как законно экономить на налогах, оформлять вычеты и подавать декларации',
        coverImage: '/images/courses/taxes.jpg',
        difficultyLevel: DifficultyLevel.INTERMEDIATE,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        isPremium: true,
        authorProfileId: user2.profile!.id,
        viewsCount: 890,
        likesCount: 45,
      }
    })

    // Добавляем теги к курсам
    await prisma.courseTag.createMany({
      data: [
        { courseId: course1.id, tagId: tags[3].id }, // Бюджет
        { courseId: course1.id, tagId: tags[0].id }, // Инвестиции
        { courseId: course2.id, tagId: tags[0].id }, // Инвестиции
        { courseId: course2.id, tagId: tags[4].id }, // Криптовалюта
        { courseId: course3.id, tagId: tags[2].id }, // Пенсия
      ]
    })
    console.log(`✅ Created ${3} courses with tags`)

    // ============================================
    // 5. Создание модулей
    // ============================================
    const modules = await Promise.all([
      // Course 1 modules
      prisma.module.create({ data: { courseId: course1.id, title: 'Введение в финансы', description: 'Базовые понятия', sortOrder: 0, isPublished: true } }),
      prisma.module.create({ data: { courseId: course1.id, title: 'Управление бюджетом', description: 'Как составить и контролировать бюджет', sortOrder: 1, isPublished: true } }),
      prisma.module.create({ data: { courseId: course1.id, title: 'Сбережения и инвестиции', description: 'Основы инвестирования', sortOrder: 2, isPublished: true } }),
      // Course 2 modules
      prisma.module.create({ data: { courseId: course2.id, title: 'Что такое инвестиции', description: 'Базовые понятия', sortOrder: 0, isPublished: true } }),
      prisma.module.create({ data: { courseId: course2.id, title: 'Акции и облигации', description: 'Виды ценных бумаг', sortOrder: 1, isPublished: true } }),
      prisma.module.create({ data: { courseId: course2.id, title: 'Диверсификация', description: 'Распределение рисков', sortOrder: 2, isPublished: true } }),
      // Course 3 modules
      prisma.module.create({ data: { courseId: course3.id, title: 'Основы налогообложения', description: 'Базовые понятия', sortOrder: 0, isPublished: true } }),
      prisma.module.create({ data: { courseId: course3.id, title: 'Налоговые вычеты', description: 'Как получить вычеты', sortOrder: 1, isPublished: true } }),
    ])
    console.log(`✅ Created ${modules.length} modules`)

    // ============================================
    // 6. Создание уроков
    // ============================================
    
    // Уроки для курса 1 (финансовая грамотность)
    const lesson1 = await prisma.lesson.create({
      data: {
        moduleId: modules[0].id,
        title: 'Что такое финансовая грамотность',
        slug: 'chto-takoe-finansovaya-gramotnost',
        description: 'Введение в тему',
        lessonType: LessonType.ARTICLE,
        sortOrder: 0,
        authorProfileId: user.profile!.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        viewsCount: 450,
        likesCount: 34,
        textContent: {
          create: {
            body: '<h1>Что такое финансовая грамотность</h1><p>Финансовая грамотность — это способность понимать и эффективно использовать различные финансовые навыки...</p>',
            wordCount: 1200,
            readingTime: 5
          }
        }
      }
    })

    const lesson2 = await prisma.lesson.create({
      data: {
        moduleId: modules[0].id,
        title: 'Почему важно управлять деньгами',
        slug: 'pochemu-vazhno-upravlyat-dengami',
        description: 'Мотивационное видео',
        lessonType: LessonType.VIDEO,
        sortOrder: 1,
        authorProfileId: user.profile!.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        duration: 600,
        viewsCount: 890,
        likesCount: 67,
        videoContent: {
          create: {
            videoUrl: 'https://www.youtube.com/watch?v=example1',
            provider: VideoProvider.YOUTUBE,
            duration: 600,
            qualities: { "1080p": "https://example.com/video1_1080.mp4", "720p": "https://example.com/video1_720.mp4" }
          }
        }
      }
    })

    const lesson3 = await prisma.lesson.create({
      data: {
        moduleId: modules[1].id,
        title: 'Как вести бюджет',
        slug: 'kak-vesti-byudzhet',
        description: 'Методы ведения бюджета',
        lessonType: LessonType.ARTICLE,
        sortOrder: 0,
        authorProfileId: user.profile!.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        textContent: {
          create: {
            body: '<h1>Как вести бюджет</h1><p>Существует несколько популярных методов ведения бюджета...</p>',
            wordCount: 1500,
            readingTime: 7
          }
        }
      }
    })

    const lesson4 = await prisma.lesson.create({
      data: {
        moduleId: modules[1].id,
        title: 'Правило 50/30/20',
        slug: 'pravilo-50-30-20',
        description: 'Простое правило распределения бюджета',
        lessonType: LessonType.ARTICLE,
        sortOrder: 1,
        authorProfileId: user.profile!.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        textContent: {
          create: {
            body: '<h1>Правило 50/30/20</h1><p>Это простое правило помогает распределить доход...</p>',
            wordCount: 800,
            readingTime: 4
          }
        }
      }
    })

    const lesson5 = await prisma.lesson.create({
      data: {
        moduleId: modules[2].id,
        title: 'Введение в инвестиции',
        slug: 'vvedenie-v-investitsii',
        description: 'Первые шаги в инвестировании',
        lessonType: LessonType.ARTICLE,
        sortOrder: 0,
        authorProfileId: user.profile!.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        textContent: {
          create: {
            body: '<h1>Введение в инвестиции</h1><p>Инвестиции — это размещение капитала с целью получения прибыли...</p>',
            wordCount: 2000,
            readingTime: 10
          }
        }
      }
    })

    // Самостоятельная статья (не в курсе)
    const standaloneArticle = await prisma.lesson.create({
      data: {
        moduleId: null, // самостоятельная
        title: '10 ошибок начинающего инвестора',
        slug: '10-oshibok-nachinayushchego-investora',
        description: 'Частые ошибки и как их избежать',
        lessonType: LessonType.ARTICLE,
        authorProfileId: user2.profile!.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        viewsCount: 1250,
        likesCount: 98,
        textContent: {
          create: {
            body: '<h1>10 ошибок начинающего инвестора</h1><p>Инвестирование может быть сложным...</p>',
            wordCount: 2500,
            readingTime: 12
          }
        }
      }
    })

    // Добавляем теги к урокам
    await prisma.lessonTag.createMany({
      data: [
        { lessonId: lesson1.id, tagId: tags[3].id }, // Бюджет
        { lessonId: lesson3.id, tagId: tags[3].id }, // Бюджет
        { lessonId: lesson4.id, tagId: tags[3].id }, // Бюджет
        { lessonId: lesson5.id, tagId: tags[0].id }, // Инвестиции
        { lessonId: standaloneArticle.id, tagId: tags[0].id }, // Инвестиции
      ]
    })
    console.log(`✅ Created lessons and standalone article`)

    // Обновляем счетчики в курсах
    await prisma.course.update({
      where: { id: course1.id },
      data: {
        lessonsCount: 5,
        modulesCount: 3,
        duration: 600 + (5 * 300)
      }
    })

    // ============================================
    // 7. Создание прогресса
    // ============================================
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15)

    await prisma.courseProgress.create({
      data: {
        profileId: user.profile!.id,
        courseId: course1.id,
        status: 'in_progress',
        progressPercent: 60,
        completedLessons: 3,
        totalLessons: 5,
        startedAt: lastMonth,
        lastViewedAt: now
      }
    })

    await prisma.lessonProgress.createMany({
      data: [
        {
          profileId: user.profile!.id,
          lessonId: lesson1.id,
          status: 'completed',
          progressPercent: 100,
          completedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          profileId: user.profile!.id,
          lessonId: lesson2.id,
          status: 'completed',
          progressPercent: 100,
          completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          profileId: user.profile!.id,
          lessonId: lesson3.id,
          status: 'in_progress',
          progressPercent: 50,
          lastPosition: 300
        }
      ]
    })

    // ============================================
    // 8. Создание истории просмотров
    // ============================================
    await prisma.history.createMany({
      data: [
        {
          profileId: user.profile!.id,
          historableType: HistorableType.LESSON,
          historableId: lesson1.id,
          watchedSeconds: 600,
          completed: true,
          viewedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          profileId: user.profile!.id,
          historableType: HistorableType.LESSON,
          historableId: lesson2.id,
          watchedSeconds: 600,
          completed: true,
          viewedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          profileId: user.profile!.id,
          historableType: HistorableType.LESSON,
          historableId: lesson3.id,
          watchedSeconds: 180,
          completed: false,
          viewedAt: now
        },
        {
          profileId: user.profile!.id,
          historableType: HistorableType.STANDALONE_ARTICLE,
          historableId: standaloneArticle.id,
          completed: false,
          viewedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    })

    // ============================================
    // 9. Создание избранного
    // ============================================
    await prisma.favorite.createMany({
      data: [
        {
          profileId: user.profile!.id,
          lessonId: lesson5.id,
          note: 'Важный урок про инвестиции',
          collection: 'Инвестиции'
        },
        {
          profileId: user.profile!.id,
          lessonId: standaloneArticle.id,
          collection: 'Статьи'
        }
      ]
    })

    // ============================================
    // 10. Создание комментариев
    // ============================================
    const comment1 = await prisma.comment.create({
      data: {
        commentableType: CommentableType.LESSON,
        commentableId: lesson1.id,
        authorProfileId: user2.profile!.id,
        text: 'Отличный урок для начинающих! Всё понятно объяснено.',
        status: ModerationStatus.APPROVED,
        likesCount: 5,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      }
    })

    await prisma.comment.create({
      data: {
        commentableType: CommentableType.COURSE,
        commentableId: course1.id,
        authorProfileId: user.profile!.id,
        text: 'Жду продолжения курса! Очень полезно.',
        status: ModerationStatus.APPROVED,
        likesCount: 3,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    })

    // ============================================
    // 11. Создание реакций (лайки)
    // ============================================
    await prisma.reaction.createMany({
      data: [
        {
          type: 'LIKE',
          profileId: user.profile!.id,
          reactionableType: ReactionableType.LESSON,
          reactionableId: lesson1.id
        },
        {
          type: 'LIKE',
          profileId: user.profile!.id,
          reactionableType: ReactionableType.COURSE,
          reactionableId: course1.id
        },
        {
          type: 'LIKE',
          profileId: user2.profile!.id,
          reactionableType: ReactionableType.COMMENT,
          reactionableId: comment1.id
        }
      ]
    })

    // ============================================
    // 12. Создание подписки
    // ============================================
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 11, 1)

    const subscription = await prisma.subscription.create({
      data: {
        profileId: user.profile!.id,
        planType: 'yearly',
        status: SubscriptionStatus.ACTIVE,
        startDate: startDate,
        endDate: endDate,
        autoRenew: true,
        price: 2490,
        currency: 'RUB',
        provider: 'yookassa',
        providerSubscriptionId: 'sub_demo_123456'
      }
    })

    // ============================================
    // 13. Создание транзакций
    // ============================================
    await prisma.transaction.createMany({
      data: [
        {
          profileId: user.profile!.id,
          subscriptionId: subscription.id,
          type: 'subscription',
          amount: 2490,
          currency: 'RUB',
          status: TransactionStatus.COMPLETED,
          provider: 'yookassa',
          providerPaymentId: 'pay_demo_001',
          completedAt: startDate,
          createdAt: startDate
        },
        {
          profileId: user.profile!.id,
          courseId: course2.id,
          type: 'one_time_purchase',
          amount: 1490,
          currency: 'RUB',
          status: TransactionStatus.COMPLETED,
          provider: 'yookassa',
          providerPaymentId: 'pay_demo_002',
          completedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        }
      ]
    })

    // ============================================
    // 14. Создание сертификата
    // ============================================
    await prisma.certificate.create({
      data: {
        profileId: user.profile!.id,
        courseId: course3.id,
        completedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        issuedAt: now,
        imageUrl: '/certificates/course3.png',
        pdfUrl: '/certificates/course3.pdf',
        certificateNumber: `CERT-${Date.now()}`,
        metadata: {
          studentName: user.profile!.displayName,
          courseName: course3.title,
          completionDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    })

    // ============================================
    // 15. Создание уведомления
    // ============================================
    await prisma.notification.create({
      data: {
        profileId: user.profile!.id,
        type: 'IN_APP',
        channel: 'in_app',
        title: 'Добро пожаловать!',
        body: 'Рады видеть вас на платформе Экономикус',
        isRead: false,
        data: {
          action: 'welcome',
          link: '/catalog'
        }
      }
    })

    // ============================================
    // Summary
    // ============================================
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                    🎉 SEED COMPLETED!                      ║
╠════════════════════════════════════════════════════════════╣
║  📊 Summary:                                               ║
║  ──────────────────────────────────────────────────────── ║
║  👤 Users:                   2                             ║
║  📚 Courses:                 3                             ║
║  📦 Modules:                 8                             ║
║  📖 Lessons:                 6 (including standalone)     ║
║  🏷️ Tags:                     5                             ║
║  💬 Comments:                2                             ║
║  ❤️ Reactions:                3                             ║
║  ⭐ Favorites:                2                             ║
║  📜 History:                 4                             ║
║  📊 Progress entries:        4                             ║
║  💳 Subscription:             1                             ║
║  💰 Transactions:            2                             ║
║  📄 Certificate:             1                             ║
║  🔔 Notifications:           1                             ║
╠════════════════════════════════════════════════════════════╣
║  🔑 Test credentials:                                      ║
║  ──────────────────────────────────────────────────────── ║
║  Email:    demo@economikus.ru                              ║
║  Password: password123                                     ║
║                                                            ║
║  Email:    maria@economikus.ru                             ║
║  Password: password123                                     ║
╚════════════════════════════════════════════════════════════╝
    `)

  } catch (error) {
    console.error('❌ Error during seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })