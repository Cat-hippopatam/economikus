-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.0
-- Время создания: Мар 16 2026 г., 17:05
-- Версия сервера: 8.0.41
-- Версия PHP: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `economikus`
--

-- --------------------------------------------------------

--
-- Структура таблицы `accounts`
--

CREATE TABLE `accounts` (
  `account_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` text COLLATE utf8mb4_unicode_ci,
  `access_token` text COLLATE utf8mb4_unicode_ci,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` text COLLATE utf8mb4_unicode_ci,
  `session_state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `accounts`
--

INSERT INTO `accounts` (`account_id`, `user_id`, `type`, `provider`, `provider_account_id`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`, `created_at`, `updated_at`) VALUES
('uu0e8400-e29b-41d4-a716-446655441901', '550e8400-e29b-41d4-a716-446655440003', 'oauth', 'google', 'google_12345', NULL, 'ya29.a0AfH6SMBx...', 1710850000, 'Bearer', 'email profile', NULL, NULL, '2026-02-01 09:15:00.000', '2026-03-13 11:16:28.354'),
('uu0e8400-e29b-41d4-a716-446655441902', '550e8400-e29b-41d4-a716-446655440004', 'oauth', 'vk', 'vk_67890', NULL, 'vk_token_xyz...', 1710900000, 'Bearer', 'email', NULL, NULL, '2026-02-10 14:20:00.000', '2026-03-13 11:16:28.354');

-- --------------------------------------------------------

--
-- Структура таблицы `audio_contents`
--

CREATE TABLE `audio_contents` (
  `audio_content_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `audio_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `audio_contents`
--

INSERT INTO `audio_contents` (`audio_content_id`, `lesson_id`, `audio_url`, `duration`, `created_at`, `updated_at`) VALUES
('dd0e8400-e29b-41d4-a716-446655440801', 'aa0e8400-e29b-41d4-a716-446655440502', 'https://cdn.economikus.ru/audio/inflation_podcast.mp3', 480, '2026-01-20 10:05:00.000', '2026-03-13 11:16:27.657');

-- --------------------------------------------------------

--
-- Структура таблицы `Authenticator`
--

CREATE TABLE `Authenticator` (
  `credentialID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `credentialPublicKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `counter` int NOT NULL,
  `credentialDeviceType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `credentialBackedUp` tinyint(1) NOT NULL,
  `transports` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `business_events`
--

CREATE TABLE `business_events` (
  `event_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `object_type` enum('COURSE','LESSON','COMMENT','SUBSCRIPTION') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `object_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `business_events`
--

INSERT INTO `business_events` (`event_id`, `profile_id`, `event_type`, `event_category`, `object_type`, `object_id`, `metadata`, `ip_address`, `user_agent`, `session_id`, `created_at`) VALUES
('ss0e8400-e29b-41d4-a716-446655441701', '660e8400-e29b-41d4-a716-446655440103', 'lesson_started', 'engagement', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440501', '{\"source\": \"course_page\"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NULL, '2026-03-01 10:05:00.000'),
('ss0e8400-e29b-41d4-a716-446655441702', '660e8400-e29b-41d4-a716-446655440104', 'subscription_purchased', 'monetization', 'SUBSCRIPTION', 'oo0e8400-e29b-41d4-a716-446655441301', '{\"plan\": \"premium_monthly\", \"promo\": null}', '192.168.1.105', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', NULL, '2026-02-15 10:00:00.000'),
('ss0e8400-e29b-41d4-a716-446655441703', '660e8400-e29b-41d4-a716-446655440103', 'certificate_issued', 'achievement', 'COURSE', '880e8400-e29b-41d4-a716-446655440304', '{\"score\": 92}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NULL, '2026-03-10 18:45:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `certificates`
--

CREATE TABLE `certificates` (
  `certificate_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issued_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completed_at` datetime(3) NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `pdf_url` text COLLATE utf8mb4_unicode_ci,
  `certificate_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `certificates`
--

INSERT INTO `certificates` (`certificate_id`, `profile_id`, `course_id`, `issued_at`, `completed_at`, `image_url`, `pdf_url`, `certificate_number`, `metadata`) VALUES
('qq0e8400-e29b-41d4-a716-446655441501', '660e8400-e29b-41d4-a716-446655440103', '880e8400-e29b-41d4-a716-446655440304', '2026-03-10 18:45:00.000', '2026-03-10 18:45:00.000', 'https://cdn.economikus.ru/certs/img_0001.png', 'https://cdn.economikus.ru/certs/pdf_0001.pdf', 'CERT-2026-0001', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `comment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentable_type` enum('COURSE','LESSON') COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentable_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `moderated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moderated_at` datetime(3) DEFAULT NULL,
  `likes_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `comments`
--

INSERT INTO `comments` (`comment_id`, `commentable_type`, `commentable_id`, `author_profile_id`, `text`, `status`, `moderated_by`, `moderated_at`, `likes_count`, `created_at`, `updated_at`, `deleted_at`) VALUES
('3d68d91e-4c67-4693-988a-aeb3fb818fbb', 'COURSE', '880e8400-e29b-41d4-a716-446655440302', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'Updated test comment', 'APPROVED', NULL, NULL, 0, '2026-03-15 13:24:36.977', '2026-03-15 13:24:37.044', '2026-03-15 13:24:37.042'),
('5ff60681-0712-4196-85b7-89fe14f1f66a', 'COURSE', '880e8400-e29b-41d4-a716-446655440302', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'Updated test comment', 'APPROVED', NULL, NULL, 0, '2026-03-15 13:42:51.511', '2026-03-15 13:42:51.593', '2026-03-15 13:42:51.591'),
('7b27da36-b333-4fe7-a75e-de8127672ee0', 'COURSE', '880e8400-e29b-41d4-a716-446655440302', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'Updated test comment', 'APPROVED', NULL, NULL, 0, '2026-03-15 13:35:20.710', '2026-03-15 13:35:20.762', '2026-03-15 13:35:20.761'),
('9d41209c-9deb-45dc-aa2d-ce36f52b4b80', 'COURSE', '880e8400-e29b-41d4-a716-446655440302', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'Updated test comment', 'APPROVED', NULL, NULL, 0, '2026-03-15 13:30:11.164', '2026-03-15 13:30:11.215', '2026-03-15 13:30:11.214'),
('kk0e8400-e29b-41d4-a716-446655440f01', 'COURSE', '880e8400-e29b-41d4-a716-446655440301', '660e8400-e29b-41d4-a716-446655440103', 'Отличный курс! Всё понятно и по делу, особенно понравился модуль про инфляцию.', 'APPROVED', NULL, NULL, 12, '2026-03-05 14:00:00.000', '2026-03-13 11:16:27.940', NULL),
('kk0e8400-e29b-41d4-a716-446655440f02', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440501', '660e8400-e29b-41d4-a716-446655440104', 'Можно ли добавить примеры расчёта ВВП по расходам?', 'APPROVED', NULL, NULL, 5, '2026-03-06 10:30:00.000', '2026-03-13 11:16:27.940', NULL),
('kk0e8400-e29b-41d4-a716-446655440f03', 'COURSE', '880e8400-e29b-41d4-a716-446655440302', '660e8400-e29b-41d4-a716-446655440104', 'Жду продолжение про технические индикаторы! 📈', 'APPROVED', NULL, NULL, 23, '2026-03-08 16:45:00.000', '2026-03-13 11:16:27.940', NULL),
('kk0e8400-e29b-41d4-a716-446655440f04', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440505', '660e8400-e29b-41d4-a716-446655440103', 'Спасибо за наглядные графики риска и доходности!', 'APPROVED', NULL, NULL, 8, '2026-03-10 11:20:00.000', '2026-03-13 11:16:27.940', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `courses`
--

CREATE TABLE `courses` (
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cover_image` text COLLATE utf8mb4_unicode_ci,
  `difficulty_level` enum('BEGINNER','INTERMEDIATE','ADVANCED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `lessons_count` int NOT NULL DEFAULT '0',
  `modules_count` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PENDING_REVIEW','PUBLISHED','ARCHIVED','DELETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime(3) DEFAULT NULL,
  `author_profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `views_count` int NOT NULL DEFAULT '0',
  `likes_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `courses`
--

INSERT INTO `courses` (`course_id`, `title`, `slug`, `description`, `cover_image`, `difficulty_level`, `duration`, `lessons_count`, `modules_count`, `status`, `is_premium`, `published_at`, `author_profile_id`, `views_count`, `likes_count`, `created_at`, `updated_at`, `deleted_at`) VALUES
('76703931-c58a-4c39-8e15-2437058bbc90', 'test3', 'test33', 'sdfdwsfsdf', '', 'INTERMEDIATE', 1200, 0, 0, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 0, '2026-03-16 12:33:46.043', '2026-03-16 12:35:10.314', NULL),
('880e8400-e29b-41d4-a716-446655440301', 'Основы макроэкономики', 'macroeconomics-basics', 'Полный курс по макроэкономике: ВВП, инфляция, безработица, денежно-кредитная политика', 'https://cdn.economikus.ru/covers/macro-basics.jpg', 'BEGINNER', 180, 12, 3, 'PUBLISHED', 0, '2026-01-20 10:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 8420, 342, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.420', NULL),
('880e8400-e29b-41d4-a716-446655440302', 'Инвестиции для начинающих', 'investments-for-beginners', 'Научитесь формировать портфель, оценивать риски и выбирать инструменты', 'https://cdn.economikus.ru/covers/invest-begin.jpg', 'BEGINNER', 240, 15, 4, 'PUBLISHED', 1, '2026-02-01 12:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 12565, 891, '2026-02-01 12:00:00.000', '2026-03-15 13:42:51.637', NULL),
('880e8400-e29b-41d4-a716-446655440303', 'Финансовый учёт в 1С', 'accounting-1c-basics', 'Практический курс по ведению бухгалтерии в 1С:Предприятие', 'https://cdn.economikus.ru/covers/1c-accounting.jpg', 'INTERMEDIATE', 300, 20, 5, 'PUBLISHED', 1, '2026-01-10 09:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 5230, 267, '2026-01-10 09:00:00.000', '2026-03-13 11:16:27.420', NULL),
('880e8400-e29b-41d4-a716-446655440304', 'Криптовалюты и блокчейн', 'crypto-blockchain-intro', 'Разбираемся в технологии блокчейн, биткоине и альткоинах', 'https://cdn.economikus.ru/covers/crypto-intro.jpg', 'INTERMEDIATE', 150, 10, 3, 'PUBLISHED', 0, '2026-02-15 14:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 18920, 1205, '2026-02-15 14:00:00.000', '2026-03-15 16:43:50.335', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `course_progress`
--

CREATE TABLE `course_progress` (
  `course_progress_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `progress_percent` int NOT NULL DEFAULT '0',
  `completed_lessons` int NOT NULL DEFAULT '0',
  `total_lessons` int NOT NULL DEFAULT '0',
  `started_at` datetime(3) DEFAULT NULL,
  `completed_at` datetime(3) DEFAULT NULL,
  `last_viewed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `course_progress`
--

INSERT INTO `course_progress` (`course_progress_id`, `profile_id`, `course_id`, `status`, `progress_percent`, `completed_lessons`, `total_lessons`, `started_at`, `completed_at`, `last_viewed_at`) VALUES
('hh0e8400-e29b-41d4-a716-446655440c01', '660e8400-e29b-41d4-a716-446655440103', '880e8400-e29b-41d4-a716-446655440301', 'in_progress', 33, 4, 12, '2026-03-01 10:00:00.000', NULL, '2026-03-12 10:00:00.000'),
('hh0e8400-e29b-41d4-a716-446655440c02', '660e8400-e29b-41d4-a716-446655440104', '880e8400-e29b-41d4-a716-446655440302', 'in_progress', 60, 9, 15, '2026-02-20 14:30:00.000', NULL, '2026-03-12 14:30:00.000'),
('hh0e8400-e29b-41d4-a716-446655440c03', '660e8400-e29b-41d4-a716-446655440103', '880e8400-e29b-41d4-a716-446655440304', 'completed', 100, 10, 10, '2026-02-25 09:00:00.000', '2026-03-10 18:45:00.000', '2026-03-10 18:45:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `course_tags`
--

CREATE TABLE `course_tags` (
  `course_tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `course_tags`
--

INSERT INTO `course_tags` (`course_tag_id`, `course_id`, `tag_id`) VALUES
('9c23fc1f-c169-4465-8545-e98fe02111c2', '76703931-c58a-4c39-8e15-2437058bbc90', '5a002291-8414-4755-9e06-e8d308a9ea08'),
('ff0e8400-e29b-41d4-a716-446655440a01', '880e8400-e29b-41d4-a716-446655440301', '770e8400-e29b-41d4-a716-446655440201'),
('ff0e8400-e29b-41d4-a716-446655440a02', '880e8400-e29b-41d4-a716-446655440302', '770e8400-e29b-41d4-a716-446655440202'),
('ff0e8400-e29b-41d4-a716-446655440a03', '880e8400-e29b-41d4-a716-446655440302', '770e8400-e29b-41d4-a716-446655440203'),
('ff0e8400-e29b-41d4-a716-446655440a04', '880e8400-e29b-41d4-a716-446655440303', '770e8400-e29b-41d4-a716-446655440204'),
('85de2b8d-41cf-4b8b-95d1-3628a8c654a0', '880e8400-e29b-41d4-a716-446655440304', '770e8400-e29b-41d4-a716-446655440202'),
('6c2e55d8-3f2c-4c23-a68d-51dfc13a70ba', '880e8400-e29b-41d4-a716-446655440304', '770e8400-e29b-41d4-a716-446655440205');

-- --------------------------------------------------------

--
-- Структура таблицы `favorites`
--

CREATE TABLE `favorites` (
  `favorite_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `collection` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `favorites`
--

INSERT INTO `favorites` (`favorite_id`, `profile_id`, `lesson_id`, `note`, `collection`, `created_at`) VALUES
('mm0e8400-e29b-41d4-a716-446655441101', '660e8400-e29b-41d4-a716-446655440104', 'aa0e8400-e29b-41d4-a716-446655440505', 'Важно пересмотреть перед инвестициями', 'Инвестиции', '2026-02-20 15:25:00.000'),
('mm0e8400-e29b-41d4-a716-446655441102', '660e8400-e29b-41d4-a716-446655440104', 'aa0e8400-e29b-41d4-a716-446655440507', 'Калькулятор сложного процента — супер!', 'Инструменты', '2026-02-21 09:00:00.000'),
('mm0e8400-e29b-41d4-a716-446655441103', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440501', 'База для экзамена', 'Учёба', '2026-03-01 10:25:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `history`
--

CREATE TABLE `history` (
  `history_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `historable_type` enum('LESSON','STANDALONE_ARTICLE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `historable_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `watched_seconds` int DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `viewed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `history`
--

INSERT INTO `history` (`history_id`, `profile_id`, `historable_type`, `historable_id`, `watched_seconds`, `completed`, `viewed_at`) VALUES
('af9a0820-4b44-4f7a-8b3e-70f271150645', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440506', 120, 0, '2026-03-15 13:42:51.204'),
('jj0e8400-e29b-41d4-a716-446655440e01', '660e8400-e29b-41d4-a716-446655440103', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440501', 720, 1, '2026-03-01 10:18:00.000'),
('jj0e8400-e29b-41d4-a716-446655440e02', '660e8400-e29b-41d4-a716-446655440103', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440502', 480, 1, '2026-03-01 10:28:00.000'),
('jj0e8400-e29b-41d4-a716-446655440e03', '660e8400-e29b-41d4-a716-446655440104', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440505', 840, 1, '2026-02-20 15:15:00.000'),
('jj0e8400-e29b-41d4-a716-446655440e04', '660e8400-e29b-41d4-a716-446655440104', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440506', 320, 0, '2026-03-12 16:00:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `lesson_type` enum('ARTICLE','VIDEO','AUDIO','QUIZ','CALCULATOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ARTICLE',
  `sort_order` int NOT NULL DEFAULT '0',
  `duration` int DEFAULT NULL,
  `cover_image` text COLLATE utf8mb4_unicode_ci,
  `author_profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PENDING_REVIEW','PUBLISHED','ARCHIVED','DELETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `published_at` datetime(3) DEFAULT NULL,
  `views_count` int NOT NULL DEFAULT '0',
  `likes_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `module_id`, `title`, `slug`, `description`, `lesson_type`, `sort_order`, `duration`, `cover_image`, `author_profile_id`, `is_premium`, `status`, `published_at`, `views_count`, `likes_count`, `created_at`, `updated_at`, `deleted_at`) VALUES
('49a7f4c8-b3ee-46c3-aa2b-161aed782b38', NULL, 'test', 'test-3', 'ntfcn', 'ARTICLE', 6, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'DRAFT', NULL, 0, 0, '2026-03-16 12:29:59.826', '2026-03-16 12:34:26.177', NULL),
('6ba66361-e85a-4ffd-9cf1-9d6b25d09809', NULL, 'test', 'test-2', 'ntfcn', 'ARTICLE', 5, 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'DRAFT', NULL, 0, 0, '2026-03-16 12:29:52.456', '2026-03-16 12:29:52.456', NULL),
('aa0e8400-e29b-41d4-a716-446655440501', '990e8400-e29b-41d4-a716-446655440401', 'Что такое ВВП?', 'what-is-gdp', 'Разбираем понятие валового внутреннего продукта', 'VIDEO', 1, 12, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:00:00.000', 3420, 156, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440502', '990e8400-e29b-41d4-a716-446655440401', 'Инфляция: виды и измерение', 'inflation-types', 'Как считают инфляцию и почему она важна', 'ARTICLE', 2, 8, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:05:00.000', 2890, 134, '2026-01-20 10:05:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440503', '990e8400-e29b-41d4-a716-446655440401', 'Уровень безработицы', 'unemployment-rate', 'Типы безработицы и методы расчёта', 'QUIZ', 3, 10, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:10:00.000', 2156, 98, '2026-01-20 10:10:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440504', '990e8400-e29b-41d4-a716-446655440401', 'Практикум: расчёт макропоказателей', 'macro-calculations-practice', 'Решаем задачи на расчёт ВВП и инфляции', 'CALCULATOR', 4, 15, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:15:00.000', 1876, 87, '2026-01-20 10:15:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440505', '990e8400-e29b-41d4-a716-446655440404', 'Риск и доходность: базовая связь', 'risk-return-basics', 'Почему высокая доходность = высокий риск', 'VIDEO', 1, 14, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:00:00.000', 5621, 412, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440506', '990e8400-e29b-41d4-a716-446655440404', 'Диверсификация портфеля', 'portfolio-diversification', 'Как снизить риск за счёт разнообразия активов', 'ARTICLE', 2, 11, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:05:00.000', 4892, 356, '2026-02-01 12:05:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440507', '990e8400-e29b-41d4-a716-446655440404', 'Сложный процент в действии', 'compound-interest-demo', 'Калькулятор сложного процента с примерами', 'CALCULATOR', 3, 9, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-02-01 12:10:00.000', 6238, 521, '2026-02-01 12:10:00.000', '2026-03-15 13:42:51.792', NULL),
('aa0e8400-e29b-41d4-a716-446655440508', '990e8400-e29b-41d4-a716-446655440404', 'Тест: основы риск-менеджмента', 'risk-management-quiz', 'Проверьте знания по управлению рисками', 'QUIZ', 4, 12, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:15:00.000', 3987, 289, '2026-02-01 12:15:00.000', '2026-03-13 11:16:27.529', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `lesson_progress_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `progress_percent` int NOT NULL DEFAULT '0',
  `last_position` int DEFAULT NULL,
  `quiz_score` int DEFAULT NULL,
  `quiz_completed` tinyint(1) NOT NULL DEFAULT '0',
  `started_at` datetime(3) DEFAULT NULL,
  `completed_at` datetime(3) DEFAULT NULL,
  `last_viewed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `lesson_progress`
--

INSERT INTO `lesson_progress` (`lesson_progress_id`, `profile_id`, `lesson_id`, `status`, `progress_percent`, `last_position`, `quiz_score`, `quiz_completed`, `started_at`, `completed_at`, `last_viewed_at`) VALUES
('8f194d50-4d66-4efd-ad6a-b88ff5a6feda', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'aa0e8400-e29b-41d4-a716-446655440507', 'in_progress', 50, NULL, NULL, 0, '2026-03-15 13:24:36.780', NULL, '2026-03-15 13:42:51.284'),
('ii0e8400-e29b-41d4-a716-446655440d01', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440501', 'completed', 100, 720, NULL, 0, '2026-03-01 10:05:00.000', '2026-03-01 10:18:00.000', '2026-03-01 10:18:00.000'),
('ii0e8400-e29b-41d4-a716-446655440d02', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440502', 'completed', 100, NULL, NULL, 0, '2026-03-01 10:20:00.000', '2026-03-01 10:28:00.000', '2026-03-01 10:28:00.000'),
('ii0e8400-e29b-41d4-a716-446655440d03', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440503', 'in_progress', 50, NULL, 85, 1, '2026-03-02 11:00:00.000', NULL, '2026-03-12 11:00:00.000'),
('ii0e8400-e29b-41d4-a716-446655440d04', '660e8400-e29b-41d4-a716-446655440104', 'aa0e8400-e29b-41d4-a716-446655440505', 'completed', 100, 840, NULL, 0, '2026-02-20 15:00:00.000', '2026-02-20 15:15:00.000', '2026-02-20 15:15:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_tags`
--

CREATE TABLE `lesson_tags` (
  `lesson_tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `lesson_tags`
--

INSERT INTO `lesson_tags` (`lesson_tag_id`, `lesson_id`, `tag_id`) VALUES
('cc11ceac-2948-455c-b9af-09b06022d856', '49a7f4c8-b3ee-46c3-aa2b-161aed782b38', '5a002291-8414-4755-9e06-e8d308a9ea08'),
('9bbf023c-2df0-47b1-b45d-c26eb208eeaf', '6ba66361-e85a-4ffd-9cf1-9d6b25d09809', '5a002291-8414-4755-9e06-e8d308a9ea08'),
('gg0e8400-e29b-41d4-a716-446655440b01', 'aa0e8400-e29b-41d4-a716-446655440501', '770e8400-e29b-41d4-a716-446655440201'),
('gg0e8400-e29b-41d4-a716-446655440b02', 'aa0e8400-e29b-41d4-a716-446655440505', '770e8400-e29b-41d4-a716-446655440202');

-- --------------------------------------------------------

--
-- Структура таблицы `modules`
--

CREATE TABLE `modules` (
  `module_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  `lessons_count` int NOT NULL DEFAULT '0',
  `duration` int DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `modules`
--

INSERT INTO `modules` (`module_id`, `course_id`, `title`, `description`, `sort_order`, `lessons_count`, `duration`, `is_published`, `created_at`, `updated_at`) VALUES
('990e8400-e29b-41d4-a716-446655440401', '880e8400-e29b-41d4-a716-446655440301', 'Введение в макроэкономику', 'Базовые понятия и показатели', 1, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440402', '880e8400-e29b-41d4-a716-446655440301', 'Денежно-кредитная политика', 'Роль Центробанка, инфляция, ставки', 2, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440403', '880e8400-e29b-41d4-a716-446655440301', 'Фискальная политика', 'Бюджет, налоги, госдолг', 3, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440404', '880e8400-e29b-41d4-a716-446655440302', 'Основы инвестирования', 'Риск, доходность, диверсификация', 1, 4, 70, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440405', '880e8400-e29b-41d4-a716-446655440302', 'Инструменты рынка', 'Акции, облигации, фонды', 2, 5, 80, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440406', '880e8400-e29b-41d4-a716-446655440302', 'Стратегии портфеля', 'Asset allocation, ребалансировка', 3, 3, 50, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440407', '880e8400-e29b-41d4-a716-446655440302', 'Психология инвестора', 'Поведенческие ошибки, дисциплина', 4, 3, 40, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473');

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('EMAIL','IN_APP','TELEGRAM') COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json DEFAULT NULL,
  `link_url` text COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `is_sent` tinyint(1) NOT NULL DEFAULT '0',
  `external_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `scheduled_for` datetime(3) DEFAULT NULL,
  `sent_at` datetime(3) DEFAULT NULL,
  `read_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `notifications`
--

INSERT INTO `notifications` (`notification_id`, `profile_id`, `type`, `channel`, `title`, `body`, `data`, `link_url`, `is_read`, `is_sent`, `external_id`, `error_message`, `scheduled_for`, `sent_at`, `read_at`, `created_at`) VALUES
('rr0e8400-e29b-41d4-a716-446655441601', '660e8400-e29b-41d4-a716-446655440104', 'IN_APP', 'in_app', 'Новый урок доступен!', 'В курсе «Инвестиции для начинающих» добавлен урок про ребалансировку портфеля', NULL, NULL, 0, 1, NULL, NULL, NULL, NULL, NULL, '2026-03-12 09:00:00.000'),
('rr0e8400-e29b-41d4-a716-446655441602', '660e8400-e29b-41d4-a716-446655440103', 'EMAIL', 'email', 'Ваш сертификат готов', 'Поздравляем! Вы завершили курс «Криптовалюты и блокчейн»', NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, '2026-03-10 18:50:00.000'),
('rr0e8400-e29b-41d4-a716-446655441603', '660e8400-e29b-41d4-a716-446655440104', 'TELEGRAM', 'telegram', 'Напоминание о подписке', 'Ваша премиум-подписка продлится через 3 дня', NULL, NULL, 0, 1, NULL, NULL, NULL, NULL, NULL, '2026-03-12 10:00:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `payment_methods`
--

CREATE TABLE `payment_methods` (
  `payment_method_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_token` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `last4` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiry_month` int DEFAULT NULL,
  `expiry_year` int DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_expired` tinyint(1) NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `payment_methods`
--

INSERT INTO `payment_methods` (`payment_method_id`, `profile_id`, `type`, `provider`, `provider_token`, `last4`, `card_type`, `expiry_month`, `expiry_year`, `phone_number`, `is_default`, `is_verified`, `is_expired`, `metadata`, `created_at`, `updated_at`, `deleted_at`) VALUES
('nn0e8400-e29b-41d4-a716-446655441201', '660e8400-e29b-41d4-a716-446655440104', 'card', 'yookassa', 'tok_12345abcde', '4242', 'visa', 12, 2028, NULL, 1, 1, 0, NULL, '2026-02-15 09:00:00.000', '2026-03-13 11:16:28.059', NULL),
('nn0e8400-e29b-41d4-a716-446655441202', '660e8400-e29b-41d4-a716-446655440103', 'card', 'cloudpayments', 'tok_67890fghij', '5555', 'mastercard', 8, 2027, NULL, 1, 1, 0, NULL, '2026-01-01 00:00:00.000', '2026-03-13 11:16:28.059', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `profiles`
--

CREATE TABLE `profiles` (
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` text COLLATE utf8mb4_unicode_ci,
  `cover_image` text COLLATE utf8mb4_unicode_ci,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telegram` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_views` int NOT NULL DEFAULT '0',
  `subscribers` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `profiles`
--

INSERT INTO `profiles` (`profile_id`, `user_id`, `nickname`, `display_name`, `avatar_url`, `cover_image`, `bio`, `website`, `telegram`, `youtube`, `total_views`, `subscribers`, `created_at`, `updated_at`) VALUES
('18360916-9d27-4c6f-9dba-86f7371bce06', '320f322f-97d7-4842-9eef-d3d66851cd10', 'testuser7', 'Test User', 'https://ui-avatars.com/api/?name=Test+User&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-15 11:51:42.013', '2026-03-15 11:51:42.013'),
('5b11073c-50f4-437a-bf86-71d841f8adc4', '3bb5404d-bcad-478d-9cbc-9c838937da5a', 'testuser5', 'Test User', 'https://ui-avatars.com/api/?name=Test+User&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-13 16:10:33.546', '2026-03-13 16:10:33.546'),
('660e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'admin', 'Администратор', 'https://cdn.economikus.ru/avatars/admin.jpg', NULL, 'Официальный аккаунт платформы', NULL, '@admin_econ', NULL, 15420, 892, '2026-01-01 10:00:00.000', '2026-03-13 11:16:27.322'),
('660e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', 'anna_econ', 'Анна Петрова', 'https://cdn.economikus.ru/avatars/anna.jpg', NULL, 'Эксперт по макроэкономике, кандидат наук', NULL, '@anna_econ', NULL, 45230, 3421, '2026-01-15 12:30:00.000', '2026-03-13 11:16:27.322'),
('660e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440003', 'ivan_s', 'Иван Сидоров', 'https://cdn.economikus.ru/avatars/ivan.jpg', NULL, 'Изучаю финансы для личного бюджета', NULL, NULL, NULL, 128, 15, '2026-02-01 09:15:00.000', '2026-03-13 11:16:27.322'),
('660e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440004', 'maria_k', 'Мария Козлова', 'https://cdn.economikus.ru/avatars/maria.jpg', NULL, 'Студентка-экономист, люблю инвестировать', NULL, '@maria_invest', NULL, 567, 89, '2026-02-10 14:20:00.000', '2026-03-13 11:16:27.322'),
('660e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440005', 'moderator', 'Модератор', 'https://cdn.economikus.ru/avatars/mod.jpg', NULL, 'Проверяю контент на качество', NULL, NULL, NULL, 2340, 156, '2026-01-05 11:00:00.000', '2026-03-13 11:16:27.322'),
('6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', 'apitest', 'API Test Updated', 'https://ui-avatars.com/api/?name=API+Test&background=random', NULL, 'Test bio', NULL, NULL, NULL, 0, 0, '2026-03-15 13:24:35.511', '2026-03-15 13:42:51.043'),
('af1383d1-5e50-47a7-833e-26e85c62afae', 'abd55251-2f17-44b1-a0e3-5dac3e418aad', 'ivan2', 'иван Adminov', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+Adminov&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-15 12:37:39.456', '2026-03-15 12:37:39.456'),
('cdf1f1f1-0d61-4d72-94ce-e29b8fc37a37', '9c406b56-4804-4d86-b612-a11c10826b06', 'newuser', 'New User', 'https://ui-avatars.com/api/?name=New+User&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-13 16:21:20.747', '2026-03-13 16:21:20.747'),
('e68c2c00-4a04-4400-8fde-d27d8c349b67', 'e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', 'ivan', 'иван авыпуквп', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+%D0%B0%D0%B2%D1%8B%D0%BF%D1%83%D0%BA%D0%B2%D0%BF&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-15 12:28:23.991', '2026-03-15 12:28:23.991');

-- --------------------------------------------------------

--
-- Структура таблицы `quiz_contents`
--

CREATE TABLE `quiz_contents` (
  `quiz_content_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `questions` json NOT NULL,
  `passing_score` int NOT NULL DEFAULT '70',
  `attempts_allowed` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `quiz_contents`
--

INSERT INTO `quiz_contents` (`quiz_content_id`, `lesson_id`, `questions`, `passing_score`, `attempts_allowed`, `created_at`, `updated_at`) VALUES
('ee0e8400-e29b-41d4-a716-446655440901', 'aa0e8400-e29b-41d4-a716-446655440503', '[{\"id\": 1, \"type\": \"single\", \"correct\": 1, \"options\": [\"Фрикционная\", \"Структурная\", \"Циклическая\", \"Сезонная\"], \"question\": \"Какой тип безработицы связан с изменением структуры экономики?\"}, {\"id\": 2, \"type\": \"single\", \"correct\": 1, \"options\": [\"Безработные / Всё население\", \"Безработные / Рабочая сила\", \"Безработные / Занятые\", \"Занятые / Рабочая сила\"], \"question\": \"Как рассчитывается уровень безработицы?\"}]', 70, 3, '2026-01-20 10:10:00.000', '2026-03-13 11:16:27.694'),
('ee0e8400-e29b-41d4-a716-446655440902', 'aa0e8400-e29b-41d4-a716-446655440508', '[{\"id\": 1, \"type\": \"single\", \"correct\": 1, \"options\": [\"Мера абсолютного риска\", \"Мера систематического риска\", \"Мера доходности\", \"Мера ликвидности\"], \"question\": \"Что такое бета-коэффициент?\"}, {\"id\": 2, \"type\": \"multiple\", \"correct\": [0, 3], \"options\": [\"Гособлигации\", \"Акции роста\", \"Криптовалюты\", \"Депозиты\"], \"question\": \"Какие инструменты относятся к консервативным?\"}]', 80, 2, '2026-02-01 12:15:00.000', '2026-03-13 11:16:27.694');

-- --------------------------------------------------------

--
-- Структура таблицы `reactions`
--

CREATE TABLE `reactions` (
  `reaction_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('LIKE','DISLIKE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reactionable_type` enum('COURSE','LESSON','COMMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reactionable_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `reactions`
--

INSERT INTO `reactions` (`reaction_id`, `type`, `profile_id`, `reactionable_type`, `reactionable_id`, `created_at`) VALUES
('ll0e8400-e29b-41d4-a716-446655441001', 'LIKE', '660e8400-e29b-41d4-a716-446655440103', 'COURSE', '880e8400-e29b-41d4-a716-446655440301', '2026-03-05 14:05:00.000'),
('ll0e8400-e29b-41d4-a716-446655441002', 'LIKE', '660e8400-e29b-41d4-a716-446655440104', 'COURSE', '880e8400-e29b-41d4-a716-446655440302', '2026-03-08 16:50:00.000'),
('ll0e8400-e29b-41d4-a716-446655441003', 'LIKE', '660e8400-e29b-41d4-a716-446655440103', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440501', '2026-03-01 10:20:00.000'),
('ll0e8400-e29b-41d4-a716-446655441004', 'LIKE', '660e8400-e29b-41d4-a716-446655440104', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440505', '2026-02-20 15:20:00.000'),
('ll0e8400-e29b-41d4-a716-446655441005', 'DISLIKE', '660e8400-e29b-41d4-a716-446655440103', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440503', '2026-03-02 11:30:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `sessions`
--

CREATE TABLE `sessions` (
  `session_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`session_id`, `session_token`, `user_id`, `expires`, `created_at`, `updated_at`) VALUES
('00c1f4a3-5955-4f80-83f7-ad5c629bb383', '532d9d97-b69a-49d8-9c1c-764fa34c9ce6', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-14 15:11:13.009', '2026-03-15 15:11:13.014', '2026-03-15 15:11:13.014'),
('00da45f7-7b7b-44c8-b37c-81cca62da7f0', '3c32c6ea-dcfc-4535-90b3-f662140d0db7', '320f322f-97d7-4842-9eef-d3d66851cd10', '2026-04-14 11:52:50.085', '2026-03-15 11:52:50.087', '2026-03-15 11:52:50.087'),
('28e8c074-ad2c-498e-9e7d-b521a872056e', 'd86de94c-4211-452b-80e0-e1b850fc05a5', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-14 16:31:39.039', '2026-03-15 16:31:39.047', '2026-03-15 16:31:39.047'),
('4f99a233-0a6f-47e6-b41e-a7ea32be8636', '959d53ff-4488-49bf-b6fd-62e535eab87f', '9c406b56-4804-4d86-b612-a11c10826b06', '2026-04-12 16:22:34.913', '2026-03-13 16:22:34.915', '2026-03-13 16:22:34.915'),
('7d51f500-fc99-4f43-83f8-12826fbd0762', '4a2ad9ff-d594-4e16-858c-66bf4b570b61', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-15 11:13:29.213', '2026-03-16 11:13:29.220', '2026-03-16 11:13:29.220'),
('9eac306a-9fc9-4a85-9136-f023fb765c89', 'a8c10ef1-4b70-4994-910c-da653802abf5', '3bb5404d-bcad-478d-9cbc-9c838937da5a', '2026-04-12 16:16:46.472', '2026-03-13 16:16:46.475', '2026-03-13 16:16:46.475'),
('c4db893c-b161-40f4-8faf-4ecdd54f809a', 'b79d356a-be91-4f52-a9bf-56787d7b528d', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-14 15:18:24.434', '2026-03-15 15:18:24.436', '2026-03-15 15:18:24.436'),
('dad37905-ff9d-46fb-903b-7a05362fc6f3', 'c32f87ac-02f1-4600-a1ba-635f4c559db8', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-14 15:04:27.125', '2026-03-15 15:04:27.127', '2026-03-15 15:04:27.127'),
('f5eb4e07-292e-4c2f-b757-e58dd574115a', '2c84d75f-2943-40bc-ab91-82c8b688ae02', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-14 13:31:45.625', '2026-03-15 13:31:45.627', '2026-03-15 13:31:45.627'),
('tt0e8400-e29b-41d4-a716-446655441801', 'sess_abc123xyz789', '550e8400-e29b-41d4-a716-446655440003', '2026-03-20 10:00:00.000', '2026-03-12 10:00:00.000', '2026-03-13 11:16:28.319'),
('tt0e8400-e29b-41d4-a716-446655441802', 'sess_def456uvw012', '550e8400-e29b-41d4-a716-446655440004', '2026-03-19 14:30:00.000', '2026-03-11 14:30:00.000', '2026-03-13 11:16:28.319');

-- --------------------------------------------------------

--
-- Структура таблицы `subscriptions`
--

CREATE TABLE `subscriptions` (
  `subscription_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','PAST_DUE','CANCELED','EXPIRED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `start_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `end_date` datetime(3) DEFAULT NULL,
  `trial_ends_at` datetime(3) DEFAULT NULL,
  `auto_renew` tinyint(1) NOT NULL DEFAULT '1',
  `cancel_at_period_end` tinyint(1) NOT NULL DEFAULT '0',
  `price` double NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RUB',
  `payment_method_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_subscription_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `canceled_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `subscriptions`
--

INSERT INTO `subscriptions` (`subscription_id`, `profile_id`, `plan_type`, `status`, `start_date`, `end_date`, `trial_ends_at`, `auto_renew`, `cancel_at_period_end`, `price`, `currency`, `payment_method_id`, `provider_subscription_id`, `provider`, `created_at`, `updated_at`, `canceled_at`, `deleted_at`) VALUES
('oo0e8400-e29b-41d4-a716-446655441301', '660e8400-e29b-41d4-a716-446655440104', 'premium_monthly', 'ACTIVE', '2026-02-15 10:00:00.000', '2026-03-15 10:00:00.000', NULL, 1, 0, 499, 'RUB', 'nn0e8400-e29b-41d4-a716-446655441201', NULL, 'yookassa', '2026-02-15 10:00:00.000', '2026-03-13 11:16:28.105', NULL, NULL),
('oo0e8400-e29b-41d4-a716-446655441302', '660e8400-e29b-41d4-a716-446655440103', 'premium_yearly', 'ACTIVE', '2026-01-01 00:00:00.000', '2027-01-01 00:00:00.000', NULL, 1, 0, 3990, 'RUB', 'nn0e8400-e29b-41d4-a716-446655441202', NULL, 'cloudpayments', '2026-01-01 00:00:00.000', '2026-03-13 11:16:28.105', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `tags`
--

CREATE TABLE `tags` (
  `tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tags`
--

INSERT INTO `tags` (`tag_id`, `name`, `slug`, `color`) VALUES
('5a002291-8414-4755-9e06-e8d308a9ea08', 'test 2', 'test-2', '#3B82F6'),
('770e8400-e29b-41d4-a716-446655440201', 'Макроэкономика', 'macroeconomics', '#3B82F6'),
('770e8400-e29b-41d4-a716-446655440202', 'Инвестиции', 'investments', '#10B981'),
('770e8400-e29b-41d4-a716-446655440203', 'Финансовая грамотность', 'financial-literacy', '#F59E0B'),
('770e8400-e29b-41d4-a716-446655440204', 'Бухгалтерия', 'accounting', '#8B5CF6'),
('770e8400-e29b-41d4-a716-446655440205', 'Криптовалюты', 'crypto', '#EC4899'),
('770e8400-e29b-41d4-a716-446655440206', 'Бизнес-модели', 'business-models', '#06B6D4'),
('c3760df4-865b-4e13-821c-acaa9c919c9a', 'тест', 'test1', '#34564c');

-- --------------------------------------------------------

--
-- Структура таблицы `text_contents`
--

CREATE TABLE `text_contents` (
  `text_content_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `word_count` int DEFAULT NULL,
  `reading_time` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `text_contents`
--

INSERT INTO `text_contents` (`text_content_id`, `lesson_id`, `body`, `word_count`, `reading_time`, `created_at`, `updated_at`) VALUES
('cc0e8400-e29b-41d4-a716-446655440701', 'aa0e8400-e29b-41d4-a716-446655440502', '<h2>Что такое инфляция?</h2><p>Инфляция — это устойчивое повышение общего уровня цен на товары и услуги...</p><h3>Виды инфляции</h3><ul><li>Умеренная (до 10% в год)</li><li>Галопирующая (10-50%)</li><li>Гиперинфляция (более 50%)</li></ul>', 450, 3, '2026-01-20 10:05:00.000', '2026-03-13 11:16:27.614'),
('cc0e8400-e29b-41d4-a716-446655440702', 'aa0e8400-e29b-41d4-a716-446655440506', '<h2>Принципы диверсификации</h2><p>«Не кладите все яйца в одну корзину» — золотое правило инвестора...</p><h3>Уровни диверсификации</h3><ol><li>По классам активов</li><li>По отраслям</li><li>По географии</li><li>По валютам</li></ol>', 380, 2, '2026-02-01 12:05:00.000', '2026-03-13 11:16:27.614');

-- --------------------------------------------------------

--
-- Структура таблицы `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscription_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RUB',
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `course_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_payment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_response` json DEFAULT NULL,
  `refunded_at` datetime(3) DEFAULT NULL,
  `refund_amount` double DEFAULT NULL,
  `refund_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `completed_at` datetime(3) DEFAULT NULL,
  `failed_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `profile_id`, `subscription_id`, `type`, `amount`, `currency`, `status`, `course_id`, `payment_method_id`, `provider`, `provider_payment_id`, `provider_response`, `refunded_at`, `refund_amount`, `refund_reason`, `created_at`, `updated_at`, `completed_at`, `failed_at`) VALUES
('pp0e8400-e29b-41d4-a716-446655441401', '660e8400-e29b-41d4-a716-446655440104', 'oo0e8400-e29b-41d4-a716-446655441301', 'subscription_payment', 499, 'RUB', 'COMPLETED', NULL, 'nn0e8400-e29b-41d4-a716-446655441201', 'yookassa', 'yoo_pay_abc123', NULL, NULL, NULL, NULL, '2026-02-15 10:00:00.000', '2026-03-13 11:16:28.142', NULL, NULL),
('pp0e8400-e29b-41d4-a716-446655441402', '660e8400-e29b-41d4-a716-446655440103', 'oo0e8400-e29b-41d4-a716-446655441302', 'subscription_payment', 3990, 'RUB', 'COMPLETED', NULL, 'nn0e8400-e29b-41d4-a716-446655441202', 'cloudpayments', 'cp_pay_xyz789', NULL, NULL, NULL, NULL, '2026-01-01 00:00:00.000', '2026-03-13 11:16:28.142', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','AUTHOR','MODERATOR','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `email_verified` datetime(3) DEFAULT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT '0',
  `blocked_reason` text COLLATE utf8mb4_unicode_ci,
  `last_login_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `email`, `first_name`, `last_name`, `password_hash`, `role`, `email_verified`, `is_blocked`, `blocked_reason`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
('11111111-1111-1111-1111-111111111111', 'demo@economikus.ru', 'Александр', 'Иванов', '$2a$10$example_hash_for_password123', 'USER', NULL, 0, NULL, NULL, '2026-03-13 10:53:15.000', '2026-03-13 10:53:15.000', NULL),
('22222222-2222-2222-2222-222222222222', 'maria@economikus.ru', 'Мария', 'Петрова', '$2a$10$example_hash_for_password123', 'AUTHOR', NULL, 0, NULL, NULL, '2026-03-13 10:53:15.000', '2026-03-13 10:53:15.000', NULL),
('320f322f-97d7-4842-9eef-d3d66851cd10', 'test7@test.com', 'Test', 'User', '$2b$12$reK4Oa70R1W23L2BYRjn5.yyoq8xMd/hieojnWDXbwoYgzcZumrDe', 'USER', '2026-03-15 11:51:41.978', 0, NULL, '2026-03-15 11:52:49.985', '2026-03-15 11:51:41.986', '2026-03-15 11:52:49.986', NULL),
('3bb5404d-bcad-478d-9cbc-9c838937da5a', 'test5@test.com', 'Test', 'User', '$2b$12$hHMhQiM4LApwSc6VJ5t9leH9bMPLMIEmLQPy4qmG5tAoR0F/5oXKm', 'USER', '2026-03-13 16:10:33.521', 0, NULL, '2026-03-13 16:16:46.351', '2026-03-13 16:10:33.526', '2026-03-13 16:16:46.355', NULL),
('45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', 'api_test@test.ru', 'API', 'Test', '$2b$12$GTnQEESlaR3VGmwkrVJkFOAky04teSWvzrNjDb/3B5TQjSOgyVfji', 'ADMIN', '2026-03-15 13:24:35.434', 0, NULL, '2026-03-16 11:13:28.970', '2026-03-15 13:24:35.438', '2026-03-16 11:13:28.978', NULL),
('550e8400-e29b-41d4-a716-446655440001', 'admin@economikus.ru', 'Админ', 'Системный', NULL, 'ADMIN', '2026-01-01 10:00:00.000', 0, NULL, NULL, '2026-01-01 10:00:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'anna@author.ru', 'Анна', 'Петрова', NULL, 'AUTHOR', '2026-01-15 12:30:00.000', 0, NULL, NULL, '2026-01-15 12:30:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'ivan@user.ru', 'Иван', 'Сидоров', NULL, 'USER', '2026-02-01 09:15:00.000', 0, NULL, NULL, '2026-02-01 09:15:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440004', 'maria@learner.ru', 'Мария', 'Козлова', NULL, 'USER', '2026-02-10 14:20:00.000', 0, NULL, NULL, '2026-02-10 14:20:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440005', 'mod@economikus.ru', 'Модер', 'Проверкин', NULL, 'MODERATOR', '2026-01-05 11:00:00.000', 0, NULL, NULL, '2026-01-05 11:00:00.000', '2026-03-13 11:16:27.249', NULL),
('9c406b56-4804-4d86-b612-a11c10826b06', 'test6@test.com', 'New', 'User', '$2b$12$.b5hR6KNeSTflbjqeCxlmuzjWWNKa9lpERoqte72X.ef0c3z1n8R.', 'USER', '2026-03-13 16:21:20.719', 0, NULL, '2026-03-13 16:22:34.894', '2026-03-13 16:21:20.722', '2026-03-13 16:22:34.896', NULL),
('abd55251-2f17-44b1-a0e3-5dac3e418aad', 'petrov2@tge.ru', 'иван', 'Adminov', '$2b$12$M1KgYuS4X.UJiN8AJe46ZeAsJoosBFTFJcTbo68UPKEKA91yHkb8S', 'USER', '2026-03-15 12:37:39.439', 0, NULL, '2026-03-15 12:37:42.099', '2026-03-15 12:37:39.441', '2026-03-15 12:37:42.101', NULL),
('e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', 'petrov@tge.ru', 'иван', 'авыпуквп', '$2b$12$SosNJ46z0ff41Bspc3VT5eOXrJuKc47dytodUmCGVNu8J36ThcrOW', 'USER', '2026-03-15 12:28:23.959', 0, NULL, '2026-03-15 12:30:58.267', '2026-03-15 12:28:23.963', '2026-03-15 12:30:58.269', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `VerificationToken`
--

CREATE TABLE `VerificationToken` (
  `identifier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `VerificationToken`
--

INSERT INTO `VerificationToken` (`identifier`, `token`, `expires`) VALUES
('ivan@user.ru', 'vt_abc123verification', '2026-03-14 19:52:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `video_contents`
--

CREATE TABLE `video_contents` (
  `video_content_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` enum('YOUTUBE','RUTUBE','VIMEO','LOCAL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'YOUTUBE',
  `duration` int NOT NULL,
  `qualities` json DEFAULT NULL,
  `subtitles` json DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `video_contents`
--

INSERT INTO `video_contents` (`video_content_id`, `lesson_id`, `video_url`, `provider`, `duration`, `qualities`, `subtitles`, `created_at`, `updated_at`) VALUES
('bb0e8400-e29b-41d4-a716-446655440601', 'aa0e8400-e29b-41d4-a716-446655440501', 'https://youtube.com/watch?v=macro_gdp_101', 'YOUTUBE', 720, '[\"360p\", \"720p\", \"1080p\"]', '[{\"url\": \"https://cdn.economikus.ru/subs/gdp_ru.vtt\", \"lang\": \"ru\"}]', '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.569'),
('bb0e8400-e29b-41d4-a716-446655440602', 'aa0e8400-e29b-41d4-a716-446655440505', 'https://cdn.economikus.ru/videos/risk_return.mp4', 'LOCAL', 840, '[\"720p\", \"1080p\"]', '[{\"url\": \"https://cdn.economikus.ru/subs/risk_ru.vtt\", \"lang\": \"ru\"}]', '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.569');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `accounts_provider_provider_account_id_key` (`provider`,`provider_account_id`),
  ADD KEY `accounts_user_id_idx` (`user_id`);

--
-- Индексы таблицы `audio_contents`
--
ALTER TABLE `audio_contents`
  ADD PRIMARY KEY (`audio_content_id`),
  ADD UNIQUE KEY `audio_contents_lesson_id_key` (`lesson_id`);

--
-- Индексы таблицы `Authenticator`
--
ALTER TABLE `Authenticator`
  ADD PRIMARY KEY (`user_id`,`credentialID`),
  ADD UNIQUE KEY `Authenticator_credentialID_key` (`credentialID`);

--
-- Индексы таблицы `business_events`
--
ALTER TABLE `business_events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `business_events_profile_id_idx` (`profile_id`),
  ADD KEY `business_events_event_type_idx` (`event_type`),
  ADD KEY `business_events_created_at_idx` (`created_at`);

--
-- Индексы таблицы `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`certificate_id`),
  ADD UNIQUE KEY `certificates_certificate_number_key` (`certificate_number`),
  ADD UNIQUE KEY `certificates_profile_id_course_id_key` (`profile_id`,`course_id`),
  ADD KEY `certificates_course_id_fkey` (`course_id`);

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `comments_commentable_type_commentable_id_idx` (`commentable_type`,`commentable_id`),
  ADD KEY `comments_author_profile_id_idx` (`author_profile_id`),
  ADD KEY `comments_status_idx` (`status`),
  ADD KEY `comments_created_at_idx` (`created_at`),
  ADD KEY `comments_moderated_by_fkey` (`moderated_by`);

--
-- Индексы таблицы `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `courses_slug_key` (`slug`),
  ADD KEY `courses_slug_idx` (`slug`),
  ADD KEY `courses_author_profile_id_idx` (`author_profile_id`),
  ADD KEY `courses_status_idx` (`status`);

--
-- Индексы таблицы `course_progress`
--
ALTER TABLE `course_progress`
  ADD PRIMARY KEY (`course_progress_id`),
  ADD UNIQUE KEY `course_progress_profile_id_course_id_key` (`profile_id`,`course_id`),
  ADD KEY `course_progress_course_id_fkey` (`course_id`);

--
-- Индексы таблицы `course_tags`
--
ALTER TABLE `course_tags`
  ADD PRIMARY KEY (`course_tag_id`),
  ADD UNIQUE KEY `course_tags_course_id_tag_id_key` (`course_id`,`tag_id`),
  ADD KEY `course_tags_tag_id_fkey` (`tag_id`);

--
-- Индексы таблицы `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`favorite_id`),
  ADD UNIQUE KEY `favorites_profile_id_lesson_id_key` (`profile_id`,`lesson_id`),
  ADD KEY `favorites_profile_id_idx` (`profile_id`),
  ADD KEY `favorites_lesson_id_idx` (`lesson_id`),
  ADD KEY `favorites_collection_idx` (`collection`);

--
-- Индексы таблицы `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`history_id`),
  ADD UNIQUE KEY `history_profile_id_historable_type_historable_id_key` (`profile_id`,`historable_type`,`historable_id`),
  ADD KEY `history_profile_id_idx` (`profile_id`),
  ADD KEY `history_viewed_at_idx` (`viewed_at`);

--
-- Индексы таблицы `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD UNIQUE KEY `lessons_slug_key` (`slug`),
  ADD KEY `lessons_slug_idx` (`slug`),
  ADD KEY `lessons_module_id_idx` (`module_id`),
  ADD KEY `lessons_author_profile_id_idx` (`author_profile_id`),
  ADD KEY `lessons_lesson_type_idx` (`lesson_type`),
  ADD KEY `lessons_status_idx` (`status`);

--
-- Индексы таблицы `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`lesson_progress_id`),
  ADD UNIQUE KEY `lesson_progress_profile_id_lesson_id_key` (`profile_id`,`lesson_id`),
  ADD KEY `lesson_progress_lesson_id_fkey` (`lesson_id`);

--
-- Индексы таблицы `lesson_tags`
--
ALTER TABLE `lesson_tags`
  ADD PRIMARY KEY (`lesson_tag_id`),
  ADD UNIQUE KEY `lesson_tags_lesson_id_tag_id_key` (`lesson_id`,`tag_id`),
  ADD KEY `lesson_tags_tag_id_fkey` (`tag_id`);

--
-- Индексы таблицы `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`module_id`),
  ADD KEY `modules_course_id_idx` (`course_id`),
  ADD KEY `modules_sort_order_idx` (`sort_order`);

--
-- Индексы таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `notifications_profile_id_idx` (`profile_id`),
  ADD KEY `notifications_is_read_idx` (`is_read`),
  ADD KEY `notifications_created_at_idx` (`created_at`);

--
-- Индексы таблицы `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`payment_method_id`),
  ADD KEY `payment_methods_profile_id_idx` (`profile_id`);

--
-- Индексы таблицы `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD UNIQUE KEY `profiles_user_id_key` (`user_id`),
  ADD UNIQUE KEY `profiles_nickname_key` (`nickname`),
  ADD KEY `profiles_user_id_idx` (`user_id`),
  ADD KEY `profiles_nickname_idx` (`nickname`);

--
-- Индексы таблицы `quiz_contents`
--
ALTER TABLE `quiz_contents`
  ADD PRIMARY KEY (`quiz_content_id`),
  ADD UNIQUE KEY `quiz_contents_lesson_id_key` (`lesson_id`);

--
-- Индексы таблицы `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`reaction_id`),
  ADD UNIQUE KEY `reactions_profile_id_reactionable_type_reactionable_id_key` (`profile_id`,`reactionable_type`,`reactionable_id`),
  ADD KEY `reactions_reactionable_type_reactionable_id_idx` (`reactionable_type`,`reactionable_id`),
  ADD KEY `reactions_profile_id_idx` (`profile_id`);

--
-- Индексы таблицы `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `sessions_session_token_key` (`session_token`),
  ADD KEY `sessions_session_token_idx` (`session_token`),
  ADD KEY `sessions_user_id_idx` (`user_id`);

--
-- Индексы таблицы `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`subscription_id`),
  ADD KEY `subscriptions_profile_id_idx` (`profile_id`),
  ADD KEY `subscriptions_status_idx` (`status`),
  ADD KEY `subscriptions_payment_method_id_fkey` (`payment_method_id`);

--
-- Индексы таблицы `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `tags_name_key` (`name`),
  ADD UNIQUE KEY `tags_slug_key` (`slug`);

--
-- Индексы таблицы `text_contents`
--
ALTER TABLE `text_contents`
  ADD PRIMARY KEY (`text_content_id`),
  ADD UNIQUE KEY `text_contents_lesson_id_key` (`lesson_id`);

--
-- Индексы таблицы `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `transactions_profile_id_idx` (`profile_id`),
  ADD KEY `transactions_subscription_id_idx` (`subscription_id`),
  ADD KEY `transactions_status_idx` (`status`),
  ADD KEY `transactions_course_id_idx` (`course_id`),
  ADD KEY `transactions_payment_method_id_fkey` (`payment_method_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_email_idx` (`email`),
  ADD KEY `users_role_idx` (`role`),
  ADD KEY `users_created_at_idx` (`created_at`);

--
-- Индексы таблицы `VerificationToken`
--
ALTER TABLE `VerificationToken`
  ADD PRIMARY KEY (`identifier`,`token`);

--
-- Индексы таблицы `video_contents`
--
ALTER TABLE `video_contents`
  ADD PRIMARY KEY (`video_content_id`),
  ADD UNIQUE KEY `video_contents_lesson_id_key` (`lesson_id`);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `audio_contents`
--
ALTER TABLE `audio_contents`
  ADD CONSTRAINT `audio_contents_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Authenticator`
--
ALTER TABLE `Authenticator`
  ADD CONSTRAINT `Authenticator_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `business_events`
--
ALTER TABLE `business_events`
  ADD CONSTRAINT `business_events_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `certificates_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_author_profile_id_fkey` FOREIGN KEY (`author_profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_moderated_by_fkey` FOREIGN KEY (`moderated_by`) REFERENCES `profiles` (`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_author_profile_id_fkey` FOREIGN KEY (`author_profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `course_progress`
--
ALTER TABLE `course_progress`
  ADD CONSTRAINT `course_progress_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_progress_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `course_tags`
--
ALTER TABLE `course_tags`
  ADD CONSTRAINT `course_tags_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_author_profile_id_fkey` FOREIGN KEY (`author_profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `lessons_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `lesson_progress_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lesson_progress_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `lesson_tags`
--
ALTER TABLE `lesson_tags`
  ADD CONSTRAINT `lesson_tags_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lesson_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `payment_methods_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `quiz_contents`
--
ALTER TABLE `quiz_contents`
  ADD CONSTRAINT `quiz_contents_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `reactions`
--
ALTER TABLE `reactions`
  ADD CONSTRAINT `reactions_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subscriptions_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `text_contents`
--
ALTER TABLE `text_contents`
  ADD CONSTRAINT `text_contents_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`subscription_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `video_contents`
--
ALTER TABLE `video_contents`
  ADD CONSTRAINT `video_contents_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
