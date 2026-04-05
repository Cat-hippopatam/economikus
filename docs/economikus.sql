-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.0
-- Время создания: Мар 26 2026 г., 15:58
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
-- Структура таблицы `author_applications`
--

CREATE TABLE `author_applications` (
  `application_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `motivation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience` text COLLATE utf8mb4_unicode_ci,
  `portfolio_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_at` datetime(3) DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `author_applications`
--

INSERT INTO `author_applications` (`application_id`, `profile_id`, `status`, `motivation`, `experience`, `portfolio_url`, `reviewed_by`, `reviewed_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
('30bc86ec-7201-41a2-9d5e-2de0800cacc1', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 'APPROVED', 'тест апрарпавпрапоапоапоапрапрапраправрпварпвпавпвапвапвап', NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '2026-03-19 08:42:22.850', NULL, '2026-03-19 08:40:20.354', '2026-03-19 08:42:22.853'),
('9c98d9bf-d8ad-41cb-bbdb-4967ce6e5409', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'APPROVED', 'вапавапвпапвапвапвапвапвапвапавпвапвапврпапропропропо', NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '2026-03-20 06:52:06.902', NULL, '2026-03-20 06:50:50.195', '2026-03-20 06:52:06.904');

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
('2abd6e91-d8f4-4189-a1df-4167e278f08d', 'Еуые', 'test1sedfgdsf', NULL, NULL, 'ADVANCED', NULL, 0, 1, 'PUBLISHED', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 32, 0, '2026-03-19 15:57:46.463', '2026-03-24 14:43:49.641', NULL),
('38a0da6e-82f3-477b-be4f-fc5f82568d0c', 'ВВП', 'vvp', '', '', 'ADVANCED', 0, 0, 2, 'PUBLISHED', 1, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 97, 0, '2026-03-20 06:52:43.604', '2026-03-24 14:43:14.715', NULL),
('67eb7445-0c5e-4743-a51f-5c6cd5987abf', 'test123456', 'test123456fdgdg', 'wefsfsdf', NULL, 'BEGINNER', NULL, 0, 0, 'PENDING_REVIEW', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 11:46:55.119', '2026-03-19 12:42:16.909', '2026-03-19 12:42:16.907'),
('76703931-c58a-4c39-8e15-2437058bbc90', 'test3', 'test33', 'sdfdwsfsdf', '', 'INTERMEDIATE', 1200, 0, 0, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 4, 0, '2026-03-16 12:33:46.043', '2026-03-24 14:31:11.475', NULL),
('7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', 'Test23', 'testilk', 'dfvbd', NULL, 'INTERMEDIATE', NULL, 0, 2, 'PUBLISHED', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 10, 0, '2026-03-19 13:26:08.009', '2026-03-24 12:05:44.118', NULL),
('818b2431-71e4-43af-a3c5-d4a42d776f8d', 'выапвп', 'test123456', NULL, NULL, 'BEGINNER', NULL, 0, 0, 'DRAFT', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 12:08:00.906', '2026-03-19 12:08:50.953', '2026-03-19 12:08:50.949'),
('880e8400-e29b-41d4-a716-446655440301', 'Основы макроэкономики', 'macroeconomics-basics', 'Полный курс по макроэкономике: ВВП, инфляция, безработица, денежно-кредитная политика', 'https://cdn.economikus.ru/covers/macro-basics.jpg', 'BEGINNER', 180, 12, 3, 'PUBLISHED', 0, '2026-01-20 10:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 8438, 342, '2026-01-20 10:00:00.000', '2026-03-20 08:29:30.480', NULL),
('880e8400-e29b-41d4-a716-446655440302', 'Инвестиции для начинающих', 'investments-for-beginners', 'Научитесь формировать портфель, оценивать риски и выбирать инструменты', 'https://cdn.economikus.ru/covers/invest-begin.jpg', 'BEGINNER', 240, 15, 4, 'PUBLISHED', 1, '2026-02-01 12:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 12584, 891, '2026-02-01 12:00:00.000', '2026-03-24 14:32:00.515', NULL),
('880e8400-e29b-41d4-a716-446655440303', 'Финансовый учёт в 1С', 'accounting-1c-basics', 'Практический курс по ведению бухгалтерии в 1С:Предприятие', 'https://cdn.economikus.ru/covers/1c-accounting.jpg', 'INTERMEDIATE', 300, 20, 5, 'PUBLISHED', 1, '2026-01-10 09:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 5234, 267, '2026-01-10 09:00:00.000', '2026-03-24 14:43:39.387', NULL),
('880e8400-e29b-41d4-a716-446655440304', 'Криптовалюты и блокчейн', 'crypto-blockchain-intro', 'Разбираемся в технологии блокчейн, биткоине и альткоинах', 'https://cdn.economikus.ru/covers/crypto-intro.jpg', 'INTERMEDIATE', 150, 10, 3, 'PUBLISHED', 0, '2026-02-15 14:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 18921, 1205, '2026-02-15 14:00:00.000', '2026-03-20 06:37:54.256', NULL),
('937fab01-13a4-42b5-85db-2053cf819149', 'hjdfgg', 'test1sedfgds', 'dfgdf', NULL, 'INTERMEDIATE', NULL, 0, 0, 'ARCHIVED', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 12:03:35.139', '2026-03-19 12:06:20.948', '2026-03-19 12:06:20.945'),
('ab0968ad-c4f4-4683-bf5a-58e59dd2c3ee', 'test', 'testing', 'fcvhgbfghfh', NULL, 'ADVANCED', NULL, 0, 0, 'DRAFT', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 16:01:46.972', '2026-03-19 16:01:46.972', NULL),
('e496dffd-c4f2-47e1-8dd0-21b17db71bcc', 'Тест', 'test123', 'dfgdfgfdgdfg', NULL, 'BEGINNER', NULL, 0, 0, 'DRAFT', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 10:25:20.444', '2026-03-19 11:48:08.097', '2026-03-19 11:48:08.092');

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
('4927b676-0d63-4b59-ac08-b3a67ff124c8', 'ff929368-264d-43a6-b450-d02442f5d511', '880e8400-e29b-41d4-a716-446655440302', 'NOT_STARTED', 0, 0, 4, NULL, NULL, '2026-03-24 14:31:58.049'),
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
('0a880780-0854-4613-aa0a-a1c9e26579f8', 'ff929368-264d-43a6-b450-d02442f5d511', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', NULL, NULL, '2026-03-24 13:18:06.089'),
('31656d4a-79c0-4482-8c6c-4be13c75db02', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', '42d89e6d-7d94-4acd-abb3-45356f77abe2', NULL, NULL, '2026-03-24 13:07:04.381'),
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
('020e3cd5-8bc9-41b8-8c30-7f0876b68cb9', 'ff929368-264d-43a6-b450-d02442f5d511', 'LESSON', '238212e6-887b-40c1-9cc3-468887b91574', 0, 0, '2026-03-24 14:43:47.002'),
('0b0f8c1d-e4f7-46c7-b25a-30ee7dd14625', 'ff929368-264d-43a6-b450-d02442f5d511', 'LESSON', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 0, 0, '2026-03-24 14:43:04.688'),
('0c10556a-7048-4d2b-985c-cd69de5e37c1', 'ff929368-264d-43a6-b450-d02442f5d511', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440508', 0, 0, '2026-03-24 14:31:58.002'),
('4f68ea3b-d415-4dc0-9dc0-754c520999ab', 'ff929368-264d-43a6-b450-d02442f5d511', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440507', 0, 0, '2026-03-24 14:31:55.190'),
('4f9bc79a-c9c4-46e9-9acd-ec7595354191', 'ff929368-264d-43a6-b450-d02442f5d511', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440505', 0, 0, '2026-03-24 14:31:46.521'),
('8a7c9a3f-16f3-4164-bb82-fc582b4ee1e0', 'ff929368-264d-43a6-b450-d02442f5d511', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440506', 0, 0, '2026-03-24 14:31:52.411'),
('af9a0820-4b44-4f7a-8b3e-70f271150645', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440506', 120, 0, '2026-03-15 13:42:51.204'),
('d289d65e-de93-4a4b-8ddf-8521c2cbe9be', 'ff929368-264d-43a6-b450-d02442f5d511', 'LESSON', '42d89e6d-7d94-4acd-abb3-45356f77abe2', 0, 0, '2026-03-24 14:43:10.735'),
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
('238212e6-887b-40c1-9cc3-468887b91574', '7d27e471-9ee7-4da2-bbe0-8ee3d9d980e0', 'апра', 'gorn', 'cvbc', 'ARTICLE', 0, 40, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-19 15:11:29.360', '2026-03-20 06:59:54.010', NULL),
('42d89e6d-7d94-4acd-abb3-45356f77abe2', '8cdb7c04-b5d8-4ed7-bf73-6ced71645faa', 'tewt23', 'tewt', NULL, 'ARTICLE', 0, NULL, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-20 07:34:19.773', '2026-03-20 07:35:52.774', NULL),
('49a7f4c8-b3ee-46c3-aa2b-161aed782b38', NULL, 'test', 'test-3', 'ntfcn', 'ARTICLE', 6, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-16 12:29:59.826', '2026-03-20 07:00:57.092', NULL),
('590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 'c7cbcad6-33dd-4825-9326-91c13e6af1b8', 'введение', 'vvedenie', '', 'ARTICLE', 0, 0, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-20 06:53:48.430', '2026-03-20 06:59:30.938', NULL),
('6ba66361-e85a-4ffd-9cf1-9d6b25d09809', NULL, 'test', 'test-2', 'ntfcn', 'ARTICLE', 5, 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-16 12:29:52.456', '2026-03-20 07:01:14.404', NULL),
('7159eb6e-2fb0-45ee-9cd8-0012f6abf785', 'b2332272-0d73-4a80-9750-87c9599f3463', 'rerte', 'rert', 'fghfdh', 'VIDEO', 0, 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-19 16:03:32.902', '2026-03-20 05:59:36.494', NULL),
('aa0e8400-e29b-41d4-a716-446655440501', '990e8400-e29b-41d4-a716-446655440401', 'Что такое ВВП?', 'what-is-gdp', 'Разбираем понятие валового внутреннего продукта', 'VIDEO', 1, 12, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:00:00.000', 3420, 156, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440502', '990e8400-e29b-41d4-a716-446655440401', 'Инфляция: виды и измерение', 'inflation-types', 'Как считают инфляцию и почему она важна', 'ARTICLE', 2, 8, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:05:00.000', 2890, 134, '2026-01-20 10:05:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440503', '990e8400-e29b-41d4-a716-446655440401', 'Уровень безработицы', 'unemployment-rate', 'Типы безработицы и методы расчёта', 'QUIZ', 3, 10, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:10:00.000', 2156, 98, '2026-01-20 10:10:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440504', '990e8400-e29b-41d4-a716-446655440401', 'Практикум: расчёт макропоказателей', 'macro-calculations-practice', 'Решаем задачи на расчёт ВВП и инфляции', 'CALCULATOR', 4, 15, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:15:00.000', 1876, 87, '2026-01-20 10:15:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440505', '990e8400-e29b-41d4-a716-446655440404', 'Риск и доходность: базовая связь', 'risk-return-basics', 'Почему высокая доходность = высокий риск', 'VIDEO', 1, 14, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:00:00.000', 5621, 412, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440506', '990e8400-e29b-41d4-a716-446655440404', 'Диверсификация портфеля', 'portfolio-diversification', 'Как снизить риск за счёт разнообразия активов', 'ARTICLE', 2, 11, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:05:00.000', 4892, 356, '2026-02-01 12:05:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440507', '990e8400-e29b-41d4-a716-446655440404', 'Сложный процент в действии', 'compound-interest-demo', 'Калькулятор сложного процента с примерами', 'CALCULATOR', 3, 9, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-02-01 12:10:00.000', 6238, 521, '2026-02-01 12:10:00.000', '2026-03-15 13:42:51.792', NULL),
('aa0e8400-e29b-41d4-a716-446655440508', '990e8400-e29b-41d4-a716-446655440404', 'Тест: основы риск-менеджмента', 'risk-management-quiz', 'Проверьте знания по управлению рисками', 'QUIZ', 4, 12, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:15:00.000', 3987, 289, '2026-02-01 12:15:00.000', '2026-03-13 11:16:27.529', NULL),
('ae153975-21c2-447d-8071-55300b1ffa0b', 'b2332272-0d73-4a80-9750-87c9599f3463', 'гкщл', 'testilkr', 'xvxcv', 'ARTICLE', 0, 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-19 13:52:23.382', '2026-03-20 07:01:05.709', NULL);

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
('11f4f3fb-fcc7-4f6d-9e37-3db2041d571a', 'ff929368-264d-43a6-b450-d02442f5d511', '238212e6-887b-40c1-9cc3-468887b91574', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-03-24 14:43:46.936', NULL, '2026-03-24 14:43:46.938'),
('741006c0-3426-4181-a629-0710b204075c', 'ff929368-264d-43a6-b450-d02442f5d511', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-03-24 14:42:21.978', NULL, '2026-03-24 14:42:21.981'),
('8f194d50-4d66-4efd-ad6a-b88ff5a6feda', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'aa0e8400-e29b-41d4-a716-446655440507', 'in_progress', 50, NULL, NULL, 0, '2026-03-15 13:24:36.780', NULL, '2026-03-15 13:42:51.284'),
('ebefcc74-3d63-48e4-9327-75e416df342a', 'ff929368-264d-43a6-b450-d02442f5d511', '42d89e6d-7d94-4acd-abb3-45356f77abe2', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-03-24 14:42:40.121', NULL, '2026-03-24 14:42:40.124'),
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
('d29b172d-2fea-4f73-8c15-226139e926c6', '49a7f4c8-b3ee-46c3-aa2b-161aed782b38', '5a002291-8414-4755-9e06-e8d308a9ea08'),
('eecef045-15b4-4f47-a3ad-0148a804e252', '6ba66361-e85a-4ffd-9cf1-9d6b25d09809', '5a002291-8414-4755-9e06-e8d308a9ea08'),
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
('7d27e471-9ee7-4da2-bbe0-8ee3d9d980e0', '2abd6e91-d8f4-4189-a1df-4167e278f08d', 'cvbvcbfghf', 'fghfhgh', 1, 0, NULL, 0, '2026-03-19 16:02:08.593', '2026-03-19 16:02:08.593'),
('86449042-5b79-42ec-9a0a-6c0553019ea4', '7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', 'тестовый осмс', 'вапвпа', 1, 0, NULL, 0, '2026-03-19 15:09:52.286', '2026-03-20 06:50:00.951'),
('8cdb7c04-b5d8-4ed7-bf73-6ced71645faa', '38a0da6e-82f3-477b-be4f-fc5f82568d0c', 'уточнее', NULL, 2, 0, NULL, 0, '2026-03-20 07:33:46.224', '2026-03-20 07:33:46.224'),
('990e8400-e29b-41d4-a716-446655440401', '880e8400-e29b-41d4-a716-446655440301', 'Введение в макроэкономику', 'Базовые понятия и показатели', 1, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440402', '880e8400-e29b-41d4-a716-446655440301', 'Денежно-кредитная политика', 'Роль Центробанка, инфляция, ставки', 2, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440403', '880e8400-e29b-41d4-a716-446655440301', 'Фискальная политика', 'Бюджет, налоги, госдолг', 3, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440404', '880e8400-e29b-41d4-a716-446655440302', 'Основы инвестирования', 'Риск, доходность, диверсификация', 1, 4, 70, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440405', '880e8400-e29b-41d4-a716-446655440302', 'Инструменты рынка', 'Акции, облигации, фонды', 2, 5, 80, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440406', '880e8400-e29b-41d4-a716-446655440302', 'Стратегии портфеля', 'Asset allocation, ребалансировка', 3, 3, 50, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440407', '880e8400-e29b-41d4-a716-446655440302', 'Психология инвестора', 'Поведенческие ошибки, дисциплина', 4, 3, 40, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('b2332272-0d73-4a80-9750-87c9599f3463', '7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', 'вапвапвап', 'вапвап', 2, 0, NULL, 0, '2026-03-19 15:10:04.541', '2026-03-20 06:50:00.951'),
('c7cbcad6-33dd-4825-9326-91c13e6af1b8', '38a0da6e-82f3-477b-be4f-fc5f82568d0c', 'что такое ...', NULL, 1, 0, NULL, 0, '2026-03-20 06:53:17.097', '2026-03-20 06:53:17.097');

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
('6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', 'apitest', 'API Test Updated', 'https://ui-avatars.com/api/?name=API+Test&background=random', NULL, 'Test bio', '', '', '', 0, 0, '2026-03-15 13:24:35.511', '2026-03-19 12:22:10.417'),
('af1383d1-5e50-47a7-833e-26e85c62afae', 'abd55251-2f17-44b1-a0e3-5dac3e418aad', 'ivan2', 'иваник Adminovok', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+Adminov&background=random', NULL, '', NULL, NULL, NULL, 0, 0, '2026-03-15 12:37:39.456', '2026-03-20 05:56:28.435'),
('cdf1f1f1-0d61-4d72-94ce-e29b8fc37a37', '9c406b56-4804-4d86-b612-a11c10826b06', 'newuser', 'New User', 'https://ui-avatars.com/api/?name=New+User&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-13 16:21:20.747', '2026-03-13 16:21:20.747'),
('e68c2c00-4a04-4400-8fde-d27d8c349b67', 'e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', 'ivan', 'иван авыпуквп', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+%D0%B0%D0%B2%D1%8B%D0%BF%D1%83%D0%BA%D0%B2%D0%BF&background=random', NULL, '', '', '', 'petrov@tge.ru', 0, 0, '2026-03-15 12:28:23.991', '2026-03-19 08:41:18.909'),
('ff929368-264d-43a6-b450-d02442f5d511', 'c093a1b7-b41c-40e1-b79b-57748faaf0a7', 'ivan_petrov', 'иван Петров', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-20 11:31:32.708', '2026-03-20 11:31:32.708');

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
('00da45f7-7b7b-44c8-b37c-81cca62da7f0', '3c32c6ea-dcfc-4535-90b3-f662140d0db7', '320f322f-97d7-4842-9eef-d3d66851cd10', '2026-04-14 11:52:50.085', '2026-03-15 11:52:50.087', '2026-03-15 11:52:50.087'),
('27d696f4-8c3b-4192-b384-ace9c5bbf38a', '491d7d7a-e014-4023-bfd0-557a311db42f', 'e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', '2026-04-18 16:08:00.660', '2026-03-19 16:08:00.662', '2026-03-19 16:08:00.662'),
('3a742642-de0e-4cc3-9844-601a6fbac941', '599b1ded-1575-44fe-a535-9be790986462', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-19 06:55:35.658', '2026-03-20 06:55:35.659', '2026-03-20 06:55:35.659'),
('4f99a233-0a6f-47e6-b41e-a7ea32be8636', '959d53ff-4488-49bf-b6fd-62e535eab87f', '9c406b56-4804-4d86-b612-a11c10826b06', '2026-04-12 16:22:34.913', '2026-03-13 16:22:34.915', '2026-03-13 16:22:34.915'),
('5c76fd61-a5eb-46c1-8911-6f8025a40186', 'c5998f6e-432b-40c7-ba95-a5f09c946ab1', 'c093a1b7-b41c-40e1-b79b-57748faaf0a7', '2026-04-23 13:16:26.919', '2026-03-24 13:16:26.924', '2026-03-24 13:16:26.924'),
('74e57c0d-a12a-4650-b606-26b23718fcff', '2d7d5e23-4af5-4fa4-9d81-bd9cd30c4b17', 'e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', '2026-04-15 15:02:18.287', '2026-03-16 15:02:18.295', '2026-03-16 15:02:18.295'),
('7b76cd4f-058a-43dc-a604-b2886890c72c', '815572db-d434-481f-90d6-1232f64cf32d', 'e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', '2026-04-17 13:39:14.923', '2026-03-18 13:39:14.925', '2026-03-18 13:39:14.925'),
('7d06c425-7caa-4783-8f66-e8b678720110', '8b6fc5c3-fc50-4b63-8f0d-285570ea8629', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-17 10:33:45.995', '2026-03-18 10:33:45.998', '2026-03-18 10:33:45.998'),
('7d51f500-fc99-4f43-83f8-12826fbd0762', '4a2ad9ff-d594-4e16-858c-66bf4b570b61', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-15 11:13:29.213', '2026-03-16 11:13:29.220', '2026-03-16 11:13:29.220'),
('9eac306a-9fc9-4a85-9136-f023fb765c89', 'a8c10ef1-4b70-4994-910c-da653802abf5', '3bb5404d-bcad-478d-9cbc-9c838937da5a', '2026-04-12 16:16:46.472', '2026-03-13 16:16:46.475', '2026-03-13 16:16:46.475'),
('c4ea7288-57f9-47e4-b61d-d524853313b3', '0fae0d5d-fa79-46fa-be76-05a501c0ad2a', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-04-15 15:44:56.936', '2026-03-16 15:44:56.939', '2026-03-16 15:44:56.939');

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
('19c1cd22-87ea-4c6c-a969-69ce4548346e', 'ff929368-264d-43a6-b450-d02442f5d511', 'premium_monthly', 'CANCELED', '2026-03-24 14:09:00.383', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-03-24 14:09:00.386', '2026-03-24 14:11:57.903', '2026-03-24 14:11:57.901', '2026-03-24 14:11:57.901'),
('5ce718fc-b28a-4d6e-b3c2-7dfed31cc827', 'ff929368-264d-43a6-b450-d02442f5d511', 'premium_monthly', 'ACTIVE', '2026-03-24 14:31:32.494', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-03-24 14:31:32.496', '2026-03-24 14:31:32.496', NULL, NULL),
('d078871c-876e-4fa2-983c-11fba0615dbb', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 'premium_monthly', 'ACTIVE', '2026-03-24 13:14:33.912', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-03-24 13:14:33.967', '2026-03-24 13:14:33.967', NULL, NULL),
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
('5f2ece31-3f98-40bd-a167-41505d1ef996', '238212e6-887b-40c1-9cc3-468887b91574', 'sd\nWhere does it come from?\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.\n\nWhere can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.', 308, 2, '2026-03-19 15:13:38.555', '2026-03-19 15:13:38.555'),
('a4207300-a13c-405a-8d0b-4b1c8d7e5709', '42d89e6d-7d94-4acd-abb3-45356f77abe2', '# React + TypeScript + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:\n\n```js\nexport default tseslint.config({\n  extends: [\n    // Remove ...tseslint.configs.recommended and replace with this\n    ...tseslint.configs.recommendedTypeChecked,\n    // Alternatively, use this for stricter rules\n    ...tseslint.configs.strictTypeChecked,\n    // Optionally, add this for stylistic rules\n    ...tseslint.configs.stylisticTypeChecked,\n  ],\n  languageOptions: {\n    // other options...\n    parserOptions: {\n      project: [\'./tsconfig.node.json\', \'./tsconfig.app.json\'],\n      tsconfigRootDir: import.meta.dirname,\n    },\n  },\n})\n```\n\nYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:\n\n```js\n// eslint.config.js\nimport reactX from \'eslint-plugin-react-x\'\nimport reactDom from \'eslint-plugin-react-dom\'\n\nexport default tseslint.config({\n  plugins: {\n    // Add the react-x and react-dom plugins\n    \'react-x\': reactX,\n    \'react-dom\': reactDom,\n  },\n  rules: {\n    // other rules...\n    // Enable its recommended typescript rules\n    ...reactX.configs[\'recommended-typescript\'].rules,\n    ...reactDom.configs.recommended.rules,\n  },\n})\n```\n', 168, 1, '2026-03-20 07:34:44.848', '2026-03-20 07:34:48.172'),
('cc0e8400-e29b-41d4-a716-446655440701', 'aa0e8400-e29b-41d4-a716-446655440502', '<h2>Что такое инфляция?</h2><p>Инфляция — это устойчивое повышение общего уровня цен на товары и услуги...</p><h3>Виды инфляции</h3><ul><li>Умеренная (до 10% в год)</li><li>Галопирующая (10-50%)</li><li>Гиперинфляция (более 50%)</li></ul>', 450, 3, '2026-01-20 10:05:00.000', '2026-03-13 11:16:27.614'),
('cc0e8400-e29b-41d4-a716-446655440702', 'aa0e8400-e29b-41d4-a716-446655440506', '<h2>Принципы диверсификации</h2><p>«Не кладите все яйца в одну корзину» — золотое правило инвестора...</p><h3>Уровни диверсификации</h3><ol><li>По классам активов</li><li>По отраслям</li><li>По географии</li><li>По валютам</li></ol>', 380, 2, '2026-02-01 12:05:00.000', '2026-03-13 11:16:27.614'),
('cf5aa587-4d08-4c08-8c57-f0a3859383ba', 'ae153975-21c2-447d-8071-55300b1ffa0b', '# Экономикус (Economikus) - Техническая документация\n\n> Подробное техническое описание проекта для разработчиков и архитекторов\n\n---\n\n## Содержание\n\n1. [Обзор проекта](#1-обзор-проекта)\n2. [Технологический стек](#2-технологический-стек)\n3. [База данных](#3-база-данных)\n4. [API Endpoints](#4-api-endpoints)\n5. [Страницы и маршруты](#5-страницы-и-маршруты)\n6. [Компоненты](#6-компоненты)\n7. [Формы и валидация](#7-формы-и-валидация)\n8. [Модальные окна](#8-модальные-окна)\n9. [Калькуляторы](#9-калькуляторы)\n10. [Админ-панель](#10-админ-панель)\n11. [Аутентификация](#11-аутентификация)\n12. [Структура проекта](#12-структура-проекта)\n\n---\n\n## 1. Обзор проекта\n\n**Название**: Экономикус (Economikus)  \n**Тип**: Образовательная платформа (LMS — Learning Management System)  \n**Веб-сайт**: economikus.ru  \n\nПлатформа для обучения финансам и инвестициям. Включает курсы, модули, уроки (статьи, видео, аудио, квизы), подписки, платежи и сертификаты.\n\n### Архитектура\n\nПроект построен на современном стеке:\n- **Frontend**: React 19 + Vite 6\n- **Backend**: Hono (edge-ready HTTP-фреймворк) на порту 3000\n- **База данных**: MySQL + Prisma ORM 5.22.0\n\n### Статус реализации\n\n| Модуль | Статус |\n|--------|--------|\n| Header / Footer | ✅ Реализовано |\n| Страницы авторизации | ✅ Реализовано (login, register) |\n| Главная страница | ✅ Реализовано |\n| Аутентификация API | ✅ Реализовано (register, login, logout, me) |\n| API курсов | ✅ Реализовано (CRUD, фильтры, пагинация) |\n| API уроков | ✅ Реализовано (CRUD, фильтры, пагинация) |\n| API пользователя | ✅ Реализовано (profile, history, favorites, progress) |\n| API тегов | ✅ Реализовано (CRUD) |\n| API комментариев | ✅ Реализовано (CRUD) |\n| API реакций | ✅ Реализовано (like/dislike) |\n| API модерации | 🔄 Заглушка |\n| API платежей | 🔄 Заглушка |\n| Админ-панель | ✅ Реализовано (dashboard, users, courses, lessons, tags) |\n| Страницы каталога | ❌ Не реализовано |\n| Страницы профиля | ❌ Не реализовано |\n| Калькуляторы | ❌ Не реализовано |\n\n### Целевая аудитория\n\n1. **Стартующий (18-24 года)**: студенты, мало денег, нужны базовые знания\n2. **Строитель (25-34 года)**: есть доход, нет времени, боится ошибок\n3. **Семьянин (35-44 года)**: есть накопления, нужна безопасная стратегия\n\n---\n\n## 2. Технологический стек\n\n| Категория         | Технология                                                            |\n| ----------------- | --------------------------------------------------------------------- |\n| Frontend          | React 19 + Vite 6                                                     |\n| Backend           | Hono 4.x + @hono/node-server                                          |\n| Язык              | TypeScript                                                            |\n| База данных       | MySQL + Prisma ORM 5.22.0                                            |\n| Аутентификация    | Сессии через cookies (bcryptjs для хэширования)                      |\n| UI-библиотека     | Mantine v8                                                            |\n| Стили             | TailwindCSS v4                                                        |\n| Стейт-менеджмент  | Zustand                                                               |\n| Валидация         | Zod + react-hook-form + @hookform/resolvers                          |\n| HTTP-клиент       | TanStack Query (@tanstack/react-query)                               |\n| Линтинг           | ESLint                                                                |\n| Иконки            | Lucide React                                                          |\n| Роутинг           | react-router-dom 7.x                                                  |\n\n---\n\n## 2.1. Правила разработки\n\n### Алиасы путей (Path Aliases)\n\nВ проекте настроены алиасы для удобного импорта файлов:\n\n```typescript\n// ✅ Правильно — используйте алиас @/\nimport { api } from \'@/lib/api\'\nimport { Button } from \'@/components/Button\'\n\n// ❌ Неправильно — не используйте относительные пути\nimport { api } from \'../../libми, а такжке дальнейший трекер развитяи/api\'\nimport { Button } from \'../components/Button\'\n```\n\n**Настройка:**\n- `vite.config.ts` — алиас `@` → `./src`\n- `tsconfig.app.json` — paths `@/*` → `src/*`\n\n### Иконки\n\nВ проекте используется библиотека **Lucide React** для иконок.\n\n```typescript\n// ✅ Правильно\nimport { Plus, Search, MoreVertical, Pencil, Trash2 } from \'lucide-react\'\n\n// ❌ Неправильно — @mantine/icons не существует в Mantine v7\nimport { IconPlus, IconSearch } from \'@mantine/icons\'\n```\n\n**Часто используемые иконки:**\n| Действие | Иконка |\n|----------|--------|\n| Добавить | `Plus` |\n| Поиск | `Search` |\n| Меню | `MoreVertical` |\n| Редактировать | `Pencil` |\n| Удалить | `Trash2` |\n| Просмотр | `Eye` |\n| Настройки | `Settings` |\n| Пользователь | `User` |\n| Выход | `LogOut` |\n\n---\n\n```json\n{\n  \"dependencies\": {\n    \"@hono/zod-validator\": \"^0.7.6\",\n    \"@hookform/resolvers\": \"^5.2.2\",\n    \"@mantine/core\": \"^8.3.16\",\n    \"@mantine/hooks\": \"^8.3.16\",\n    \"@prisma/client\": \"^5.22.0\",\n    \"@tanstack/react-query\": \"^5.90.21\",\n    \"bcryptjs\": \"^3.0.3\",\n    \"hono\": \"^4.12.7\",\n    \"react\": \"^19.1.0\",\n    \"react-dom\": \"^19.1.0\",\n    \"react-hook-form\": \"^7.71.2\",\n    \"react-router-dom\": \"^7.13.1\",\n    \"zod\": \"^4.3.6\",\n    \"zustand\": \"^5.0.11\"\n  },\n  \"devDependencies\": {\n    \"@hono/vite-dev-server\": \"^0.25.1\",\n    \"prisma\": \"^5.22.0\",\n    \"tsx\": \"^4.21.0\",\n    \"vite\": \"^6.3.5\"\n  }\n}\n```\n\n---\nВажный совет (Persist):\n\nЕсли вы хотите, чтобы данные в Zustand **не пропадали при перезагрузке страницы**, используйте встроенный мидлвар `persist`:\n\n```typescript\nimport { create } from \'zustand\'\nimport { persist } from \'zustand/middleware\'\n\nexport const useUserStore = create(\n  persist(\n    (set) => ({ /* ваш стор */ }),\n    { name: \'user-storage\' } // имя ключа в LocalStorage\n  )\n)\n```\n\n## 3. База данных\n\n### 3.1 Схема MySQL (Prisma ORM)\n\nПроект использует схему MySQL с 28 моделями:\n\n#### Основные модели\n\n| Модель | Назначение | Ключевые поля |\n|--------|------------|---------------|\n| **User** | Пользователь системы | email, firstName, lastName, role, isBlocked |\n| **Profile** | Публичный профиль | userId, nickname, displayName, avatarUrl, bio |\n| **Course** | Курсы | title, slug, description, coverImage, difficultyLevel, isPremium |\n| **Module** | Модули внутри курсов | courseId, title, sortOrder, lessonsCount |\n| **Lesson** | Уроки (статьи, видео, аудио, квизы) | moduleId, title, slug, lessonType, isPremium |\n| **TextContent** | Текстовый контент урока | lessonId, body, wordCount, readingTime |\n| **VideoContent** | Видеоконтент урока | lessonId, videoUrl, provider, duration |\n| **AudioContent** | Аудиоконтент урока | lessonId, audioUrl, duration |\n| **QuizContent** | Квизы | lessonId, questions, passingScore |\n| **Tag** | Теги | name, slug, color |\n| **CourseTag** | Связь тегов с курсами | courseId, tagId |\n| **LessonTag** | Связь тегов с уроками | lessonId, tagId |\n| **Comment** | Комментарии | commentableType, commentableId, authorProfileId, text |\n| **Reaction** | Лайки/дизлайки (курсы, уроки, комментарии) | profileId, type, reactionableType, reactionableId |\n| **Favorite** | Избранное | profileId, lessonId, collection |\n| **History** | История просмотров | profileId, historableType, historableId, watchedSeconds |\n| **CourseProgress** | Прогресс прохождения курса | profileId, courseId, status, progressPercent |\n| **LessonProgress** | Прогресс прохождения урока | profileId, lessonId, status, progressPercent |\n| **Subscription** | Подписки пользователей | profileId, planType, status, startDate, endDate |\n| **Transaction** | Транзакции и платежи | profileId, type, amount, status, provider |\n| **PaymentMethod** | Методы оплаты | profileId, type, provider, last4, cardType |\n| **Certificate** | Сертификаты курсов | profileId, courseId, certificateNumber, imageUrl |\n| **Notification** | Уведомления | profileId, type, title, body, isRead |\n| **BusinessEvent** | События аналитики | profileId, eventType, eventCategory, metadata |\n| **Session** | Сессии пользователей | sessionToken, userId, expires |\n| **Account** | OAuth аккаунты | userId, provider, providerAccountId |\n| **VerificationToken** | Токены верификации | identifier, token, expires |\n| **Authenticator** | WebAuthn аутентификаторы | userId, credentialID, credentialPublicKey |\n\n#### 3.2 Enums (перечисления)\n\n```prisma\n// Роли пользователей\nenum Role {\n  USER      // Обычный пользователь\n  AUTHOR    // Автор контента\n  MODERATOR // Модератор\n  ADMIN     // Администратор\n}\n\n// Статусы контента\nenum ContentStatus {\n  DRAFT           // Черновик\n  PENDING_REVIEW  // На модерации\n  PUBLISHED       // Опубликован\n  ARCHIVED        // В архиве\n  DELETED         // Удалён (soft delete)\n}\n\n// Уровень сложности курса\nenum DifficultyLevel {\n  BEGINNER      // Начинающий\n  INTERMEDIATE  // Средний\n  ADVANCED      // Продвинутый\n}\n\n// Тип видео-провайдера\nenum VideoProvider {\n  YOUTUBE\n  RUTUBE\n  VIMEO\n  LOCAL\n}\n\n// Типы уроков\nenum LessonType {\n  ARTICLE   // Статья\n  VIDEO     // Видео\n  AUDIO     // Аудио\n  QUIZ      // Тест/квиз\n  CALCULATOR // Калькулятор\n}\n\n// Типы комментируемых объектов\nenum CommentableType {\n  COURSE\n  LESSON\n}\n\n// Типы объектов для реакций\nenum ReactionableType {\n  COURSE\n  LESSON\n  COMMENT\n}\n\n// Статусы подписки\nenum SubscriptionStatus {\n  ACTIVE      // Активна\n  PAST_DUE    // Просрочена\n  CANCELED    // Отменена\n  EXPIRED     // Истекла\n}\n\n// Статусы транзакций\nenum TransactionStatus {\n  PENDING    // В ожидании\n  COMPLETED  // Завершена\n  FAILED     // Ошибка\n  REFUNDED   // Возвращена\n}\n\n// Типы реакций\nenum ReactionType {\n  LIKE\n  DISLIKE\n}\n\n// Статусы модерации\nenum ModerationStatus {\n  PENDING   // На рассмотрении\n  APPROVED  // Одобрено\n  REJECTED  // Отклонено\n}\n\n// Типы уведомлений\nenum NotificationType {\n  EMAIL\n  IN_APP\n  TELEGRAM\n}\n\n// Типы объектов для истории\nenum HistorableType {\n  LESSON\n  STANDALONE_ARTICLE\n}\n\n// Типы бизнес-объектов\nenum BusinessObjectType {\n  COURSE\n  LESSON\n  COMMENT\n  SUBSCRIPTION\n}\n```\n\n#### 3.3 Особенности реализации\n\n- **Soft Delete**: Многие модели имеют поле `deletedAt` для мягкого удаления\n- **User vs Profile**: \n  - User — аутентификация и безопасность (email, passwordHash, role)\n  - Profile — контент и активности (courses, lessons, comments, reactions)\n- **Полиморфизм уроков**: Lesson содержит lessonType и связанные таблицы (TextContent, VideoContent, AudioContent, QuizContent)\n- **Кешированная статистика**: Course и Lesson хранят viewsCount, likesCount\n\n---\n\n## 4. API Endpoints\n\nAPI построен на Hono фреймворке. Все роуты находятся в `server/index.ts`.\n\n### 4.1 Аутентификация ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 1 | POST | `/api/auth/register` | Регистрация нового пользователя | Все |\n| 2 | POST | `/api/auth/login` | Вход по email/password | Все |\n| 3 | POST | `/api/auth/logout` | Выход | Авторизованный |\n| 4 | GET | `/api/auth/me` | Текущий пользователь (по сессии) | Авторизованный |\n\n**Примеры запросов:**\n\n```json\n// POST /api/auth/register\n{\n  \"email\": \"user@example.com\",\n  \"firstName\": \"Иван\",\n  \"lastName\": \"Петров\",\n  \"password\": \"Password123\",\n  \"nickname\": \"ivan_petrov\"\n}\n\n// POST /api/auth/login\n{\n  \"email\": \"user@example.com\",\n  \"password\": \"Password123\",\n  \"remember\": true\n}\n```\n\n### 4.2 Курсы ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 5 | GET | `/api/courses` | Список курсов с пагинацией и фильтрами | Все |\n| 6 | GET | `/api/courses/:slug` | Детальная страница курса | Все |\n| 7 | GET | `/api/courses/:slug/modules` | Модули курса | Все |\n| 8 | GET | `/api/courses/:slug/modules/:id` | Модуль с уроками | Все |\n\n### 4.3 Уроки ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 9 | GET | `/api/lessons` | Список уроков с фильтрами | Все |\n| 10 | GET | `/api/lessons/:slug` | Детальная страница урока | Все |\n| 11 | GET | `/api/lessons/:slug/content` | Контент урока (текст/видео/аудио) | Все |\n\n### 4.4 Пользователь ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 12 | GET | `/api/user/me` | Текущий пользователь | Авторизованный |\n| 13 | PATCH | `/api/user/profile` | Обновление профиля | Авторизованный |\n| 14 | GET | `/api/user/profile/:nickname` | Публичный профиль | Все |\n| 15 | GET | `/api/user/history` | История просмотров | Авторизованный |\n| 16 | POST | `/api/user/history` | Добавить в историю | Авторизованный |\n| 17 | GET | `/api/user/favorites` | Избранное | Авторизованный |\n| 18 | POST | `/api/user/favorites` | Добавить в избранное | Авторизованный |\n| 19 | DELETE | `/api/user/favorites/:id` | Удалить из избранного | Авторизованный |\n| 20 | GET | `/api/user/progress/courses` | Прогресс по курсам | Авторизованный |\n| 21 | GET | `/api/user/progress/lessons/:id` | Прогресс по уроку | Авторизованный |\n| 22 | POST | `/api/user/progress/lessons/:id` | Обновить прогресс | Авторизованный |\n| 23 | GET | `/api/user/certificates` | Сертификаты | Авторизованный |\n\n### 4.5 Реакции ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 24 | GET | `/api/reactions` | Получить реакции | Все |\n| 25 | POST | `/api/reactions` | Поставить реакцию | Авторизованный |\n| 26 | DELETE | `/api/reactions` | Удалить реакцию | Авторизованный |\n\n### 4.6 Теги ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 27 | GET | `/api/tags` | Список тегов | Все |\n| 28 | GET | `/api/tags/:slug/courses` | Курсы по тегу | Все |\n| 29 | GET | `/api/tags/:slug/lessons` | Уроки по тегу | Все |\n\n### 4.7 Комментарии ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 30 | GET | `/api/comments` | Список комментариев | Все |\n| 31 | POST | `/api/comments` | Добавить комментарий | Авторизованный |\n| 32 | PATCH | `/api/comments/:id` | Редактировать комментарий | Авторизованный |\n| 33 | DELETE | `/api/comments/:id` | Удалить комментарий | Авторизованный |\n\n### 4.8 Платежи 🔄 Заглушка\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 38 | GET | `/api/payment/plans` | Тарифы подписки | Все |\n| 39 | POST | `/api/payment/subscribe` | Оформление подписки | Авторизованный |\n| 40 | POST | `/api/payment/cancel` | Отмена подписки | Авторизованный |\n\n### 4.9 Модерация 🔄 Заглушка\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 34 | GET | `/api/moderation` | Контент на модерации | MODERATOR, ADMIN |\n| 35 | POST | `/api/moderation/:id/approve` | Одобрить контент | MODERATOR, ADMIN |\n| 36 | POST | `/api/moderation/:id/reject` | Отклонить контент | MODERATOR, ADMIN |\n\n### 4.10 Администрирование ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 37 | GET | `/api/admin/stats` | Статистика системы | ADMIN |\n| 38 | GET | `/api/admin/users` | Список пользователей | ADMIN |\n| 39 | PATCH | `/api/admin/users/:id` | Изменить пользователя | ADMIN |\n| 40 | DELETE | `/api/admin/users/:id` | Удалить пользователя | ADMIN |\n| 41 | GET | `/api/admin/courses` | Список курсов (админ) | ADMIN |\n| 42 | POST | `/api/admin/courses` | Создать курс | ADMIN |\n| 43 | PATCH | `/api/admin/courses/:id` | Обновить курс | ADMIN |\n| 44 | DELETE | `/api/admin/courses/:id` | Удалить курс | ADMIN |\n| 45 | GET | `/api/admin/modules` | Список модулей | ADMIN |\n| 46 | POST | `/api/admin/modules` | Создать модуль | ADMIN |\n| 47 | PATCH | `/api/admin/modules/:id` | Обновить модуль | ADMIN |\n| 48 | DELETE | `/api/admin/modules/:id` | Удалить модуль | ADMIN |\n| 49 | GET | `/api/admin/lessons` | Список уроков (админ) | ADMIN |\n| 50 | POST | `/api/admin/lessons` | Создать урок | ADMIN |\n| 51 | PATCH | `/api/admin/lessons/:id` | Обновить урок | ADMIN |\n| 52 | DELETE | `/api/admin/lessons/:id` | Удалить урок | ADMIN |\n| 53 | GET | `/api/admin/lessons/:id/content` | Контент урока | ADMIN |\n| 54 | PATCH | `/api/admin/lessons/:id/content` | Обновить контент | ADMIN |\n| 55 | GET | `/api/admin/tags` | Список тегов (админ) | ADMIN |\n| 56 | POST | `/api/admin/tags` | Создать тег | ADMIN |\n| 57 | PATCH | `/api/admin/tags/:id` | Обновить тег | ADMIN |\n| 58 | DELETE | `/api/admin/tags/:id` | Удалить тег | ADMIN |\n\n### 4.11 Каталог 🔄 Заглушка\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 48 | GET | `/api/catalog` | Каталог с фильтрами | Все |\n\n### 4.12 Health Check\n\n| Метод | Путь | Описание |\n|-------|------|----------|\n| GET | `/api/health` | Проверка работоспособности сервера |\n\n**Параметры запроса `/api/courses`:**\n- `page` — номер страницы (по умолчанию 1)\n- `limit` — количество на странице (по умолчанию 20)\n- `status` — фильтр по статусу (PUBLISHED, DRAFT)\n- `difficulty` — фильтр по сложности (BEGINNER, INTERMEDIATE, ADVANCED)\n- `tag` — фильтр по тегу (slug тега)\n- `search` — поиск по названию\n- `author` — фильтр по автору\n- `isPremium` — фильтр по premium статусу\n- `sort` — сортировка (created_at_desc, created_at_asc, popular)\n\n---\n\n## 5. Страницы и маршруты\n\nПроект использует Vite + React Router 7. Маршруты настраиваются в `src/App.tsx`.\n\n### 5.1 Текущая реализация\n\n**Реализованные страницы:**\n\n| № | Путь | Компонент | Описание | Статус |\n|---|------|-----------|----------|--------|\n| 1 | `/` | `src/pages/HomePage.tsx` | Главная страница | ✅ |\n| 2 | `/login` | `src/pages/auth/LoginPage.tsx` | Страница входа | ✅ |\n| 3 | `/register` | `src/pages/auth/RegisterPage.tsx` | Страница регистрации | ✅ |\n| 4 | `/catalog` | Заглушка | Каталог курсов | 🔄 |\n| 5 | `/courses` | Заглушка | Список курсов | 🔄 |\n| 6 | `/calculators` | Заглушка | Калькуляторы | 🔄 |\n| 7 | `/profile` | Заглушка | Профиль пользователя | 🔄 |\n\n**Админ-панель (реализовано):**\n\n| № | Путь | Компонент | Описание | Статус |\n|---|------|-----------|----------|--------|\n| 8 | `/admin` | `src/pages/admin/AdminDashboard.tsx` | Дашборд | ✅ |\n| 9 | `/admin/courses` | `src/pages/admin/AdminCourses.tsx` | Управление курсами | ✅ |\n| 10 | `/admin/lessons` | `src/pages/admin/AdminLessons.tsx` | Управление уроками | ✅ |\n| 11 | `/admin/tags` | `src/pages/admin/AdminTags.tsx` | Управление тегами | ✅ |\n| 12 | `/admin/users` | `src/pages/admin/AdminUsers.tsx` | Управление пользователями | ✅ |\n\n**Layouts:**\n\n| Layout | Компонент | Описание |\n|--------|-----------|----------|\n| MainLayout | `src/layouts/MainLayout.tsx` | Header + Footer |\n| AuthLayout | `src/layouts/AuthLayout.tsx` | Только Header, центрированный контент |\n\n### 5.2 Планируемые публичные маршруты\n\n| № | Путь | Компонент | Описание |\n|---|------|-----------|----------|\n| 8 | `/course/:slug` | `src/pages/CoursePage.tsx` | Детальная страница курса |\n| 9 | `/course/:slug/module/:moduleId` | `src/pages/ModulePage.tsx` | Страница модуля |\n| 10 | `/lesson/:slug` | `src/pages/LessonPage.tsx` | Страница урока |\n| 11 | `/faq` | `src/pages/FaqPage.tsx` | Вопросы и ответы |\n| 12 | `/tools` | `src/pages/ToolsPage.tsx` | Инструменты |\n| 13 | `/calculator/credit` | `src/pages/CalculatorPage.tsx` | Кредитный калькулятор |\n| 14 | `/calculator/deposit` | `src/pages/CalculatorPage.tsx` | Калькулятор вкладов |\n| 15 | `/calculator/mortgage` | `src/pages/CalculatorPage.tsx` | Ипотечный калькулятор |\n\n### 5.3 Планируемые защищённые маршруты\n\n| № | Путь | Компонент | Описание | Требование |\n|---|------|-----------|----------|------------|\n| 16 | `/profile` | `src/pages/ProfilePage.tsx` | Личный кабинет | Авторизация |\n| 17 | `/profile/courses` | `src/pages/ProfileCoursesPage.tsx` | Мои курсы | Авторизация |\n| 18 | `/profile/favorites` | `src/pages/ProfileFavoritesPage.tsx` | Избранное | Авторизация |\n| 19 | `/profile/settings` | `src/pages/ProfileSettingsPage.tsx` | Настройки профиля | Авторизация |\n| 20 | `/profile/subscription` | `src/pages/ProfileSubscriptionPage.tsx` | Подписка | Авторизация |\n| 21 | `/profile/history` | `src/pages/ProfileHistoryPage.tsx` | История просмотров | Авторизация |\n| 22 | `/profile/certificates` | `src/pages/ProfileCertificatesPage.tsx` | Мои сертификаты | Авторизация |\n\n### 5.4 Планируемые админ-маршруты\n\n| № | Путь | Компонент | Описание | Требование |\n|---|------|-----------|----------|------------|\n| 23 | `/admin` | `src/pages/admin/AdminPage.tsx` | Главная админ-панель | ADMIN |\n| 24 | `/admin/users` | `src/pages/admin/AdminUsersPage.tsx` | Управление пользователями | ADMIN |\n| 25 | `/admin/content` | `src/pages/admin/AdminContentPage.tsx` | Управление контентом | ADMIN |\n| 26 | `/admin/moderation` | `src/pages/admin/AdminModerationPage.tsx` | Модерация контента | MODERATOR, ADMIN |\n| 27 | `/admin/stats` | `src/pages/admin/AdminStatsPage.tsx` | Статистика | ADMIN |\n\n### 5.5 Планируемые автор-маршруты\n\n| № | Путь | Компонент | Описание | Требование |\n|---|------|-----------|----------|------------|\n| 28 | `/author/dashboard` | `src/pages/author/AuthorDashboardPage.tsx` | Панель автора | AUTHOR, ADMIN |\n| 29 | `/author/courses/new` | `src/pages/author/AuthorCourseNewPage.tsx` | Создание курса | AUTHOR, ADMIN |\n| 30 | `/author/courses/:id/edit` | `src/pages/author/AuthorCourseEditPage.tsx` | Редактирование курса | AUTHOR, ADMIN |\n\n---\n\n## 6. Компоненты\n\n### 6.1 Текущая структура\n\nНа данный момент компоненты не вынесены в отдельную папку. Весь UI используется напрямую из Mantine в страницах.\n\n**Используемые компоненты Mantine:**\n- `Container`, `Paper`, `Stack`, `Group`, `Box`\n- `TextInput`, `PasswordInput`, `Checkbox`\n- `Button`, `Title`, `Text`\n- `Alert`, `Divider`, `LoadingOverlay`\n- `Table`\n\n### 6.2 Планируемые общие компоненты (`src/components/common/`)\n\n| № | Компонент | Назначение | Параметры |\n|---|-----------|------------|-----------|\n| 1 | `Button.tsx` | Универсальная кнопка (Mantine Button) | variant, size, disabled, isLoading |\n| 2 | `Input.tsx` | Поле ввода (Mantine Input) | error, type, placeholder, value |\n| 3 | `Slider.tsx` | Слайдер с мин/макс | min, max, step, value, onChange, formatLabel |\n| 4 | `Card.tsx` | Карточка контента | title, description, image, link |\n| 5 | `Modal.tsx` | Модальное окно (Mantine Modal) | isOpen, onClose, title, children |\n| 6 | `Header.tsx` | Шапка сайта | - |\n| 7 | `Footer.tsx` | Подвал сайта | - |\n| 8 | `Reactions.tsx` | Лайки/дизлайки контента | contentId, initialLikes, initialDislikes |\n| 9 | `ViewTracker.tsx` | Отслеживание просмотров | contentId |\n| 10 | `Loader.tsx` | Индикатор загрузки | size, color |\n| 11 | `EmptyState.tsx` | Пустое состояние | title, description, action |\n\n### 6.3 Планируемые компоненты калькуляторов (`src/components/calculators/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 12 | `CreditForm.tsx` | Форма кредитного калькулятора |\n| 13 | `CreditChart.tsx` | График платежей по кредиту |\n| 14 | `CreditResults.tsx` | Результаты расчёта кредита |\n| 15 | `DepositForm.tsx` | Форма калькулятора вкладов |\n| 16 | `DepositChart.tsx` | График начисления процентов |\n| 17 | `DepositResults.tsx` | Результаты расчёта вклада |\n| 18 | `MortgageForm.tsx` | Форма ипотечного калькулятора |\n| 19 | `MortgageChart.tsx` | График ипотечных платежей |\n| 20 | `MortgageResults.tsx` | Результаты расчёта ипотеки |\n\n### 6.4 Планируемые компоненты главной страницы (`src/components/home/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 21 | `HeroSection.tsx` | Герой-секция с призывом к действию |\n| 22 | `FeaturesSection.tsx` | Секция особенностей платформы |\n| 23 | `CourseCard.tsx` | Карточка курса |\n| 24 | `ArticleCard.tsx` | Карточка статьи/урока |\n| 25 | `TestimonialsSection.tsx` | Отзывы пользователей |\n| 26 | `PricingSection.tsx` | Тарифы подписки |\n\n### 6.5 Планируемые компоненты профиля (`src/components/profile/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 27 | `CourseList.tsx` | Список курсов пользователя |\n| 28 | `CourseStats.tsx` | Статистика курсов |\n| 29 | `Certificates.tsx` | Сертификаты |\n| 30 | `ContinueLearning.tsx` | Продолжить обучение |\n| 31 | `FavoritesGrid.tsx` | Сетка избранного |\n| 32 | `CollectionsList.tsx` | Коллекции избранного |\n| 33 | `ProfileForm.tsx` | Форма редактирования профиля |\n| 34 | `AvatarUpload.tsx` | Загрузка аватара |\n| 35 | `SocialLinks.tsx` | Социальные сети |\n| 36 | `SubscriptionStatus.tsx` | Статус подписки |\n| 37 | `PaymentHistory.tsx` | История платежей |\n| 38 | `CancelSubscription.tsx` | Отмена подписки |\n\n### 6.6 Планируемые админ-компоненты (`src/components/admin/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 39 | `UserTable.tsx` | Таблица пользователей с пагинацией |\n| 40 | `ContentTable.tsx` | Таблица контента |\n| 41 | `ModerationQueue.tsx` | Очередь модерации |\n| 42 | `StatsCards.tsx` | Карточки статистики |\n| 43 | `UserFilters.tsx` | Фильтры пользователей |\n| 44 | `ContentFilters.tsx` | Фильтры контента |\n\n---\n\n## 7. Формы и валидация\n\n### 7.1 Форма входа ✅ Реализовано (`src/pages/auth/LoginPage.tsx`)\n\n**Используемые библиотеки:**\n- `react-hook-form` — управление формой\n- `@hookform/resolvers/zod` — интеграция с Zod\n- `@tanstack/react-query` — мутация для отправки\n\n**Валидация:**\n```typescript\n// Zod схема (src/shared/types.ts)\nexport const LoginSchema = z.object({\n  email: z.string()\n    .email(\'Некорректный email\')\n    .min(5)\n    .transform((val) => val.toLowerCase()),\n  password: z.string().min(6, \'Пароль слишком короткий\'),\n  remember: z.boolean().optional()\n})\n```\n\n**Поля формы:**\n- `email` — type=\"email\", обязательное\n- `password` — type=\"password\", обязательное, минимум 6 символов\n- `remember` — checkbox, опциональное\n\n**API запрос:**\n```\nPOST /api/auth/login\nContent-Type: application/json\nCredentials: include\n\n{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\",\n  \"remember\": true\n}\n```\n\n### 7.2 Форма регистрации ✅ Реализовано (`src/pages/auth/RegisterPage.tsx`)\n\n**Валидация:**\n```typescript\n// Zod схема (src/shared/types.ts)\nexport const RegisterSchema = z.object({\n  email: z.string()\n    .email(\'Некорректный формат email\')\n    .min(5, \'Email слишком короткий\')\n    .max(255, \'Email слишком длинный\')\n    .transform((val) => val.toLowerCase()),\n  \n  firstName: z.string()\n    .min(2, \'Имя должно содержать минимум 2 символа\')\n    .max(100, \'Имя слишком длинное\')\n    .regex(/^[\\p{L}\\s\'-]+$/u, \'Имя может содержать только буквы, пробелы, дефисы и апострофы\'),\n  \n  lastName: z.string()\n    .min(2, \'Фамилия должна содержать минимум 2 символа\')\n    .max(100, \'Фамилия слишком длинная\')\n    .regex(/^[\\p{L}\\s\'-]+$/u, \'Фамилия может содержать только буквы, пробелы, дефисы и апострофы\'),\n  \n  password: z.string()\n    .min(6, \'Пароль должен содержать минимум 6 символов\')\n    .max(100, \'Пароль слишком длинный\')\n    .regex(/[A-Z]/, \'Пароль должен содержать хотя бы одну заглавную букву\')\n    .regex(/[a-z]/, \'Пароль должен содержать хотя бы одну строчную букву\')\n    .regex(/[0-9]/, \'Пароль должен содержать хотя бы одну цифру\'),\n  \n  nickname: z.string()\n    .min(3, \'Никнейм должен содержать минимум 3 символа\')\n    .max(50, \'Никнейм слишком длинный\')\n    .regex(/^[a-zA-Z0-9_]+$/, \'Никнейм может содержать только латинские буквы, цифры и подчёркивание\')\n})\n```\n\n**Поля формы:**\n- `email` — type=\"email\", обязательное\n- `firstName` — обязательное, 2-100 символов, только буквы\n- `lastName` — обязательное, 2-100 символов, только буквы\n- `nickname` — обязательное, 3-50 символов, латиница + цифры + _\n- `password` — обязательное, минимум 6 символов, должен содержать:\n  - Заглавную букву\n  - Строчную букву\n  - Цифру\n\n**Индикаторы силы пароля:**\nОтображаются в реальном времени при вводе пароля:\n- ✅ Заглавная буква\n- ✅ Строчная буква\n- ✅ Цифра\n\n**API запрос:**\n```\nPOST /api/auth/register\nContent-Type: application/json\n\n{\n  \"email\": \"user@example.com\",\n  \"firstName\": \"Иван\",\n  \"lastName\": \"Петров\",\n  \"password\": \"Password123\",\n  \"nickname\": \"ivan_petrov\"\n}\n```\n\n### 7.3 Планируемые формы\n\n#### Форма профиля\n**Клиентская валидация:**\n- firstName: обязательно\n- lastName: обязательно\n- nickname: обязательно, мин. 3 символа, только `a-zA-Z0-9_`\n- displayName: обязательно\n- bio: максимум 500 символов\n\n#### Формы калькуляторов\n\n**Кредитный калькулятор:**\n- Сумма кредита: min 10,000, max 100,000,000\n- Процентная ставка: min 1, max 50\n- Срок: min 1, max 600 месяцев\n- Тип платежа: аннуитетный/дифференцированный\n\n**Калькулятор вкладов:**\n- Сумма вклада: min 1,000, max 100,000,000\n- Процентная ставка: min 0.1, max 30\n- Срок: min 1, max 60 месяцев\n- Капитализация: ежемесячно/ежеквартально/ежегодно/нет\n\n**Ипотечный калькулятор:**\n- Сумма кредита: min 100,000, max 100,000,000\n- Процентная ставка: min 1, max 30\n- Срок: min 1, max 50 лет\n- Первоначальный взнос: min 0, max 90%\n\n---\n\n## 8. Модальные окна\n\n### 8.1 Текущий статус\n\n❌ Модальные окна не реализованы. Планируется использование обычных страниц.\n\n\n\n### 8.3 Планируемые страницы\n\n| страница | Назначение | Параметры |\n|---------|------------|-----------|\n| `auth` | Вход/регистрация | `mode`: \"login\" \\| \"register\" |\n| `subscribe` | Оформление подписки | - |\n| `payment` | Оплата | `productId`, `priceId` |\n| `confirm` | Подтверждение действия | `title`, `message`, `onConfirm` |\n| `favorite` | Добавление в избранное | `contentId` |\n\n---\n\n## 9. Калькуляторы\n\n### 9.1 Текущий статус\n\n❌ Калькуляторы не реализованы.\n\n### 9.2 Планируемые калькуляторы\n\n#### Кредитный калькулятор (`/calculator/credit`)\n\n**Функциональность:**\n- Расчёт ежемесячного платежа (аннуитетный/дифференцированный)\n- График платежей\n- Досрочное погашение\n- Визуализация (график)\n\n**Типы:**\n```typescript\ninterface CreditInput {\n  amount: number;        // Сумма кредита\n  rate: number;          // Годовая ставка (%)\n  term: number;          // Срок (месяцев)\n  type: \'annuity\' | \'differentiated\';\n  earlyRepayment?: {\n    amount: number;\n    month: number;\n  };\n}\n\ninterface CreditResult {\n  monthlyPayment: number;\n  totalPayment: number;\n  totalInterest: number;\n  schedule: CreditMonth[];\n}\n```\n\n#### Калькулятор вкладов (`/calculator/deposit`)\n\n**Функциональность:**\n- Расчёт с капитализацией и без\n- Ежемесячное пополнение\n- Эффективная ставка\n- Визуализация (график)\n\n#### Ипотечный калькулятор (`/calculator/mortgage`)\n\n**Функциональность:**\n- Расчёт ипотечного платежа\n- Первоначальный взнос\n- График платежей\n- Страховка (опционально)\n\n---\n\n## 10. Админ-панель\n\n### 10.1 Текущий статус\n\n✅ Админ-панель реализована.\n\n### 10.2 Реализованные страницы\n\n| Страница | Путь | Функциональность |\n|----------|------|------------------|\n| Дашборд | `/admin` | Статистика (пользователи, курсы, уроки, просмотры, премиум) |\n| Пользователи | `/admin/users` | Просмотр, редактирование роли, удаление |\n| Курсы | `/admin/courses` | CRUD курсов, фильтры по статусу/сложности, поиск |\n| Уроки | `/admin/lessons` | CRUD уроков, фильтры по типу/статусу, привязка к модулям |\n| Теги | `/admin/tags` | CRUD тегов с цветами |\n\n### 10.3 Реализованная функциональность\n\n**Дашборд:**\n- Карточки статистики (пользователи, курсы, уроки, просмотры, премиум-пользователи)\n- Быстрые действия (создать курс/урок/тег)\n- Статус системы\n\n**Управление пользователями:**\n- Просмотр списка с пагинацией\n- Поиск по имени/email/никнейму\n- Фильтр по роли (USER/AUTHOR/MODERATOR/ADMIN)\n- Редактирование роли\n- Удаление пользователя\n\n**Управление курсами:**\n- CRUD операций\n- Фильтры по статусу (DRAFT/PUBLISHED/ARCHIVED)\n- Фильтры по сложности (BEGINNER/INTERMEDIATE/ADVANCED)\n- Поиск по названию\n- Редактирование: название, описание, сложность, премиум-статус, обложка\n\n**Управление уроками:**\n- CRUD операций\n- Фильтры по типу (ARTICLE/VIDEO/AUDIO/QUIZ)\n- Фильтры по статусу\n- Привязка к курсу и модулю\n- Редактирование контента (текст/видео/аудио/квиз)\n\n**Управление тегами:**\n- CRUD операций\n- Выбор цвета тега\n- Автоматическая генерация slug\n\n### 10.4 Защита маршрутов\n\n- Проверка роли `ADMIN` при входе в админ-панель\n- Проверка сессии через cookie\n- Редирект на главную при отсутствии прав\n- Редирект на страницу входа при отсутствии сессии\n\n---\n\n## 11. Аутентификация\n\n### 11.1 Текущая реализация ✅\n\n**Технологии:**\n- **Сессионная аутентификация** (НЕ JWT)\n- Сессии через cookies (HttpOnly, SameSite=Strict)\n- bcryptjs для хэширования паролей (12 раундов)\n- UUID для токенов сессий\n\n**Срок действия сессии:** 30 дней\n\n**Важно:** Мы НЕ используем JWT токены. Вместо этого используется сессионная аутентификация с хранением сессий в базе данных.\n\n**Файлы:**\n- `server/routes/auth.routes.ts` — роуты аутентификации\n- `src/lib/api.ts` — axios с withCredentials\n- `src/shared/types.ts` — Zod схемы валидации\n\n### 11.2 Как работают сессии\n\n**Структура таблицы Session:**\n```prisma\nmodel Session {\n  id           String   @id\n  sessionToken String   @unique  // Уникальный токен\n  userId       String              // Может быть несколько сессий на одного пользователя\n  expires      DateTime\n  user         User     @relation(...)\n  \n  @@index([userId])\n}\n```\n\n**Процесс входа:**\n1. Пользователь отправляет email/password\n2. Сервер проверяет credentials\n3. Создаётся новая запись в таблице Session\n4. В браузер устанавливается cookie: `session=<token>; HttpOnly; SameSite=Strict`\n\n**Многодевайсная авторизация:**\n- Один пользователь может иметь **несколько сессий** (разные устройства/браузеры)\n- При логине создаётся новая сессия, старые НЕ удаляются\n- Это позволяет быть авторизованным одновременно на ПК и телефоне\n\n### 11.3 Возможные улучшения\n\n**1. Ограничение количества сессий:**\n```typescript\n// Удалить старые сессии, если больше 5\nconst existing = await prisma.session.count({ where: { userId } })\nif (existing >= 5) {\n  await prisma.session.deleteMany({\n    where: { userId },\n    orderBy: { createdAt: \'asc\' },\n    take: existing - 4\n  })\n}\n```\n\n**2. Очистка истёкших сессий (cron job):**\n```typescript\n// Удалить просроченные сессии\nawait prisma.session.deleteMany({\n  where: { expires: { lt: new Date() } }\n})\n```\n\n**3. \"Выйти со всех устройств\":**\n```typescript\n// Удалить все сессии пользователя, кроме текущей\nawait prisma.session.deleteMany({\n  where: { \n    userId: currentUserId,\n    sessionToken: { not: currentToken }\n  }\n})\n```\n\n### 11.4 API Endpoints\n\n| Endpoint | Метод | Описание |\n|----------|-------|----------|\n| `/api/auth/register` | POST | Регистрация нового пользователя |\n| `/api/auth/login` | POST | Вход по email/password |\n| `/api/auth/logout` | POST | Выход (удаление сессии) |\n| `/api/auth/me` | GET | Получение текущего пользователя по cookie |\n\n### 11.3 Процесс регистрации\n\n1. Валидация данных через Zod (RegisterSchema)\n2. Проверка уникальности email и nickname\n3. Хэширование пароля (bcryptjs, 12 раундов)\n4. Создание User и Profile в транзакции\n5. Автоматическая генерация аватара через ui-avatars.com\n\n### 11.4 Процесс входа\n\n1. Валидация данных через Zod (LoginSchema)\n2. Поиск пользователя по email\n3. Проверка пароля (bcryptjs compare)\n4. Проверка на блокировку (isBlocked)\n5. Создание сессии в БД (Session table)\n6. Установка cookie с sessionToken\n7. Обновление lastLoginAt\n\n### 11.5 Роли и права доступа\n\n| Роль | Доступ |\n|------|--------|\n| USER | Личный кабинет, курсы, избранное, история |\n| AUTHOR | + Создание контента, авторская панель |\n| MODERATOR | + Модерация контента |\n| ADMIN | + Полное управление пользователями и контентом |\n\n### 11.6 Структура ответов\n\n**Успешная регистрация (201):**\n```json\n{\n  \"message\": \"User created successfully\",\n  \"user\": {\n    \"id\": \"uuid\",\n    \"email\": \"user@example.com\",\n    \"firstName\": \"Иван\",\n    \"lastName\": \"Петров\",\n    \"role\": \"USER\",\n    \"profile\": {\n      \"id\": \"uuid\",\n      \"nickname\": \"ivan_petrov\",\n      \"displayName\": \"Иван Петров\",\n      \"avatarUrl\": \"https://ui-avatars.com/...\"\n    }\n  }\n}\n```\n\n**Ошибка (400/401/500):**\n```json\n{\n  \"error\": \"Сообщение об ошибке\",\n  \"code\": \"ERROR_CODE\",\n  \"details\": [{ \"field\": \"email\", \"message\": \"Ошибка валидации\" }]\n}\n```\n\n---\n\n## 12. Структура проекта\n\n### 12.1 Текущая структура\n\n```\n├── src/                         # Исходный код фронтенда\n│   ├── components/              # React компоненты\n│   │   ├── common/              # Общие компоненты\n│   │   └── layout/              # Layout компоненты\n│   │       ├── Header.tsx       # Шапка сайта ✅\n│   │       ├── Footer.tsx       # Подвал сайта ✅\n│   │       └── index.ts         # Экспорт\n│   ├── layouts/                 # Layout обёртки\n│   │   ├── MainLayout.tsx       # Основной layout (Header + Footer) ✅\n│   │   ├── AuthLayout.tsx       # Layout для авторизации (только Header) ✅\n│   │   └── index.ts             # Экспорт\n│   ├── pages/                   # Страницы\n│   │   ├── auth/                # Страницы авторизации\n│   │   │   ├── LoginPage.tsx    # Страница входа ✅\n│   │   │   └── RegisterPage.tsx # Страница регистрации ✅\n│   │   └── HomePage.tsx         # Главная страница ✅\n│   ├── shared/                  # Общие типы и утилиты\n│   │   └── types.ts             # TypeScript типы и Zod схемы ✅\n│   ├── store/                   # Zustand сторы\n│   │   └── useAppStore.ts       # Глобальный стор ✅\n│   ├── assets/                  # Статические ресурсы\n│   ├── App.tsx                  # Главный компонент с роутингом ✅\n│   ├── main.tsx                 # Точка входа ✅\n│   └── vite-env.d.ts           # Типы Vite\n│\n├── server/                      # Бэкенд (Hono)\n│   ├── routes/                  # API роуты\n│   │   ├── auth.routes.ts       # Аутентификация ✅\n│   │   ├── user.routes.ts       # Пользователь 🔄 Заглушка\n│   │   ├── courses.routes.ts    # Курсы 🔄 Заглушка\n│   │   ├── lessons.routes.ts    # Уроки 🔄 Заглушка\n│   │   ├── comments.routes.ts   # Комментарии 🔄 Заглушка\n│   │   ├── reactions.routes.ts  # Реакции 🔄 Заглушка\n│   │   ├── tags.routes.ts       # Теги 🔄 Заглушка\n│   │   ├── payments.routes.ts   # Платежи 🔄 Заглушка\n│   │   ├── moderation.routes.ts # Модерация 🔄 Заглушка\n│   │   └── admin.routes.ts      # Админ 🔄 Заглушка\n│   ├── middleware/              # Middleware\n│   │   ├── auth.ts              # Auth middleware 🔄 Заглушка\n│   │   ├── logger.ts            # Logger 🔄 Заглушка\n│   │   └── rate-limit.ts        # Rate limiting 🔄 Заглушка\n│   ├── lib/                     # Библиотеки\n│   │   ├── auth.ts              # Auth конфигурация 🔄 Резерв\n│   │   ├── errors.ts            # Классы ошибок ✅\n│   │   ├── validators.ts        # Zod схемы 🔄 Заглушка\n│   │   └── agination.ts         # Пагинация 🔄 Заглушка\n│   ├── db.ts                    # Prisma клиент ✅\n│   └── index.ts                 # Главный файл сервера ✅\n│\n├── prisma/                      # База данных\n│   ├── schema.prisma            # Схема БД ✅\n│   └── migrations/              # Миграции\n│\n├── public/                      # Статические файлы\n│   └── images/                  # Изображения\n│\n├── package.json                 # Зависимости\n├── vite.config.ts               # Конфигурация Vite ✅\n├── tsconfig.json                # Конфигурация TypeScript\n├── tailwind.config.js           # Конфигурация Tailwind\n├── eslint.config.js             # Конфигурация ESLint\n└── .env                         # Переменные окружения\n```\n\n### 12.2 Ключевые файлы\n\n| Файл | Назначение | Статус |\n|------|------------|--------|\n| `server/index.ts` | Главный файл сервера Hono | ✅ |\n| `server/db.ts` | Экспорт Prisma клиента | ✅ |\n| `server/lib/errors.ts` | Класс AppError для ошибок | ✅ |\n| `server/routes/auth.routes.ts` | Роуты аутентификации | ✅ |\n| `src/App.tsx` | Роутинг приложения | ✅ |\n| `src/layouts/MainLayout.tsx` | Основной layout | ✅ |\n| `src/layouts/AuthLayout.tsx` | Layout для авторизации | ✅ |\n| `src/components/layout/Header.tsx` | Шапка сайта | ✅ |\n| `src/components/layout/Footer.tsx` | Подвал сайта | ✅ |\n| `src/pages/HomePage.tsx` | Главная страница | ✅ |\n| `src/pages/auth/LoginPage.tsx` | Страница входа | ✅ |\n| `src/pages/auth/RegisterPage.tsx` | Страница регистрации | ✅ |\n| `src/shared/types.ts` | TypeScript типы и Zod схемы | ✅ |\n| `prisma/schema.prisma` | Схема базы данных | ✅ |\n\n---\n\n## 13. Цветовая палитра\n\nИспользуется в стилях:\n\n```css\n:root {\n  --background: #F8F6F3;      /* Светлый фон */\n  --foreground: #264653;      /* Основной текст */\n  --primary: #F4A261;         /* Оранжевый */\n  --secondary: #2A9D8F;       /* Бирюзовый */\n  --accent: #F4A261;          /* Акцентный */\n  --muted: #6C757D;           /* Приглушённый */\n  --destructive: #FF6B6B;     /* Ошибка/удаление */\n  --border: #E9ECEF;          /* Границы */\n}\n```\n\n---\n\n## 14. Команды для работы\n\n```bash\n# Запуск dev-сервера (Vite + Hono на порту 5173)\nnpm run dev\n\n# Запуск только бэкенда (порт 3000)\nnpx tsx server/index.ts\n\n# Сборка проекта\nnpm run build\n\n# Запуск продакшн-версии\nnpm run preview\n\n# Запуск линтера\nnpm run lint\n\n# Генерация Prisma Client\nnpx prisma generate\n\n# Применение миграций\nnpx prisma migrate dev\n\n# Просмотр Studio\nnpx prisma studio\n\n# Сидирование БД (если есть)\nnpm run db:seed\n```\n\n---\n\n## 15. Переменные окружения (.env)\n\n```env\n# База данных (MySQL)\nDATABASE_URL=\"mysql://user:password@localhost:3306/economikus\"\n\n# Порт сервера (опционально)\nPORT=3000\n\n# Секрет для сессий (минимум 32 символа)\nAUTH_SECRET=\"your-secret-key-min-32-chars-long\"\n```\n\n---\n\n## 16. Известные проблемы и решения\n\n### 16.1 Исправленные проблемы\n\n| Проблема | Решение |\n|----------|---------|\n| Ошибка `erors.ts` | Переименован в `errors.ts` |\n| Prisma 7.x несовместимость | Понижена до 5.22.0 |\n| Отсутствие `url` в datasource | Добавлен `url = env(\"DATABASE_URL\")` |\n| `acceptTerms` в RegisterSchema | Поле оставлено (требуется в форме) |\n| `userId`/`profileId` вместо `id` | Исправлено на `id` в auth.routes.ts |\n| Сервер не запускался | Добавлен `serve()` из @hono/node-server |\n\n### 16.2 Текущие ограничения\n\n- Нет защиты маршрутов на фронтенде (требуется добавить ProtectedRoute)\n- Нет middleware для проверки ролей\n- Нет rate limiting\n- Нет логирования запросов\n\n---\n\n## 17. TODO / Roadmap\n\n### Приоритет 1 (Базовый функционал) ✅ Завершено\n- [x] Header и Footer компоненты\n- [x] MainLayout и AuthLayout\n- [x] Страницы входа/регистрации\n- [x] Главная страница\n- [x] Аутентификация API (register, login, logout, me)\n\n### Приоритет 2 (API - без защиты маршрутов)\n- [ ] API курсов (GET /api/courses, GET /api/courses/:slug)\n- [ ] API уроков (GET /api/lessons, GET /api/lessons/:slug)\n- [ ] API пользователя (GET /api/user/me, PATCH /api/user/profile)\n- [ ] API тегов (GET /api/tags)\n- [ ] API комментариев (CRUD)\n- [ ] API реакций (лайки/дизлайки)\n- [ ] API платежей (заглушки)\n- [ ] API модерации (заглушки)\n- [ ] API админа (заглушки)\n\n### Приоритет 3 (Страницы контента)\n- [ ] Страница каталога\n- [ ] Страница списка курсов\n- [ ] Страница курса\n- [ ] Страница урока\n\n### Приоритет 4 (Профиль пользователя)\n- [ ] Страница профиля\n- [ ] Страница настроек\n- [ ] Страница избранного\n- [ ] Страница истории\n\n### Приоритет 5 (Админ-панель)\n- [ ] Базовая админ-панель\n- [ ] Управление пользователями\n- [ ] Функции модератора\n\n### Приоритет 6 (Дополнительный функционал)\n- [ ] Калькуляторы\n- [ ] Платежи (имитация)\n\n### Приоритет 7 (Защита)\n- [ ] ProtectedRoute компонент\n- [ ] Middleware для проверки ролей\n- [ ] Rate limiting\n- [ ] Логирование\n\n---\n\n*Документация обновлена: март 2026*\n*Версия: 2.1*\n*Статус: Актуальная*\n', 5903, 30, '2026-03-19 15:58:41.431', '2026-03-19 15:58:41.431');
INSERT INTO `text_contents` (`text_content_id`, `lesson_id`, `body`, `word_count`, `reading_time`, `created_at`, `updated_at`) VALUES
('d7221603-6f1a-4eec-af51-163f4c0170a0', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', '# Руководство по оптимизации и рефакторингу проекта Economikus\n\n> Единый документ с принципами, правилами и стандартами разработки\n\n---\n\n## Содержание\n\n1. [Принципы разработки](#1-принципы-разработки)\n2. [Архитектура проекта](#2-архитектура-проекта)\n3. [Стандарты именования](#3-стандарты-именования)\n4. [Переиспользуемые компоненты](#4-переиспользуемые-компоненты)\n5. [Хуки для управления состоянием](#5-хуки-для-управления-состоянием)\n6. [Модальные окна](#6-модальные-окна)\n7. [Сервисы API](#7-сервисы-api)\n8. [Константы и типы](#8-константы-и-типы)\n9. [Правила рефакторинга страниц](#9-правила-рефакторинга-страниц)\n10. [Чеклист для новых фич](#10-чеклист-для-новых-фич)\n\n---\n\n## 1. Принципы разработки\n\n### 1.1 Основные принципы\n\n| Принцип | Описание |\n|---------|----------|\n| **DRY** | Don\'t Repeat Yourself — избегаем дублирование кода |\n| **KISS** | Keep It Simple, Stupid — простые решения лучше сложных |\n| **Single Responsibility** | Один компонент/хук — одна задача |\n| **Composition over Inheritance** | Композиция вместо наследования |\n\n### 1.2 Правила написания кода\n\n```typescript\n// ❌ Плохо: дублирование логики\nfunction AdminTags() {\n  const [tags, setTags] = useState([])\n  const [loading, setLoading] = useState(true)\n  \n  useEffect(() => {\n    api.get(\'/admin/tags\').then(res => setTags(res.data.items))\n  }, [])\n  // ...\n}\n\nfunction AdminCourses() {\n  const [courses, setCourses] = useState([])\n  const [loading, setLoading] = useState(true)\n  \n  useEffect(() => {\n    api.get(\'/admin/courses\').then(res => setCourses(res.data.items))\n  }, [])\n  // ...\n}\n\n// ✅ Хорошо: выносим в хук\nfunction AdminTags() {\n  const { tags, loading, handleDelete } = useTagList()\n  // ...\n}\n\nfunction AdminCourses() {\n  const { courses, loading, handleDelete } = useCourseList()\n  // ...\n}\n```\n\n### 1.3 Структура файлов\n\n```\nsrc/\n├── components/           # Переиспользуемые UI компоненты\n│   ├── common/          # Универсальные компоненты (Badge, Dialog, etc.)\n│   ├── modals/          # Модальные окна\n│   ├── tables/          # Компоненты таблиц\n│   ├── cards/           # Карточки\n│   └── layout/          # Layout компоненты\n│\n├── hooks/               # Кастомные хуки\n├── services/            # API сервисы\n├── types/               # TypeScript типы\n├── constants/           # Константы и конфигурации\n├── pages/               # Страницы приложения\n└── layouts/             # Layout обёртки\n```\n\n---\n\n## 2. Архитектура проекта\n\n### 2.1 Уровни абстракции\n\n```\n┌─────────────────────────────────────────────────────────────┐\n│                         PAGES                                │\n│  (Страницы — используют компоненты, хуки, сервисы)          │\n├─────────────────────────────────────────────────────────────┤\n│                       LAYOUTS                                │\n│  (Обёртки страниц — Header, Footer, Sidebar)                │\n├─────────────────────────────────────────────────────────────┤\n│                      COMPONENTS                              │\n│  (UI компоненты — modals, tables, cards, common)            │\n├─────────────────────────────────────────────────────────────┤\n│                         HOOKS                                │\n│  (Бизнес-логика — useTagList, useCourseList, etc.)          │\n├─────────────────────────────────────────────────────────────┤\n│                       SERVICES                               │\n│  (API вызовы — TagService, CourseService, etc.)             │\n├─────────────────────────────────────────────────────────────┤\n│                      CONSTANTS                               │\n│  (Статичные данные — статусы, роли, типы)                   │\n├─────────────────────────────────────────────────────────────┤\n│                         TYPES                                │\n│  (TypeScript интерфейсы и типы)                             │\n└─────────────────────────────────────────────────────────────┘\n```\n\n### 2.2 Поток данных\n\n```\nPage → Hook → Service → API → Backend\n  ↓\nComponent (render)\n```\n\n---\n\n## 3. Стандарты именования\n\n### 3.1 Файлы\n\n| Тип | Паттерн | Пример |\n|-----|---------|--------|\n| Компонент | `PascalCase.tsx` | `StatusBadge.tsx` |\n| Хук | `camelCase.ts` | `useTagList.ts` |\n| Сервис | `camelCase.service.ts` | `tag.service.ts` |\n| Тип | `camelCase.ts` | `tag.ts` |\n| Константа | `camelCase.ts` | `status.ts` |\n| Страница | `PascalCase.tsx` | `AdminTags.tsx` |\n\n### 3.2 Компоненты\n\n```typescript\n// ✅ Хорошо: описательное имя\nexport function ConfirmDialog({ opened, onClose, onConfirm, title, message }: ConfirmDialogProps) {}\n\n// ✅ Хорошо: префикс для типа компонента\nexport function UserModal() {}\nexport function StatusBadge() {}\nexport function StatCard() {}\n\n// ❌ Плохо: неинформативное имя\nexport function Dialog() {}\nexport function Badge() {}\nexport function Card() {}\n```\n\n### 3.3 Хуки\n\n```typescript\n// ✅ Хорошо: префикс use + описательное имя\nexport function useTagList() {}\nexport function useCourseList() {}\nexport function useNotification() {}\n\n// ✅ Хорошо: возвращаемый тип с суффиксом Return\ninterface UseTagListReturn {\n  tags: Tag[]\n  loading: boolean\n  // ...\n}\n```\n\n### 3.4 Переменные и функции\n\n```typescript\n// ✅ Хорошо: глагол для действий\nconst fetchUsers = async () => {}\nconst handleDelete = async (id: string) => {}\nconst openEditModal = (user: User) => {}\n\n// ✅ Хорошо: is/has для булевых значений\nconst isLoading = true\nconst hasPermission = false\nconst isOpened = false\n\n// ✅ Хорошо: описательные имена для состояния\nconst [deleteConfirm, setDeleteConfirm] = useState({ opened: false, id: null })\n```\n\n---\n\n## 4. Переиспользуемые компоненты\n\n### 4.1 Общие компоненты (src/components/common/)\n\n| Компонент | Назначение | Props |\n|-----------|------------|-------|\n| `StatusBadge` | Бейдж статуса | `status, type, size, variant` |\n| `RoleBadge` | Бейдж роли | `role, size, variant` |\n| `LoadingState` | Состояние загрузки | `text, size` |\n| `EmptyState` | Пустое состояние | `title, description, icon` |\n| `ErrorState` | Состояние ошибки | `title, message, onRetry` |\n| `ConfirmDialog` | Диалог подтверждения | `opened, onClose, onConfirm, title, message` |\n| `ColorIndicator` | Индикатор цвета | `color, size` |\n| `AvatarUploader` | Загрузка аватара | `currentAvatar, size, onUploadSuccess` |\n\n### 4.2 Пример использования\n\n```tsx\nimport { StatusBadge, RoleBadge, ConfirmDialog, LoadingState, EmptyState, AvatarUploader } from \'@/components/common\'\nimport { ProtectedRoute } from \'@/components/auth\'\n\n// Статус контента\n<StatusBadge status={course.status} type=\"content\" />\n\n// Роль пользователя\n<RoleBadge role={user.role} />\n\n// Диалог подтверждения\n<ConfirmDialog\n  opened={deleteConfirm.opened}\n  onClose={() => setDeleteConfirm({ opened: false })}\n  onConfirm={handleDelete}\n  title=\"Удалить курс?\"\n  message=\"Это действие нельзя отменить.\"\n  confirmLabel=\"Удалить\"\n  color=\"red\"\n/>\n\n// Состояния\n{loading && <LoadingState text=\"Загрузка...\" />}\n{!loading && items.length === 0 && <EmptyState title=\"Нет данных\" />}\n\n// Загрузка аватара\n<AvatarUploader\n  currentAvatar={profile.avatarUrl}\n  size={80}\n  onUploadSuccess={(url) => console.log(\'Uploaded:\', url)}\n/>\n\n// Защита роутов\n<ProtectedRoute roles={[\'ADMIN\']}>\n  <AdminDashboard />\n</ProtectedRoute>\n```\n\n### 4.3 Создание нового компонента\n\n```tsx\n// src/components/common/NewBadge.tsx\nimport { Badge } from \'@mantine/core\'\nimport { NEW_CONFIG } from \'@/constants\'\n\ninterface NewBadgeProps {\n  type: string\n  size?: \'sm\' | \'md\' | \'lg\'\n}\n\nexport function NewBadge({ type, size = \'md\' }: NewBadgeProps) {\n  const config = NEW_CONFIG[type]\n  \n  return (\n    <Badge color={config?.color || \'gray\'} size={size}>\n      {config?.label || type}\n    </Badge>\n  )\n}\n\n// Экспорт в src/components/common/index.ts\nexport { NewBadge } from \'./NewBadge\'\n```\n\n---\n\n## 5. Хуки для управления состоянием\n\n### 5.1 Структура хука для списка с CRUD\n\n```typescript\n// src/hooks/useEntityList.ts\nimport { useState, useCallback, useEffect } from \'react\'\nimport { EntityService } from \'@/services\'\nimport type { Entity, EntityInput } from \'@/types\'\nimport { useNotification } from \'./useNotification\'\n\ninterface UseEntityListReturn {\n  entities: Entity[]\n  loading: boolean\n  page: number\n  setPage: (page: number) => void\n  totalPages: number\n  search: string\n  setSearch: (search: string) => void\n  filter: string | null\n  setFilter: (filter: string | null) => void\n  modalOpened: boolean\n  editingEntity: Entity | null\n  saving: boolean\n  openCreate: () => void\n  openEdit: (entity: Entity) => void\n  closeModal: () => void\n  handleSave: (data: EntityInput) => Promise<void>\n  handleDelete: (id: string) => Promise<void>\n  refresh: () => Promise<void>\n}\n\nexport function useEntityList(): UseEntityListReturn {\n  const [entities, setEntities] = useState<Entity[]>([])\n  const [loading, setLoading] = useState(true)\n  const [page, setPage] = useState(1)\n  const [totalPages, setTotalPages] = useState(1)\n  const [search, setSearch] = useState(\'\')\n  const [filter, setFilter] = useState<string | null>(null)\n  const [modalOpened, setModalOpened] = useState(false)\n  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)\n  const [saving, setSaving] = useState(false)\n  const { showError, showSuccess } = useNotification()\n\n  // Загрузка данных\n  const fetchEntities = useCallback(async () => {\n    setLoading(true)\n    try {\n      const params: Record<string, string> = { page: page.toString(), limit: \'10\' }\n      if (search) params.search = search\n      if (filter) params.filter = filter\n\n      const result = await EntityService.getAdmin(params)\n      setEntities(result.items)\n      setTotalPages(result.pagination.totalPages)\n    } catch (error) {\n      showError(\'Ошибка загрузки\')\n    } finally {\n      setLoading(false)\n    }\n  }, [page, search, filter, showError])\n\n  useEffect(() => {\n    fetchEntities()\n  }, [fetchEntities])\n\n  // CRUD операции\n  const openCreate = useCallback(() => {\n    setEditingEntity(null)\n    setModalOpened(true)\n  }, [])\n\n  const openEdit = useCallback((entity: Entity) => {\n    setEditingEntity(entity)\n    setModalOpened(true)\n  }, [])\n\n  const closeModal = useCallback(() => {\n    setModalOpened(false)\n    setEditingEntity(null)\n  }, [])\n\n  const handleSave = useCallback(async (data: EntityInput) => {\n    setSaving(true)\n    try {\n      if (editingEntity) {\n        await EntityService.update(editingEntity.id, data)\n        showSuccess(\'Обновлено\')\n      } else {\n        await EntityService.create(data)\n        showSuccess(\'Создано\')\n      }\n      closeModal()\n      fetchEntities()\n    } catch (error) {\n      showError(\'Ошибка сохранения\')\n    } finally {\n      setSaving(false)\n    }\n  }, [editingEntity, closeModal, fetchEntities, showError, showSuccess])\n\n  const handleDelete = useCallback(async (id: string) => {\n    try {\n      await EntityService.delete(id)\n      showSuccess(\'Удалено\')\n      fetchEntities()\n    } catch (error) {\n      showError(\'Ошибка удаления\')\n    }\n  }, [fetchEntities, showError, showSuccess])\n\n  return {\n    entities,\n    loading,\n    page,\n    setPage,\n    totalPages,\n    search,\n    setSearch,\n    filter,\n    setFilter,\n    modalOpened,\n    editingEntity,\n    saving,\n    openCreate,\n    openEdit,\n    closeModal,\n    handleSave,\n    handleDelete,\n    refresh: fetchEntities,\n  }\n}\n```\n\n### 5.2 Существующие хуки\n\n| Хук | Назначение |\n|-----|------------|\n| `useTagList` | Управление списком тегов |\n| `useCourseList` | Управление списком курсов |\n| `useLessonList` | Управление списком уроков |\n| `useUserList` | Управление списком пользователей |\n| `useNotification` | Уведомления (toast) |\n| `useConfirm` | Диалоги подтверждения |\n| `usePagination` | Логика пагинации |\n| `useTable` | Логика таблиц с сортировкой |\n\n---\n\n## 6. Модальные окна\n\n### 6.1 Структура модального окна\n\n```tsx\n// src/components/modals/EntityModal.tsx\nimport { useEffect } from \'react\'\nimport { Modal, Stack, TextInput, Group, Button } from \'@mantine/core\'\nimport { useForm, Controller } from \'react-hook-form\'\nimport { zodResolver } from \'@hookform/resolvers/zod\'\nimport { z } from \'zod\'\nimport type { Entity } from \'@/types\'\n\n// Схема валидации\nconst EntitySchema = z.object({\n  name: z.string().min(2, \'Минимум 2 символа\').max(100, \'Максимум 100 символов\'),\n  description: z.string().max(500).optional(),\n})\n\ntype EntityFormData = z.infer<typeof EntitySchema>\n\ninterface EntityModalProps {\n  opened: boolean\n  onClose: () => void\n  entity: Entity | null\n  onSave: (data: EntityFormData) => Promise<void>\n  loading?: boolean\n}\n\nexport function EntityModal({ opened, onClose, entity, onSave, loading }: EntityModalProps) {\n  const {\n    register,\n    handleSubmit,\n    formState: { errors },\n    control,\n    reset,\n    setValue,\n  } = useForm<EntityFormData>({\n    resolver: zodResolver(EntitySchema),\n    defaultValues: {\n      name: \'\',\n      description: \'\',\n    },\n  })\n\n  // Сброс формы при открытии\n  useEffect(() => {\n    if (opened) {\n      reset({\n        name: entity?.name || \'\',\n        description: entity?.description || \'\',\n      })\n    }\n  }, [opened, entity, reset])\n\n  return (\n    <Modal\n      opened={opened}\n      onClose={onClose}\n      title={entity ? \'Редактировать\' : \'Создать\'}\n      size=\"md\"\n    >\n      <form onSubmit={handleSubmit(onSave)}>\n        <Stack gap=\"md\">\n          <TextInput\n            label=\"Название\"\n            required\n            {...register(\'name\')}\n            error={errors.name?.message}\n          />\n          <Group justify=\"flex-end\" mt=\"md\">\n            <Button variant=\"subtle\" onClick={onClose}>Отмена</Button>\n            <Button type=\"submit\" loading={loading}>\n              {entity ? \'Сохранить\' : \'Создать\'}\n            </Button>\n          </Group>\n        </Stack>\n      </form>\n    </Modal>\n  )\n}\n```\n\n### 6.2 Существующие модальные окна\n\n| Модальное окно | Назначение |\n|----------------|------------|\n| `TagModal` | Создание/редактирование тега |\n| `CourseModal` | Создание/редактирование курса |\n| `LessonModal` | Создание/редактирование урока |\n| `UserModal` | Редактирование пользователя |\n\n---\n\n## 7. Сервисы API\n\n### 7.1 Структура сервиса\n\n```typescript\n// src/services/entity.service.ts\nimport { api } from \'./api\'\nimport type { Entity, EntityInput, PaginatedResponse } from \'@/types\'\n\nexport const EntityService = {\n  // === ПУБЛИЧНЫЕ ===\n\n  /**\n   * Получить список\n   */\n  getAll: (params?: { page?: number; limit?: number; search?: string }) =>\n    api.get<PaginatedResponse<Entity>>(\'/entities\', params),\n\n  /**\n   * Получить по ID\n   */\n  getById: (id: string) =>\n    api.get<Entity>(`/entities/${id}`),\n\n  // === АДМИН ===\n\n  /**\n   * Создать\n   */\n  create: (data: EntityInput) =>\n    api.post<Entity>(\'/admin/entities\', data),\n\n  /**\n   * Обновить\n   */\n  update: (id: string, data: Partial<EntityInput>) =>\n    api.patch<Entity>(`/admin/entities/${id}`, data),\n\n  /**\n   * Удалить\n   */\n  delete: (id: string) =>\n    api.delete(`/admin/entities/${id}`),\n\n  /**\n   * Получить список (админ)\n   */\n  getAdmin: (params?: { page?: number; limit?: number; search?: string }) =>\n    api.get<PaginatedResponse<Entity>>(\'/admin/entities\', params),\n}\n```\n\n### 7.2 Базовый API класс\n\n```typescript\n// src/services/api.ts\nconst API_BASE = import.meta.env.PROD \n  ? (import.meta.env.VITE_API_URL || \'https://api.economikus.ru/api\')\n  : \'/api\'\n\nexport const api = {\n  get: <T>(url: string, params?: Record<string, unknown>) =>\n    fetch(`${API_BASE}${url}?${new URLSearchParams(params as Record<string, string>)}`, {\n      credentials: \'include\',\n    }).then(res => res.json()) as Promise<T>,\n\n  post: <T>(url: string, data?: unknown) =>\n    fetch(`${API_BASE}${url}`, {\n      method: \'POST\',\n      headers: { \'Content-Type\': \'application/json\' },\n      credentials: \'include\',\n      body: JSON.stringify(data),\n    }).then(res => res.json()) as Promise<T>,\n\n  patch: <T>(url: string, data?: unknown) =>\n    fetch(`${API_BASE}${url}`, {\n      method: \'PATCH\',\n      headers: { \'Content-Type\': \'application/json\' },\n      credentials: \'include\',\n      body: JSON.stringify(data),\n    }).then(res => res.json()) as Promise<T>,\n\n  delete: (url: string) =>\n    fetch(`${API_BASE}${url}`, {\n      method: \'DELETE\',\n      credentials: \'include\',\n    }),\n}\n```\n\n---\n\n## 8. Константы и типы\n\n### 8.1 Структура констант\n\n```typescript\n// src/constants/status.ts\nexport const STATUS_COLORS = {\n  course: {\n    DRAFT: \'gray\',\n    PUBLISHED: \'green\',\n    ARCHIVED: \'red\',\n  },\n  lesson: {\n    DRAFT: \'gray\',\n    PUBLISHED: \'green\',\n    ARCHIVED: \'red\',\n  },\n}\n\nexport const STATUS_LABELS = {\n  course: {\n    DRAFT: \'Черновик\',\n    PUBLISHED: \'Опубликован\',\n    ARCHIVED: \'Архив\',\n  },\n  lesson: {\n    DRAFT: \'Черновик\',\n    PUBLISHED: \'Опубликован\',\n    ARCHIVED: \'Архив\',\n  },\n}\n\n// src/constants/roles.ts\nexport const ROLE_COLORS = {\n  USER: \'gray\',\n  AUTHOR: \'blue\',\n  ADMIN: \'red\',\n}\n\nexport const ROLE_LABELS = {\n  USER: \'Пользователь\',\n  AUTHOR: \'Автор\',\n  ADMIN: \'Администратор\',\n}\n```\n\n### 8.2 Структура типов\n\n```typescript\n// src/types/entity.ts\nexport interface Entity {\n  id: string\n  name: string\n  description?: string\n  createdAt?: string\n}\n\nexport interface EntityInput {\n  name: string\n  description?: string\n}\n\n// src/types/api.ts\nexport interface PaginatedResponse<T> {\n  items: T[]\n  pagination: {\n    page: number\n    limit: number\n    total: number\n    totalPages: number\n  }\n}\n```\n\n---\n\n## 9. Правила рефакторинга страниц\n\n### 9.1 Шаги рефакторинга\n\n1. **Создать типы** (если отсутствуют)\n   - `src/types/entity.ts` — интерфейсы Entity, EntityInput\n   - Экспортировать в `src/types/index.ts`\n\n2. **Создать сервис** (если отсутствует)\n   - `src/services/entity.service.ts` — CRUD методы\n   - Экспортировать в `src/services/index.ts`\n\n3. **Создать хук**\n   - `src/hooks/useEntityList.ts` — логика списка с CRUD\n   - Экспортировать в `src/hooks/index.ts`\n\n4. **Создать модальное окно**\n   - `src/components/modals/EntityModal.tsx` — форма создания/редактирования\n   - Экспортировать в `src/components/modals/index.ts`\n\n5. **Обновить страницу**\n   - Импортировать хук, модалку, компоненты\n   - Удалить локальное состояние и логику\n   - Использовать ConfirmDialog вместо confirm()\n\n### 9.2 Шаблон страницы\n\n```tsx\n// src/pages/admin/AdminEntities.tsx\nimport { useState } from \'react\'\nimport { Box, Button, Card, Group, Text, Table, TextInput, Select, Pagination, ActionIcon, Menu, Skeleton, Alert, Stack, Badge } from \'@mantine/core\'\nimport { Plus, Search, MoreVertical, Pencil, Trash2 } from \'lucide-react\'\nimport { EntityModal } from \'@/components/modals\'\nimport { StatusBadge, ConfirmDialog } from \'@/components/common\'\nimport { useEntityList } from \'@/hooks\'\nimport { STATUS_LABELS } from \'@/constants\'\nimport type { EntityInput } from \'@/types\'\n\nexport function AdminEntities() {\n  const {\n    entities,\n    loading,\n    page,\n    setPage,\n    totalPages,\n    search,\n    setSearch,\n    filter,\n    setFilter,\n    modalOpened,\n    editingEntity,\n    saving,\n    openCreate,\n    openEdit,\n    closeModal,\n    handleSave,\n    handleDelete,\n  } = useEntityList()\n\n  // Диалог подтверждения\n  const [deleteConfirm, setDeleteConfirm] = useState({\n    opened: false,\n    id: null as string | null,\n    name: \'\',\n  })\n\n  const confirmDelete = (entity: { id: string; name: string }) => {\n    setDeleteConfirm({ opened: true, id: entity.id, name: entity.name })\n  }\n\n  const executeDelete = async () => {\n    if (deleteConfirm.id) {\n      await handleDelete(deleteConfirm.id)\n      setDeleteConfirm({ opened: false, id: null, name: \'\' })\n    }\n  }\n\n  const onSave = async (data: EntityInput) => {\n    await handleSave(data)\n  }\n\n  return (\n    <Box>\n      {/* Header */}\n      <Group justify=\"space-between\" mb=\"lg\">\n        <Text size=\"xl\" fw={700}>Сущности</Text>\n        <Button leftSection={<Plus size={16} />} onClick={openCreate}>\n          Создать\n        </Button>\n      </Group>\n\n      {/* Filters */}\n      <Card shadow=\"xs\" padding=\"md\" radius=\"md\" withBorder mb=\"lg\">\n        <Group>\n          <TextInput\n            placeholder=\"Поиск...\"\n            leftSection={<Search size={16} />}\n            value={search}\n            onChange={(e) => setSearch(e.target.value)}\n            style={{ flex: 1 }}\n          />\n          <Select\n            placeholder=\"Фильтр\"\n            data={[{ value: \'\', label: \'Все\' }]}\n            value={filter}\n            onChange={(v) => setFilter(v || null)}\n            clearable\n            w={180}\n          />\n        </Group>\n      </Card>\n\n      {/* Table */}\n      {loading ? (\n        <Stack gap=\"sm\">\n          {[...Array(5)].map((_, i) => <Skeleton key={i} height={60} radius=\"md\" />)}\n        </Stack>\n      ) : entities.length === 0 ? (\n        <Alert color=\"gray\">Не найдено</Alert>\n      ) : (\n        <Card shadow=\"xs\" padding={0} radius=\"md\" withBorder>\n          <Table striped highlightOnHover>\n            <Table.Thead>\n              <Table.Tr>\n                <Table.Th>Название</Table.Th>\n                <Table.Th>Статус</Table.Th>\n                <Table.Th></Table.Th>\n              </Table.Tr>\n            </Table.Thead>\n            <Table.Tbody>\n              {entities.map((entity) => (\n                <Table.Tr key={entity.id}>\n                  <Table.Td>\n                    <Text fw={500}>{entity.name}</Text>\n                  </Table.Td>\n                  <Table.Td>\n                    <StatusBadge status={entity.status} type=\"content\" />\n                  </Table.Td>\n                  <Table.Td>\n                    <Menu>\n                      <Menu.Target>\n                        <ActionIcon variant=\"subtle\">\n                          <MoreVertical size={16} />\n                        </ActionIcon>\n                      </Menu.Target>\n                      <Menu.Dropdown>\n                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEdit(entity)}>\n                          Редактировать\n                        </Menu.Item>\n                        <Menu.Item color=\"red\" leftSection={<Trash2 size={14} />} onClick={() => confirmDelete({ id: entity.id, name: entity.name })}>\n                          Удалить\n                        </Menu.Item>\n                      </Menu.Dropdown>\n                    </Menu>\n                  </Table.Td>\n                </Table.Tr>\n              ))}\n            </Table.Tbody>\n          </Table>\n        </Card>\n      )}\n\n      {/* Pagination */}\n      {totalPages > 1 && (\n        <Group justify=\"center\" mt=\"lg\">\n          <Pagination total={totalPages} value={page} onChange={setPage} />\n        </Group>\n      )}\n\n      {/* Modal */}\n      <EntityModal\n        opened={modalOpened}\n        onClose={closeModal}\n        entity={editingEntity}\n        onSave={onSave}\n        loading={saving}\n      />\n\n      {/* Confirm Dialog */}\n      <ConfirmDialog\n        opened={deleteConfirm.opened}\n        onClose={() => setDeleteConfirm({ opened: false, id: null, name: \'\' })}\n        onConfirm={executeDelete}\n        title=\"Удалить?\"\n        message={`\"${deleteConfirm.name}\" будет удалено. Это действие нельзя отменить.`}\n        confirmLabel=\"Удалить\"\n        color=\"red\"\n      />\n    </Box>\n  )\n}\n```\n\n### 9.3 Чеклист рефакторинга\n\n- [ ] Типы созданы и экспортированы\n- [ ] Сервис создан и экспортирован\n- [ ] Хук создан и экспортирован\n- [ ] Модальное окно создано и экспортировано\n- [ ] Страница обновлена\n- [ ] ConfirmDialog используется вместо confirm()\n- [ ] StatusBadge/RoleBadge используются вместо локальных мап\n- [ ] TypeScript компиляция без ошибок\n- [ ] Линтер без ошибок\n\n---\n\n## 10. Чеклист для новых фич\n\n### 10.1 Перед началом\n\n- [ ] Проанализированы существующие компоненты/хуки\n- [ ] Определена необходимость новых абстракций\n- [ ] Согласована структура с командой\n\n### 10.2 Разработка\n\n- [ ] Типы в `src/types/`\n- [ ] Константы в `src/constants/`\n- [ ] Сервис в `src/services/`\n- [ ] Хук в `src/hooks/`\n- [ ] Компоненты в `src/components/`\n- [ ] Страница в `src/pages/`\n\n### 10.3 Проверка\n\n- [ ] `npm run build` — без ошибок\n- [ ] `npm run lint` — без ошибок (warnings допустимы)\n- [ ] `npx tsc --noEmit` — без ошибок\n- [ ] Код отформатирован (Prettier)\n\n### 10.4 Документация\n\n- [ ] JSDoc комментарии для публичных функций\n- [ ] Обновлена TECHNICAL_DOCUMENTATION.md (если нужно)\n- [ ] Обновлен REFACTORING_PLAN.md (если нужно)\n\n---\n\n## Приложение А: Существующие компоненты\n\n### Переиспользуемые компоненты\n\n| Категория | Компонент | Файл |\n|-----------|-----------|------|\n| Common | StatusBadge | `components/common/StatusBadge.tsx` |\n| Common | RoleBadge | `components/common/RoleBadge.tsx` |\n| Common | LoadingState | `components/common/LoadingState.tsx` |\n| Common | EmptyState | `components/common/EmptyState.tsx` |\n| Common | ErrorState | `components/common/ErrorState.tsx` |\n| Common | ConfirmDialog | `components/common/ConfirmDialog.tsx` |\n| Common | ColorIndicator | `components/common/ColorIndicator.tsx` |\n| Common | AvatarUploader | `components/common/AvatarUploader.tsx` |\n| Auth | ProtectedRoute | `components/auth/ProtectedRoute.tsx` |\n| Modals | TagModal | `components/modals/TagModal.tsx` |\n| Modals | CourseModal | `components/modals/CourseModal.tsx` |\n| Modals | LessonModal | `components/modals/LessonModal.tsx` |\n| Modals | UserModal | `components/modals/UserModal.tsx` |\n| Tables | DataTable | `components/tables/DataTable.tsx` |\n| Tables | TableFilters | `components/tables/TableFilters.tsx` |\n| Cards | StatCard | `components/cards/StatCard.tsx` |\n\n### Хуки\n\n| Хук | Файл | Назначение |\n|-----|------|------------|\n| useAuth | `hooks/useAuth.ts` | Авторизация |\n| useNotification | `hooks/useNotification.ts` | Уведомления |\n| useConfirm | `hooks/useConfirm.ts` | Диалоги подтверждения |\n| usePagination | `hooks/usePagination.ts` | Пагинация |\n| useTable | `hooks/useTable.ts` | Таблицы |\n| useTagList | `hooks/useTagList.ts` | Теги |\n| useCourseList | `hooks/useCourseList.ts` | Курсы |\n| useLessonList | `hooks/useLessonList.ts` | Уроки |\n| useUserList | `hooks/useUserList.ts` | Пользователи |\n| useAvatarUpload | `hooks/useAvatarUpload.ts` | Загрузка аватара |\n\n### Сервисы\n\n| Сервис | Файл | Назначение |\n|--------|------|------------|\n| api | `services/api.ts` | Базовый API |\n| AuthService | `services/auth.service.ts` | Авторизация |\n| UserService | `services/user.service.ts` | Пользователи |\n| CourseService | `services/course.service.ts` | Курсы |\n| LessonService | `services/lesson.service.ts` | Уроки |\n| TagService | `services/tag.service.ts` | Теги |\n| ApplicationService | `services/application.service.ts` | Заявки |\n\n---\n\n## Приложение Б: Статус рефакторинга\n\n### Выполнено ✅\n\n#### Админ-страницы\n\n| Страница | Хук | Модалка | Компоненты |\n|----------|-----|---------|------------|\n| AdminDashboard | — | — | StatCard |\n| AdminTags | useTagList | TagModal | ColorIndicator, ConfirmDialog |\n| AdminCourses | useCourseList | CourseModal | StatusBadge, ConfirmDialog |\n| AdminLessons | useLessonList | LessonModal | StatusBadge, ConfirmDialog |\n| AdminUsers | useUserList | UserModal | RoleBadge, ConfirmDialog |\n\n#### Защита роутов\n\n| Компонент | Назначение |\n|-----------|------------|\n| ProtectedRoute | Защита роутов с проверкой авторизации и ролей |\n\n#### Профиль пользователя\n\n| Компонент | Назначение |\n|-----------|------------|\n| ProfileSettingsPage | Рефакторинг с AvatarUploader |\n| AvatarUploader | Загрузка и удаление аватара |\n| useAvatarUpload | Хук для загрузки аватара |\n\n#### Бэкенд endpoints\n\n| Endpoint | Метод | Назначение |\n|----------|-------|------------|\n| `/user/password` | PATCH | Смена пароля |\n| `/user/avatar` | POST | Загрузка аватара |\n| `/user/avatar` | DELETE | Удаление аватара |\n\n### В процессе 🔲\n\n| Страница | Статус |\n|----------|--------|\n| AdminModeration | Требует отдельного подхода (модерация контента) |\n| AdminApplications | Требует отдельного подхода (заявки авторов) |\n| LoginPage | Рефакторинг с useAuthForm |\n| RegisterPage | Рефакторинг с useAuthForm |\n| BecomeAuthorPage | Рефакторинг |\n\n---\n\n## 11. Тестирование API\n\n### 11.1 Обязательные проверки\n\nПри создании новых API endpoints **обязательно** проводить тестирование:\n\n1. **Проверка авторизации**\n   - Запрос без авторизации должен возвращать `401 Unauthorized`\n   - Запрос с авторизацией должен возвращать данные\n\n2. **Проверка прав доступа**\n   - Запрос с недостаточными правами должен возвращать `403 Forbidden`\n\n3. **Проверка валидации**\n   - Невалидные данные должны возвращать `400 Bad Request`\n   - Проверить граничные случаи\n\n4. **Проверка существования данных**\n   - Запрос к несуществующему ресурсу должен возвращать `404 Not Found`\n\n### 11.2 Пример тестирования\n\n```powershell\n# Проверка без авторизации (должен вернуть 401)\nInvoke-RestMethod -Uri \"http://localhost:3000/api/author/analytics\" -Method Get\n\n# Проверка Swagger документации\nInvoke-WebRequest -Uri \"http://localhost:3000/api/swagger\" -UseBasicParsing\n\n# Проверка OpenAPI spec\nInvoke-RestMethod -Uri \"http://localhost:3000/api/doc\" -Method Get\n```\n\n### 11.3 Добавление в Swagger\n\nПосле тестирования endpoint **обязательно** добавить документацию в OpenAPI:\n\n1. Открыть `server/index.ts`\n2. Найти секцию `paths` в `/api/doc` endpoint\n3. Добавить описание endpoint с параметрами и responses\n\nПример:\n```typescript\n\'/author/analytics\': {\n  get: {\n    tags: [\'Author\'],\n    summary: \'Детальная аналитика автора\',\n    description: \'Возвращает расширенную статистику\',\n    responses: {\n      \'200\': { description: \'Детальная аналитика\' },\n      \'401\': { description: \'Не авторизован\' },\n      \'403\': { description: \'Доступ только для авторов\' }\n    }\n  }\n}\n```\n\n### 11.4 Чеклист тестирования API\n\n- [ ] Endpoint доступен по правильному URL\n- [ ] Возвращает правильный HTTP статус\n- [ ] Возвращает правильный формат данных (JSON)\n- [ ] Обрабатывает ошибки корректно\n- [ ] Документация добавлена в Swagger\n- [ ] Документация обновлена в TECHNICAL_DOCUMENTATION_4.md\n\n---\n\n*Документ создан: Январь 2025*\n*Версия: 1.1*\n*Обновлено: Добавлен раздел 11 - Тестирование API*\n', 3330, 17, '2026-03-20 06:54:34.006', '2026-03-20 06:55:01.411');

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
('348dd2cd-4f2b-455d-be49-363caaec02f0', 'ff929368-264d-43a6-b450-d02442f5d511', '19c1cd22-87ea-4c6c-a969-69ce4548346e', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1774361517923', NULL, NULL, NULL, NULL, '2026-03-24 14:11:57.925', '2026-03-24 14:11:57.925', NULL, NULL),
('b725d435-b2a1-4f97-ac05-018831cbe2b3', 'ff929368-264d-43a6-b450-d02442f5d511', '5ce718fc-b28a-4d6e-b3c2-7dfed31cc827', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1774362692525', NULL, NULL, NULL, NULL, '2026-03-24 14:31:32.529', '2026-03-24 14:31:32.529', NULL, NULL),
('ba88d019-f5e5-4e22-83ec-01b044b1faac', 'ff929368-264d-43a6-b450-d02442f5d511', '19c1cd22-87ea-4c6c-a969-69ce4548346e', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1774361340408', NULL, NULL, NULL, NULL, '2026-03-24 14:09:00.410', '2026-03-24 14:09:00.410', NULL, NULL),
('fb911753-6183-4841-9003-8b29f752c4ca', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 'd078871c-876e-4fa2-983c-11fba0615dbb', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1774358074001', NULL, NULL, NULL, NULL, '2026-03-24 13:14:34.005', '2026-03-24 13:14:34.005', NULL, NULL),
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
('45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', 'api_test@test.ru', 'API', 'Test', '$2b$12$GTnQEESlaR3VGmwkrVJkFOAky04teSWvzrNjDb/3B5TQjSOgyVfji', 'ADMIN', '2026-03-15 13:24:35.434', 0, NULL, '2026-03-20 07:35:22.619', '2026-03-15 13:24:35.438', '2026-03-20 07:35:22.620', NULL),
('550e8400-e29b-41d4-a716-446655440001', 'admin@economikus.ru', 'Админ', 'Системный', NULL, 'ADMIN', '2026-01-01 10:00:00.000', 0, NULL, NULL, '2026-01-01 10:00:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'anna@author.ru', 'Анна', 'Петрова', NULL, 'AUTHOR', '2026-01-15 12:30:00.000', 0, NULL, NULL, '2026-01-15 12:30:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'ivan@user.ru', 'Иван', 'Сидоров', NULL, 'USER', '2026-02-01 09:15:00.000', 0, NULL, NULL, '2026-02-01 09:15:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440004', 'maria@learner.ru', 'Мария', 'Козлова', NULL, 'USER', '2026-02-10 14:20:00.000', 0, NULL, NULL, '2026-02-10 14:20:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440005', 'mod@economikus.ru', 'Модер', 'Проверкин', NULL, 'MODERATOR', '2026-01-05 11:00:00.000', 0, NULL, NULL, '2026-01-05 11:00:00.000', '2026-03-13 11:16:27.249', NULL),
('9c406b56-4804-4d86-b612-a11c10826b06', 'test6@test.com', 'New', 'User', '$2b$12$.b5hR6KNeSTflbjqeCxlmuzjWWNKa9lpERoqte72X.ef0c3z1n8R.', 'USER', '2026-03-13 16:21:20.719', 0, NULL, '2026-03-13 16:22:34.894', '2026-03-13 16:21:20.722', '2026-03-13 16:22:34.896', NULL),
('abd55251-2f17-44b1-a0e3-5dac3e418aad', 'petrov2@tge.ru', 'иван', 'Adminov', '$2b$12$M1KgYuS4X.UJiN8AJe46ZeAsJoosBFTFJcTbo68UPKEKA91yHkb8S', 'AUTHOR', '2026-03-15 12:37:39.439', 0, NULL, '2026-03-24 13:15:31.412', '2026-03-15 12:37:39.441', '2026-03-24 13:15:31.417', NULL),
('c093a1b7-b41c-40e1-b79b-57748faaf0a7', 'ron@ron.com', 'иван', 'Петров', '$2b$12$T.JarxA/NT8N/o8qn0jayOCnb8csJ7oiEC9el6RzjSb1GUAygvjO6', 'USER', '2026-03-20 11:31:32.674', 0, NULL, '2026-03-24 13:16:26.858', '2026-03-20 11:31:32.677', '2026-03-24 13:16:26.863', NULL),
('e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', 'petrov@tge.ru', 'иван', 'авыпуквп', '$2b$10$CuVz5L11qXlrN29/wKkmO.vgPRPIkgTRr.W4aCD1EyoigRQYBPtdW', 'AUTHOR', '2026-03-15 12:28:23.959', 0, NULL, '2026-03-24 13:15:56.282', '2026-03-15 12:28:23.963', '2026-03-24 13:15:56.287', NULL);

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
-- Индексы таблицы `author_applications`
--
ALTER TABLE `author_applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `author_applications_profile_id_idx` (`profile_id`),
  ADD KEY `author_applications_status_idx` (`status`),
  ADD KEY `author_applications_reviewed_by_fkey` (`reviewed_by`);

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
-- Ограничения внешнего ключа таблицы `author_applications`
--
ALTER TABLE `author_applications`
  ADD CONSTRAINT `author_applications_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `author_applications_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `profiles` (`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
