-- SQL скрипт для заполнения базы данных economikus
-- Используя UUID как в оригинальной структуре

-- Создание пользователей
INSERT INTO `user` (`user_id`, `email`, `first_name`, `last_name`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', 'demo@economikus.ru', 'Александр', 'Иванов', '$2a$10$example_hash_for_password123', 'USER', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'maria@economikus.ru', 'Мария', 'Петрова', '$2a$10$example_hash_for_password123', 'AUTHOR', NOW(), NOW());

-- Создание профилей пользователей
INSERT INTO `profile` (`profile_id`, `user_id`, `nickname`, `display_name`, `avatar_url`, `cover_image`, `bio`, `website`, `telegram`, `created_at`, `updated_at`) VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'alexivanov', 'Александр Иванов', '/images/avatars/default.jpg', '/images/covers/default.jpg', 'Интересуюсь инвестициями и финансовой грамотностью', 'https://example.com', '@alexivanov', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'mariapetrova', 'Мария Петрова', '/images/avatars/maria.jpg', NULL, 'Финансовый консультант, автор курсов', NULL, NULL, NOW(), NOW());

-- Создание тегов
INSERT INTO `tags` (`tag_id`, `name`, `slug`, `color`, `created_at`, `updated_at`) VALUES
('55555555-5555-5555-5555-555555555555', 'Инвестиции', 'investitsii', '#F4A261', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Недвижимость', 'nedvizhimost', '#2A9D8F', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Пенсия', 'pensiya', '#264653', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Бюджет', 'byudzhet', '#E76F51', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Криптовалюта', 'kriptovalyuta', '#9B59B6', NOW(), NOW());

-- Создание курсов
INSERT INTO `courses` (`course_id`, `title`, `slug`, `description`, `cover_image`, `difficulty_level`, `duration`, `lessons_count`, `modules_count`, `status`, `is_premium`, `published_at`, `author_profile_id`, `views_count`, `likes_count`, `created_at`, `updated_at`) VALUES
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Основы финансовой грамотности', 'osnovy-finansovoy-gramotnosti', 'Научитесь управлять личными финансами, составлять бюджет и планировать расходы', '/images/courses/finance-basics.jpg', 'BEGINNER', 600, 5, 3, 'PUBLISHED', 0, NOW(), '33333333-3333-3333-3333-333333333333', 1250, 89, NOW(), NOW()),
('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Инвестиции для начинающих', 'investitsii-dlya-nachinayushchikh', 'Разберитесь в основах инвестирования: акции, облигации, ETF и диверсификация', '/images/courses/investing.jpg', 'BEGINNER', 600, 5, 3, 'PUBLISHED', 1, NOW(), '44444444-4444-4444-4444-444444444444', 2340, 167, NOW(), NOW()),
('ccccccc3-cccc-cccc-cccc-cccccccccccc', 'Налоговая грамотность', 'nalogovaya-gramotnost', 'Как законно экономить на налогах, оформлять вычеты и подавать декларации', '/images/courses/taxes.jpg', 'INTERMEDIATE', 600, 5, 3, 'PUBLISHED', 1, NOW(), '44444444-4444-4444-4444-444444444444', 890, 45, NOW(), NOW());

-- Создание модулей
INSERT INTO `modules` (`module_id`, `course_id`, `title`, `description`, `sort_order`, `is_published`, `created_at`, `updated_at`) VALUES
('ddddddd1-dddd-dddd-dddd-dddddddddddd', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Введение в финансы', 'Базовые понятия', 0, 1, NOW(), NOW()),
('ddddddd2-dddd-dddd-dddd-ddddddddddde', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Управление бюджетом', 'Как составить и контролировать бюджет', 1, 1, NOW(), NOW()),
('ddddddd3-dddd-dddd-dddd-dddddddddddf', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Сбережения и инвестиции', 'Основы инвестирования', 2, 1, NOW(), NOW()),
('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Что такое инвестиции', 'Базовые понятия', 0, 1, NOW(), NOW()),
('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Акции и облигации', 'Виды ценных бумаг', 1, 1, NOW(), NOW()),
('eeeeeee3-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Диверсификация', 'Распределение рисков', 2, 1, NOW(), NOW()),
('ffffff1-ffff-ffff-ffff-ffffffffffff', 'ccccccc3-cccc-cccc-cccc-cccccccccccc', 'Основы налогообложения', 'Базовые понятия', 0, 1, NOW(), NOW()),
('ffffff2-ffff-ffff-ffff-ffffffffffff', 'ccccccc3-cccc-cccc-cccc-cccccccccccc', 'Налоговые вычеты', 'Как получить вычеты', 1, 1, NOW(), NOW());

-- Создание уроков
INSERT INTO `lessons` (`lesson_id`, `module_id`, `title`, `slug`, `description`, `lesson_type`, `sort_order`, `author_profile_id`, `status`, `published_at`, `duration`, `views_count`, `likes_count`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', 'ddddddd1-dddd-dddd-dddd-dddddddddddd', 'Что такое финансовая грамотность', 'chto-takoe-finansovaya-gramotnost', 'Введение в тему', 'ARTICLE', 0, '33333333-3333-3333-3333-333333333333', 'PUBLISHED', NOW(), NULL, 450, 34, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'ddddddd1-dddd-dddd-dddd-dddddddddddd', 'Почему важно управлять деньгами', 'pochemu-vazhno-upravlyat-dengami', 'Мотивационное видео', 'VIDEO', 1, '33333333-3333-3333-3333-333333333333', 'PUBLISHED', NOW(), 600, 890, 67, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'ddddddd2-dddd-dddd-dddd-ddddddddddde', 'Как вести бюджет', 'kak-vesti-byudzhet', 'Методы ведения бюджета', 'ARTICLE', 0, '33333333-3333-3333-3333-333333333333', 'PUBLISHED', NOW(), NULL, NULL, NULL, NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'ddddddd2-dddd-dddd-dddd-ddddddddddde', 'Правило 50/30/20', 'pravilo-50-30-20', 'Простое правило распределения бюджета', 'ARTICLE', 1, '33333333-3333-3333-3333-333333333333', 'PUBLISHED', NOW(), NULL, NULL, NULL, NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'ddddddd3-dddd-dddd-dddd-dddddddddddf', 'Введение в инвестиции', 'vvedenie-v-investitsii', 'Первые шаги в инвестировании', 'ARTICLE', 0, '33333333-3333-3333-3333-333333333333', 'PUBLISHED', NOW(), NULL, NULL, NULL, NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', NULL, '10 ошибок начинающего инвестора', '10-oshibok-nachinayushchego-investora', 'Частые ошибки и как их избежать', 'ARTICLE', 0, '44444444-4444-4444-4444-444444444444', 'PUBLISHED', NOW(), NULL, 1250, 98, NOW(), NOW());

-- Создание текстового контента для уроков
INSERT INTO `text_contents` (`text_content_id`, `lesson_id`, `body`, `word_count`, `reading_time`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '<h1>Что такое финансовая грамотность</h1><p>Финансовая грамотность — это способность понимать и эффективно использовать различные финансовые навыки...</p>', 1200, 5, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '<h1>Как вести бюджет</h1><p>Существует несколько популярных методов ведения бюджета...</p>', 1500, 7, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '<h1>Правило 50/30/20</h1><p>Это простое правило помогает распределить доход...</p>', 800, 4, NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '<h1>Введение в инвестиции</h1><p>Инвестиции — это размещение капитала с целью получения прибыли...</p>', 2000, 10, NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '<h1>10 ошибок начинающего инвестора</h1><p>Инвестирование может быть сложным...</p>', 2500, 12, NOW(), NOW());

-- Создание видео контента для уроков
INSERT INTO `video_contents` (`video_content_id`, `lesson_id`, `video_url`, `provider`, `duration`, `qualities`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'https://www.youtube.com/watch?v=example1', 'YOUTUBE', 600, '{"1080p": "https://example.com/video1_1080.mp4", "720p": "https://example.com/video1_720.mp4"}', NOW(), NOW());

-- Создание связей между уроками и тегами
INSERT INTO `lesson_tags` (`lesson_tag_id`, `lesson_id`, `tag_id`) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888'), -- Бюджет
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888'), -- Бюджет
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888'), -- Бюджет
('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555'), -- Инвестиции
('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555'); -- Инвестиции

-- Создание связей между курсами и тегами
INSERT INTO `course_tags` (`course_tag_id`, `course_id`, `tag_id`) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '88888888-8888-8888-8888-888888888888'), -- Бюджет
('22222222-2222-2222-2222-222222222222', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'), -- Инвестиции
('33333333-3333-3333-3333-333333333333', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555'), -- Инвестиции
('44444444-4444-4444-4444-444444444444', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '99999999-9999-9999-9999-999999999999'), -- Криптовалюта
('55555555-5555-5555-5555-555555555555', 'ccccccc3-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777'); -- Пенсия

-- Создание прогресса пользователя
INSERT INTO `course_progress` (`course_progress_id`, `profile_id`, `course_id`, `status`, `progress_percent`, `completed_lessons`, `total_lessons`, `started_at`, `completed_at`, `last_viewed_at`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_progress', 60, 3, 5, DATE_SUB(NOW(), INTERVAL 30 DAY), NULL, NOW(), NOW(), NOW());

-- Создание прогресса уроков
INSERT INTO `lesson_progress` (`lesson_progress_id`, `profile_id`, `lesson_id`, `status`, `progress_percent`, `completed_at`, `last_position`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'completed', 100, DATE_SUB(NOW(), INTERVAL 7 DAY), NULL, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'completed', 100, DATE_SUB(NOW(), INTERVAL 5 DAY), NULL, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'in_progress', 50, NULL, 300, NOW(), NOW());

-- Создание истории просмотров
INSERT INTO `history` (`history_id`, `profile_id`, `historable_type`, `historable_id`, `watched_seconds`, `completed`, `viewed_at`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'LESSON', '11111111-1111-1111-1111-111111111111', 600, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'LESSON', '22222222-2222-2222-2222-222222222222', 600, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'LESSON', '33333333-3333-3333-3333-333333333333', 180, 0, NOW(), NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'STANDALONE_ARTICLE', '66666666-6666-6666-6666-666666666666', 0, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), NOW());

-- Создание избранного
INSERT INTO `favorites` (`favorite_id`, `profile_id`, `lesson_id`, `note`, `collection`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Важный урок про инвестиции', 'Инвестиции', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', NULL, 'Статьи', NOW(), NOW());

-- Создание комментариев
INSERT INTO `comments` (`comment_id`, `commentable_type`, `commentable_id`, `author_profile_id`, `text`, `status`, `moderated_by`, `moderated_at`, `likes_count`, `created_at`, `updated_at`, `deleted_at`) VALUES
('11111111-1111-1111-1111-111111111111', 'LESSON', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Отличный урок для начинающих! Всё понятно объяснено.', 'APPROVED', NULL, NULL, 5, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW(), NULL),
('22222222-2222-2222-2222-222222222222', 'COURSE', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Жду продолжения курса! Очень полезно.', 'APPROVED', NULL, NULL, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), NULL);

-- Создание реакций
INSERT INTO `reactions` (`reaction_id`, `type`, `profile_id`, `reactionable_type`, `reactionable_id`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', 'LIKE', '33333333-3333-3333-3333-333333333333', 'LESSON', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'LIKE', '33333333-3333-3333-3333-333333333333', 'COURSE', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'LIKE', '33333333-3333-3333-3333-333333333333', 'COMMENT', '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- Создание подписок
INSERT INTO `subscriptions` (`subscription_id`, `profile_id`, `status`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW());

-- Создание транзакций
INSERT INTO `transactions` (`transaction_id`, `profile_id`, `amount`, `currency`, `status`, `description`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 1000, 'RUB', 'COMPLETED', 'Оплата курса', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 500, 'RUB', 'COMPLETED', 'Подписка', NOW(), NOW());