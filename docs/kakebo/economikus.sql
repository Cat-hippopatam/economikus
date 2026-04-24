-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.0
-- Время создания: Апр 24 2026 г., 18:46
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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `account_deletion_requests`
--

CREATE TABLE `account_deletion_requests` (
  `request_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','COMPLETED','REJECTED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `processed_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processed_at` datetime(3) DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `status` enum('DRAFT','PENDING_REVIEW','PUBLISHED','ARCHIVED','REJECTED','DELETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime(3) DEFAULT NULL,
  `author_profile_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `views_count` int NOT NULL DEFAULT '0',
  `likes_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Структура таблицы `course_tags`
--

CREATE TABLE `course_tags` (
  `course_tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Структура таблицы `kakebo_entries`
--

CREATE TABLE `kakebo_entries` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profileId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `category` enum('LIFE','CULTURE','EXTRA','UNEXPECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'LIFE',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `isNecessary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `kakebo_entries`
--

INSERT INTO `kakebo_entries` (`id`, `profileId`, `date`, `year`, `month`, `category`, `description`, `amount`, `isNecessary`, `created_at`, `updated_at`) VALUES
('cmocvizmp0001fr1m2qd96wpo', '7a691991-9eb7-446f-bd30-1e24a48fc5b3', '2026-04-24', 2026, 4, 'LIFE', 'коммуналка', 280, 0, '2026-04-24 12:15:34.367', '2026-04-24 12:15:34.367'),
('cmocvjyrp0003fr1me3kzcjwh', '7a691991-9eb7-446f-bd30-1e24a48fc5b3', '2026-04-24', 2026, 4, 'LIFE', 'еда', 2000, 0, '2026-04-24 12:16:19.910', '2026-04-24 12:16:19.910'),
('cmocvkeka0005fr1ms2y5gv65', '7a691991-9eb7-446f-bd30-1e24a48fc5b3', '2026-04-24', 2026, 4, 'EXTRA', 'пластик', 1000, 0, '2026-04-24 12:16:40.378', '2026-04-24 12:16:40.378'),
('cmocvl0820007fr1mukhm0cge', '7a691991-9eb7-446f-bd30-1e24a48fc5b3', '2026-04-25', 2026, 4, 'UNEXPECTED', 'ракушка', 2000, 0, '2026-04-24 12:17:08.450', '2026-04-24 12:17:08.450'),
('cmocvlfdw0009fr1monic0hmy', '7a691991-9eb7-446f-bd30-1e24a48fc5b3', '2026-04-24', 2026, 4, 'LIFE', 'коммуналка', 10, 1, '2026-04-24 12:17:28.100', '2026-04-24 12:17:28.100'),
('cmocwdkon0001vbijrmloi34r', '7a691991-9eb7-446f-bd30-1e24a48fc5b3', '2026-04-29', 2026, 4, 'LIFE', 'холодильник', 3000, 1, '2026-04-24 12:39:21.335', '2026-04-24 12:39:21.335'),
('cmocwecl90003vbij6s18t7gi', '7a691991-9eb7-446f-bd30-1e24a48fc5b3', '2026-04-24', 2026, 4, 'EXTRA', 'провода', 530, 0, '2026-04-24 12:39:57.501', '2026-04-24 12:39:57.501');

-- --------------------------------------------------------

--
-- Структура таблицы `kakebo_reflections`
--

CREATE TABLE `kakebo_reflections` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profileId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `unnecessary_spent` double DEFAULT NULL,
  `money_at_start` double DEFAULT NULL,
  `planned_to_save` double DEFAULT NULL,
  `actually_saved` double DEFAULT NULL,
  `improvements` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `kakebo_settings`
--

CREATE TABLE `kakebo_settings` (
  `profileId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `month_limit` double DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `kakebo_settings`
--

INSERT INTO `kakebo_settings` (`profileId`, `month_limit`, `created_at`, `updated_at`) VALUES
('7a691991-9eb7-446f-bd30-1e24a48fc5b3', 10000, '2026-04-24 12:38:23.858', '2026-04-24 12:38:41.685');

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
  `status` enum('DRAFT','PENDING_REVIEW','PUBLISHED','ARCHIVED','REJECTED','DELETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `published_at` datetime(3) DEFAULT NULL,
  `views_count` int NOT NULL DEFAULT '0',
  `likes_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_tags`
--

CREATE TABLE `lesson_tags` (
  `lesson_tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `profiles`
--

INSERT INTO `profiles` (`profile_id`, `user_id`, `nickname`, `display_name`, `avatar_url`, `cover_image`, `bio`, `website`, `telegram`, `youtube`, `total_views`, `subscribers`, `created_at`, `updated_at`) VALUES
('48091634-c8d6-48d2-8396-e26c59f10188', '192c7ff2-98d4-43b1-b233-612f82778cf9', 'ivan2', 'иван Петров', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-04-24 11:31:47.823', '2026-04-24 11:31:47.823'),
('7a691991-9eb7-446f-bd30-1e24a48fc5b3', '8abc2fc4-452a-4a35-acde-7073427109a2', 'api_test', 'API Test', 'https://ui-avatars.com/api/?name=API+Test&background=0D8ABC&color=fff', NULL, '', '', '', '', 0, 0, '2026-04-24 11:56:53.146', '2026-04-24 12:19:32.193');

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`session_id`, `session_token`, `user_id`, `expires`, `created_at`, `updated_at`) VALUES
('c84f217e-aaa0-407e-b771-26c73a8d9a55', '2f43d382-c01d-4a8d-a525-defad7faa33e', '8abc2fc4-452a-4a35-acde-7073427109a2', '2026-05-24 11:59:45.340', '2026-04-24 11:59:45.346', '2026-04-24 11:59:45.346');

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `canceled_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completed_at` datetime(3) DEFAULT NULL,
  `failed_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `email`, `first_name`, `last_name`, `password_hash`, `role`, `email_verified`, `is_blocked`, `blocked_reason`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
('192c7ff2-98d4-43b1-b233-612f82778cf9', 'ron@ron22.com', 'иван', 'Петров', '$2b$12$jKZr0TbzH.4DjjTDohnypOAJ903i/G714Bq9sQLODG2cs9W.lx6pa', 'USER', '2026-04-24 11:31:47.783', 0, NULL, '2026-04-24 11:45:57.889', '2026-04-24 11:31:47.789', '2026-04-24 11:45:57.890', NULL),
('8abc2fc4-452a-4a35-acde-7073427109a2', 'api_test@test.ru', 'API', 'Test', '$2b$12$isDPwVLsp1XFtNUcfLqMd.GyZ7.nNDSZQ.QtRqmM9eojsFpGJimoa', 'ADMIN', '2026-04-24 11:56:53.121', 0, NULL, '2026-04-24 11:59:45.300', '2026-04-24 11:56:53.127', '2026-04-24 11:59:45.301', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `VerificationToken`
--

CREATE TABLE `VerificationToken` (
  `identifier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Индексы таблицы `account_deletion_requests`
--
ALTER TABLE `account_deletion_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `account_deletion_requests_processed_by_fkey` (`processed_by`),
  ADD KEY `idx_profile_id` (`profile_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_user_id` (`user_id`);

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
-- Индексы таблицы `kakebo_entries`
--
ALTER TABLE `kakebo_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kakebo_entries_profileId_year_month_idx` (`profileId`,`year`,`month`),
  ADD KEY `kakebo_entries_profileId_date_idx` (`profileId`,`date`);

--
-- Индексы таблицы `kakebo_reflections`
--
ALTER TABLE `kakebo_reflections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kakebo_reflections_profileId_year_month_key` (`profileId`,`year`,`month`),
  ADD KEY `kakebo_reflections_profileId_year_month_idx` (`profileId`,`year`,`month`);

--
-- Индексы таблицы `kakebo_settings`
--
ALTER TABLE `kakebo_settings`
  ADD PRIMARY KEY (`profileId`);

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
-- Ограничения внешнего ключа таблицы `account_deletion_requests`
--
ALTER TABLE `account_deletion_requests`
  ADD CONSTRAINT `account_deletion_requests_processed_by_fkey` FOREIGN KEY (`processed_by`) REFERENCES `profiles` (`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `account_deletion_requests_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `account_deletion_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Ограничения внешнего ключа таблицы `kakebo_entries`
--
ALTER TABLE `kakebo_entries`
  ADD CONSTRAINT `kakebo_entries_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `kakebo_reflections`
--
ALTER TABLE `kakebo_reflections`
  ADD CONSTRAINT `kakebo_reflections_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `kakebo_settings`
--
ALTER TABLE `kakebo_settings`
  ADD CONSTRAINT `kakebo_settings_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
