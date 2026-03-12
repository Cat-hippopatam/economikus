-- SQL скрипт для заполнения базы данных
-- Создание пользователей
INSERT INTO `user` (`id`, `email`, `firstName`, `lastName`, `passwordHash`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'demo@economikus.ru', 'Александр', 'Иванов', '$2a$10$example_hash_for_password123', 'USER', NOW(), NOW()),
(2, 'maria@economikus.ru', 'Мария', 'Петрова', '$2a$10$example_hash_for_password123', 'AUTHOR', NOW(), NOW());

-- Создание профилей пользователей
INSERT INTO `profile` (`id`, `userId`, `nickname`, `displayName`, `avatarUrl`, `coverImage`, `bio`, `website`, `telegram`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'alexivanov', 'Александр Иванов', '/images/avatars/default.jpg', '/images/covers/default.jpg', 'Интересуюсь инвестициями и финансовой грамотностью', 'https://example.com', '@alexivanov', NOW(), NOW()),
(2, 2, 'mariapetrova', 'Мария Петрова', '/images/avatars/maria.jpg', NULL, 'Финансовый консультант, автор курсов', NULL, NULL, NOW(), NOW());

-- Создание тегов
INSERT INTO `tag` (`id`, `name`, `slug`, `color`, `createdAt`, `updatedAt`) VALUES
(1, 'Инвестиции', 'investitsii', '#F4A261', NOW(), NOW()),
(2, 'Недвижимость', 'nedvizhimost', '#2A9D8F', NOW(), NOW()),
(3, 'Пенсия', 'pensiya', '#264653', NOW(), NOW()),
(4, 'Бюджет', 'byudzhet', '#E76F51', NOW(), NOW()),
(5, 'Криптовалюта', 'kriptovalyuta', '#9B59B6', NOW(), NOW());

-- Создание курсов
INSERT INTO `course` (`id`, `title`, `slug`, `description`, `coverImage`, `difficultyLevel`, `status`, `publishedAt`, `isPremium`, `authorProfileId`, `viewsCount`, `likesCount`, `lessonsCount`, `modulesCount`, `duration`, `createdAt`, `updatedAt`) VALUES
(1, 'Основы финансовой грамотности', 'osnovy-finansovoy-gramotnosti', 'Научитесь управлять личными финансами, составлять бюджет и планировать расходы', '/images/courses/finance-basics.jpg', 'BEGINNER', 'PUBLISHED', NOW(), 0, 1, 1250, 89, 0, 0, 0, NOW(), NOW()),
(2, 'Инвестиции для начинающих', 'investitsii-dlya-nachinayushchikh', 'Разберитесь в основах инвестирования: акции, облигации, ETF и диверсификация', '/images/courses/investing.jpg', 'BEGINNER', 'PUBLISHED', NOW(), 1, 2, 2340, 167, 0, 0, 0, NOW(), NOW()),
(3, 'Налоговая грамотность', 'nalogovaya-gramotnost', 'Как законно экономить на налогах, оформлять вычеты и подавать декларации', '/images/courses/taxes.jpg', 'INTERMEDIATE', 'PUBLISHED', NOW(), 1, 2, 890, 45, 0, 0, 0, NOW(), NOW());

-- Создание модулей
INSERT INTO `module` (`id`, `courseId`, `title`, `description`, `sortOrder`, `isPublished`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Введение в финансы', 'Базовые понятия', 0, 1, NOW(), NOW()),
(2, 1, 'Управление бюджетом', 'Как составить и контролировать бюджет', 1, 1, NOW(), NOW()),
(3, 1, 'Сбережения и инвестиции', 'Основы инвестирования', 2, 1, NOW(), NOW()),
(4, 2, 'Что такое инвестиции', 'Базовые понятия', 0, 1, NOW(), NOW()),
(5, 2, 'Акции и облигации', 'Виды ценных бумаг', 1, 1, NOW(), NOW()),
(6, 2, 'Диверсификация', 'Распределение рисков', 2, 1, NOW(), NOW()),
(7, 3, 'Основы налогообложения', 'Базовые понятия', 0, 1, NOW(), NOW()),
(8, 3, 'Налоговые вычеты', 'Как получить вычеты', 1, 1, NOW(), NOW());

-- Создание уроков
INSERT INTO `lesson` (`id`, `moduleId`, `title`, `slug`, `description`, `lessonType`, `sortOrder`, `authorProfileId`, `status`, `publishedAt`, `duration`, `viewsCount`, `likesCount`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Что такое финансовая грамотность', 'chto-takoe-finansovaya-gramotnost', 'Введение в тему', 'ARTICLE', 0, 1, 'PUBLISHED', NOW(), NULL, 450, 34, NOW(), NOW()),
(2, 1, 'Почему важно управлять деньгами', 'pochemu-vazhno-upravlyat-dengami', 'Мотивационное видео', 'VIDEO', 1, 1, 'PUBLISHED', NOW(), 600, 890, 67, NOW(), NOW()),
(3, 2, 'Как вести бюджет', 'kak-vesti-byudzhet', 'Методы ведения бюджета', 'ARTICLE', 0, 1, 'PUBLISHED', NOW(), NULL, NULL, NULL, NOW(), NOW()),
(4, 2, 'Правило 50/30/20', 'pravilo-50-30-20', 'Простое правило распределения бюджета', 'ARTICLE', 1, 1, 'PUBLISHED', NOW(), NULL, NULL, NULL, NOW(), NOW()),
(5, 3, 'Введение в инвестиции', 'vvedenie-v-investitsii', 'Первые шаги в инвестировании', 'ARTICLE', 0, 1, 'PUBLISHED', NOW(), NULL, NULL, NULL, NOW(), NOW()),
(6, NULL, '10 ошибок начинающего инвестора', '10-oshibok-nachinayushchego-investora', 'Частые ошибки и как их избежать', 'ARTICLE', 0, 2, 'PUBLISHED', NOW(), NULL, 1250, 98, NOW(), NOW());

-- Создание текстового контента для уроков
INSERT INTO `textContent` (`id`, `lessonId`, `body`, `wordCount`, `readingTime`, `createdAt`, `updatedAt`) VALUES
(1, 1, '<h1>Что такое финансовая грамотность</h1><p>Финансовая грамотность — это способность понимать и эффективно использовать различные финансовые навыки...</p>', 1200, 5, NOW(), NOW()),
(2, 3, '<h1>Как вести бюджет</h1><p>Существует несколько популярных методов ведения бюджета...</p>', 1500, 7, NOW(), NOW()),
(3, 4, '<h1>Правило 50/30/20</h1><p>Это простое правило помогает распределить доход...</p>', 800, 4, NOW(), NOW()),
(4, 5, '<h1>Введение в инвестиции</h1><p>Инвестиции — это размещение капитала с целью получения прибыли...</p>', 2000, 10, NOW(), NOW()),
(5, 6, '<h1>10 ошибок начинающего инвестора</h1><p>Инвестирование может быть сложным...</p>', 2500, 12, NOW(), NOW());

-- Создание видео контента для уроков
INSERT INTO `videoContent` (`id`, `lessonId`, `videoUrl`, `provider`, `duration`, `qualities`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'https://www.youtube.com/watch?v=example1', 'YOUTUBE', 600, '{"1080p": "https://example.com/video1_1080.mp4", "720p": "https://example.com/video1_720.mp4"}', NOW(), NOW());

-- Создание связей между уроками и тегами
INSERT INTO `lessonTag` (`lessonId`, `tagId`) VALUES
(1, 4), -- Бюджет
(3, 4), -- Бюджет
(4, 4), -- Бюджет
(5, 1), -- Инвестиции
(6, 1); -- Инвестиции

-- Создание связей между курсами и тегами
INSERT INTO `courseTag` (`courseId`, `tagId`) VALUES
(1, 4), -- Бюджет
(1, 1), -- Инвестиции
(2, 1), -- Инвестиции
(2, 5), -- Криптовалюта
(3, 3); -- Пенсия

-- Создание прогресса пользователя
INSERT INTO `courseProgress` (`id`, `profileId`, `courseId`, `status`, `progressPercent`, `completedLessons`, `totalLessons`, `startedAt`, `lastViewedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'in_progress', 60, 3, 5, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW(), NOW(), NOW());

-- Создание прогресса уроков
INSERT INTO `lessonProgress` (`id`, `profileId`, `lessonId`, `status`, `progressPercent`, `completedAt`, `lastPosition`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'completed', 100, DATE_SUB(NOW(), INTERVAL 7 DAY), NULL, NOW(), NOW()),
(2, 1, 2, 'completed', 100, DATE_SUB(NOW(), INTERVAL 5 DAY), NULL, NOW(), NOW()),
(3, 1, 3, 'in_progress', 50, NULL, 300, NOW(), NOW());

-- Создание истории просмотров
INSERT INTO `history` (`id`, `profileId`, `historableType`, `historableId`, `watchedSeconds`, `completed`, `viewedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'LESSON', 1, 600, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW(), NOW()),
(2, 1, 'LESSON', 2, 600, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW(), NOW()),
(3, 1, 'LESSON', 3, 180, 0, NOW(), NOW(), NOW()),
(4, 1, 'STANDALONE_ARTICLE', 6, 0, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), NOW());

-- Создание избранного
INSERT INTO `favorite` (`id`, `profileId`, `lessonId`, `note`, `collection`, `createdAt`, `updatedAt`) VALUES
(1, 1, 5, 'Важный урок про инвестиции', 'Инвестиции', NOW(), NOW()),
(2, 1, 6, NULL, 'Статьи', NOW(), NOW());

-- Создание комментариев
INSERT INTO `comment` (`id`, `commentableType`, `commentableId`, `authorProfileId`, `text`, `status`, `likesCount`, `createdAt`, `updatedAt`) VALUES
(1, 'LESSON', 1, 2, 'Отличный урок для начинающих! Всё понятно объяснено.', 'APPROVED', 5, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(2, 'COURSE', 1, 1, 'Жду продолжения курса! Очень полезно.', 'APPROVED', 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Создание реакций
INSERT INTO `reaction` (`id`, `type`, `profileId`, `reactionableType`, `reactionableId`, `createdAt`, `updatedAt`) VALUES
(1, 'LIKE', 1, 'LESSON', 1, NOW(), NOW()),
(2, 'LIKE', 1, 'COURSE', 1, NOW(), NOW()),
(3, 'LIKE', 1, 'COMMENT', 1, NOW(), NOW());

-- Создание подписок
INSERT INTO `subscription` (`id`, `profileId`, `status`, `startDate`, `endDate`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW());

-- Создание транзакций
INSERT INTO `transaction` (`id`, `profileId`, `amount`, `currency`, `status`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1000, 'RUB', 'COMPLETED', 'Оплата курса', NOW(), NOW()),
(2, 1, 500, 'RUB', 'COMPLETED', 'Подписка', NOW(), NOW());