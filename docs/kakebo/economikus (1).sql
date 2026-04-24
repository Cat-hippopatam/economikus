-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:3306
-- Время создания: Апр 24 2026 г., 14:49
-- Версия сервера: 8.0.45-0ubuntu0.24.04.1
-- Версия PHP: 8.3.6

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
  `account_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `access_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `session_state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Структура таблицы `account_deletion_requests`
--

CREATE TABLE `account_deletion_requests` (
  `request_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','COMPLETED','REJECTED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `processed_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processed_at` datetime(3) DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `audio_contents`
--

CREATE TABLE `audio_contents` (
  `audio_content_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `audio_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `credentialID` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `credentialPublicKey` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `counter` int NOT NULL,
  `credentialDeviceType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `credentialBackedUp` tinyint(1) NOT NULL,
  `transports` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `author_applications`
--

CREATE TABLE `author_applications` (
  `application_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `motivation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `portfolio_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_at` datetime(3) DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `author_applications`
--

INSERT INTO `author_applications` (`application_id`, `profile_id`, `status`, `motivation`, `experience`, `portfolio_url`, `reviewed_by`, `reviewed_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
('30bc86ec-7201-41a2-9d5e-2de0800cacc1', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 'APPROVED', 'тест апрарпавпрапоапоапоапрапрапраправрпварпвпавпвапвапвап', NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '2026-03-19 08:42:22.850', NULL, '2026-03-19 08:40:20.354', '2026-03-19 08:42:22.853'),
('499f9ec0-fa38-4bf4-bc7b-31fb4715257b', 'e1dcc85e-98c7-442f-b0ec-a579aed64814', 'APPROVED', 'ertertertetrtetertretegfgdchgvkjlkjlgjkhfjgfghfghfghf', NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '2026-04-14 04:54:35.440', NULL, '2026-04-14 03:10:42.432', '2026-04-14 04:54:35.442'),
('761eefea-0268-4083-9b88-1fb9d5d9ccad', 'e1dcc85e-98c7-442f-b0ec-a579aed64814', 'REJECTED', 'fghghghhgfghfdfjghkdghkdghdhjghjghhjgdhjgjdhjghjgdjdg', NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '2026-04-14 03:10:07.596', 'fghfgh', '2026-04-14 03:09:37.487', '2026-04-14 03:10:07.597'),
('9c98d9bf-d8ad-41cb-bbdb-4967ce6e5409', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'APPROVED', 'вапавапвпапвапвапвапвапвапвапавпвапвапврпапропропропо', NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '2026-03-20 06:52:06.902', NULL, '2026-03-20 06:50:50.195', '2026-03-20 06:52:06.904');

-- --------------------------------------------------------

--
-- Структура таблицы `business_events`
--

CREATE TABLE `business_events` (
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `object_type` enum('COURSE','LESSON','COMMENT','SUBSCRIPTION') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `object_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `certificate_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `issued_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completed_at` datetime(3) NOT NULL,
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pdf_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `certificate_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `comment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentable_type` enum('COURSE','LESSON') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentable_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `moderated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `course_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover_image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `difficulty_level` enum('BEGINNER','INTERMEDIATE','ADVANCED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `lessons_count` int NOT NULL DEFAULT '0',
  `modules_count` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PENDING_REVIEW','PUBLISHED','ARCHIVED','DELETED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime(3) DEFAULT NULL,
  `author_profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
('2abd6e91-d8f4-4189-a1df-4167e278f08d', 'Еуые', 'test1sedfgdsf', '', '', 'ADVANCED', 0, 0, 1, 'PUBLISHED', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 45, 0, '2026-03-19 15:57:46.463', '2026-04-13 12:48:00.458', NULL),
('38a0da6e-82f3-477b-be4f-fc5f82568d0c', 'ВВП', 'vvp', '', '', 'ADVANCED', 0, 0, 2, 'PUBLISHED', 1, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 132, 0, '2026-03-20 06:52:43.604', '2026-04-22 10:38:45.641', NULL),
('41746a95-ba21-4d7a-87bb-588421bf0409', 'dfgdfg', 'dfgd', NULL, NULL, NULL, NULL, 0, 2, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 4, 0, '2026-04-10 13:04:25.757', '2026-04-12 13:48:55.764', '2026-04-12 13:48:55.763'),
('56b2edfb-bc0f-46f4-8efd-e991bd4ce2ad', 'hec', 'gorn', NULL, NULL, NULL, NULL, 0, 2, 'PUBLISHED', 0, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 1, 0, '2026-04-10 12:55:38.094', '2026-04-12 15:55:25.475', NULL),
('6435f0fe-1f72-480f-b358-db01f06855db', 'test', 'test', NULL, NULL, NULL, NULL, 0, 1, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 5, 0, '2026-04-12 15:56:31.197', '2026-04-12 16:47:57.756', NULL),
('67eb7445-0c5e-4743-a51f-5c6cd5987abf', 'test123456', 'test123456fdgdg', 'wefsfsdf', NULL, 'BEGINNER', NULL, 0, 0, 'PENDING_REVIEW', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 11:46:55.119', '2026-03-19 12:42:16.909', '2026-03-19 12:42:16.907'),
('72493c2b-3732-11f1-a8d2-1278a1aee829', 'Основы финансовой грамотности', 'osnovy-finansovoj-gramotnosti', 'Базовый курс для тех, кто хочет научиться управлять личными финансами. Вы узнаете, как вести бюджет, ставить финансовые цели, создавать подушку безопасности и защищаться от мошенников.', 'https://cdn.economikus.ru/covers/fin-gramotnost.jpg', 'BEGINNER', 180, 6, 3, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 0, '2026-04-13 12:15:23.049', '2026-04-13 12:15:23.049', NULL),
('7257effb-3732-11f1-a8d2-1278a1aee829', 'Инвестиции для начинающих', 'investicii-dlya-nachinayushchih', 'Ваш первый шаг в мир инвестиций. Узнайте, чем акции отличаются от облигаций, как работает сложный процент и как собрать свой первый портфель с минимальными рисками.', 'https://cdn.economikus.ru/covers/invest-begin.jpg', 'BEGINNER', 240, 8, 4, 'PUBLISHED', 1, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 0, '2026-04-13 12:15:23.146', '2026-04-13 12:15:23.146', NULL),
('7266211f-3732-11f1-a8d2-1278a1aee829', 'Налоги для физических лиц: просто о сложном', 'nalogi-dlya-fizicheskih-lic', 'Всё, что нужно знать обычному человеку о налогах в России. Имущественный, транспортный, НДФЛ, налоговые вычеты и личный кабинет налогоплательщика.', 'https://cdn.economikus.ru/covers/nalogi-fizlic.jpg', 'INTERMEDIATE', 150, 6, 3, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 0, '2026-04-13 12:15:23.239', '2026-04-13 12:15:23.239', NULL),
('76703931-c58a-4c39-8e15-2437058bbc90', 'test3', 'test33', 'sdfdwsfsdf', '', 'INTERMEDIATE', 1200, 0, 0, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 4, 0, '2026-03-16 12:33:46.043', '2026-04-12 15:05:28.569', '2026-04-12 15:05:28.568'),
('7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', 'Test23', 'testilk', 'dfvbd', '', 'INTERMEDIATE', 0, 0, 2, 'PUBLISHED', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 11, 0, '2026-03-19 13:26:08.009', '2026-04-13 11:49:01.596', NULL),
('818b2431-71e4-43af-a3c5-d4a42d776f8d', 'выапвп', 'test123456', NULL, NULL, 'BEGINNER', NULL, 0, 0, 'DRAFT', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 12:08:00.906', '2026-03-19 12:08:50.953', '2026-03-19 12:08:50.949'),
('880e8400-e29b-41d4-a716-446655440301', 'Основы макроэкономики', 'macroeconomics-basics', 'Полный курс по макроэкономике: ВВП, инфляция, безработица, денежно-кредитная политика', 'https://cdn.economikus.ru/covers/macro-basics.jpg', 'BEGINNER', 180, 12, 3, 'PUBLISHED', 0, '2026-01-20 10:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 8439, 342, '2026-01-20 10:00:00.000', '2026-04-12 16:06:31.907', NULL),
('880e8400-e29b-41d4-a716-446655440302', 'Инвестиции для начинающих', 'investments-for-beginners', 'Научитесь формировать портфель, оценивать риски и выбирать инструменты', 'https://cdn.economikus.ru/covers/invest-begin.jpg', 'BEGINNER', 240, 15, 4, 'PUBLISHED', 1, '2026-02-01 12:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 12591, 891, '2026-02-01 12:00:00.000', '2026-04-12 16:06:48.845', NULL),
('880e8400-e29b-41d4-a716-446655440303', 'Финансовый учёт в 1С', 'accounting-1c-basics', 'Практический курс по ведению бухгалтерии в 1С:Предприятие', 'https://cdn.economikus.ru/covers/1c-accounting.jpg', 'INTERMEDIATE', 300, 20, 5, 'PUBLISHED', 1, '2026-01-10 09:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 5236, 267, '2026-01-10 09:00:00.000', '2026-04-12 16:06:23.387', NULL),
('880e8400-e29b-41d4-a716-446655440304', 'Криптовалюты и блокчейн', 'crypto-blockchain-intro', 'Разбираемся в технологии блокчейн, биткоине и альткоинах', 'https://cdn.economikus.ru/covers/crypto-intro.jpg', 'INTERMEDIATE', 150, 10, 3, 'PUBLISHED', 0, '2026-02-15 14:00:00.000', '660e8400-e29b-41d4-a716-446655440102', 18923, 1205, '2026-02-15 14:00:00.000', '2026-04-05 16:50:57.725', NULL),
('937fab01-13a4-42b5-85db-2053cf819149', 'hjdfgg', 'test1sedfgds', 'dfgdf', NULL, 'INTERMEDIATE', NULL, 0, 0, 'ARCHIVED', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 12:03:35.139', '2026-03-19 12:06:20.948', '2026-03-19 12:06:20.945'),
('ab0968ad-c4f4-4683-bf5a-58e59dd2c3ee', 'test', 'testing', 'fcvhgbfghfh', NULL, 'ADVANCED', NULL, 0, 0, 'DRAFT', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 16:01:46.972', '2026-04-12 15:05:18.914', '2026-04-12 15:05:18.913'),
('d51d7485-3733-11f1-a8d2-1278a1aee829', 'Банковские продукты: как выбрать выгодные', 'bankovskie-produkty-kak-vybrat-vygodnye', 'Научитесь выбирать действительно выгодные дебетовые и кредитные карты, вклады и накопительные счета. Разберёмся в кешбэке, процентах на остаток и скрытых комиссиях.', 'https://cdn.economikus.ru/covers/bank-products.jpg', 'BEGINNER', 140, 6, 3, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 0, '2026-04-13 12:25:18.353', '2026-04-13 12:25:18.353', NULL),
('d529750f-3733-11f1-a8d2-1278a1aee829', 'Страхование: что нужно, а что — маркетинг', 'strahovanie-chto-nuzhno-a-chto-marketing', 'Разбираемся в видах страхования: ОСАГО, КАСКО, ДМС, ипотечное, накопительное. Узнайте, какие полисы действительно необходимы, а какие — пустая трата денег.', 'https://cdn.economikus.ru/covers/insurance.jpg', 'INTERMEDIATE', 120, 5, 2, 'PUBLISHED', 1, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 0, '2026-04-13 12:25:18.433', '2026-04-13 12:25:18.433', NULL),
('d534706f-3733-11f1-a8d2-1278a1aee829', 'Финансовое планирование для семьи', 'finansovoe-planirovanie-dlya-semi', 'Как вести семейный бюджет без ссор, планировать крупные покупки, копить на образование детей и распределять финансовые роли в паре.', 'https://cdn.economikus.ru/covers/family-finance.jpg', 'BEGINNER', 160, 6, 3, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 9, 0, '2026-04-13 12:25:18.504', '2026-04-14 04:48:56.334', NULL),
('d53d4fde-3733-11f1-a8d2-1278a1aee829', 'Психология денег и финансовые привычки', 'psihologiya-deneg-i-finansovye-privychki', 'Почему мы принимаем иррациональные финансовые решения и как это исправить. Курс о мышлении, привычках и установках, которые мешают богатеть.', 'https://cdn.economikus.ru/covers/money-psychology.jpg', 'INTERMEDIATE', 130, 5, 2, 'PUBLISHED', 1, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 15, 0, '2026-04-13 12:25:18.562', '2026-04-13 12:37:53.406', NULL),
('d54684b7-3733-11f1-a8d2-1278a1aee829', 'Удалённая работа и фриланс: финансовая сторона', 'udalyonnaya-rabota-i-frilans-finansovaya-storona', 'Особенности управления деньгами при нестабильном доходе. Налоги для самозанятых и ИП, планирование бюджета в условиях неопределённости, самостоятельные отчисления на пенсию.', 'https://cdn.economikus.ru/covers/freelance-finance.jpg', 'INTERMEDIATE', 140, 6, 3, 'PUBLISHED', 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 28, 0, '2026-04-13 12:25:18.623', '2026-04-22 10:38:37.766', NULL),
('e496dffd-c4f2-47e1-8dd0-21b17db71bcc', 'Тест', 'test123', 'dfgdfgfdgdfg', NULL, 'BEGINNER', NULL, 0, 0, 'DRAFT', 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 0, '2026-03-19 10:25:20.444', '2026-03-19 11:48:08.097', '2026-03-19 11:48:08.092');

-- --------------------------------------------------------

--
-- Структура таблицы `course_progress`
--

CREATE TABLE `course_progress` (
  `course_progress_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
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
('0744cf9e-5308-4da6-bdda-b683bc7fc28a', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd534706f-3733-11f1-a8d2-1278a1aee829', 'NOT_STARTED', 0, 0, 6, NULL, NULL, '2026-04-14 04:48:55.154'),
('51b8e1da-e542-4e24-b7a3-4290c1ded5a8', 'af1383d1-5e50-47a7-833e-26e85c62afae', '880e8400-e29b-41d4-a716-446655440302', 'NOT_STARTED', 0, 0, 4, NULL, NULL, '2026-04-05 16:51:11.759'),
('532f2f72-f3a8-40f7-aa32-b403ad573b50', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd54684b7-3733-11f1-a8d2-1278a1aee829', 'NOT_STARTED', 0, 0, 6, NULL, NULL, '2026-04-22 10:38:37.939'),
('hh0e8400-e29b-41d4-a716-446655440c01', '660e8400-e29b-41d4-a716-446655440103', '880e8400-e29b-41d4-a716-446655440301', 'in_progress', 33, 4, 12, '2026-03-01 10:00:00.000', NULL, '2026-03-12 10:00:00.000'),
('hh0e8400-e29b-41d4-a716-446655440c02', '660e8400-e29b-41d4-a716-446655440104', '880e8400-e29b-41d4-a716-446655440302', 'in_progress', 60, 9, 15, '2026-02-20 14:30:00.000', NULL, '2026-03-12 14:30:00.000'),
('hh0e8400-e29b-41d4-a716-446655440c03', '660e8400-e29b-41d4-a716-446655440103', '880e8400-e29b-41d4-a716-446655440304', 'completed', 100, 10, 10, '2026-02-25 09:00:00.000', '2026-03-10 18:45:00.000', '2026-03-10 18:45:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `course_tags`
--

CREATE TABLE `course_tags` (
  `course_tag_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `course_tags`
--

INSERT INTO `course_tags` (`course_tag_id`, `course_id`, `tag_id`) VALUES
('4399896f-ff44-4a6d-b51d-d2f1634cd939', '2abd6e91-d8f4-4189-a1df-4167e278f08d', '770e8400-e29b-41d4-a716-446655440204'),
('ff5c91d0-9210-409d-958c-b0a0762207e3', '2abd6e91-d8f4-4189-a1df-4167e278f08d', '770e8400-e29b-41d4-a716-446655440206'),
('191cb5e5-fa9c-49b3-8ce7-617771bff750', '7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', '770e8400-e29b-41d4-a716-446655440204'),
('dfb07e4b-c8a9-4a09-965d-fe814c728331', '7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', '770e8400-e29b-41d4-a716-446655440206'),
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
  `favorite_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `collection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `favorites`
--

INSERT INTO `favorites` (`favorite_id`, `profile_id`, `lesson_id`, `note`, `collection`, `created_at`) VALUES
('31656d4a-79c0-4482-8c6c-4be13c75db02', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', '42d89e6d-7d94-4acd-abb3-45356f77abe2', NULL, NULL, '2026-03-24 13:07:04.381'),
('39e13b51-8869-41b0-8666-fc499b5b1c2d', 'af1383d1-5e50-47a7-833e-26e85c62afae', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', NULL, NULL, '2026-04-05 11:59:56.637'),
('mm0e8400-e29b-41d4-a716-446655441101', '660e8400-e29b-41d4-a716-446655440104', 'aa0e8400-e29b-41d4-a716-446655440505', 'Важно пересмотреть перед инвестициями', 'Инвестиции', '2026-02-20 15:25:00.000'),
('mm0e8400-e29b-41d4-a716-446655441102', '660e8400-e29b-41d4-a716-446655440104', 'aa0e8400-e29b-41d4-a716-446655440507', 'Калькулятор сложного процента — супер!', 'Инструменты', '2026-02-21 09:00:00.000'),
('mm0e8400-e29b-41d4-a716-446655441103', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440501', 'База для экзамена', 'Учёба', '2026-03-01 10:25:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `history`
--

CREATE TABLE `history` (
  `history_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `historable_type` enum('LESSON','STANDALONE_ARTICLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `historable_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `watched_seconds` int DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `viewed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `history`
--

INSERT INTO `history` (`history_id`, `profile_id`, `historable_type`, `historable_id`, `watched_seconds`, `completed`, `viewed_at`) VALUES
('0356b4e2-608a-420e-82c4-1244753aa73c', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd539611d-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-14 04:48:47.149'),
('196f4020-420c-4cf4-a59a-0f3abe3aa8fb', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd548dbec-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-22 10:38:31.766'),
('23ddafb6-5b69-4d1a-bab5-d7cfca25e953', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'LESSON', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 0, 0, '2026-04-05 16:50:43.192'),
('41dec530-cb28-4f85-9830-d6279c271575', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd5364710-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-14 04:48:39.410'),
('4391d419-b571-48f3-b4db-c0dc913fae3a', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440507', 0, 0, '2026-04-05 16:51:09.255'),
('5622044b-2913-42f7-ae51-881eec76ab62', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 0, 0, '2026-04-22 10:38:45.782'),
('6478fa79-a7bb-4706-b757-c15335faaa6b', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', '5d683c3d-8d65-4829-a0b4-d71d6d86003f', 0, 0, '2026-04-10 13:33:08.611'),
('6c66b60b-8208-4d4c-b3ef-e7f56bd0b258', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd53b5165-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-14 04:48:55.140'),
('81aabcf2-04da-455e-8aff-8170e22c9eff', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd53658e6-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-14 04:48:42.147'),
('87f9cf07-8ba9-4fa0-b418-d1b57d326160', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd53949dd-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-14 04:48:44.112'),
('955ec105-6a76-46b6-9188-9368c388a26c', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'fe316cb2-7d8e-4629-88e4-08ed49aa60a6', 0, 0, '2026-04-12 13:57:20.694'),
('a6b8cddf-9e41-4c2f-acb5-45f3e5aacf14', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd54be150-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-22 10:38:34.576'),
('af9a0820-4b44-4f7a-8b3e-70f271150645', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440506', 120, 0, '2026-03-15 13:42:51.204'),
('b4067212-d1d8-479f-86fb-7719cf855fc3', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd54bfdf2-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-22 10:38:35.459'),
('bd7791a7-5f86-4e22-906e-63a916b100a3', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd54e990d-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-22 10:38:36.375'),
('cddec5f4-be9d-45b2-a067-d6656a68f720', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd53b3a4f-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-14 04:48:53.187'),
('d8746c33-ee44-4546-ac2b-d8728adf7fc7', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd54eb16c-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-22 10:38:37.912'),
('e731e8aa-4e7c-4f7a-9b6d-ff93811dc9d1', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'LESSON', '238212e6-887b-40c1-9cc3-468887b91574', 0, 0, '2026-04-05 17:03:56.118'),
('ecea4089-bbdc-4ea1-8b6f-798f9f79e029', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440506', 0, 0, '2026-04-05 16:51:06.224'),
('ee292112-8173-4c43-bebb-13e2ce711ec9', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440505', 0, 0, '2026-04-05 16:51:03.243'),
('f4800507-d389-4729-a511-14c3dea37f2f', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440508', 0, 0, '2026-04-05 16:51:11.742'),
('f63f6373-7cbd-417f-9e31-ddea4012a6ba', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'LESSON', 'd548f97f-3733-11f1-a8d2-1278a1aee829', 0, 0, '2026-04-22 10:38:33.405'),
('jj0e8400-e29b-41d4-a716-446655440e01', '660e8400-e29b-41d4-a716-446655440103', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440501', 720, 1, '2026-03-01 10:18:00.000'),
('jj0e8400-e29b-41d4-a716-446655440e02', '660e8400-e29b-41d4-a716-446655440103', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440502', 480, 1, '2026-03-01 10:28:00.000'),
('jj0e8400-e29b-41d4-a716-446655440e03', '660e8400-e29b-41d4-a716-446655440104', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440505', 840, 1, '2026-02-20 15:15:00.000'),
('jj0e8400-e29b-41d4-a716-446655440e04', '660e8400-e29b-41d4-a716-446655440104', 'LESSON', 'aa0e8400-e29b-41d4-a716-446655440506', 320, 0, '2026-03-12 16:00:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lesson_type` enum('ARTICLE','VIDEO','AUDIO','QUIZ','CALCULATOR') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ARTICLE',
  `sort_order` int NOT NULL DEFAULT '0',
  `duration` int DEFAULT NULL,
  `cover_image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `author_profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PENDING_REVIEW','PUBLISHED','ARCHIVED','DELETED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
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
('425e5039-632c-4197-9694-5b446964988c', '04a196dd-7949-4292-9d25-1738e6b0be55', 'hec1', 'hec1', NULL, 'ARTICLE', 0, NULL, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-10 12:59:47.326', '2026-04-12 13:53:58.586', NULL),
('42d89e6d-7d94-4acd-abb3-45356f77abe2', '8cdb7c04-b5d8-4ed7-bf73-6ced71645faa', 'tewt23', 'tewt', '', 'ARTICLE', 0, 0, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-20 07:34:19.773', '2026-04-13 11:48:11.580', NULL),
('49a7f4c8-b3ee-46c3-aa2b-161aed782b38', NULL, 'test', 'test-3', 'ntfcn', 'ARTICLE', 6, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-16 12:29:59.826', '2026-04-12 16:01:38.625', NULL),
('590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 'c7cbcad6-33dd-4825-9326-91c13e6af1b8', 'введение', 'vvedenie', '', 'ARTICLE', 0, 0, NULL, 'af1383d1-5e50-47a7-833e-26e85c62afae', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-20 06:53:48.430', '2026-03-20 06:59:30.938', NULL),
('5d683c3d-8d65-4829-a0b4-d71d6d86003f', 'e4a29ecd-a839-4f21-b15c-40a61ad0c460', 'erterrty', 'erte', NULL, 'ARTICLE', 0, NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-10 13:04:52.625', '2026-04-12 16:01:49.167', NULL),
('6ba66361-e85a-4ffd-9cf1-9d6b25d09809', NULL, 'test', 'test-2', 'ntfcn', 'ARTICLE', 5, 0, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-16 12:29:52.456', '2026-03-20 07:01:14.404', NULL),
('6bffb046-0bb5-4fb6-8fb3-05c61066432b', 'f12fc4f3-b695-4948-a6c3-3a701718b191', 'eterte', 'eter', NULL, 'VIDEO', 0, NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-10 13:05:13.692', '2026-04-12 15:54:56.020', '2026-04-12 15:54:56.019'),
('7159eb6e-2fb0-45ee-9cd8-0012f6abf785', 'b2332272-0d73-4a80-9750-87c9599f3463', 'rerte', 'rert', 'fghfdh', 'VIDEO', 0, 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-19 16:03:32.902', '2026-03-20 05:59:36.494', NULL),
('724c3e2e-3732-11f1-a8d2-1278a1aee829', '724aa5f9-3732-11f1-a8d2-1278a1aee829', 'Что такое финансовая грамотность и зачем она нужна', 'chto-takoe-finansovaya-gramotnost', 'Введение в тему: почему управлять деньгами нужно учиться, и как это изменит вашу жизнь.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.069', '2026-04-13 12:15:23.069', NULL),
('724c59f0-3732-11f1-a8d2-1278a1aee829', '724aa5f9-3732-11f1-a8d2-1278a1aee829', 'Ставим финансовые цели правильно', 'pravilnye-finansovye-celi', 'Методика SMART для финансов: как мечту превратить в достижимую цель с конкретной суммой и сроком.', 'VIDEO', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.069', '2026-04-13 12:15:23.069', NULL),
('7250a49e-3732-11f1-a8d2-1278a1aee829', '724abf29-3732-11f1-a8d2-1278a1aee829', 'Анализ доходов и расходов: первые шаги', 'analiz-dohodov-i-rashodov', 'Собираем данные о ваших деньгах за месяц и учимся их правильно категоризировать.', 'ARTICLE', 1, 15, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.098', '2026-04-13 12:15:23.098', NULL),
('7250c115-3732-11f1-a8d2-1278a1aee829', '724abf29-3732-11f1-a8d2-1278a1aee829', 'Правило 50/30/20 и другие техники бюджетирования', 'pravilo-50-30-20', 'Разбираем популярные методы распределения бюджета и выбираем подходящий именно вам.', 'QUIZ', 2, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.098', '2026-04-13 12:15:23.098', NULL),
('7254b674-3732-11f1-a8d2-1278a1aee829', '724ad163-3732-11f1-a8d2-1278a1aee829', 'Финансовая подушка: сколько и где хранить', 'finansovaya-podushka-bezopasnosti', 'Рассчитываем размер резервного фонда и выбираем надёжные инструменты для его хранения.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.124', '2026-04-13 12:15:23.124', NULL),
('7254c715-3732-11f1-a8d2-1278a1aee829', '724ad163-3732-11f1-a8d2-1278a1aee829', 'Как защититься от финансовых мошенников', 'zashchita-ot-moshennikov', 'Актуальные схемы обмана и простые правила, которые спасут ваши деньги.', 'VIDEO', 2, 14, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.124', '2026-04-13 12:15:23.124', NULL),
('725ab10e-3732-11f1-a8d2-1278a1aee829', '72594f4c-3732-11f1-a8d2-1278a1aee829', 'Что такое инвестиции и зачем они нужны', 'chto-takoe-investicii', 'Отличие инвестиций от сбережений. Как инфляция съедает ваши деньги.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.164', '2026-04-13 12:15:23.164', NULL),
('725ac212-3732-11f1-a8d2-1278a1aee829', '72594f4c-3732-11f1-a8d2-1278a1aee829', 'Сложный процент — восьмое чудо света', 'slozhnyj-procent', 'Как работает сложный процент и почему начинать инвестировать нужно как можно раньше.', 'CALCULATOR', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.164', '2026-04-13 12:15:23.164', NULL),
('725d1543-3732-11f1-a8d2-1278a1aee829', '725965eb-3732-11f1-a8d2-1278a1aee829', 'Акции: что это и как на них заработать', 'akcii-dlya-novichkov', 'Разбираемся в типах акций, дивидендах и от чего зависит цена.', 'VIDEO', 1, 15, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.179', '2026-04-13 12:15:23.179', NULL),
('725d2853-3732-11f1-a8d2-1278a1aee829', '725965eb-3732-11f1-a8d2-1278a1aee829', 'Облигации: надёжная основа портфеля', 'obligacii-osnova-portfelya', 'Почему облигации считаются защитным активом и как выбрать надёжные.', 'ARTICLE', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.179', '2026-04-13 12:15:23.179', NULL),
('72601da3-3732-11f1-a8d2-1278a1aee829', '72597043-3732-11f1-a8d2-1278a1aee829', 'Риск и доходность: фундаментальная связь', 'risk-i-dohodnost', 'Почему нельзя получить высокую доходность без риска. Виды рисков.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.199', '2026-04-13 12:15:23.199', NULL),
('7260391a-3732-11f1-a8d2-1278a1aee829', '72597043-3732-11f1-a8d2-1278a1aee829', 'Диверсификация: не кладите яйца в одну корзину', 'diversifikaciya-portfelya', 'Как снизить риск с помощью правильного распределения активов.', 'QUIZ', 2, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.199', '2026-04-13 12:15:23.199', NULL),
('7263157d-3732-11f1-a8d2-1278a1aee829', '72597bdb-3732-11f1-a8d2-1278a1aee829', 'Определяем свой риск-профиль', 'risk-profil-investora', 'Тест на определение вашей толерантности к риску.', 'QUIZ', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.219', '2026-04-13 12:15:23.219', NULL),
('7263283a-3732-11f1-a8d2-1278a1aee829', '72597bdb-3732-11f1-a8d2-1278a1aee829', 'Собираем первый портфель из ETF', 'pervyj-portfel-iz-etf', 'Пошаговая инструкция по сборке простого и эффективного портфеля.', 'ARTICLE', 2, 15, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.219', '2026-04-13 12:15:23.219', NULL),
('72684467-3732-11f1-a8d2-1278a1aee829', '7267347f-3732-11f1-a8d2-1278a1aee829', 'Виды налогов для физических лиц', 'vidy-nalogov-dlya-fizlic', 'Обзорная лекция о налогах, которые платит обычный гражданин.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.253', '2026-04-13 12:15:23.253', NULL),
('72685fe7-3732-11f1-a8d2-1278a1aee829', '7267347f-3732-11f1-a8d2-1278a1aee829', 'Личный кабинет налогоплательщика: инструкция', 'lichnyj-kabinet-nalogoplatelshchika', 'Как зарегистрироваться и пользоваться сервисом ФНС, не выходя из дома.', 'VIDEO', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.253', '2026-04-13 12:15:23.253', NULL),
('726b4af4-3732-11f1-a8d2-1278a1aee829', '726747ec-3732-11f1-a8d2-1278a1aee829', 'Налог на имущество: как рассчитывается', 'nalog-na-imushchestvo', 'Почему налог на квартиру вырос и как проверить кадастровую стоимость.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.273', '2026-04-13 12:15:23.273', NULL),
('726b71dd-3732-11f1-a8d2-1278a1aee829', '726747ec-3732-11f1-a8d2-1278a1aee829', 'Транспортный и земельный налог', 'transportnyj-i-zemelnyj-nalog', 'Особенности расчёта и льготы для владельцев авто и участков.', 'ARTICLE', 2, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.273', '2026-04-13 12:15:23.273', NULL),
('726dbf7d-3732-11f1-a8d2-1278a1aee829', '726758dd-3732-11f1-a8d2-1278a1aee829', 'Имущественный вычет при покупке жилья', 'imushchestvennyj-vychet', 'Как вернуть до 260 000 рублей при покупке квартиры и до 390 000 рублей по ипотечным процентам.', 'CALCULATOR', 1, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.289', '2026-04-13 12:15:23.289', NULL),
('726dd9a6-3732-11f1-a8d2-1278a1aee829', '726758dd-3732-11f1-a8d2-1278a1aee829', 'Социальные и инвестиционные вычеты', 'socialnye-i-investicionnye-vychety', 'Возврат денег за лечение, обучение и инвестиции на ИИС.', 'ARTICLE', 2, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:15:23.289', '2026-04-13 12:15:23.289', NULL),
('72eb5a4b-1268-490d-b69c-60c9f3c53c18', NULL, 'Введение инвестирование', 'vvedenir-in-inv', NULL, 'ARTICLE', 0, NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'DRAFT', NULL, 0, 0, '2026-04-06 09:15:19.674', '2026-04-06 09:15:19.674', NULL),
('aa0e8400-e29b-41d4-a716-446655440501', '990e8400-e29b-41d4-a716-446655440401', 'Что такое ВВП?', 'what-is-gdp', 'Разбираем понятие валового внутреннего продукта', 'VIDEO', 1, 12, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:00:00.000', 3420, 156, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440502', '990e8400-e29b-41d4-a716-446655440401', 'Инфляция: виды и измерение', 'inflation-types', 'Как считают инфляцию и почему она важна', 'ARTICLE', 2, 8, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:05:00.000', 2890, 134, '2026-01-20 10:05:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440503', '990e8400-e29b-41d4-a716-446655440401', 'Уровень безработицы', 'unemployment-rate', 'Типы безработицы и методы расчёта', 'QUIZ', 3, 10, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:10:00.000', 2156, 98, '2026-01-20 10:10:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440504', '990e8400-e29b-41d4-a716-446655440401', 'Практикум: расчёт макропоказателей', 'macro-calculations-practice', 'Решаем задачи на расчёт ВВП и инфляции', 'CALCULATOR', 4, 15, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-01-20 10:15:00.000', 1876, 87, '2026-01-20 10:15:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440505', '990e8400-e29b-41d4-a716-446655440404', 'Риск и доходность: базовая связь', 'risk-return-basics', 'Почему высокая доходность = высокий риск', 'VIDEO', 1, 14, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:00:00.000', 5621, 412, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440506', '990e8400-e29b-41d4-a716-446655440404', 'Диверсификация портфеля', 'portfolio-diversification', 'Как снизить риск за счёт разнообразия активов', 'ARTICLE', 2, 11, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:05:00.000', 4892, 356, '2026-02-01 12:05:00.000', '2026-03-13 11:16:27.529', NULL),
('aa0e8400-e29b-41d4-a716-446655440507', '990e8400-e29b-41d4-a716-446655440404', 'Сложный процент в действии', 'compound-interest-demo', 'Калькулятор сложного процента с примерами', 'CALCULATOR', 3, 9, NULL, '660e8400-e29b-41d4-a716-446655440102', 0, 'PUBLISHED', '2026-02-01 12:10:00.000', 6238, 521, '2026-02-01 12:10:00.000', '2026-03-15 13:42:51.792', NULL),
('aa0e8400-e29b-41d4-a716-446655440508', '990e8400-e29b-41d4-a716-446655440404', 'Тест: основы риск-менеджмента', 'risk-management-quiz', 'Проверьте знания по управлению рисками', 'QUIZ', 4, 12, NULL, '660e8400-e29b-41d4-a716-446655440102', 1, 'PUBLISHED', '2026-02-01 12:15:00.000', 3987, 289, '2026-02-01 12:15:00.000', '2026-03-13 11:16:27.529', NULL),
('ae153975-21c2-447d-8071-55300b1ffa0b', 'b2332272-0d73-4a80-9750-87c9599f3463', 'гкщл', 'testilkr', 'xvxcv', 'ARTICLE', 0, 0, NULL, 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 0, 'PUBLISHED', NULL, 0, 0, '2026-03-19 13:52:23.382', '2026-03-20 07:01:05.709', NULL),
('d51feb9c-3733-11f1-a8d2-1278a1aee829', 'd51ec77f-3733-11f1-a8d2-1278a1aee829', 'Как выбрать дебетовую карту: на что смотреть', 'kak-vybrat-debetovuyu-kartu', 'Критерии выбора: кешбэк, процент на остаток, стоимость обслуживания, лимиты.', 'ARTICLE', 1, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.370', '2026-04-13 12:25:18.370', NULL),
('d51fffc8-3733-11f1-a8d2-1278a1aee829', 'd51ec77f-3733-11f1-a8d2-1278a1aee829', 'Кешбэк: как получать максимум', 'keshbek-kak-poluchat-maksimum', 'Сравнение кешбэк-программ банков. Как выбрать категории и не попасть на уловки.', 'QUIZ', 2, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.370', '2026-04-13 12:25:18.370', NULL),
('d523242b-3733-11f1-a8d2-1278a1aee829', 'd51ed90e-3733-11f1-a8d2-1278a1aee829', 'Вклад или накопительный счёт: что выбрать', 'vklad-ili-nakopitelnyj-schet', 'Сравниваем доходность, ликвидность и надёжность инструментов.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.391', '2026-04-13 12:25:18.391', NULL),
('d523402d-3733-11f1-a8d2-1278a1aee829', 'd51ed90e-3733-11f1-a8d2-1278a1aee829', 'Калькулятор доходности вклада', 'kalkulyator-dohodnosti-vklada', 'Рассчитайте реальную доходность с учётом капитализации и налога.', 'CALCULATOR', 2, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.391', '2026-04-13 12:25:18.391', NULL),
('d525f441-3733-11f1-a8d2-1278a1aee829', 'd51ee0d6-3733-11f1-a8d2-1278a1aee829', 'Грейс-период: беспроцентный период без подвоха', 'grejs-period-besprocentnyj', 'Как пользоваться кредиткой и не платить проценты. Правила и ошибки.', 'VIDEO', 1, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.409', '2026-04-13 12:25:18.409', NULL),
('d52609d6-3733-11f1-a8d2-1278a1aee829', 'd51ee0d6-3733-11f1-a8d2-1278a1aee829', 'Кредитная карта как инструмент заработка', 'kreditnaya-karta-kak-instrument-zarabotka', 'Схема: тратим с кредитки, держим свои деньги на вкладе.', 'ARTICLE', 2, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.409', '2026-04-13 12:25:18.409', NULL),
('d52cd82d-3733-11f1-a8d2-1278a1aee829', 'd52af3aa-3733-11f1-a8d2-1278a1aee829', 'ОСАГО: как сэкономить и не попасть на штраф', 'osago-kak-sekonomit', 'Расчёт коэффициента бонус-малус (КБМ), выбор страховой и проверка подлинности.', 'ARTICLE', 1, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.455', '2026-04-13 12:25:18.455', NULL),
('d52cf7c3-3733-11f1-a8d2-1278a1aee829', 'd52af3aa-3733-11f1-a8d2-1278a1aee829', 'Страхование квартиры и ответственности', 'strahovanie-kvartiry-i-otvetstvennosti', 'Когда полис действительно нужен. Что входит в базовое покрытие.', 'ARTICLE', 2, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.455', '2026-04-13 12:25:18.455', NULL),
('d52d03aa-3733-11f1-a8d2-1278a1aee829', 'd52af3aa-3733-11f1-a8d2-1278a1aee829', 'Страховка для путешественников (ВЗР)', 'strahovka-dlya-puteshestvennikov', 'Как выбрать полис для визы и реальной защиты за границей.', 'VIDEO', 3, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.455', '2026-04-13 12:25:18.455', NULL),
('d53186a9-3733-11f1-a8d2-1278a1aee829', 'd52b0d14-3733-11f1-a8d2-1278a1aee829', 'ДМС vs ОМС: стоит ли переплачивать', 'dms-vs-oms-stoit-li-pereplachivat', 'Сравниваем возможности полиса добровольного медицинского страхования с бесплатной медициной.', 'QUIZ', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.485', '2026-04-13 12:25:18.485', NULL),
('d5319b27-3733-11f1-a8d2-1278a1aee829', 'd52b0d14-3733-11f1-a8d2-1278a1aee829', 'Накопительное и инвестиционное страхование жизни (НСЖ/ИСЖ)', 'nszh-iszh-razbor', 'Почему эти продукты часто невыгодны и как их правильно анализировать.', 'ARTICLE', 2, 15, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.485', '2026-04-13 12:25:18.485', NULL),
('d5364710-3733-11f1-a8d2-1278a1aee829', 'd5355420-3733-11f1-a8d2-1278a1aee829', 'Три модели семейного бюджета', 'tri-modeli-semejnogo-byudzheta', 'Общий, раздельный и смешанный бюджет: плюсы и минусы каждого подхода.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.516', '2026-04-13 12:25:18.516', NULL),
('d53658e6-3733-11f1-a8d2-1278a1aee829', 'd5355420-3733-11f1-a8d2-1278a1aee829', 'Как обсуждать деньги без ссор', 'kak-obsuzhdat-dengi-bez-ssor', 'Практические техники коммуникации для финансовых разговоров.', 'VIDEO', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.516', '2026-04-13 12:25:18.516', NULL),
('d53949dd-3733-11f1-a8d2-1278a1aee829', 'd53563f8-3733-11f1-a8d2-1278a1aee829', 'Ипотека: как накопить на первый взнос', 'ipoteka-kak-nakopit-na-pervyj-vznos', 'Реалистичный план накопления первоначального взноса за 1-3 года.', 'CALCULATOR', 1, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.536', '2026-04-13 12:25:18.536', NULL),
('d539611d-3733-11f1-a8d2-1278a1aee829', 'd53563f8-3733-11f1-a8d2-1278a1aee829', 'Финансовый план на 5 лет', 'finansovyj-plan-na-5-let', 'Ставим измеримые цели: ремонт, машина, путешествие.', 'QUIZ', 2, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.536', '2026-04-13 12:25:18.536', NULL),
('d53b3a4f-3733-11f1-a8d2-1278a1aee829', 'd5356d60-3733-11f1-a8d2-1278a1aee829', 'Карманные деньги: сколько и с какого возраста', 'karmannye-dengi-skolko-i-s-kakogo-vozrasta', 'Как научить ребёнка обращаться с деньгами через практику.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.549', '2026-04-13 12:25:18.549', NULL),
('d53b5165-3733-11f1-a8d2-1278a1aee829', 'd5356d60-3733-11f1-a8d2-1278a1aee829', 'Накопления на образование ребёнка', 'nakopleniya-na-obrazovanie-rebenka', 'Сколько нужно откладывать в месяц, чтобы оплатить вуз через 15 лет.', 'CALCULATOR', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.549', '2026-04-13 12:25:18.549', NULL),
('d53f81d4-3733-11f1-a8d2-1278a1aee829', 'd53e852d-3733-11f1-a8d2-1278a1aee829', 'Тест: Ваш денежный сценарий', 'test-vash-denezhnyj-scenarij', 'Определите, какой сценарий (бедняк, середняк, богач) управляет вашими финансами.', 'QUIZ', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.578', '2026-04-13 12:25:18.578', NULL),
('d53f9d45-3733-11f1-a8d2-1278a1aee829', 'd53e852d-3733-11f1-a8d2-1278a1aee829', 'Синдром отложенной жизни и импульсивные покупки', 'sindrom-otlozhennoj-zhizni', 'Как перестать жить «на черновик» и контролировать спонтанные траты.', 'ARTICLE', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.578', '2026-04-13 12:25:18.578', NULL),
('d53fb3db-3733-11f1-a8d2-1278a1aee829', 'd53e852d-3733-11f1-a8d2-1278a1aee829', 'Финансовая тревожность: как успокоиться', 'finansovaya-trevozhnost', 'Практические техники снижения стресса из-за денег.', 'VIDEO', 3, 15, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.578', '2026-04-13 12:25:18.578', NULL),
('d5438550-3733-11f1-a8d2-1278a1aee829', 'd53ea30c-3733-11f1-a8d2-1278a1aee829', 'Метод маленьких шагов: как начать копить', 'metod-malenkih-shagov', 'Почему резкие перемены не работают и как внедрять привычки постепенно.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.604', '2026-04-13 12:25:18.604', NULL),
('d543a4c7-3733-11f1-a8d2-1278a1aee829', 'd53ea30c-3733-11f1-a8d2-1278a1aee829', 'Челлендж: 30 дней финансовой осознанности', 'chellendzh-30-dnej-finansovoj-osoznannosti', 'Пошаговый план на месяц для перезагрузки денежного мышления.', 'QUIZ', 2, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 1, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.604', '2026-04-13 12:25:18.604', NULL),
('d548dbec-3733-11f1-a8d2-1278a1aee829', 'd547ac38-3733-11f1-a8d2-1278a1aee829', 'Самозанятый или ИП: что выбрать в 2026 году', 'samozanyatyj-ili-ip', 'Сравнение налоговых режимов НПД, УСН и ПСН для фрилансеров.', 'ARTICLE', 1, 15, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.639', '2026-04-13 12:25:18.639', NULL),
('d548f97f-3733-11f1-a8d2-1278a1aee829', 'd547ac38-3733-11f1-a8d2-1278a1aee829', 'Приложение «Мой налог»: пошаговая инструкция', 'moy-nalog-instrukciya', 'Как регистрироваться, выписывать чеки и платить налог самозанятого.', 'VIDEO', 2, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.639', '2026-04-13 12:25:18.639', NULL),
('d54be150-3733-11f1-a8d2-1278a1aee829', 'd547c0e6-3733-11f1-a8d2-1278a1aee829', 'Метод «среднего чека» для нестабильного дохода', 'metod-srednego-cheka', 'Как рассчитать свой реальный средний доход и отталкиваться от него в бюджете.', 'ARTICLE', 1, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.658', '2026-04-13 12:25:18.658', NULL),
('d54bfdf2-3733-11f1-a8d2-1278a1aee829', 'd547c0e6-3733-11f1-a8d2-1278a1aee829', 'Калькулятор подушки безопасности для фрилансера', 'kalkulyator-podushki-dlya-frilansera', 'Рассчитайте увеличенный резервный фонд с учётом нестабильности.', 'CALCULATOR', 2, 10, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.658', '2026-04-13 12:25:18.658', NULL),
('d54e990d-3733-11f1-a8d2-1278a1aee829', 'd547d542-3733-11f1-a8d2-1278a1aee829', 'Как самозанятому копить на пенсию', 'kak-samozanyatomu-kopit-na-pensiyu', 'Обзор инструментов: ИИС, ПДС, самостоятельные инвестиции.', 'ARTICLE', 1, 12, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.676', '2026-04-23 13:18:14.863', NULL),
('d54eb16c-3733-11f1-a8d2-1278a1aee829', 'd547d542-3733-11f1-a8d2-1278a1aee829', 'Больничный и отпуск для фрилансера', 'bolnichnyj-i-otpusk-dlya-frilansera', 'Как закладывать «социальные» расходы в стоимость своих услуг.', 'QUIZ', 2, 8, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'PUBLISHED', NULL, 0, 0, '2026-04-13 12:25:18.676', '2026-04-14 04:52:57.740', NULL),
('da5f1c71-645e-48a7-ae2a-e8a7f985a260', 'e4a29ecd-a839-4f21-b15c-40a61ad0c460', 'ggggg', 'ggggg', NULL, 'ARTICLE', 7, NULL, NULL, '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 0, 'REJECTED', NULL, 0, 0, '2026-04-12 13:52:30.468', '2026-04-12 16:07:47.140', NULL);
INSERT INTO `lessons` (`lesson_id`, `module_id`, `title`, `slug`, `description`, `lesson_type`, `sort_order`, `duration`, `cover_image`, `author_profile_id`, `is_premium`, `status`, `published_at`, `views_count`, `likes_count`, `created_at`, `updated_at`, `deleted_at`) VALUES
('fe316cb2-7d8e-4629-88e4-08ed49aa60a6', 'c7cbcad6-33dd-4825-9326-91c13e6af1b8', 'tegtest18', 'tegt1', NULL, 'ARTICLE', 0, NULL, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5kAAAHhCAYAAADkuHqjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAKfvSURBVHhe7N0JfA3n/j/wTxZOJJJYQkJICEFExJoUQSqWVlquVDdu1XJR7q3SVZd/lV9bqi26XFq9lrY3dCFuFbeW9CopjZ1QS4gmhIgQSSScLPJ/npk5yTnJySImRH3er9ckM88sZ/aZ7zzPPGPj3tK/EEREREREREQ6sNX+ExEREREREd0yBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbG/eW/oVae41iY2uLWva1YGdfG7a2drC1UePhG4U3cONGAQryc5GXn4fCGzeUdCIiIiIiIrrzamSQaXBwRO1aDmLutISyiDnPzbsO4/UcLYGIiIiIiIjupGoJMhs16gK3Bv6o5+oLZ2cvONZpjNq1XWFnZ1D6FxQYkZubgZxrqcjKSsKVjHikXT6CS5cPok6dukrOpTWmGS0Ze8qczWvXruJGQYGWQkRERERERHeCbkGmd/NB8GreD008QmBv76ClVl7W1UT8tvtlXDdeVrrlTFWUkWkih5XFZq9dy2KgSUREREREdAfdUpBZp04jtPF9HK19hsFQu56WWjXbd/4dVzJOILhbZwR164RPPlum9ak8maOZfTVD6yIiIiIiIqLbrUq1y9raGRDY8R/4y0P/hX+7MbccYB6LX6YEmCZTnhmDZ0VjTgafsimPLGYr3+ckIiIiIiKiO8Oubv3Gb2ntlSKLxYaGzIdnkxDY2FS2QGvZ8vKysHvvm6KtUCn2mnwuRUmXgaa0a88BJbj8978+QsSQBy3SrbG1sxfTNIrJ6VIKmKqFH8bMmIW3/x6OAMcERB9MU1Ij3o3E4pdGY+xfnxRNMFz//RN+U/oQEREREdHd4qZyMoO6voZePd6Fo6O7lnLrzp7bIoJL9TMkppBVFpWN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sjxVW66aLCBMLfZ7U8tT2fUuh2udifXRVfuGpkmV5pGIiIiI6C5h85fHVxe2bKG+V3irTEVkZe7kxi0FRUGnDDZNuZcmJYc1zwHVK9A8/cd67Nz1ptZFRERERERE1c3mqb/tLnRrKKs0vTXmuZi3Sq8gM+1SHDZFj9a6iIiIiIiIqLrZOtZprLXemlY+lfvkSGXo9W6mXstGRERERERElWPz7AtXCvWo+MdU/NU8F7Ki9yyt9dfz3cz8/Ov4LqqX1kVERERERETVzdbOTg3qbpUMMGsavZaNiIiIiIiIKqfmRYZERERERER017ItKNCnkh09mb6neatq4rIRERERERH9mdlMfDax0NHRXeusOvNPkNwq02dNblVOzgX8Z91grYuIiIiIiIiqm23OtVSt9dboERSanEoo1NpujV7LRkRERERERJVjm5WVpLXqR+ZEytphFy7OU7pl8VfZbd6YisTKYWS3HEeS6XoVl62OZSMiIiIiIqKy2V7JiNdab50MFiVTsVlTsGit5llTmhxGtpvG2aRjjqiey0ZEREREREQVs027fERr1Ycp91J+71K+p2li3m4eYMp0+Y1NSeZm6pWLKem9bERERERERFQ+O5vaBW/5tX0atrb6VNpzOV19n1IGkuY5mLJdvmvZoL5NUVAp203D6FXZj0l+/nXs3vuO1kVERERERES3g417S//C3j3fQ/Nm/bUk/chg0jzQtEbmXMoisnrmYEpnzm7B9h2vaF1ERERERER0OyhBpnfzQejV410tSV8yyGzlY6O0tzILOE+JoFLmbOodXJr8uvM1JJ7ZqHURERERERHR7aAEmbLlkb9Ew1C7npJ4tzPmXsHq/4RpXURERERERHS7FGUtnkxYo7Xd/f5My0JERERERHQ3KQoyT8R/i8JCtdKeu5lcBrksREREREREdPsVFZeVAjv+A/7txmhdd6cjx5bh4KFPta6q8kbgyEcQ6Kx1WjiDmM++R4LWRURERERERMUsqn6NO/IFcnIuaF13HznvchluXS0YDAY4GuxQ/HVPwE6mOdSxSCMiIiIiIqJiFkHmjQIj9h/8SOu6+8h5l8ugm9S9WPHZPHylNTFntXRzBk94duiLdp37wsfHwzIANTSEo2tD2KmV65oxwODqAYP6uVCFnVNbeIlpyOl4NXHSUoVarmIalsPCxklJczTo821TIiIi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DCdn1BNBgzJ/ZeUUFp7Erm83YN95Ixzd5ftp6nwUpBzEho17yyheVwZruU9F8pH285f48ZBYHqeG8O/WE707eqJ+4SXsWrdaqYDktrEzwOCoNfZGZJw9iPWfvIIBj3wAiy+QWJG02FQRkGb/YhHgvIIFG48i1WiAq4cPfNuIppkzjOkJiHprLCZXNNE74MrWz7FmZzKyasvaiIOVbeFml42ErSuw4VAdsT81hKN8aGC+b7X0EPuTKc0NTSocxgMu8t3lr6Ow80w27BuY7edZZvt5KfkoyLN2POm5D5neyfRAfdsMJO1ci42yMqI7QR43UZtKH9cWipc9R9tmod1aK8u+b30k9lVQrN34+wp8u+k40nLFdvELFOO2haeTEcmHNpQqdWDMtYN70TDi/GFlmDJzXU3f+DQVo7V6LiAiIiIic+p3MnXRGkFjH0UXyG/kbUCWixsMxjTkGKsYrOrBxgmOLg4wZl5CQbXeHNrDriYsb3XwDkZ4FwOS1mxDnJZU09k5eYiQKx052abQWft+45lf8NnqHVpaMfWbm5lIEyGkW7nDiEBjwVeI19JkYGdwrQ/kpKiVw9ySP/E+VAnKNsuv4rIbGsLRcB05mSWC6o6j8Ew/TyT9PBsbjrrC0VEEnBkZN/egiYiIiIhuWol3MvWSj4LMlDt/s1yYjZyM6g4wpRqyvNUhMRbr76IAUyrIFtuiKMCUCpBz3Sga6+FFgdIvF8YKh7lWIkAxiqBFjwBT+hPvQ5WgbLOqLrvxUukAs6S8DHEuYIBJREREdDtUU07m2nJrfiUiqnbmOZmHtDQiIiIiqnY6BplERERERER0r6um4rJERERERER0L2KQSURERERERLphkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6YZBJREREREREurHpEBxWqLXTXSbuty1a2+0XcF9/rY2IiIiIiEh1MTUFNu4t/RlkEhERERERkS5YXJaIiIiIiIh0wyCTiIiIiIiIdMMgk4iIiIiIiHTDIJOIiIiI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RERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsb95b+hVo76jg6wcGhDuzt7USXjZpYpkLk5xfg+vVruJaTraURERERERHRvUzJybSztUP9Bm6oW9dZBJj2IqWiAFOyUYaV48hx5TSIiIiIiIjo3qbkZMogUQaM+fn5yMm+itzc6ygsyt+0zkbEobVrO8DRqW7RuOmX07S+REREREREdC+yaeEfVChzI2WQeCU9rcLgsiQZbNarrwapV69m3WLR2Z4YPLUvvLSukrIOfY/In09qXURERERERFTT2LTr2rdQBoiZGVdgNF7Xkm+OweAAF9d6OudmtkbQ2Efhtmc2NhzSkoiIiO40Gyc4ujgrrQU5KTDmKa1ERETVyzUYPUIccHT9L7gCT/gO6oqCX9ci4arWvwax6RDcr1D8Q9rFlJvOxTSRuZlujTxEWyEupl5QE29ZiSCz0UAMGwj8L3KTWKmapoMxbIgTDn72PRL8HsWovs21HmbO/Iqv1sdqHXSvsfMbgVED3XDk+4XYdS5fS7WHW//JGO71B9Z8vRYXeINIRJXiCs9+j2NgQEMYCvJhFOcSgz2QFb8Jq9bvFd1ERJVRUcm9w0jv2KHckn3rMRhP1N+Dz1bv0FLprtBxFJ7p56l1mMk8gm+Wri2OccrUGl3GDENgQRouwA2eBQfxjYiNsrS+NYkIMsOU0PJiaoqSUFWNGssg89anU6xEkNlkCEY+CKw3bQAncYCOFgdorWREL/gK8XKj+Z3FVz/9Lvsq6t/3GB6uywPw3iYCyn4ioGzxB1YtW4s0sbcbxL4y4v56JQJPIqLyOXadgJFBedgRtQJHLqghpV2Dfhg0Ihh2Oz/Gj3tZ0zoR3ayKSu5Z71+v3xQGmXcjGa90u2IZUFpLK5cBBtf6sMM1GDMyUKCl1jR2jZv5vCVbZIU/t8LJqa7y/1anU6wBPDv7w/FcDOJl5qhzW3T0BeL3H8d1G3HA/XUwPE4eQaq7Ay7/dhCX3QPRrX4qdu4/ijzjVaWx8w5GhzrnsOfoGXWSdA+6gZw/LsG2cyhCvPJw9Kw3woYG4Ppv/8L/jl9TB3EKRJchj+CBsP64L6gHWjevh/SkeGSZcjjN+nfvHoQ2TWvjbIIH7pvwOPp064HAEk397J34g3VgEf3p5J0/iH179+Hi1eJLeuG1M7Br0QstbyQh7vRl+IQ/j0B7y3NAcZorPEMex6CBA9Grdy8EBnRA7cyTSL5sRL1eE/CgVxqOncnQxvJG4Mhx8MvXptWwL0KHD8X99/dD925d4Ol8HYmnLyg3F+X/ppzO4/BI2YsLOVpPeQ19ajR88yqeNhFVtxL3u6VY7+/Qkve4dyUZrzS9jsMyntGSSqYZWg/GoKF/QWjfvujapSPc8s/hVEqWWqpzWCukxJ1AthLrGFEoS3WO7ITcPb8jXU7L/HzeRZzPXa7jbHYgHnpqKIJK3bMGAIlp8Bg2DoN6mdI6w8u9EbLPyfvgiq4f9nD0fQD3hz+IXj3FNa1omurwyidM7i6u8I0YBv+MX7DmZ97JUyUUnsSub3fgQvM+GDGqL9xTfsGm3dqNnE1XhI0ejA75R/Dj18vw1ddrcSC/HR4ePQo+DqX7R/57PeIMXfFAr2zsXLkCq2SzPx2O6QfUdtHsZN1URH9S+fKtEKCWKxxdPUTTFr4Dx6JHoxTsPaAe+HYOBjjWUlqLFKXVag0f96s4uPFrRC7/Gj8eAQIfCIeX/GqYwQGOBvMRa8Fg0MZzCMbAJ4LgfGIjvv1sHpZ+8yuutBiMxwf5K0OW+5vKdByUYr0q9RrapWHlpk1ERPpxdK4LXM0oO8eyiQgaw1sja8d3+GrhPHy17hgMvUbh4e6ugL28TsibU40s1TksEO4OdaB8SLLBQAz/axDqJ/+KNcvFPesqcT73DENIk9+xUbtHjT6dj4LT0do962ocTpPXiHycjtbuadfHIs3FHw/3DxYTrOD64TUEwwe3RsGJX7FBmV40TucXD3/XBZke/Z5GqOtx/Bi1g++/UOVl/4rDf8hKqrJxbGfxvuPYMxi+WQex5odfkJaRgpyM4zj2w7fYleWJLl3FTaSV/ke+m4dvth6GUekWzbUCce95XW0XDSsBIfqT8xuKUWPGiCYCYe0boiAlAfIhc4Xy9mL76ijEn1HPFWk7f8WxfDd4qG+bwK6WQW0pwbFrV/hc3otNsceRYzSi4JKYjqxp3TewzHe2rJOvD6jX0IPn1BT9pk1ERBVxrGOPgpyyS316dfVH7WPR2H48UdxPGmE88zM27boEz3bBcNSGUcgcxcf7wuXoESRpSV49A1H/9M9Y8/NeXJH3pBfF+fzredh08GzRPWq2vEfNy9a6L6FAq4/HeFXtn3PmMJKzClBQUPJ1stLXj3o+zeCYdhgxsXu1e+RsGG+o/aS7K8h09keo3xVs/VZ9t46o0to+hrBWRiSdt0fgA0PgJnMOhNoGexgvJZd4YToZSeey4ebmXUZ/IrqnHfoKny2YrTb/XIGDtYPw6INdtZ7iQt/vVTwztbgJM9VJ59QVvZ96HuNF2vhJL4n/Q+CvxZXXMrLg6NsLgc1lDqm3mEY/+Luo/eR5CO7BGGM2zWf+0hqO9vYwhaVl/qYZQ8cReNh0DdXKwlZm2kREpAcnuDdyQnp6stZdmkGckx39hlicz8f0agjUckBtbZiySnXKcdMuVKU4nRO6PG76vecxuHU+Du89qPVTWbt+XDl0DGluXTEsfDDade4rmjZwK57Juy0nMxv71qxAPOtWoJshixP090bWntXY8N1a7IM/Bg/UioLdEAeOS8MSN1PqSUA+BbLen4juSbU84OyktZvkJeLg0TTYuXminpaU9LMWgGpNtPbKlNf9/dDOuBeRH83GF4vexxcLvsdB7Xpm3BuFH38HOoSPwPAnH0FP5xQkmx52yyfD53ZYTFNtvkK8OkSZv2li5z4Ew2SFZyWvoZWYNhER6cCmHTwaGnEhuexKUmUGYtbh70ufk80qBSqrVKcc17leM63rZoj46lvtdz76GKv25yPwwcFF17Qyrx+XN2HV13uR3TIQQe294eXlDpeiorU1Osg8iV1LzWrSOr9WXJg/LlEb6A5sMF0I5ZPlEjVsXfn5Y9a6dc9zRbvwXsp7mD/+mqy+n/nfg8htNxiDO7riyu7DSG7cFQODvdXy7CKcrBf8GIIaZ+DooUT1KU2J/s6dR2H4g4FaNxHdGwzwGfwURo4agy4+Htrxbw+7Jn0xsLsHcs4er7BWQHs79eqrFk+S55reaKfWmSdkIPnnxYj8bB6+Es03P/yOK1qxI+U81KQrwjqafleM22MMhoW0Vroq5oTAvm2R+b8vS9WofevTJqI7Rr6jp7wfbt648v6kJjI0RL1uHeFTkILk9BLbrI7YYrYGOIltl3gsEbXbDURQC+2Jpk1DeA2agIHtte5ySnUmiHHt2oWht29DNcHGCe79J+BhcQ9bdWVfP5Qc1fu7wu38L/g28its+mE7EkwVBAk1uHZZolsly4+Px2DvS/hl1Tqkmt6VvBqP+Gut0aN3O2Qf+A92/VEPvn0GIDSkN7rd1wN+jYzYv3YZDlwoAK6dwqlLbmjVK6yov3+DdOz5eSsuXtPuAGWtYA0vs4Y3oj+1AqQfP4LzDm3QpXcf9Oopzwe90NW/CWwSt2LNxoOQp5iG7Xuj4WXLWiBNabv23oDbfb3Rr1cPdBbjtrx+Ckm1GiDvZGxxrmURsxol/5DnoUZo13dg8XmqXgp2/vwb0o03yv3N+AvqdOqcWI01v53X+pr1r2DaRFTdbqF22dYtEdi5c4mmKa7Iry5ow1HNUK/veDzRvQFs7euhVclt1lzEULUboK3cduu/wa7cVgjuPwghynWmK7xuxCMm5ndkO7ZFR38nHFm9FHGXTefn5vC9r4H6pY1LR3HK2BJd+4Vp4wbDu+A0dsTsKvpigtxv2iBeqQ1dJfevTujSVQ6vjtPWJRsHflmPU5edyrl+iGuE/3g86HEKP6zcor1WJqflC2jXNJsOwf1EHGyDtIspKKzie442NoBbI1lzQSEuplo9QohqvlquMCCj7Ip7KupPRPcOWcNsnXzkZN7m9zeq8zzEcxwRUbWo8LumTYZg5OP1sMv8VQWDK+xyM4oq57kptzKuTmzz89W3N2vXNqsS9yaZxjVNi+iulFfBzVVF/Yno3iHOB7c9wJSq8zzEcxwRUbXITT2LhHOXtC4rci4g4XQKMrVOhfEWgsRbGVcnNi38gwrr1nUWAWI+rqSn3XRupszFrFffDfb29rh6NQvXcu7ARZeIiIiIiIhqBFsZFMoAUwaJMliUH92UgWNF5DByWFOAKafBAJOIiIiIiOjeZuPe0r/QztYOLvXqK8FiVcgAM/NKOgpusLgsERERERHRvUz5hIkMDtMvpynFXWXAKCvwqVihMqwcR47LAJOIiIiIiIiUnEytnYiIiIiIiOiWKDmZRERERERERHpgkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6YZBJREREREREumGQSURERERERLphkElERERERES6sekQHFaotRMRERERERFV2cXUFNi4t/RnkElE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IqFwWev22W2Y8zd1H5FFlYfP34L4dBFsNtN+U95znRC/+fepFkWXXb3V/nKdIjMZe+Q6uH8qlpnWqzxGHlOvAcXLoFbWmHpRLK9Hb0z7v0BtYFXRNC0aT7hr/SWLYTyckZFyFFEzJ2Hk7tcRXuZDFRGMmVcOVel580EbbzdxPWivXQ/EehbdRdeDLp0Q0MwNbbqYH4SVsEpsu/8n7lvN1rOvhwjSLfbNyu2/cpsp178cg9jn1Gk1tpf7wAdify25DxDdPjbtuvYttLe3R2bGFRiN2tv4N8lgcICLaz3k5+cjXamYgKimEheYHi6I2SkvNjWPV49guJaXc+AdjHB/IG6DVhzqLiK/j9c4dT2iSy2cJ2av24gxbY9iWf9HlYoayiVvjhpfRFR0GduwvP4VjUt0p1Rh3wyb/j0WTmiEPS+HYuQq7RMm4mZ6Zqc3ETfYDzhSolKd200sU5i4US59zNdwlZzvgLD+cD1Z/joOEOf0DHFOL+t8LR8cBuAo1vvNKv9za5WZp4BghGTGVnKbyweujZC6Zls5OdVimDAR7+p0vpTL6nt1i7oM3lOwZEZtrBj7gdV3bm+3OztvldkWRHcfmxb+QYV16zorAeKV9DQU3mRmpMzFrFffDTJQvXo1C9dyWOUrkXWySvgItNG6FKei4D30Ha3jHhTyIlbNeAjdW7khI/pNdBxfPW/AEP3pyG8Srn8I+P4VDJgpcyvMg8xxWKQORXcLi2+O8pveRHT3s5VBoQwwZZAog0WZK1mZorNyGDmsKcCU02CASVSei0g6m2zZnJO10ty7Jo19CCEtnHE9biWmMcAkqrxEWftnDy3AlIwwZqpN1cok0R1VYERGjtoQEf0Z2Li39C+0s7WDS736SrBYFTLAzLySjoIbFVU/RkRERERERH9mSu2yMjiU71LK4q4yYKxcBT6FyrByHDkuA0wiIiIiIiJScjK1diIiIiIiIqJbcvd9J5OIiIiIiIhqLAaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZREREREREpBsGmURERERERKQbBplERERERESkGwaZRERERERE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+NVpafyVqXtz+kglMrXu+hKi646N27fPKARIBbL15YjOPGIUzP/MuMKyZJsOANLT29Ik/z9ZZul+NWWL6SY4ogxVWnPTlqj7V7oAFedQY+vxeXl/07/OwdJcQFb3+LzhIqoq6wNh25hgcumA6jIJnMaQhlqxDtSEtu17ia5V7W71HlbbqZOTFhDPl5ag9ioLCnUWs3OXrlBB9cKFCvxYdYW+tomIiIiIiOg37XcqFKqAqUKiCovqrKQtTWfVNGrauoCp3oMBk4iIiIiI6PrWrvtt3rXtf9cezp27aGGxNVTALD9fipp/tarLNyIiIiIiIvqN0HqXVeFQXUupmruqwGhbBz612rRqHjUvAyYRERERERFpZzKN34mIiIiIiIja5Jq7TyYRERERERH9ejFkEhERERERkd0wZBIREREREZHdMGQSERERERGR3TBkEhERERERkd0wZBIREREREZHdMGQSERERERGR3TBkEhERERERkd0wZBIREREREZHdMGQSERERERGR3TBkEhERERERkd0wZBIREREREZHdMGQSERERERGR3TBkEhERERERkd0wZBIREREREZHdMGQSERERERGR3TBkEhERERERkd20G+AXUGv8TkRERERERNRqZ4uL0K77bd4MmURERERERGQXbC5LREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdsOQSURERERERHbDkElERERERER2w5BJREREREREdgL8P48xVV5WExzMAAAAAElFTkSuQmCC', 'af1383d1-5e50-47a7-833e-26e85c62afae', 0, 'REJECTED', NULL, 0, 0, '2026-04-05 17:17:57.875', '2026-04-12 15:04:29.250', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `lesson_progress_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
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
('055852c2-2e93-468c-a885-5471c086c0a0', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd53658e6-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-14 04:48:42.151', NULL, '2026-04-14 04:48:42.152'),
('0b8b79ee-a7ce-498b-82de-1556f8c60597', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd53b3a4f-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-14 04:48:53.192', NULL, '2026-04-14 04:48:53.193'),
('12e1058a-7931-40a8-b064-e780ec511c18', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd53949dd-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-14 04:48:44.116', NULL, '2026-04-14 04:48:44.117'),
('14005624-b0af-4cb5-ad5f-015b408e6462', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '5d683c3d-8d65-4829-a0b4-d71d6d86003f', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-10 13:33:08.620', NULL, '2026-04-10 13:33:08.621'),
('1a3c4196-72e1-48d3-817c-3f1c995e5a7b', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd539611d-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-14 04:48:47.155', NULL, '2026-04-14 04:48:47.155'),
('3cfab686-6dbd-47d6-b84e-24d371a390c4', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd54be150-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-22 10:38:34.581', NULL, '2026-04-22 10:38:34.582'),
('404ced83-ebb8-4194-b179-31ee74d9e2d9', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd53b5165-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-14 04:48:55.144', NULL, '2026-04-14 04:48:55.145'),
('49a60826-f59d-4296-a6d2-d19c3ee94e8d', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd54e990d-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-22 10:38:36.380', NULL, '2026-04-22 10:38:36.382'),
('4a552d60-74e2-46ed-bf31-b64680a8cfc7', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'aa0e8400-e29b-41d4-a716-446655440505', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-05 16:51:03.250', NULL, '2026-04-05 16:51:03.251'),
('775f3ddb-6967-41b4-818d-d196df5b645c', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd548f97f-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-22 10:38:33.410', NULL, '2026-04-22 10:38:33.412'),
('82492e4a-8870-46cd-afb4-9ed34739f3cd', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'fe316cb2-7d8e-4629-88e4-08ed49aa60a6', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-12 13:57:20.699', NULL, '2026-04-12 13:57:20.700'),
('86c03ba8-a651-4f0e-8319-992826c40ad6', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd54eb16c-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-22 10:38:37.919', NULL, '2026-04-22 10:38:37.920'),
('8f194d50-4d66-4efd-ad6a-b88ff5a6feda', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'aa0e8400-e29b-41d4-a716-446655440507', 'in_progress', 50, NULL, NULL, 0, '2026-03-15 13:24:36.780', NULL, '2026-03-15 13:42:51.284'),
('941e23a0-ddc8-4c38-b0a0-1e1f414bfc3e', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-12 13:57:18.518', NULL, '2026-04-12 13:57:18.519'),
('97fcc0d8-88fc-4cbd-bd61-fa4f6319a03a', 'af1383d1-5e50-47a7-833e-26e85c62afae', '238212e6-887b-40c1-9cc3-468887b91574', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-05 11:14:52.123', NULL, '2026-04-05 11:14:52.125'),
('992e2169-518c-4571-b528-25b37eac4e98', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd54bfdf2-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-22 10:38:35.466', NULL, '2026-04-22 10:38:35.467'),
('b3676c79-c320-4615-8a7a-b841d3b9646e', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd548dbec-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-22 10:38:31.775', NULL, '2026-04-22 10:38:31.776'),
('b780837c-7856-4f3d-b95f-56accf38e11f', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'aa0e8400-e29b-41d4-a716-446655440507', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-05 16:51:09.260', NULL, '2026-04-05 16:51:09.261'),
('b7dc93aa-8059-4f71-8865-6a8bfaad2a66', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd5364710-3733-11f1-a8d2-1278a1aee829', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-14 04:48:39.414', NULL, '2026-04-14 04:48:39.417'),
('de9786b6-98c6-453a-9f3e-4a6d63db48c8', 'af1383d1-5e50-47a7-833e-26e85c62afae', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-05 11:14:17.043', NULL, '2026-04-05 11:14:17.044'),
('ee38f40f-71ab-40f1-b9d4-3e9881dbc58e', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'aa0e8400-e29b-41d4-a716-446655440506', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-05 16:51:06.230', NULL, '2026-04-05 16:51:06.231'),
('f1d94c54-16e3-4cdf-9e06-a114a527d09b', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'aa0e8400-e29b-41d4-a716-446655440508', 'IN_PROGRESS', 0, NULL, NULL, 0, '2026-04-05 16:51:11.747', NULL, '2026-04-05 16:51:11.748'),
('ii0e8400-e29b-41d4-a716-446655440d01', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440501', 'completed', 100, 720, NULL, 0, '2026-03-01 10:05:00.000', '2026-03-01 10:18:00.000', '2026-03-01 10:18:00.000'),
('ii0e8400-e29b-41d4-a716-446655440d02', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440502', 'completed', 100, NULL, NULL, 0, '2026-03-01 10:20:00.000', '2026-03-01 10:28:00.000', '2026-03-01 10:28:00.000'),
('ii0e8400-e29b-41d4-a716-446655440d03', '660e8400-e29b-41d4-a716-446655440103', 'aa0e8400-e29b-41d4-a716-446655440503', 'in_progress', 50, NULL, 85, 1, '2026-03-02 11:00:00.000', NULL, '2026-03-12 11:00:00.000'),
('ii0e8400-e29b-41d4-a716-446655440d04', '660e8400-e29b-41d4-a716-446655440104', 'aa0e8400-e29b-41d4-a716-446655440505', 'completed', 100, 840, NULL, 0, '2026-02-20 15:00:00.000', '2026-02-20 15:15:00.000', '2026-02-20 15:15:00.000');

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_tags`
--

CREATE TABLE `lesson_tags` (
  `lesson_tag_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `lesson_tags`
--

INSERT INTO `lesson_tags` (`lesson_tag_id`, `lesson_id`, `tag_id`) VALUES
('28e61a8a-3d32-4be2-bd28-8f2c078b7791', '42d89e6d-7d94-4acd-abb3-45356f77abe2', '770e8400-e29b-41d4-a716-446655440204'),
('db2f9eb6-8772-4e97-aa6a-c28a8c52e7b0', '42d89e6d-7d94-4acd-abb3-45356f77abe2', '770e8400-e29b-41d4-a716-446655440206'),
('gg0e8400-e29b-41d4-a716-446655440b01', 'aa0e8400-e29b-41d4-a716-446655440501', '770e8400-e29b-41d4-a716-446655440201'),
('gg0e8400-e29b-41d4-a716-446655440b02', 'aa0e8400-e29b-41d4-a716-446655440505', '770e8400-e29b-41d4-a716-446655440202');

-- --------------------------------------------------------

--
-- Структура таблицы `modules`
--

CREATE TABLE `modules` (
  `module_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
('04a196dd-7949-4292-9d25-1738e6b0be55', '56b2edfb-bc0f-46f4-8efd-e991bd4ce2ad', 'hec1', NULL, 1, 0, NULL, 0, '2026-04-10 13:02:30.611', '2026-04-10 13:02:30.611'),
('2c0ffd70-f271-4bac-b178-ac097dc2af49', '56b2edfb-bc0f-46f4-8efd-e991bd4ce2ad', 'hec2', NULL, 2, 0, NULL, 0, '2026-04-10 13:02:37.448', '2026-04-10 13:02:37.448'),
('724aa5f9-3732-11f1-a8d2-1278a1aee829', '72493c2b-3732-11f1-a8d2-1278a1aee829', 'Введение в личные финансы', 'Базовые понятия и первые шаги к финансовой независимости.', 1, 2, NULL, 1, '2026-04-13 12:15:23.059', '2026-04-13 12:15:23.059'),
('724abf29-3732-11f1-a8d2-1278a1aee829', '72493c2b-3732-11f1-a8d2-1278a1aee829', 'Бюджетирование и учёт расходов', 'Как планировать бюджет и контролировать траты.', 2, 2, NULL, 1, '2026-04-13 12:15:23.059', '2026-04-13 12:15:23.059'),
('724ad163-3732-11f1-a8d2-1278a1aee829', '72493c2b-3732-11f1-a8d2-1278a1aee829', 'Финансовая безопасность', 'Подушка безопасности, страховка и защита от мошенников.', 3, 2, NULL, 1, '2026-04-13 12:15:23.059', '2026-04-13 12:15:23.059'),
('72594f4c-3732-11f1-a8d2-1278a1aee829', '7257effb-3732-11f1-a8d2-1278a1aee829', 'Базовые понятия инвестиций', 'Что такое инвестиции и почему они работают.', 1, 2, NULL, 1, '2026-04-13 12:15:23.155', '2026-04-13 12:15:23.155'),
('725965eb-3732-11f1-a8d2-1278a1aee829', '7257effb-3732-11f1-a8d2-1278a1aee829', 'Инструменты фондового рынка', 'Акции, облигации, ETF и ПИФы.', 2, 2, NULL, 1, '2026-04-13 12:15:23.155', '2026-04-13 12:15:23.155'),
('72597043-3732-11f1-a8d2-1278a1aee829', '7257effb-3732-11f1-a8d2-1278a1aee829', 'Риск и доходность', 'Как оценивать риски и не терять деньги.', 3, 2, NULL, 1, '2026-04-13 12:15:23.155', '2026-04-13 12:15:23.155'),
('72597bdb-3732-11f1-a8d2-1278a1aee829', '7257effb-3732-11f1-a8d2-1278a1aee829', 'Практика: первый портфель', 'Собираем инвестиционный портфель шаг за шагом.', 4, 2, NULL, 1, '2026-04-13 12:15:23.155', '2026-04-13 12:15:23.155'),
('7267347f-3732-11f1-a8d2-1278a1aee829', '7266211f-3732-11f1-a8d2-1278a1aee829', 'Налоговая система РФ: основы', 'Кто, сколько и зачем платит налоги.', 1, 2, NULL, 1, '2026-04-13 12:15:23.246', '2026-04-13 12:15:23.246'),
('726747ec-3732-11f1-a8d2-1278a1aee829', '7266211f-3732-11f1-a8d2-1278a1aee829', 'Имущественные налоги', 'Налог на квартиру, машину и землю.', 2, 2, NULL, 1, '2026-04-13 12:15:23.246', '2026-04-13 12:15:23.246'),
('726758dd-3732-11f1-a8d2-1278a1aee829', '7266211f-3732-11f1-a8d2-1278a1aee829', 'Налоговые вычеты', 'Как вернуть часть уплаченных налогов.', 3, 2, NULL, 1, '2026-04-13 12:15:23.246', '2026-04-13 12:15:23.246'),
('7d27e471-9ee7-4da2-bbe0-8ee3d9d980e0', '2abd6e91-d8f4-4189-a1df-4167e278f08d', 'cvbvcbfghf', 'fghfhgh', 1, 0, NULL, 0, '2026-03-19 16:02:08.593', '2026-03-19 16:02:08.593'),
('86449042-5b79-42ec-9a0a-6c0553019ea4', '7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', 'тестовый осмс', 'вапвпа', 1, 0, NULL, 0, '2026-03-19 15:09:52.286', '2026-03-20 06:50:00.951'),
('8cdb7c04-b5d8-4ed7-bf73-6ced71645faa', '38a0da6e-82f3-477b-be4f-fc5f82568d0c', 'уточнее', NULL, 2, 0, NULL, 0, '2026-03-20 07:33:46.224', '2026-03-20 07:33:46.224'),
('9581ae66-50bb-4ae7-86a3-c2b670a8f5db', '41746a95-ba21-4d7a-87bb-588421bf0409', 'fghfgh', NULL, 1, 0, NULL, 0, '2026-04-10 13:04:35.640', '2026-04-10 13:04:35.640'),
('990e8400-e29b-41d4-a716-446655440401', '880e8400-e29b-41d4-a716-446655440301', 'Введение в макроэкономику', 'Базовые понятия и показатели', 1, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440402', '880e8400-e29b-41d4-a716-446655440301', 'Денежно-кредитная политика', 'Роль Центробанка, инфляция, ставки', 2, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440403', '880e8400-e29b-41d4-a716-446655440301', 'Фискальная политика', 'Бюджет, налоги, госдолг', 3, 4, 60, 1, '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440404', '880e8400-e29b-41d4-a716-446655440302', 'Основы инвестирования', 'Риск, доходность, диверсификация', 1, 4, 70, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440405', '880e8400-e29b-41d4-a716-446655440302', 'Инструменты рынка', 'Акции, облигации, фонды', 2, 5, 80, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440406', '880e8400-e29b-41d4-a716-446655440302', 'Стратегии портфеля', 'Asset allocation, ребалансировка', 3, 3, 50, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('990e8400-e29b-41d4-a716-446655440407', '880e8400-e29b-41d4-a716-446655440302', 'Психология инвестора', 'Поведенческие ошибки, дисциплина', 4, 3, 40, 1, '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.473'),
('b2332272-0d73-4a80-9750-87c9599f3463', '7a0f50cd-b0c2-44af-86fd-ed5ea46ca8d6', 'вапвапвап', 'вапвап', 2, 0, NULL, 0, '2026-03-19 15:10:04.541', '2026-03-20 06:50:00.951'),
('c7cbcad6-33dd-4825-9326-91c13e6af1b8', '38a0da6e-82f3-477b-be4f-fc5f82568d0c', 'что такое ...', NULL, 1, 0, NULL, 0, '2026-03-20 06:53:17.097', '2026-03-20 06:53:17.097'),
('d51ec77f-3733-11f1-a8d2-1278a1aee829', 'd51d7485-3733-11f1-a8d2-1278a1aee829', 'Дебетовые карты и кешбэк', 'Как получать максимум выгоды от повседневных трат.', 1, 2, NULL, 1, '2026-04-13 12:25:18.362', '2026-04-13 12:25:18.362'),
('d51ed90e-3733-11f1-a8d2-1278a1aee829', 'd51d7485-3733-11f1-a8d2-1278a1aee829', 'Вклады и накопительные счета', 'Где хранить сбережения с максимальной доходностью.', 2, 2, NULL, 1, '2026-04-13 12:25:18.362', '2026-04-13 12:25:18.362'),
('d51ee0d6-3733-11f1-a8d2-1278a1aee829', 'd51d7485-3733-11f1-a8d2-1278a1aee829', 'Кредитные карты с умом', 'Как пользоваться кредиткой бесплатно и зарабатывать на грейс-периоде.', 3, 2, NULL, 1, '2026-04-13 12:25:18.362', '2026-04-13 12:25:18.362'),
('d52af3aa-3733-11f1-a8d2-1278a1aee829', 'd529750f-3733-11f1-a8d2-1278a1aee829', 'Обязательное и нужное страхование', 'Полисы, без которых нельзя или рискованно.', 1, 3, NULL, 1, '2026-04-13 12:25:18.442', '2026-04-13 12:25:18.442'),
('d52b0d14-3733-11f1-a8d2-1278a1aee829', 'd529750f-3733-11f1-a8d2-1278a1aee829', 'Добровольное страхование: что стоит денег', 'Разбираем ДМС, КАСКО и накопительное страхование жизни.', 2, 2, NULL, 1, '2026-04-13 12:25:18.442', '2026-04-13 12:25:18.442'),
('d5355420-3733-11f1-a8d2-1278a1aee829', 'd534706f-3733-11f1-a8d2-1278a1aee829', 'Семейный бюджет: модели и правила', 'Как договориться о деньгах в паре.', 1, 2, NULL, 1, '2026-04-13 12:25:18.510', '2026-04-13 12:25:18.510'),
('d53563f8-3733-11f1-a8d2-1278a1aee829', 'd534706f-3733-11f1-a8d2-1278a1aee829', 'Крупные финансовые цели', 'Ипотека, машина, ремонт — как накопить без кредитов.', 2, 2, NULL, 1, '2026-04-13 12:25:18.510', '2026-04-13 12:25:18.510'),
('d5356d60-3733-11f1-a8d2-1278a1aee829', 'd534706f-3733-11f1-a8d2-1278a1aee829', 'Дети и деньги', 'Финансовое воспитание и накопления на образование.', 3, 2, NULL, 1, '2026-04-13 12:25:18.510', '2026-04-13 12:25:18.510'),
('d53e852d-3733-11f1-a8d2-1278a1aee829', 'd53d4fde-3733-11f1-a8d2-1278a1aee829', 'Денежные установки и сценарии', 'Откуда берутся наши отношения с деньгами.', 1, 3, NULL, 1, '2026-04-13 12:25:18.571', '2026-04-13 12:25:18.571'),
('d53ea30c-3733-11f1-a8d2-1278a1aee829', 'd53d4fde-3733-11f1-a8d2-1278a1aee829', 'Формирование полезных привычек', 'Как внедрить финансовую дисциплину без насилия над собой.', 2, 2, NULL, 1, '2026-04-13 12:25:18.571', '2026-04-13 12:25:18.571'),
('d547ac38-3733-11f1-a8d2-1278a1aee829', 'd54684b7-3733-11f1-a8d2-1278a1aee829', 'Легализация дохода', 'Самозанятость, ИП, НПД — что выбрать фрилансеру.', 1, 2, NULL, 1, '2026-04-13 12:25:18.631', '2026-04-13 12:25:18.631'),
('d547c0e6-3733-11f1-a8d2-1278a1aee829', 'd54684b7-3733-11f1-a8d2-1278a1aee829', 'Бюджет при плавающем доходе', 'Как планировать траты, когда доход непредсказуем.', 2, 2, NULL, 1, '2026-04-13 12:25:18.631', '2026-04-13 12:25:18.631'),
('d547d542-3733-11f1-a8d2-1278a1aee829', 'd54684b7-3733-11f1-a8d2-1278a1aee829', 'Социальные гарантии для самозанятых', 'Больничные, отпуска, пенсия — как обеспечить себя самому.', 3, 2, NULL, 1, '2026-04-13 12:25:18.631', '2026-04-13 12:25:18.631'),
('e4a29ecd-a839-4f21-b15c-40a61ad0c460', '6435f0fe-1f72-480f-b358-db01f06855db', 'fgtyhfhg', NULL, 1, 0, NULL, 0, '2026-04-12 15:56:44.220', '2026-04-12 15:56:44.220'),
('f12fc4f3-b695-4948-a6c3-3a701718b191', '41746a95-ba21-4d7a-87bb-588421bf0409', 'fturt', NULL, 2, 0, NULL, 0, '2026-04-10 13:04:38.995', '2026-04-10 13:04:38.995');

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('EMAIL','IN_APP','TELEGRAM') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json DEFAULT NULL,
  `link_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `is_sent` tinyint(1) NOT NULL DEFAULT '0',
  `external_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `payment_method_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last4` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiry_month` int DEFAULT NULL,
  `expiry_year` int DEFAULT NULL,
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover_image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telegram` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
('6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', 'apitest', 'API Test Updated', NULL, NULL, 'Test bio', '', '', '', 0, 0, '2026-03-15 13:24:35.511', '2026-04-23 14:10:35.156'),
('af1383d1-5e50-47a7-833e-26e85c62afae', 'abd55251-2f17-44b1-a0e3-5dac3e418aad', 'ivan2', 'иваник Adminovok', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+Adminov&background=random', NULL, '', NULL, NULL, NULL, 0, 0, '2026-03-15 12:37:39.456', '2026-03-20 05:56:28.435'),
('cdf1f1f1-0d61-4d72-94ce-e29b8fc37a37', '9c406b56-4804-4d86-b612-a11c10826b06', 'newuser', 'New User', 'https://ui-avatars.com/api/?name=New+User&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-13 16:21:20.747', '2026-03-13 16:21:20.747'),
('e1dcc85e-98c7-442f-b0ec-a579aed64814', '460a3072-e8a7-4d02-804a-b36748de7d7d', 'ivan_petrov_c', 'иван Петров', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2&background=random', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-04-14 03:09:13.445', '2026-04-14 03:09:13.445'),
('e68c2c00-4a04-4400-8fde-d27d8c349b67', 'e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', 'ivan', 'иван авыпуквп', 'https://ui-avatars.com/api/?name=%D0%B8%D0%B2%D0%B0%D0%BD+%D0%B0%D0%B2%D1%8B%D0%BF%D1%83%D0%BA%D0%B2%D0%BF&background=random', NULL, '', '', '', 'petrov@tge.ru', 0, 0, '2026-03-15 12:28:23.991', '2026-03-19 08:41:18.909');

-- --------------------------------------------------------

--
-- Структура таблицы `quiz_contents`
--

CREATE TABLE `quiz_contents` (
  `quiz_content_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
('7253e70d-3732-11f1-a8d2-1278a1aee829', '7250c115-3732-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"single\", \"correct\": 1, \"options\": [\"50% на нужды, 30% на желания, 20% на сбережения\", \"70% на нужды, 20% на желания, 10% на сбережения\", \"40% на нужды, 40% на желания, 20% на сбережения\"], \"question\": \"Что означает правило 50/30/20?\"}]', 70, NULL, '2026-04-13 12:15:23.118', '2026-04-13 12:15:23.118'),
('72624796-3732-11f1-a8d2-1278a1aee829', '7260391a-3732-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"multiple\", \"correct\": [0, 1, 2], \"options\": [\"Акции разных секторов\", \"Облигации разных эмитентов\", \"Активы в разных валютах\", \"Все деньги в одной акции\"], \"question\": \"Какие способы диверсификации правильные?\"}]', 70, NULL, '2026-04-13 12:15:23.213', '2026-04-13 12:15:23.213'),
('72644c7a-3732-11f1-a8d2-1278a1aee829', '7263157d-3732-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"single\", \"correct\": 1, \"options\": [\"Готовность к просадке до 10%\", \"Готовность к просадке до 30%\", \"Готовность к просадке более 50%\"], \"question\": \"Какую максимальную просадку портфеля вы готовы принять?\"}]', 70, NULL, '2026-04-13 12:15:23.226', '2026-04-13 12:15:23.226'),
('d52229f2-3733-11f1-a8d2-1278a1aee829', 'd51fffc8-3733-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"multiple\", \"correct\": [0, 2], \"options\": [\"Выбирать категории под свои реальные траты\", \"Брать все возможные категории\", \"Следить за МСС-кодами магазинов\", \"Покупать только ради кешбэка\"], \"question\": \"Какие правила помогут максимизировать кешбэк?\"}]', 70, NULL, '2026-04-13 12:25:18.383', '2026-04-13 12:25:18.383'),
('d53296cf-3733-11f1-a8d2-1278a1aee829', 'd53186a9-3733-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"single\", \"correct\": 2, \"options\": [\"Всегда стоит\", \"Никогда не стоит\", \"Зависит от потребностей и бюджета\"], \"question\": \"Стоит ли покупать ДМС?\"}]', 70, NULL, '2026-04-13 12:25:18.491', '2026-04-13 12:25:18.491'),
('d53a6043-3733-11f1-a8d2-1278a1aee829', 'd539611d-3733-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"single\", \"correct\": 0, \"options\": [\"Да, это основа планирования\", \"Нет, планы всё равно меняются\", \"Только если доход стабильный\"], \"question\": \"Нужно ли составлять финансовый план на 5 лет?\"}]', 70, NULL, '2026-04-13 12:25:18.542', '2026-04-13 12:25:18.542'),
('d540dc2b-3733-11f1-a8d2-1278a1aee829', 'd53f81d4-3733-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"single\", \"correct\": -1, \"options\": [\"Деньги — зло\", \"Деньги — свобода\", \"Деньги — ответственность\", \"Деньги — результат труда\"], \"question\": \"Какая фраза ближе всего к вашему отношению к деньгам?\"}]', 70, NULL, '2026-04-13 12:25:18.585', '2026-04-13 12:25:18.585'),
('d545a016-3733-11f1-a8d2-1278a1aee829', 'd543a4c7-3733-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"multiple\", \"correct\": [0, 1, 3], \"options\": [\"Записывать все расходы\", \"Откладывать хотя бы 1%\", \"Сразу урезать бюджет вдвое\", \"Планировать траты на неделю\"], \"question\": \"Какие привычки внедряем в челлендже?\"}]', 70, NULL, '2026-04-13 12:25:18.616', '2026-04-13 12:25:18.616'),
('d5510367-3733-11f1-a8d2-1278a1aee829', 'd54eb16c-3733-11f1-a8d2-1278a1aee829', '[{\"id\": 1, \"type\": \"single\", \"correct\": 2, \"options\": [\"Никак, это издержки фриланса\", \"Брать кредит в плохой месяц\", \"Закладывать в ставку 20-30% на соцпакет\"], \"question\": \"Как фрилансеру компенсировать отсутствие оплачиваемого отпуска?\"}]', 70, NULL, '2026-04-13 12:25:18.691', '2026-04-13 12:25:18.691'),
('ee0e8400-e29b-41d4-a716-446655440901', 'aa0e8400-e29b-41d4-a716-446655440503', '[{\"id\": 1, \"type\": \"single\", \"correct\": 1, \"options\": [\"Фрикционная\", \"Структурная\", \"Циклическая\", \"Сезонная\"], \"question\": \"Какой тип безработицы связан с изменением структуры экономики?\"}, {\"id\": 2, \"type\": \"single\", \"correct\": 1, \"options\": [\"Безработные / Всё население\", \"Безработные / Рабочая сила\", \"Безработные / Занятые\", \"Занятые / Рабочая сила\"], \"question\": \"Как рассчитывается уровень безработицы?\"}]', 70, 3, '2026-01-20 10:10:00.000', '2026-03-13 11:16:27.694'),
('ee0e8400-e29b-41d4-a716-446655440902', 'aa0e8400-e29b-41d4-a716-446655440508', '[{\"id\": 1, \"type\": \"single\", \"correct\": 1, \"options\": [\"Мера абсолютного риска\", \"Мера систематического риска\", \"Мера доходности\", \"Мера ликвидности\"], \"question\": \"Что такое бета-коэффициент?\"}, {\"id\": 2, \"type\": \"multiple\", \"correct\": [0, 3], \"options\": [\"Гособлигации\", \"Акции роста\", \"Криптовалюты\", \"Депозиты\"], \"question\": \"Какие инструменты относятся к консервативным?\"}]', 80, 2, '2026-02-01 12:15:00.000', '2026-03-13 11:16:27.694');

-- --------------------------------------------------------

--
-- Структура таблицы `reactions`
--

CREATE TABLE `reactions` (
  `reaction_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('LIKE','DISLIKE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reactionable_type` enum('COURSE','LESSON','COMMENT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reactionable_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`session_id`, `session_token`, `user_id`, `expires`, `created_at`, `updated_at`) VALUES
('5e4b2a41-7ec6-4f0e-9976-ed8f8809379d', 'dc5cbdb7-97f1-43d0-90c0-d5002ebaceac', 'abd55251-2f17-44b1-a0e3-5dac3e418aad', '2026-05-05 09:10:35.828', '2026-04-05 09:10:35.829', '2026-04-05 09:10:35.829'),
('6903daf9-06ea-48ae-9c6b-8d67783a5c53', 'c90a98a9-db1a-40be-a7d0-d89eeb89a0c1', 'abd55251-2f17-44b1-a0e3-5dac3e418aad', '2026-05-05 09:19:03.174', '2026-04-05 09:19:03.175', '2026-04-05 09:19:03.175'),
('97252036-a873-40ad-a65f-2e378182967a', '44104187-e3e1-4ed7-b0b5-30fddd5826cb', 'abd55251-2f17-44b1-a0e3-5dac3e418aad', '2026-05-05 09:39:38.899', '2026-04-05 09:39:38.901', '2026-04-05 09:39:38.901'),
('d376b630-0368-4ca0-9ee6-d8a563963272', '1cb6b789-2eef-4989-8558-554f6b894ef5', '45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', '2026-05-23 13:19:00.042', '2026-04-23 13:19:00.042', '2026-04-23 13:19:00.042'),
('f21a6dec-083d-4e83-8e97-01e09945662c', '941d4520-2bfa-4956-a22a-764e48e551fb', 'abd55251-2f17-44b1-a0e3-5dac3e418aad', '2026-05-06 14:27:30.974', '2026-04-06 14:27:30.976', '2026-04-06 14:27:30.976');

-- --------------------------------------------------------

--
-- Структура таблицы `subscriptions`
--

CREATE TABLE `subscriptions` (
  `subscription_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','PAST_DUE','CANCELED','EXPIRED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `start_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `end_date` datetime(3) DEFAULT NULL,
  `trial_ends_at` datetime(3) DEFAULT NULL,
  `auto_renew` tinyint(1) NOT NULL DEFAULT '1',
  `cancel_at_period_end` tinyint(1) NOT NULL DEFAULT '0',
  `price` double NOT NULL,
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RUB',
  `payment_method_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_subscription_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `canceled_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `subscriptions`
--

INSERT INTO `subscriptions` (`subscription_id`, `profile_id`, `plan_type`, `status`, `start_date`, `end_date`, `trial_ends_at`, `auto_renew`, `cancel_at_period_end`, `price`, `currency`, `payment_method_id`, `provider_subscription_id`, `provider`, `created_at`, `updated_at`, `canceled_at`, `deleted_at`) VALUES
('0468a22c-f351-43ce-b7e8-52c6290b0af6', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'premium_monthly', 'CANCELED', '2026-04-06 10:31:45.727', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-06 10:31:45.728', '2026-04-06 10:32:00.517', '2026-04-06 10:32:00.516', '2026-04-06 10:32:00.516'),
('231c46d8-e1a7-43e8-b460-a74a43e0d376', 'af1383d1-5e50-47a7-833e-26e85c62afae', 'premium_monthly', 'ACTIVE', '2026-04-05 11:59:45.746', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-05 11:59:45.747', '2026-04-05 11:59:45.747', NULL, NULL),
('3bffa915-fcbd-472f-9d58-4c7893d2c04f', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'premium_monthly', 'CANCELED', '2026-04-14 04:50:26.016', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-14 04:50:26.017', '2026-04-14 04:50:56.267', '2026-04-14 04:50:56.267', '2026-04-14 04:50:56.267'),
('65469941-9e88-4121-9fed-f5f00b3ea1fe', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'premium_annual', 'CANCELED', '2026-04-06 10:26:07.167', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-06 10:26:07.170', '2026-04-06 10:27:12.684', '2026-04-06 10:27:12.683', '2026-04-06 10:27:12.683'),
('6f17641a-e4a9-4560-8811-3e7c02f19719', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'premium_annual', 'CANCELED', '2026-04-06 10:32:02.523', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-06 10:32:02.525', '2026-04-14 04:50:23.255', '2026-04-14 04:50:23.255', '2026-04-14 04:50:23.255'),
('d078871c-876e-4fa2-983c-11fba0615dbb', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 'premium_monthly', 'ACTIVE', '2026-03-24 13:14:33.912', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-03-24 13:14:33.967', '2026-03-24 13:14:33.967', NULL, NULL),
('d9cce818-9815-45ad-a17e-7ec145cf975e', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'premium_monthly', 'CANCELED', '2026-04-06 10:25:49.317', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-06 10:25:49.318', '2026-04-06 10:26:03.985', '2026-04-06 10:26:03.984', '2026-04-06 10:26:03.984'),
('eac611f1-4ac3-4110-b0ca-cf4ce1763cc7', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'premium_annual', 'CANCELED', '2026-04-06 10:23:11.545', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-06 10:23:11.546', '2026-04-06 10:23:30.312', '2026-04-06 10:23:30.311', '2026-04-06 10:23:30.311'),
('eef69ccb-2f32-4897-9e71-015ffc869aca', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'premium_annual', 'CANCELED', '2026-04-06 10:30:59.412', NULL, NULL, 1, 0, 299, 'RUB', NULL, NULL, NULL, '2026-04-06 10:30:59.413', '2026-04-06 10:31:43.274', '2026-04-06 10:31:43.274', '2026-04-06 10:31:43.274'),
('oo0e8400-e29b-41d4-a716-446655441301', '660e8400-e29b-41d4-a716-446655440104', 'premium_monthly', 'ACTIVE', '2026-02-15 10:00:00.000', '2026-03-15 10:00:00.000', NULL, 1, 0, 499, 'RUB', 'nn0e8400-e29b-41d4-a716-446655441201', NULL, 'yookassa', '2026-02-15 10:00:00.000', '2026-03-13 11:16:28.105', NULL, NULL),
('oo0e8400-e29b-41d4-a716-446655441302', '660e8400-e29b-41d4-a716-446655440103', 'premium_yearly', 'ACTIVE', '2026-01-01 00:00:00.000', '2027-01-01 00:00:00.000', NULL, 1, 0, 3990, 'RUB', 'nn0e8400-e29b-41d4-a716-446655441202', NULL, 'cloudpayments', '2026-01-01 00:00:00.000', '2026-03-13 11:16:28.105', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `tags`
--

CREATE TABLE `tags` (
  `tag_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tags`
--

INSERT INTO `tags` (`tag_id`, `name`, `slug`, `color`) VALUES
('3880a899-5103-4913-ac38-f7ce3dff9a4e', 'Angl', 'angl', '#3B82F6'),
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
  `text_content_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `word_count` int DEFAULT NULL,
  `reading_time` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `text_contents`
--

INSERT INTO `text_contents` (`text_content_id`, `lesson_id`, `body`, `word_count`, `reading_time`, `created_at`, `updated_at`) VALUES
('0eead5d9-9aa9-4d6c-81c4-86fac0ba5715', '49a7f4c8-b3ee-46c3-aa2b-161aed782b38', 'yetyryty', 1, 1, '2026-04-12 15:57:00.097', '2026-04-12 16:01:38.618'),
('52f5674c-b152-4777-9fe3-7e5b40a27a80', '425e5039-632c-4197-9694-5b446964988c', 'sdgfdsgfgdgfdgd', 1, 1, '2026-04-10 13:00:17.266', '2026-04-10 13:00:19.043'),
('5f2ece31-3f98-40bd-a167-41505d1ef996', '238212e6-887b-40c1-9cc3-468887b91574', 'sd\nWhere does it come from?\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.\n\nWhere can I get some?\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.', 308, 2, '2026-03-19 15:13:38.555', '2026-03-19 15:13:38.555'),
('724e08b3-3732-11f1-a8d2-1278a1aee829', '724c3e2e-3732-11f1-a8d2-1278a1aee829', '<h2>Что такое финансовая грамотность?</h2><p>Финансовая грамотность — это набор знаний и навыков, которые помогают человеку принимать разумные решения в отношении своих денег. Это не про то, как стать миллионером за неделю, а про то, как жить по средствам, копить на цели и не попадать в долговые ямы.</p><h3>Почему это важно?</h3><ul><li>Вы перестаёте жить от зарплаты до зарплаты</li><li>У вас появляется финансовая подушка безопасности</li><li>Вы можете планировать крупные покупки без кредитов</li><li>Вы защищены от мошенников и невыгодных предложений</li></ul>', 120, 1, '2026-04-13 12:15:23.080', '2026-04-13 12:15:23.080'),
('7252adb4-3732-11f1-a8d2-1278a1aee829', '7250a49e-3732-11f1-a8d2-1278a1aee829', '<h2>Собираем данные о финансах</h2><p>Первый шаг к контролю над деньгами — понять, куда они уходят. В течение месяца записывайте все расходы, даже самые мелкие. Используйте приложения (Дзен-мани, CoinKeeper) или простую таблицу Excel.</p><h3>Категории расходов</h3><ul><li>Обязательные: ЖКХ, продукты, транспорт, связь, кредиты</li><li>Необязательные: кафе, развлечения, подписки, импульсивные покупки</li><li>Накопления: инвестиции, подушка безопасности, крупные цели</li></ul>', 100, 1, '2026-04-13 12:15:23.110', '2026-04-13 12:15:23.110'),
('7255fd95-3732-11f1-a8d2-1278a1aee829', '7254b674-3732-11f1-a8d2-1278a1aee829', '<h2>Золотой стандарт: 3-6 месяцев расходов</h2><p>Финансовая подушка — это ваш страховой полис на случай потери работы, болезни или непредвиденных расходов. Оптимальный размер: 3 месяца расходов при стабильной работе, 6 месяцев при нестабильном доходе.</p><h3>Где хранить подушку?</h3><ul><li>Накопительный счёт с процентом на остаток</li><li>Вклад с возможностью пополнения и снятия</li><li>Фонды денежного рынка (ликвидные ETF)</li></ul>', 90, 1, '2026-04-13 12:15:23.132', '2026-04-13 12:15:23.132'),
('725bfc6b-3732-11f1-a8d2-1278a1aee829', '725ab10e-3732-11f1-a8d2-1278a1aee829', '<h2>Инвестиции vs Сбережения</h2><p>Сбережения — это деньги под матрасом или на вкладе под низкий процент. Инвестиции — это вложение денег в активы (акции, облигации, недвижимость) с целью получения дохода выше инфляции.</p><h3>Почему важно инвестировать?</h3><p>При инфляции 8% годовых ваши 100 000 рублей через 10 лет превратятся в эквивалент 46 000 рублей по покупательной способности. Инвестиции помогают не просто сохранить, но и приумножить капитал.</p>', 85, 1, '2026-04-13 12:15:23.171', '2026-04-13 12:15:23.171'),
('725f1751-3732-11f1-a8d2-1278a1aee829', '725d2853-3732-11f1-a8d2-1278a1aee829', '<h2>Что такое облигации?</h2><p>Облигация — это долговая ценная бумага. Покупая облигацию, вы даёте в долг государству или компании, а они обязуются вернуть деньги с процентами в определённый срок.</p><h3>Виды облигаций</h3><ul><li>ОФЗ (облигации федерального займа) — самые надёжные</li><li>Корпоративные облигации — более доходные, но и более рискованные</li><li>Еврооблигации — номинированы в иностранной валюте</li></ul>', 75, 1, '2026-04-13 12:15:23.192', '2026-04-13 12:15:23.192'),
('72615e23-3732-11f1-a8d2-1278a1aee829', '72601da3-3732-11f1-a8d2-1278a1aee829', '<h2>Связь риска и доходности</h2><p>В инвестициях действует железное правило: чем выше потенциальная доходность, тем выше риск. Не существует инструментов с высокой доходностью и низким риском — это всегда компромисс.</p><h3>Виды рисков</h3><ul><li>Рыночный риск — падение всего рынка</li><li>Кредитный риск — дефолт эмитента облигаций</li><li>Валютный риск — изменение курса валюты</li><li>Инфляционный риск — обесценивание денег</li></ul>', 80, 1, '2026-04-13 12:15:23.207', '2026-04-13 12:15:23.207'),
('72652b4b-3732-11f1-a8d2-1278a1aee829', '7263283a-3732-11f1-a8d2-1278a1aee829', '<h2>Простой портфель для начинающего</h2><p>Для первого портфеля достаточно двух-трёх ETF:</p><ul><li>60% — ETF на индекс МосБиржи (акции РФ)</li><li>30% — ETF на корпоративные облигации РФ</li><li>10% — Фонд денежного рынка (ликвидность)</li></ul><p>Такой портфель прост в управлении и даёт адекватную доходность при умеренном риске.</p>', 60, 1, '2026-04-13 12:15:23.231', '2026-04-13 12:15:23.231'),
('7269bc6e-3732-11f1-a8d2-1278a1aee829', '72684467-3732-11f1-a8d2-1278a1aee829', '<h2>Какие налоги платят физические лица?</h2><ul><li><strong>НДФЛ</strong> — 13% (или 15% при доходе выше 5 млн ₽) с зарплаты и других доходов</li><li><strong>Налог на имущество</strong> — квартиры, дома, гаражи</li><li><strong>Транспортный налог</strong> — автомобили, мотоциклы, яхты</li><li><strong>Земельный налог</strong> — участки в собственности</li></ul>', 60, 1, '2026-04-13 12:15:23.261', '2026-04-13 12:15:23.261'),
('726cb27d-3732-11f1-a8d2-1278a1aee829', '726b4af4-3732-11f1-a8d2-1278a1aee829', '<h2>Как считается налог на имущество?</h2><p>Налог = Кадастровая стоимость × Ставка налога × Понижающий коэффициент (если есть). Ставки устанавливают муниципалитеты, обычно 0.1% для квартир.</p><p>Проверить кадастровую стоимость можно на сайте Росреестра или в личном кабинете ФНС.</p>', 50, 1, '2026-04-13 12:15:23.281', '2026-04-13 12:15:23.281'),
('726cba06-3732-11f1-a8d2-1278a1aee829', '726b71dd-3732-11f1-a8d2-1278a1aee829', '<h2>Транспортный налог</h2><p>Зависит от мощности двигателя и региона регистрации. Льготы есть у многодетных, инвалидов, ветеранов.</p><h2>Земельный налог</h2><p>Рассчитывается от кадастровой стоимости участка. Ставка до 0.3% для земель под ИЖС и ЛПХ.</p>', 45, 1, '2026-04-13 12:15:23.281', '2026-04-13 12:15:23.281'),
('726ef9c1-3732-11f1-a8d2-1278a1aee829', '726dd9a6-3732-11f1-a8d2-1278a1aee829', '<h2>Социальные вычеты</h2><p>Можно вернуть 13% от расходов на:</p><ul><li>Лечение (своё и близких родственников)</li><li>Обучение (своё и детей до 24 лет)</li><li>Фитнес (с 2022 года)</li></ul><p>Максимальная сумма расходов — 150 000 ₽ в год (возврат до 19 500 ₽).</p><h2>Инвестиционный вычет</h2><p>По ИИС типа А можно вернуть 13% от внесённой суммы, но не более 52 000 ₽ в год (при взносе 400 000 ₽).</p>', 80, 1, '2026-04-13 12:15:23.296', '2026-04-13 12:15:23.296'),
('a4207300-a13c-405a-8d0b-4b1c8d7e5709', '42d89e6d-7d94-4acd-abb3-45356f77abe2', '# React + TypeScript + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:\n\n```js\nexport default tseslint.config({\n  extends: [\n    // Remove ...tseslint.configs.recommended and replace with this\n    ...tseslint.configs.recommendedTypeChecked,\n    // Alternatively, use this for stricter rules\n    ...tseslint.configs.strictTypeChecked,\n    // Optionally, add this for stylistic rules\n    ...tseslint.configs.stylisticTypeChecked,\n  ],\n  languageOptions: {\n    // other options...\n    parserOptions: {\n      project: [\'./tsconfig.node.json\', \'./tsconfig.app.json\'],\n      tsconfigRootDir: import.meta.dirname,\n    },\n  },\n})\n```\n\nYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:\n\n```js\n// eslint.config.js\nimport reactX from \'eslint-plugin-react-x\'\nimport reactDom from \'eslint-plugin-react-dom\'\n\nexport default tseslint.config({\n  plugins: {\n    // Add the react-x and react-dom plugins\n    \'react-x\': reactX,\n    \'react-dom\': reactDom,\n  },\n  rules: {\n    // other rules...\n    // Enable its recommended typescript rules\n    ...reactX.configs[\'recommended-typescript\'].rules,\n    ...reactDom.configs.recommended.rules,\n  },\n})\n```\n', 168, 1, '2026-03-20 07:34:44.848', '2026-03-20 07:34:48.172'),
('b8d9735c-c65e-4a8f-a059-72df1998aa26', '5d683c3d-8d65-4829-a0b4-d71d6d86003f', 'ftgyhrth', 1, 1, '2026-04-10 13:04:59.643', '2026-04-10 13:04:59.643'),
('cc0e8400-e29b-41d4-a716-446655440701', 'aa0e8400-e29b-41d4-a716-446655440502', '<h2>Что такое инфляция?</h2><p>Инфляция — это устойчивое повышение общего уровня цен на товары и услуги...</p><h3>Виды инфляции</h3><ul><li>Умеренная (до 10% в год)</li><li>Галопирующая (10-50%)</li><li>Гиперинфляция (более 50%)</li></ul>', 450, 3, '2026-01-20 10:05:00.000', '2026-03-13 11:16:27.614'),
('cc0e8400-e29b-41d4-a716-446655440702', 'aa0e8400-e29b-41d4-a716-446655440506', '<h2>Принципы диверсификации</h2><p>«Не кладите все яйца в одну корзину» — золотое правило инвестора...</p><h3>Уровни диверсификации</h3><ol><li>По классам активов</li><li>По отраслям</li><li>По географии</li><li>По валютам</li></ol>', 380, 2, '2026-02-01 12:05:00.000', '2026-03-13 11:16:27.614');
INSERT INTO `text_contents` (`text_content_id`, `lesson_id`, `body`, `word_count`, `reading_time`, `created_at`, `updated_at`) VALUES
('cf5aa587-4d08-4c08-8c57-f0a3859383ba', 'ae153975-21c2-447d-8071-55300b1ffa0b', '# Экономикус (Economikus) - Техническая документация\n\n> Подробное техническое описание проекта для разработчиков и архитекторов\n\n---\n\n## Содержание\n\n1. [Обзор проекта](#1-обзор-проекта)\n2. [Технологический стек](#2-технологический-стек)\n3. [База данных](#3-база-данных)\n4. [API Endpoints](#4-api-endpoints)\n5. [Страницы и маршруты](#5-страницы-и-маршруты)\n6. [Компоненты](#6-компоненты)\n7. [Формы и валидация](#7-формы-и-валидация)\n8. [Модальные окна](#8-модальные-окна)\n9. [Калькуляторы](#9-калькуляторы)\n10. [Админ-панель](#10-админ-панель)\n11. [Аутентификация](#11-аутентификация)\n12. [Структура проекта](#12-структура-проекта)\n\n---\n\n## 1. Обзор проекта\n\n**Название**: Экономикус (Economikus)  \n**Тип**: Образовательная платформа (LMS — Learning Management System)  \n**Веб-сайт**: economikus.ru  \n\nПлатформа для обучения финансам и инвестициям. Включает курсы, модули, уроки (статьи, видео, аудио, квизы), подписки, платежи и сертификаты.\n\n### Архитектура\n\nПроект построен на современном стеке:\n- **Frontend**: React 19 + Vite 6\n- **Backend**: Hono (edge-ready HTTP-фреймворк) на порту 3000\n- **База данных**: MySQL + Prisma ORM 5.22.0\n\n### Статус реализации\n\n| Модуль | Статус |\n|--------|--------|\n| Header / Footer | ✅ Реализовано |\n| Страницы авторизации | ✅ Реализовано (login, register) |\n| Главная страница | ✅ Реализовано |\n| Аутентификация API | ✅ Реализовано (register, login, logout, me) |\n| API курсов | ✅ Реализовано (CRUD, фильтры, пагинация) |\n| API уроков | ✅ Реализовано (CRUD, фильтры, пагинация) |\n| API пользователя | ✅ Реализовано (profile, history, favorites, progress) |\n| API тегов | ✅ Реализовано (CRUD) |\n| API комментариев | ✅ Реализовано (CRUD) |\n| API реакций | ✅ Реализовано (like/dislike) |\n| API модерации | 🔄 Заглушка |\n| API платежей | 🔄 Заглушка |\n| Админ-панель | ✅ Реализовано (dashboard, users, courses, lessons, tags) |\n| Страницы каталога | ❌ Не реализовано |\n| Страницы профиля | ❌ Не реализовано |\n| Калькуляторы | ❌ Не реализовано |\n\n### Целевая аудитория\n\n1. **Стартующий (18-24 года)**: студенты, мало денег, нужны базовые знания\n2. **Строитель (25-34 года)**: есть доход, нет времени, боится ошибок\n3. **Семьянин (35-44 года)**: есть накопления, нужна безопасная стратегия\n\n---\n\n## 2. Технологический стек\n\n| Категория         | Технология                                                            |\n| ----------------- | --------------------------------------------------------------------- |\n| Frontend          | React 19 + Vite 6                                                     |\n| Backend           | Hono 4.x + @hono/node-server                                          |\n| Язык              | TypeScript                                                            |\n| База данных       | MySQL + Prisma ORM 5.22.0                                            |\n| Аутентификация    | Сессии через cookies (bcryptjs для хэширования)                      |\n| UI-библиотека     | Mantine v8                                                            |\n| Стили             | TailwindCSS v4                                                        |\n| Стейт-менеджмент  | Zustand                                                               |\n| Валидация         | Zod + react-hook-form + @hookform/resolvers                          |\n| HTTP-клиент       | TanStack Query (@tanstack/react-query)                               |\n| Линтинг           | ESLint                                                                |\n| Иконки            | Lucide React                                                          |\n| Роутинг           | react-router-dom 7.x                                                  |\n\n---\n\n## 2.1. Правила разработки\n\n### Алиасы путей (Path Aliases)\n\nВ проекте настроены алиасы для удобного импорта файлов:\n\n```typescript\n// ✅ Правильно — используйте алиас @/\nimport { api } from \'@/lib/api\'\nimport { Button } from \'@/components/Button\'\n\n// ❌ Неправильно — не используйте относительные пути\nimport { api } from \'../../libми, а такжке дальнейший трекер развитяи/api\'\nimport { Button } from \'../components/Button\'\n```\n\n**Настройка:**\n- `vite.config.ts` — алиас `@` → `./src`\n- `tsconfig.app.json` — paths `@/*` → `src/*`\n\n### Иконки\n\nВ проекте используется библиотека **Lucide React** для иконок.\n\n```typescript\n// ✅ Правильно\nimport { Plus, Search, MoreVertical, Pencil, Trash2 } from \'lucide-react\'\n\n// ❌ Неправильно — @mantine/icons не существует в Mantine v7\nimport { IconPlus, IconSearch } from \'@mantine/icons\'\n```\n\n**Часто используемые иконки:**\n| Действие | Иконка |\n|----------|--------|\n| Добавить | `Plus` |\n| Поиск | `Search` |\n| Меню | `MoreVertical` |\n| Редактировать | `Pencil` |\n| Удалить | `Trash2` |\n| Просмотр | `Eye` |\n| Настройки | `Settings` |\n| Пользователь | `User` |\n| Выход | `LogOut` |\n\n---\n\n```json\n{\n  \"dependencies\": {\n    \"@hono/zod-validator\": \"^0.7.6\",\n    \"@hookform/resolvers\": \"^5.2.2\",\n    \"@mantine/core\": \"^8.3.16\",\n    \"@mantine/hooks\": \"^8.3.16\",\n    \"@prisma/client\": \"^5.22.0\",\n    \"@tanstack/react-query\": \"^5.90.21\",\n    \"bcryptjs\": \"^3.0.3\",\n    \"hono\": \"^4.12.7\",\n    \"react\": \"^19.1.0\",\n    \"react-dom\": \"^19.1.0\",\n    \"react-hook-form\": \"^7.71.2\",\n    \"react-router-dom\": \"^7.13.1\",\n    \"zod\": \"^4.3.6\",\n    \"zustand\": \"^5.0.11\"\n  },\n  \"devDependencies\": {\n    \"@hono/vite-dev-server\": \"^0.25.1\",\n    \"prisma\": \"^5.22.0\",\n    \"tsx\": \"^4.21.0\",\n    \"vite\": \"^6.3.5\"\n  }\n}\n```\n\n---\nВажный совет (Persist):\n\nЕсли вы хотите, чтобы данные в Zustand **не пропадали при перезагрузке страницы**, используйте встроенный мидлвар `persist`:\n\n```typescript\nimport { create } from \'zustand\'\nimport { persist } from \'zustand/middleware\'\n\nexport const useUserStore = create(\n  persist(\n    (set) => ({ /* ваш стор */ }),\n    { name: \'user-storage\' } // имя ключа в LocalStorage\n  )\n)\n```\n\n## 3. База данных\n\n### 3.1 Схема MySQL (Prisma ORM)\n\nПроект использует схему MySQL с 28 моделями:\n\n#### Основные модели\n\n| Модель | Назначение | Ключевые поля |\n|--------|------------|---------------|\n| **User** | Пользователь системы | email, firstName, lastName, role, isBlocked |\n| **Profile** | Публичный профиль | userId, nickname, displayName, avatarUrl, bio |\n| **Course** | Курсы | title, slug, description, coverImage, difficultyLevel, isPremium |\n| **Module** | Модули внутри курсов | courseId, title, sortOrder, lessonsCount |\n| **Lesson** | Уроки (статьи, видео, аудио, квизы) | moduleId, title, slug, lessonType, isPremium |\n| **TextContent** | Текстовый контент урока | lessonId, body, wordCount, readingTime |\n| **VideoContent** | Видеоконтент урока | lessonId, videoUrl, provider, duration |\n| **AudioContent** | Аудиоконтент урока | lessonId, audioUrl, duration |\n| **QuizContent** | Квизы | lessonId, questions, passingScore |\n| **Tag** | Теги | name, slug, color |\n| **CourseTag** | Связь тегов с курсами | courseId, tagId |\n| **LessonTag** | Связь тегов с уроками | lessonId, tagId |\n| **Comment** | Комментарии | commentableType, commentableId, authorProfileId, text |\n| **Reaction** | Лайки/дизлайки (курсы, уроки, комментарии) | profileId, type, reactionableType, reactionableId |\n| **Favorite** | Избранное | profileId, lessonId, collection |\n| **History** | История просмотров | profileId, historableType, historableId, watchedSeconds |\n| **CourseProgress** | Прогресс прохождения курса | profileId, courseId, status, progressPercent |\n| **LessonProgress** | Прогресс прохождения урока | profileId, lessonId, status, progressPercent |\n| **Subscription** | Подписки пользователей | profileId, planType, status, startDate, endDate |\n| **Transaction** | Транзакции и платежи | profileId, type, amount, status, provider |\n| **PaymentMethod** | Методы оплаты | profileId, type, provider, last4, cardType |\n| **Certificate** | Сертификаты курсов | profileId, courseId, certificateNumber, imageUrl |\n| **Notification** | Уведомления | profileId, type, title, body, isRead |\n| **BusinessEvent** | События аналитики | profileId, eventType, eventCategory, metadata |\n| **Session** | Сессии пользователей | sessionToken, userId, expires |\n| **Account** | OAuth аккаунты | userId, provider, providerAccountId |\n| **VerificationToken** | Токены верификации | identifier, token, expires |\n| **Authenticator** | WebAuthn аутентификаторы | userId, credentialID, credentialPublicKey |\n\n#### 3.2 Enums (перечисления)\n\n```prisma\n// Роли пользователей\nenum Role {\n  USER      // Обычный пользователь\n  AUTHOR    // Автор контента\n  MODERATOR // Модератор\n  ADMIN     // Администратор\n}\n\n// Статусы контента\nenum ContentStatus {\n  DRAFT           // Черновик\n  PENDING_REVIEW  // На модерации\n  PUBLISHED       // Опубликован\n  ARCHIVED        // В архиве\n  DELETED         // Удалён (soft delete)\n}\n\n// Уровень сложности курса\nenum DifficultyLevel {\n  BEGINNER      // Начинающий\n  INTERMEDIATE  // Средний\n  ADVANCED      // Продвинутый\n}\n\n// Тип видео-провайдера\nenum VideoProvider {\n  YOUTUBE\n  RUTUBE\n  VIMEO\n  LOCAL\n}\n\n// Типы уроков\nenum LessonType {\n  ARTICLE   // Статья\n  VIDEO     // Видео\n  AUDIO     // Аудио\n  QUIZ      // Тест/квиз\n  CALCULATOR // Калькулятор\n}\n\n// Типы комментируемых объектов\nenum CommentableType {\n  COURSE\n  LESSON\n}\n\n// Типы объектов для реакций\nenum ReactionableType {\n  COURSE\n  LESSON\n  COMMENT\n}\n\n// Статусы подписки\nenum SubscriptionStatus {\n  ACTIVE      // Активна\n  PAST_DUE    // Просрочена\n  CANCELED    // Отменена\n  EXPIRED     // Истекла\n}\n\n// Статусы транзакций\nenum TransactionStatus {\n  PENDING    // В ожидании\n  COMPLETED  // Завершена\n  FAILED     // Ошибка\n  REFUNDED   // Возвращена\n}\n\n// Типы реакций\nenum ReactionType {\n  LIKE\n  DISLIKE\n}\n\n// Статусы модерации\nenum ModerationStatus {\n  PENDING   // На рассмотрении\n  APPROVED  // Одобрено\n  REJECTED  // Отклонено\n}\n\n// Типы уведомлений\nenum NotificationType {\n  EMAIL\n  IN_APP\n  TELEGRAM\n}\n\n// Типы объектов для истории\nenum HistorableType {\n  LESSON\n  STANDALONE_ARTICLE\n}\n\n// Типы бизнес-объектов\nenum BusinessObjectType {\n  COURSE\n  LESSON\n  COMMENT\n  SUBSCRIPTION\n}\n```\n\n#### 3.3 Особенности реализации\n\n- **Soft Delete**: Многие модели имеют поле `deletedAt` для мягкого удаления\n- **User vs Profile**: \n  - User — аутентификация и безопасность (email, passwordHash, role)\n  - Profile — контент и активности (courses, lessons, comments, reactions)\n- **Полиморфизм уроков**: Lesson содержит lessonType и связанные таблицы (TextContent, VideoContent, AudioContent, QuizContent)\n- **Кешированная статистика**: Course и Lesson хранят viewsCount, likesCount\n\n---\n\n## 4. API Endpoints\n\nAPI построен на Hono фреймворке. Все роуты находятся в `server/index.ts`.\n\n### 4.1 Аутентификация ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 1 | POST | `/api/auth/register` | Регистрация нового пользователя | Все |\n| 2 | POST | `/api/auth/login` | Вход по email/password | Все |\n| 3 | POST | `/api/auth/logout` | Выход | Авторизованный |\n| 4 | GET | `/api/auth/me` | Текущий пользователь (по сессии) | Авторизованный |\n\n**Примеры запросов:**\n\n```json\n// POST /api/auth/register\n{\n  \"email\": \"user@example.com\",\n  \"firstName\": \"Иван\",\n  \"lastName\": \"Петров\",\n  \"password\": \"Password123\",\n  \"nickname\": \"ivan_petrov\"\n}\n\n// POST /api/auth/login\n{\n  \"email\": \"user@example.com\",\n  \"password\": \"Password123\",\n  \"remember\": true\n}\n```\n\n### 4.2 Курсы ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 5 | GET | `/api/courses` | Список курсов с пагинацией и фильтрами | Все |\n| 6 | GET | `/api/courses/:slug` | Детальная страница курса | Все |\n| 7 | GET | `/api/courses/:slug/modules` | Модули курса | Все |\n| 8 | GET | `/api/courses/:slug/modules/:id` | Модуль с уроками | Все |\n\n### 4.3 Уроки ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 9 | GET | `/api/lessons` | Список уроков с фильтрами | Все |\n| 10 | GET | `/api/lessons/:slug` | Детальная страница урока | Все |\n| 11 | GET | `/api/lessons/:slug/content` | Контент урока (текст/видео/аудио) | Все |\n\n### 4.4 Пользователь ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 12 | GET | `/api/user/me` | Текущий пользователь | Авторизованный |\n| 13 | PATCH | `/api/user/profile` | Обновление профиля | Авторизованный |\n| 14 | GET | `/api/user/profile/:nickname` | Публичный профиль | Все |\n| 15 | GET | `/api/user/history` | История просмотров | Авторизованный |\n| 16 | POST | `/api/user/history` | Добавить в историю | Авторизованный |\n| 17 | GET | `/api/user/favorites` | Избранное | Авторизованный |\n| 18 | POST | `/api/user/favorites` | Добавить в избранное | Авторизованный |\n| 19 | DELETE | `/api/user/favorites/:id` | Удалить из избранного | Авторизованный |\n| 20 | GET | `/api/user/progress/courses` | Прогресс по курсам | Авторизованный |\n| 21 | GET | `/api/user/progress/lessons/:id` | Прогресс по уроку | Авторизованный |\n| 22 | POST | `/api/user/progress/lessons/:id` | Обновить прогресс | Авторизованный |\n| 23 | GET | `/api/user/certificates` | Сертификаты | Авторизованный |\n\n### 4.5 Реакции ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 24 | GET | `/api/reactions` | Получить реакции | Все |\n| 25 | POST | `/api/reactions` | Поставить реакцию | Авторизованный |\n| 26 | DELETE | `/api/reactions` | Удалить реакцию | Авторизованный |\n\n### 4.6 Теги ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 27 | GET | `/api/tags` | Список тегов | Все |\n| 28 | GET | `/api/tags/:slug/courses` | Курсы по тегу | Все |\n| 29 | GET | `/api/tags/:slug/lessons` | Уроки по тегу | Все |\n\n### 4.7 Комментарии ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 30 | GET | `/api/comments` | Список комментариев | Все |\n| 31 | POST | `/api/comments` | Добавить комментарий | Авторизованный |\n| 32 | PATCH | `/api/comments/:id` | Редактировать комментарий | Авторизованный |\n| 33 | DELETE | `/api/comments/:id` | Удалить комментарий | Авторизованный |\n\n### 4.8 Платежи 🔄 Заглушка\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 38 | GET | `/api/payment/plans` | Тарифы подписки | Все |\n| 39 | POST | `/api/payment/subscribe` | Оформление подписки | Авторизованный |\n| 40 | POST | `/api/payment/cancel` | Отмена подписки | Авторизованный |\n\n### 4.9 Модерация 🔄 Заглушка\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 34 | GET | `/api/moderation` | Контент на модерации | MODERATOR, ADMIN |\n| 35 | POST | `/api/moderation/:id/approve` | Одобрить контент | MODERATOR, ADMIN |\n| 36 | POST | `/api/moderation/:id/reject` | Отклонить контент | MODERATOR, ADMIN |\n\n### 4.10 Администрирование ✅ Реализовано\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 37 | GET | `/api/admin/stats` | Статистика системы | ADMIN |\n| 38 | GET | `/api/admin/users` | Список пользователей | ADMIN |\n| 39 | PATCH | `/api/admin/users/:id` | Изменить пользователя | ADMIN |\n| 40 | DELETE | `/api/admin/users/:id` | Удалить пользователя | ADMIN |\n| 41 | GET | `/api/admin/courses` | Список курсов (админ) | ADMIN |\n| 42 | POST | `/api/admin/courses` | Создать курс | ADMIN |\n| 43 | PATCH | `/api/admin/courses/:id` | Обновить курс | ADMIN |\n| 44 | DELETE | `/api/admin/courses/:id` | Удалить курс | ADMIN |\n| 45 | GET | `/api/admin/modules` | Список модулей | ADMIN |\n| 46 | POST | `/api/admin/modules` | Создать модуль | ADMIN |\n| 47 | PATCH | `/api/admin/modules/:id` | Обновить модуль | ADMIN |\n| 48 | DELETE | `/api/admin/modules/:id` | Удалить модуль | ADMIN |\n| 49 | GET | `/api/admin/lessons` | Список уроков (админ) | ADMIN |\n| 50 | POST | `/api/admin/lessons` | Создать урок | ADMIN |\n| 51 | PATCH | `/api/admin/lessons/:id` | Обновить урок | ADMIN |\n| 52 | DELETE | `/api/admin/lessons/:id` | Удалить урок | ADMIN |\n| 53 | GET | `/api/admin/lessons/:id/content` | Контент урока | ADMIN |\n| 54 | PATCH | `/api/admin/lessons/:id/content` | Обновить контент | ADMIN |\n| 55 | GET | `/api/admin/tags` | Список тегов (админ) | ADMIN |\n| 56 | POST | `/api/admin/tags` | Создать тег | ADMIN |\n| 57 | PATCH | `/api/admin/tags/:id` | Обновить тег | ADMIN |\n| 58 | DELETE | `/api/admin/tags/:id` | Удалить тег | ADMIN |\n\n### 4.11 Каталог 🔄 Заглушка\n\n| № | Метод | Путь | Описание | Доступ |\n|---|-------|------|----------|--------|\n| 48 | GET | `/api/catalog` | Каталог с фильтрами | Все |\n\n### 4.12 Health Check\n\n| Метод | Путь | Описание |\n|-------|------|----------|\n| GET | `/api/health` | Проверка работоспособности сервера |\n\n**Параметры запроса `/api/courses`:**\n- `page` — номер страницы (по умолчанию 1)\n- `limit` — количество на странице (по умолчанию 20)\n- `status` — фильтр по статусу (PUBLISHED, DRAFT)\n- `difficulty` — фильтр по сложности (BEGINNER, INTERMEDIATE, ADVANCED)\n- `tag` — фильтр по тегу (slug тега)\n- `search` — поиск по названию\n- `author` — фильтр по автору\n- `isPremium` — фильтр по premium статусу\n- `sort` — сортировка (created_at_desc, created_at_asc, popular)\n\n---\n\n## 5. Страницы и маршруты\n\nПроект использует Vite + React Router 7. Маршруты настраиваются в `src/App.tsx`.\n\n### 5.1 Текущая реализация\n\n**Реализованные страницы:**\n\n| № | Путь | Компонент | Описание | Статус |\n|---|------|-----------|----------|--------|\n| 1 | `/` | `src/pages/HomePage.tsx` | Главная страница | ✅ |\n| 2 | `/login` | `src/pages/auth/LoginPage.tsx` | Страница входа | ✅ |\n| 3 | `/register` | `src/pages/auth/RegisterPage.tsx` | Страница регистрации | ✅ |\n| 4 | `/catalog` | Заглушка | Каталог курсов | 🔄 |\n| 5 | `/courses` | Заглушка | Список курсов | 🔄 |\n| 6 | `/calculators` | Заглушка | Калькуляторы | 🔄 |\n| 7 | `/profile` | Заглушка | Профиль пользователя | 🔄 |\n\n**Админ-панель (реализовано):**\n\n| № | Путь | Компонент | Описание | Статус |\n|---|------|-----------|----------|--------|\n| 8 | `/admin` | `src/pages/admin/AdminDashboard.tsx` | Дашборд | ✅ |\n| 9 | `/admin/courses` | `src/pages/admin/AdminCourses.tsx` | Управление курсами | ✅ |\n| 10 | `/admin/lessons` | `src/pages/admin/AdminLessons.tsx` | Управление уроками | ✅ |\n| 11 | `/admin/tags` | `src/pages/admin/AdminTags.tsx` | Управление тегами | ✅ |\n| 12 | `/admin/users` | `src/pages/admin/AdminUsers.tsx` | Управление пользователями | ✅ |\n\n**Layouts:**\n\n| Layout | Компонент | Описание |\n|--------|-----------|----------|\n| MainLayout | `src/layouts/MainLayout.tsx` | Header + Footer |\n| AuthLayout | `src/layouts/AuthLayout.tsx` | Только Header, центрированный контент |\n\n### 5.2 Планируемые публичные маршруты\n\n| № | Путь | Компонент | Описание |\n|---|------|-----------|----------|\n| 8 | `/course/:slug` | `src/pages/CoursePage.tsx` | Детальная страница курса |\n| 9 | `/course/:slug/module/:moduleId` | `src/pages/ModulePage.tsx` | Страница модуля |\n| 10 | `/lesson/:slug` | `src/pages/LessonPage.tsx` | Страница урока |\n| 11 | `/faq` | `src/pages/FaqPage.tsx` | Вопросы и ответы |\n| 12 | `/tools` | `src/pages/ToolsPage.tsx` | Инструменты |\n| 13 | `/calculator/credit` | `src/pages/CalculatorPage.tsx` | Кредитный калькулятор |\n| 14 | `/calculator/deposit` | `src/pages/CalculatorPage.tsx` | Калькулятор вкладов |\n| 15 | `/calculator/mortgage` | `src/pages/CalculatorPage.tsx` | Ипотечный калькулятор |\n\n### 5.3 Планируемые защищённые маршруты\n\n| № | Путь | Компонент | Описание | Требование |\n|---|------|-----------|----------|------------|\n| 16 | `/profile` | `src/pages/ProfilePage.tsx` | Личный кабинет | Авторизация |\n| 17 | `/profile/courses` | `src/pages/ProfileCoursesPage.tsx` | Мои курсы | Авторизация |\n| 18 | `/profile/favorites` | `src/pages/ProfileFavoritesPage.tsx` | Избранное | Авторизация |\n| 19 | `/profile/settings` | `src/pages/ProfileSettingsPage.tsx` | Настройки профиля | Авторизация |\n| 20 | `/profile/subscription` | `src/pages/ProfileSubscriptionPage.tsx` | Подписка | Авторизация |\n| 21 | `/profile/history` | `src/pages/ProfileHistoryPage.tsx` | История просмотров | Авторизация |\n| 22 | `/profile/certificates` | `src/pages/ProfileCertificatesPage.tsx` | Мои сертификаты | Авторизация |\n\n### 5.4 Планируемые админ-маршруты\n\n| № | Путь | Компонент | Описание | Требование |\n|---|------|-----------|----------|------------|\n| 23 | `/admin` | `src/pages/admin/AdminPage.tsx` | Главная админ-панель | ADMIN |\n| 24 | `/admin/users` | `src/pages/admin/AdminUsersPage.tsx` | Управление пользователями | ADMIN |\n| 25 | `/admin/content` | `src/pages/admin/AdminContentPage.tsx` | Управление контентом | ADMIN |\n| 26 | `/admin/moderation` | `src/pages/admin/AdminModerationPage.tsx` | Модерация контента | MODERATOR, ADMIN |\n| 27 | `/admin/stats` | `src/pages/admin/AdminStatsPage.tsx` | Статистика | ADMIN |\n\n### 5.5 Планируемые автор-маршруты\n\n| № | Путь | Компонент | Описание | Требование |\n|---|------|-----------|----------|------------|\n| 28 | `/author/dashboard` | `src/pages/author/AuthorDashboardPage.tsx` | Панель автора | AUTHOR, ADMIN |\n| 29 | `/author/courses/new` | `src/pages/author/AuthorCourseNewPage.tsx` | Создание курса | AUTHOR, ADMIN |\n| 30 | `/author/courses/:id/edit` | `src/pages/author/AuthorCourseEditPage.tsx` | Редактирование курса | AUTHOR, ADMIN |\n\n---\n\n## 6. Компоненты\n\n### 6.1 Текущая структура\n\nНа данный момент компоненты не вынесены в отдельную папку. Весь UI используется напрямую из Mantine в страницах.\n\n**Используемые компоненты Mantine:**\n- `Container`, `Paper`, `Stack`, `Group`, `Box`\n- `TextInput`, `PasswordInput`, `Checkbox`\n- `Button`, `Title`, `Text`\n- `Alert`, `Divider`, `LoadingOverlay`\n- `Table`\n\n### 6.2 Планируемые общие компоненты (`src/components/common/`)\n\n| № | Компонент | Назначение | Параметры |\n|---|-----------|------------|-----------|\n| 1 | `Button.tsx` | Универсальная кнопка (Mantine Button) | variant, size, disabled, isLoading |\n| 2 | `Input.tsx` | Поле ввода (Mantine Input) | error, type, placeholder, value |\n| 3 | `Slider.tsx` | Слайдер с мин/макс | min, max, step, value, onChange, formatLabel |\n| 4 | `Card.tsx` | Карточка контента | title, description, image, link |\n| 5 | `Modal.tsx` | Модальное окно (Mantine Modal) | isOpen, onClose, title, children |\n| 6 | `Header.tsx` | Шапка сайта | - |\n| 7 | `Footer.tsx` | Подвал сайта | - |\n| 8 | `Reactions.tsx` | Лайки/дизлайки контента | contentId, initialLikes, initialDislikes |\n| 9 | `ViewTracker.tsx` | Отслеживание просмотров | contentId |\n| 10 | `Loader.tsx` | Индикатор загрузки | size, color |\n| 11 | `EmptyState.tsx` | Пустое состояние | title, description, action |\n\n### 6.3 Планируемые компоненты калькуляторов (`src/components/calculators/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 12 | `CreditForm.tsx` | Форма кредитного калькулятора |\n| 13 | `CreditChart.tsx` | График платежей по кредиту |\n| 14 | `CreditResults.tsx` | Результаты расчёта кредита |\n| 15 | `DepositForm.tsx` | Форма калькулятора вкладов |\n| 16 | `DepositChart.tsx` | График начисления процентов |\n| 17 | `DepositResults.tsx` | Результаты расчёта вклада |\n| 18 | `MortgageForm.tsx` | Форма ипотечного калькулятора |\n| 19 | `MortgageChart.tsx` | График ипотечных платежей |\n| 20 | `MortgageResults.tsx` | Результаты расчёта ипотеки |\n\n### 6.4 Планируемые компоненты главной страницы (`src/components/home/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 21 | `HeroSection.tsx` | Герой-секция с призывом к действию |\n| 22 | `FeaturesSection.tsx` | Секция особенностей платформы |\n| 23 | `CourseCard.tsx` | Карточка курса |\n| 24 | `ArticleCard.tsx` | Карточка статьи/урока |\n| 25 | `TestimonialsSection.tsx` | Отзывы пользователей |\n| 26 | `PricingSection.tsx` | Тарифы подписки |\n\n### 6.5 Планируемые компоненты профиля (`src/components/profile/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 27 | `CourseList.tsx` | Список курсов пользователя |\n| 28 | `CourseStats.tsx` | Статистика курсов |\n| 29 | `Certificates.tsx` | Сертификаты |\n| 30 | `ContinueLearning.tsx` | Продолжить обучение |\n| 31 | `FavoritesGrid.tsx` | Сетка избранного |\n| 32 | `CollectionsList.tsx` | Коллекции избранного |\n| 33 | `ProfileForm.tsx` | Форма редактирования профиля |\n| 34 | `AvatarUpload.tsx` | Загрузка аватара |\n| 35 | `SocialLinks.tsx` | Социальные сети |\n| 36 | `SubscriptionStatus.tsx` | Статус подписки |\n| 37 | `PaymentHistory.tsx` | История платежей |\n| 38 | `CancelSubscription.tsx` | Отмена подписки |\n\n### 6.6 Планируемые админ-компоненты (`src/components/admin/`)\n\n| № | Компонент | Назначение |\n|---|-----------|------------|\n| 39 | `UserTable.tsx` | Таблица пользователей с пагинацией |\n| 40 | `ContentTable.tsx` | Таблица контента |\n| 41 | `ModerationQueue.tsx` | Очередь модерации |\n| 42 | `StatsCards.tsx` | Карточки статистики |\n| 43 | `UserFilters.tsx` | Фильтры пользователей |\n| 44 | `ContentFilters.tsx` | Фильтры контента |\n\n---\n\n## 7. Формы и валидация\n\n### 7.1 Форма входа ✅ Реализовано (`src/pages/auth/LoginPage.tsx`)\n\n**Используемые библиотеки:**\n- `react-hook-form` — управление формой\n- `@hookform/resolvers/zod` — интеграция с Zod\n- `@tanstack/react-query` — мутация для отправки\n\n**Валидация:**\n```typescript\n// Zod схема (src/shared/types.ts)\nexport const LoginSchema = z.object({\n  email: z.string()\n    .email(\'Некорректный email\')\n    .min(5)\n    .transform((val) => val.toLowerCase()),\n  password: z.string().min(6, \'Пароль слишком короткий\'),\n  remember: z.boolean().optional()\n})\n```\n\n**Поля формы:**\n- `email` — type=\"email\", обязательное\n- `password` — type=\"password\", обязательное, минимум 6 символов\n- `remember` — checkbox, опциональное\n\n**API запрос:**\n```\nPOST /api/auth/login\nContent-Type: application/json\nCredentials: include\n\n{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\",\n  \"remember\": true\n}\n```\n\n### 7.2 Форма регистрации ✅ Реализовано (`src/pages/auth/RegisterPage.tsx`)\n\n**Валидация:**\n```typescript\n// Zod схема (src/shared/types.ts)\nexport const RegisterSchema = z.object({\n  email: z.string()\n    .email(\'Некорректный формат email\')\n    .min(5, \'Email слишком короткий\')\n    .max(255, \'Email слишком длинный\')\n    .transform((val) => val.toLowerCase()),\n  \n  firstName: z.string()\n    .min(2, \'Имя должно содержать минимум 2 символа\')\n    .max(100, \'Имя слишком длинное\')\n    .regex(/^[\\p{L}\\s\'-]+$/u, \'Имя может содержать только буквы, пробелы, дефисы и апострофы\'),\n  \n  lastName: z.string()\n    .min(2, \'Фамилия должна содержать минимум 2 символа\')\n    .max(100, \'Фамилия слишком длинная\')\n    .regex(/^[\\p{L}\\s\'-]+$/u, \'Фамилия может содержать только буквы, пробелы, дефисы и апострофы\'),\n  \n  password: z.string()\n    .min(6, \'Пароль должен содержать минимум 6 символов\')\n    .max(100, \'Пароль слишком длинный\')\n    .regex(/[A-Z]/, \'Пароль должен содержать хотя бы одну заглавную букву\')\n    .regex(/[a-z]/, \'Пароль должен содержать хотя бы одну строчную букву\')\n    .regex(/[0-9]/, \'Пароль должен содержать хотя бы одну цифру\'),\n  \n  nickname: z.string()\n    .min(3, \'Никнейм должен содержать минимум 3 символа\')\n    .max(50, \'Никнейм слишком длинный\')\n    .regex(/^[a-zA-Z0-9_]+$/, \'Никнейм может содержать только латинские буквы, цифры и подчёркивание\')\n})\n```\n\n**Поля формы:**\n- `email` — type=\"email\", обязательное\n- `firstName` — обязательное, 2-100 символов, только буквы\n- `lastName` — обязательное, 2-100 символов, только буквы\n- `nickname` — обязательное, 3-50 символов, латиница + цифры + _\n- `password` — обязательное, минимум 6 символов, должен содержать:\n  - Заглавную букву\n  - Строчную букву\n  - Цифру\n\n**Индикаторы силы пароля:**\nОтображаются в реальном времени при вводе пароля:\n- ✅ Заглавная буква\n- ✅ Строчная буква\n- ✅ Цифра\n\n**API запрос:**\n```\nPOST /api/auth/register\nContent-Type: application/json\n\n{\n  \"email\": \"user@example.com\",\n  \"firstName\": \"Иван\",\n  \"lastName\": \"Петров\",\n  \"password\": \"Password123\",\n  \"nickname\": \"ivan_petrov\"\n}\n```\n\n### 7.3 Планируемые формы\n\n#### Форма профиля\n**Клиентская валидация:**\n- firstName: обязательно\n- lastName: обязательно\n- nickname: обязательно, мин. 3 символа, только `a-zA-Z0-9_`\n- displayName: обязательно\n- bio: максимум 500 символов\n\n#### Формы калькуляторов\n\n**Кредитный калькулятор:**\n- Сумма кредита: min 10,000, max 100,000,000\n- Процентная ставка: min 1, max 50\n- Срок: min 1, max 600 месяцев\n- Тип платежа: аннуитетный/дифференцированный\n\n**Калькулятор вкладов:**\n- Сумма вклада: min 1,000, max 100,000,000\n- Процентная ставка: min 0.1, max 30\n- Срок: min 1, max 60 месяцев\n- Капитализация: ежемесячно/ежеквартально/ежегодно/нет\n\n**Ипотечный калькулятор:**\n- Сумма кредита: min 100,000, max 100,000,000\n- Процентная ставка: min 1, max 30\n- Срок: min 1, max 50 лет\n- Первоначальный взнос: min 0, max 90%\n\n---\n\n## 8. Модальные окна\n\n### 8.1 Текущий статус\n\n❌ Модальные окна не реализованы. Планируется использование обычных страниц.\n\n\n\n### 8.3 Планируемые страницы\n\n| страница | Назначение | Параметры |\n|---------|------------|-----------|\n| `auth` | Вход/регистрация | `mode`: \"login\" \\| \"register\" |\n| `subscribe` | Оформление подписки | - |\n| `payment` | Оплата | `productId`, `priceId` |\n| `confirm` | Подтверждение действия | `title`, `message`, `onConfirm` |\n| `favorite` | Добавление в избранное | `contentId` |\n\n---\n\n## 9. Калькуляторы\n\n### 9.1 Текущий статус\n\n❌ Калькуляторы не реализованы.\n\n### 9.2 Планируемые калькуляторы\n\n#### Кредитный калькулятор (`/calculator/credit`)\n\n**Функциональность:**\n- Расчёт ежемесячного платежа (аннуитетный/дифференцированный)\n- График платежей\n- Досрочное погашение\n- Визуализация (график)\n\n**Типы:**\n```typescript\ninterface CreditInput {\n  amount: number;        // Сумма кредита\n  rate: number;          // Годовая ставка (%)\n  term: number;          // Срок (месяцев)\n  type: \'annuity\' | \'differentiated\';\n  earlyRepayment?: {\n    amount: number;\n    month: number;\n  };\n}\n\ninterface CreditResult {\n  monthlyPayment: number;\n  totalPayment: number;\n  totalInterest: number;\n  schedule: CreditMonth[];\n}\n```\n\n#### Калькулятор вкладов (`/calculator/deposit`)\n\n**Функциональность:**\n- Расчёт с капитализацией и без\n- Ежемесячное пополнение\n- Эффективная ставка\n- Визуализация (график)\n\n#### Ипотечный калькулятор (`/calculator/mortgage`)\n\n**Функциональность:**\n- Расчёт ипотечного платежа\n- Первоначальный взнос\n- График платежей\n- Страховка (опционально)\n\n---\n\n## 10. Админ-панель\n\n### 10.1 Текущий статус\n\n✅ Админ-панель реализована.\n\n### 10.2 Реализованные страницы\n\n| Страница | Путь | Функциональность |\n|----------|------|------------------|\n| Дашборд | `/admin` | Статистика (пользователи, курсы, уроки, просмотры, премиум) |\n| Пользователи | `/admin/users` | Просмотр, редактирование роли, удаление |\n| Курсы | `/admin/courses` | CRUD курсов, фильтры по статусу/сложности, поиск |\n| Уроки | `/admin/lessons` | CRUD уроков, фильтры по типу/статусу, привязка к модулям |\n| Теги | `/admin/tags` | CRUD тегов с цветами |\n\n### 10.3 Реализованная функциональность\n\n**Дашборд:**\n- Карточки статистики (пользователи, курсы, уроки, просмотры, премиум-пользователи)\n- Быстрые действия (создать курс/урок/тег)\n- Статус системы\n\n**Управление пользователями:**\n- Просмотр списка с пагинацией\n- Поиск по имени/email/никнейму\n- Фильтр по роли (USER/AUTHOR/MODERATOR/ADMIN)\n- Редактирование роли\n- Удаление пользователя\n\n**Управление курсами:**\n- CRUD операций\n- Фильтры по статусу (DRAFT/PUBLISHED/ARCHIVED)\n- Фильтры по сложности (BEGINNER/INTERMEDIATE/ADVANCED)\n- Поиск по названию\n- Редактирование: название, описание, сложность, премиум-статус, обложка\n\n**Управление уроками:**\n- CRUD операций\n- Фильтры по типу (ARTICLE/VIDEO/AUDIO/QUIZ)\n- Фильтры по статусу\n- Привязка к курсу и модулю\n- Редактирование контента (текст/видео/аудио/квиз)\n\n**Управление тегами:**\n- CRUD операций\n- Выбор цвета тега\n- Автоматическая генерация slug\n\n### 10.4 Защита маршрутов\n\n- Проверка роли `ADMIN` при входе в админ-панель\n- Проверка сессии через cookie\n- Редирект на главную при отсутствии прав\n- Редирект на страницу входа при отсутствии сессии\n\n---\n\n## 11. Аутентификация\n\n### 11.1 Текущая реализация ✅\n\n**Технологии:**\n- **Сессионная аутентификация** (НЕ JWT)\n- Сессии через cookies (HttpOnly, SameSite=Strict)\n- bcryptjs для хэширования паролей (12 раундов)\n- UUID для токенов сессий\n\n**Срок действия сессии:** 30 дней\n\n**Важно:** Мы НЕ используем JWT токены. Вместо этого используется сессионная аутентификация с хранением сессий в базе данных.\n\n**Файлы:**\n- `server/routes/auth.routes.ts` — роуты аутентификации\n- `src/lib/api.ts` — axios с withCredentials\n- `src/shared/types.ts` — Zod схемы валидации\n\n### 11.2 Как работают сессии\n\n**Структура таблицы Session:**\n```prisma\nmodel Session {\n  id           String   @id\n  sessionToken String   @unique  // Уникальный токен\n  userId       String              // Может быть несколько сессий на одного пользователя\n  expires      DateTime\n  user         User     @relation(...)\n  \n  @@index([userId])\n}\n```\n\n**Процесс входа:**\n1. Пользователь отправляет email/password\n2. Сервер проверяет credentials\n3. Создаётся новая запись в таблице Session\n4. В браузер устанавливается cookie: `session=<token>; HttpOnly; SameSite=Strict`\n\n**Многодевайсная авторизация:**\n- Один пользователь может иметь **несколько сессий** (разные устройства/браузеры)\n- При логине создаётся новая сессия, старые НЕ удаляются\n- Это позволяет быть авторизованным одновременно на ПК и телефоне\n\n### 11.3 Возможные улучшения\n\n**1. Ограничение количества сессий:**\n```typescript\n// Удалить старые сессии, если больше 5\nconst existing = await prisma.session.count({ where: { userId } })\nif (existing >= 5) {\n  await prisma.session.deleteMany({\n    where: { userId },\n    orderBy: { createdAt: \'asc\' },\n    take: existing - 4\n  })\n}\n```\n\n**2. Очистка истёкших сессий (cron job):**\n```typescript\n// Удалить просроченные сессии\nawait prisma.session.deleteMany({\n  where: { expires: { lt: new Date() } }\n})\n```\n\n**3. \"Выйти со всех устройств\":**\n```typescript\n// Удалить все сессии пользователя, кроме текущей\nawait prisma.session.deleteMany({\n  where: { \n    userId: currentUserId,\n    sessionToken: { not: currentToken }\n  }\n})\n```\n\n### 11.4 API Endpoints\n\n| Endpoint | Метод | Описание |\n|----------|-------|----------|\n| `/api/auth/register` | POST | Регистрация нового пользователя |\n| `/api/auth/login` | POST | Вход по email/password |\n| `/api/auth/logout` | POST | Выход (удаление сессии) |\n| `/api/auth/me` | GET | Получение текущего пользователя по cookie |\n\n### 11.3 Процесс регистрации\n\n1. Валидация данных через Zod (RegisterSchema)\n2. Проверка уникальности email и nickname\n3. Хэширование пароля (bcryptjs, 12 раундов)\n4. Создание User и Profile в транзакции\n5. Автоматическая генерация аватара через ui-avatars.com\n\n### 11.4 Процесс входа\n\n1. Валидация данных через Zod (LoginSchema)\n2. Поиск пользователя по email\n3. Проверка пароля (bcryptjs compare)\n4. Проверка на блокировку (isBlocked)\n5. Создание сессии в БД (Session table)\n6. Установка cookie с sessionToken\n7. Обновление lastLoginAt\n\n### 11.5 Роли и права доступа\n\n| Роль | Доступ |\n|------|--------|\n| USER | Личный кабинет, курсы, избранное, история |\n| AUTHOR | + Создание контента, авторская панель |\n| MODERATOR | + Модерация контента |\n| ADMIN | + Полное управление пользователями и контентом |\n\n### 11.6 Структура ответов\n\n**Успешная регистрация (201):**\n```json\n{\n  \"message\": \"User created successfully\",\n  \"user\": {\n    \"id\": \"uuid\",\n    \"email\": \"user@example.com\",\n    \"firstName\": \"Иван\",\n    \"lastName\": \"Петров\",\n    \"role\": \"USER\",\n    \"profile\": {\n      \"id\": \"uuid\",\n      \"nickname\": \"ivan_petrov\",\n      \"displayName\": \"Иван Петров\",\n      \"avatarUrl\": \"https://ui-avatars.com/...\"\n    }\n  }\n}\n```\n\n**Ошибка (400/401/500):**\n```json\n{\n  \"error\": \"Сообщение об ошибке\",\n  \"code\": \"ERROR_CODE\",\n  \"details\": [{ \"field\": \"email\", \"message\": \"Ошибка валидации\" }]\n}\n```\n\n---\n\n## 12. Структура проекта\n\n### 12.1 Текущая структура\n\n```\n├── src/                         # Исходный код фронтенда\n│   ├── components/              # React компоненты\n│   │   ├── common/              # Общие компоненты\n│   │   └── layout/              # Layout компоненты\n│   │       ├── Header.tsx       # Шапка сайта ✅\n│   │       ├── Footer.tsx       # Подвал сайта ✅\n│   │       └── index.ts         # Экспорт\n│   ├── layouts/                 # Layout обёртки\n│   │   ├── MainLayout.tsx       # Основной layout (Header + Footer) ✅\n│   │   ├── AuthLayout.tsx       # Layout для авторизации (только Header) ✅\n│   │   └── index.ts             # Экспорт\n│   ├── pages/                   # Страницы\n│   │   ├── auth/                # Страницы авторизации\n│   │   │   ├── LoginPage.tsx    # Страница входа ✅\n│   │   │   └── RegisterPage.tsx # Страница регистрации ✅\n│   │   └── HomePage.tsx         # Главная страница ✅\n│   ├── shared/                  # Общие типы и утилиты\n│   │   └── types.ts             # TypeScript типы и Zod схемы ✅\n│   ├── store/                   # Zustand сторы\n│   │   └── useAppStore.ts       # Глобальный стор ✅\n│   ├── assets/                  # Статические ресурсы\n│   ├── App.tsx                  # Главный компонент с роутингом ✅\n│   ├── main.tsx                 # Точка входа ✅\n│   └── vite-env.d.ts           # Типы Vite\n│\n├── server/                      # Бэкенд (Hono)\n│   ├── routes/                  # API роуты\n│   │   ├── auth.routes.ts       # Аутентификация ✅\n│   │   ├── user.routes.ts       # Пользователь 🔄 Заглушка\n│   │   ├── courses.routes.ts    # Курсы 🔄 Заглушка\n│   │   ├── lessons.routes.ts    # Уроки 🔄 Заглушка\n│   │   ├── comments.routes.ts   # Комментарии 🔄 Заглушка\n│   │   ├── reactions.routes.ts  # Реакции 🔄 Заглушка\n│   │   ├── tags.routes.ts       # Теги 🔄 Заглушка\n│   │   ├── payments.routes.ts   # Платежи 🔄 Заглушка\n│   │   ├── moderation.routes.ts # Модерация 🔄 Заглушка\n│   │   └── admin.routes.ts      # Админ 🔄 Заглушка\n│   ├── middleware/              # Middleware\n│   │   ├── auth.ts              # Auth middleware 🔄 Заглушка\n│   │   ├── logger.ts            # Logger 🔄 Заглушка\n│   │   └── rate-limit.ts        # Rate limiting 🔄 Заглушка\n│   ├── lib/                     # Библиотеки\n│   │   ├── auth.ts              # Auth конфигурация 🔄 Резерв\n│   │   ├── errors.ts            # Классы ошибок ✅\n│   │   ├── validators.ts        # Zod схемы 🔄 Заглушка\n│   │   └── agination.ts         # Пагинация 🔄 Заглушка\n│   ├── db.ts                    # Prisma клиент ✅\n│   └── index.ts                 # Главный файл сервера ✅\n│\n├── prisma/                      # База данных\n│   ├── schema.prisma            # Схема БД ✅\n│   └── migrations/              # Миграции\n│\n├── public/                      # Статические файлы\n│   └── images/                  # Изображения\n│\n├── package.json                 # Зависимости\n├── vite.config.ts               # Конфигурация Vite ✅\n├── tsconfig.json                # Конфигурация TypeScript\n├── tailwind.config.js           # Конфигурация Tailwind\n├── eslint.config.js             # Конфигурация ESLint\n└── .env                         # Переменные окружения\n```\n\n### 12.2 Ключевые файлы\n\n| Файл | Назначение | Статус |\n|------|------------|--------|\n| `server/index.ts` | Главный файл сервера Hono | ✅ |\n| `server/db.ts` | Экспорт Prisma клиента | ✅ |\n| `server/lib/errors.ts` | Класс AppError для ошибок | ✅ |\n| `server/routes/auth.routes.ts` | Роуты аутентификации | ✅ |\n| `src/App.tsx` | Роутинг приложения | ✅ |\n| `src/layouts/MainLayout.tsx` | Основной layout | ✅ |\n| `src/layouts/AuthLayout.tsx` | Layout для авторизации | ✅ |\n| `src/components/layout/Header.tsx` | Шапка сайта | ✅ |\n| `src/components/layout/Footer.tsx` | Подвал сайта | ✅ |\n| `src/pages/HomePage.tsx` | Главная страница | ✅ |\n| `src/pages/auth/LoginPage.tsx` | Страница входа | ✅ |\n| `src/pages/auth/RegisterPage.tsx` | Страница регистрации | ✅ |\n| `src/shared/types.ts` | TypeScript типы и Zod схемы | ✅ |\n| `prisma/schema.prisma` | Схема базы данных | ✅ |\n\n---\n\n## 13. Цветовая палитра\n\nИспользуется в стилях:\n\n```css\n:root {\n  --background: #F8F6F3;      /* Светлый фон */\n  --foreground: #264653;      /* Основной текст */\n  --primary: #F4A261;         /* Оранжевый */\n  --secondary: #2A9D8F;       /* Бирюзовый */\n  --accent: #F4A261;          /* Акцентный */\n  --muted: #6C757D;           /* Приглушённый */\n  --destructive: #FF6B6B;     /* Ошибка/удаление */\n  --border: #E9ECEF;          /* Границы */\n}\n```\n\n---\n\n## 14. Команды для работы\n\n```bash\n# Запуск dev-сервера (Vite + Hono на порту 5173)\nnpm run dev\n\n# Запуск только бэкенда (порт 3000)\nnpx tsx server/index.ts\n\n# Сборка проекта\nnpm run build\n\n# Запуск продакшн-версии\nnpm run preview\n\n# Запуск линтера\nnpm run lint\n\n# Генерация Prisma Client\nnpx prisma generate\n\n# Применение миграций\nnpx prisma migrate dev\n\n# Просмотр Studio\nnpx prisma studio\n\n# Сидирование БД (если есть)\nnpm run db:seed\n```\n\n---\n\n## 15. Переменные окружения (.env)\n\n```env\n# База данных (MySQL)\nDATABASE_URL=\"mysql://user:password@localhost:3306/economikus\"\n\n# Порт сервера (опционально)\nPORT=3000\n\n# Секрет для сессий (минимум 32 символа)\nAUTH_SECRET=\"your-secret-key-min-32-chars-long\"\n```\n\n---\n\n## 16. Известные проблемы и решения\n\n### 16.1 Исправленные проблемы\n\n| Проблема | Решение |\n|----------|---------|\n| Ошибка `erors.ts` | Переименован в `errors.ts` |\n| Prisma 7.x несовместимость | Понижена до 5.22.0 |\n| Отсутствие `url` в datasource | Добавлен `url = env(\"DATABASE_URL\")` |\n| `acceptTerms` в RegisterSchema | Поле оставлено (требуется в форме) |\n| `userId`/`profileId` вместо `id` | Исправлено на `id` в auth.routes.ts |\n| Сервер не запускался | Добавлен `serve()` из @hono/node-server |\n\n### 16.2 Текущие ограничения\n\n- Нет защиты маршрутов на фронтенде (требуется добавить ProtectedRoute)\n- Нет middleware для проверки ролей\n- Нет rate limiting\n- Нет логирования запросов\n\n---\n\n## 17. TODO / Roadmap\n\n### Приоритет 1 (Базовый функционал) ✅ Завершено\n- [x] Header и Footer компоненты\n- [x] MainLayout и AuthLayout\n- [x] Страницы входа/регистрации\n- [x] Главная страница\n- [x] Аутентификация API (register, login, logout, me)\n\n### Приоритет 2 (API - без защиты маршрутов)\n- [ ] API курсов (GET /api/courses, GET /api/courses/:slug)\n- [ ] API уроков (GET /api/lessons, GET /api/lessons/:slug)\n- [ ] API пользователя (GET /api/user/me, PATCH /api/user/profile)\n- [ ] API тегов (GET /api/tags)\n- [ ] API комментариев (CRUD)\n- [ ] API реакций (лайки/дизлайки)\n- [ ] API платежей (заглушки)\n- [ ] API модерации (заглушки)\n- [ ] API админа (заглушки)\n\n### Приоритет 3 (Страницы контента)\n- [ ] Страница каталога\n- [ ] Страница списка курсов\n- [ ] Страница курса\n- [ ] Страница урока\n\n### Приоритет 4 (Профиль пользователя)\n- [ ] Страница профиля\n- [ ] Страница настроек\n- [ ] Страница избранного\n- [ ] Страница истории\n\n### Приоритет 5 (Админ-панель)\n- [ ] Базовая админ-панель\n- [ ] Управление пользователями\n- [ ] Функции модератора\n\n### Приоритет 6 (Дополнительный функционал)\n- [ ] Калькуляторы\n- [ ] Платежи (имитация)\n\n### Приоритет 7 (Защита)\n- [ ] ProtectedRoute компонент\n- [ ] Middleware для проверки ролей\n- [ ] Rate limiting\n- [ ] Логирование\n\n---\n\n*Документация обновлена: март 2026*\n*Версия: 2.1*\n*Статус: Актуальная*\n', 5903, 30, '2026-03-19 15:58:41.431', '2026-03-19 15:58:41.431'),
('cfc75f6f-03fb-4518-85da-8814d3f959a8', 'da5f1c71-645e-48a7-ae2a-e8a7f985a260', 'dfghdhfgh', 1, 1, '2026-04-12 15:55:13.123', '2026-04-12 15:55:13.123'),
('d5211b57-3733-11f1-a8d2-1278a1aee829', 'd51feb9c-3733-11f1-a8d2-1278a1aee829', '<h2>5 критериев выбора дебетовой карты</h2><ol><li><strong>Кешбэк</strong> — реальный возврат деньгами, а не бонусами</li><li><strong>Процент на остаток</strong> — альтернатива вкладу для свободных денег</li><li><strong>Стоимость обслуживания</strong> — бесплатно при выполнении условий</li><li><strong>Лимиты на снятие и переводы</strong> — важно для путешествий</li><li><strong>Мобильное приложение</strong> — удобство важнее мелких бонусов</li></ol>', 70, 1, '2026-04-13 12:25:18.376', '2026-04-13 12:25:18.376'),
('d5249d64-3733-11f1-a8d2-1278a1aee829', 'd523242b-3733-11f1-a8d2-1278a1aee829', '<h2>Вклад vs Накопительный счёт</h2><table><tr><th>Критерий</th><th>Вклад</th><th>Накопительный счёт</th></tr><tr><td>Ставка</td><td>Фиксированная, выше</td><td>Плавающая, ниже</td></tr><tr><td>Снятие</td><td>Потеря процентов</td><td>Свободное</td></tr><tr><td>Пополнение</td><td>Не всегда</td><td>Всегда</td></tr></table><p>Вывод: вклад для долгосрочных накоплений, накопительный счёт — для подушки безопасности.</p>', 65, 1, '2026-04-13 12:25:18.400', '2026-04-13 12:25:18.400'),
('d5281c4b-3733-11f1-a8d2-1278a1aee829', 'd52609d6-3733-11f1-a8d2-1278a1aee829', '<h2>Стратегия: кредитка + вклад</h2><p>1. Получаете зарплату и кладёте на накопительный счёт под 15% годовых.</p><p>2. Все повседневные траты делаете с кредитной карты с грейс-периодом 50-100 дней.</p><p>3. В конце грейс-периода гасите задолженность с накопительного счёта.</p><p>Результат: ваши деньги работают и приносят процент, а кредиткой пользуетесь бесплатно.</p>', 60, 1, '2026-04-13 12:25:18.422', '2026-04-13 12:25:18.422'),
('d52f92d3-3733-11f1-a8d2-1278a1aee829', 'd52cd82d-3733-11f1-a8d2-1278a1aee829', '<h2>Как работает КБМ?</h2><p>Коэффициент бонус-малус — ваша скидка за безаварийную езду. Каждый год без ДТП снижает стоимость полиса на 5%. Максимальная скидка — 50% (КБМ 0.5).</p><p>Проверить свой КБМ можно на сайте РСА. Если он неверный — требуйте восстановления через страховую.</p>', 55, 1, '2026-04-13 12:25:18.471', '2026-04-13 12:25:18.471'),
('d52faf0f-3733-11f1-a8d2-1278a1aee829', 'd52cf7c3-3733-11f1-a8d2-1278a1aee829', '<h2>Что страхуем в квартире?</h2><ul><li><strong>Конструктив</strong> — стены, перекрытия (нужно при ипотеке)</li><li><strong>Отделку и имущество</strong> — добровольно, стоит 2-5 тыс ₽ в год</li><li><strong>Гражданскую ответственность</strong> — на случай залива соседей</li></ul>', 50, 1, '2026-04-13 12:25:18.471', '2026-04-13 12:25:18.471'),
('d53357ff-3733-11f1-a8d2-1278a1aee829', 'd5319b27-3733-11f1-a8d2-1278a1aee829', '<h2>Осторожно: НСЖ и ИСЖ</h2><p>Накопительное и инвестиционное страхование жизни — сложные продукты, которые банки часто навязывают под видом «вклада с повышенной ставкой».</p><h3>Минусы:</h3><ul><li>Деньги заморожены на 3-5 лет, досрочное расторжение — потеря до 90%</li><li>Доходность часто ниже инфляции</li><li>Огромные комиссии агенту (до 90% первого взноса)</li></ul><p>Вывод: НСЖ/ИСЖ выгодны только банку и агенту, а не вам.</p>', 75, 1, '2026-04-13 12:25:18.496', '2026-04-13 12:25:18.496'),
('d537a5f6-3733-11f1-a8d2-1278a1aee829', 'd5364710-3733-11f1-a8d2-1278a1aee829', '<h2>Модели семейного бюджета</h2><ul><li><strong>Общий котёл</strong> — все деньги в одну кучу. Плюс: прозрачность. Минус: потеря личной свободы.</li><li><strong>Раздельный</strong> — каждый платит за себя. Плюс: независимость. Минус: сложно копить на общие цели.</li><li><strong>Смешанный (50/50 или пропорционально)</strong> — общий счёт на расходы + личные. Оптимальный вариант для большинства пар.</li></ul>', 65, 1, '2026-04-13 12:25:18.524', '2026-04-13 12:25:18.524'),
('d53c6bbe-3733-11f1-a8d2-1278a1aee829', 'd53b3a4f-3733-11f1-a8d2-1278a1aee829', '<h2>Правила карманных денег</h2><ul><li>Начинать с 6-7 лет, небольшие суммы раз в неделю</li><li>Не платить за оценки и домашние обязанности</li><li>Дать свободу тратить (и ошибаться) — это лучший учитель</li><li>К 12-14 годам переходить на месячный бюджет</li></ul><p>Сумма: 100-300 рублей в неделю в младшей школе, 500-1000 в средней.</p>', 55, 1, '2026-04-13 12:25:18.556', '2026-04-13 12:25:18.556'),
('d541dfda-3733-11f1-a8d2-1278a1aee829', 'd53f9d45-3733-11f1-a8d2-1278a1aee829', '<h2>Что такое синдром отложенной жизни?</h2><p>Это состояние, когда человек живёт в ожидании «лучшего будущего»: «вот накоплю — куплю», «вот выйду на пенсию — заживу».</p><h3>Как бороться с импульсивными покупками:</h3><ul><li>Правило 24 часов: отложите покупку на сутки, желание часто проходит</li><li>Считайте стоимость в часах работы: «Я работал 10 часов ради этой кофточки?»</li><li>Отпишитесь от рассылок магазинов</li></ul>', 70, 1, '2026-04-13 12:25:18.591', '2026-04-13 12:25:18.591');
INSERT INTO `text_contents` (`text_content_id`, `lesson_id`, `body`, `word_count`, `reading_time`, `created_at`, `updated_at`) VALUES
('d544980d-3733-11f1-a8d2-1278a1aee829', 'd5438550-3733-11f1-a8d2-1278a1aee829', '<h2>Почему «с понедельника новую жизнь» не работает?</h2><p>Резкие ограничения вызывают стресс и срывы. Наш мозг сопротивляется переменам.</p><h3>Стратегия маленьких шагов:</h3><ol><li>Неделя 1: просто записывайте расходы, не меняя поведения</li><li>Неделя 2: найдите одну ненужную подписку и отключите</li><li>Неделя 3: откладывайте 1% от дохода (да, всего 1%)</li><li>Неделя 4: увеличьте до 2% и т.д.</li></ol>', 70, 1, '2026-04-13 12:25:18.609', '2026-04-13 12:25:18.609'),
('d54a2b32-3733-11f1-a8d2-1278a1aee829', 'd548dbec-3733-11f1-a8d2-1278a1aee829', '<h2>НПД (самозанятость) vs ИП на УСН</h2><table><tr><th>Критерий</th><th>Самозанятый (НПД)</th><th>ИП на УСН 6%</th></tr><tr><td>Ставка налога</td><td>4% с физлиц, 6% с юрлиц</td><td>6% с оборота</td></tr><tr><td>Лимит дохода</td><td>2.4 млн ₽ в год</td><td>До 265.8 млн ₽</td></tr><tr><td>Отчётность</td><td>Нет деклараций</td><td>Ежегодная декларация</td></tr><tr><td>Сотрудники</td><td>Нельзя нанимать</td><td>Можно</td></tr></table><p>Для большинства фрилансеров с доходом до 2.4 млн оптимален НПД.</p>', 80, 1, '2026-04-13 12:25:18.646', '2026-04-13 12:25:18.646'),
('d54d8261-3733-11f1-a8d2-1278a1aee829', 'd54be150-3733-11f1-a8d2-1278a1aee829', '<h2>Как планировать при плавающем доходе?</h2><p>1. Посчитайте средний доход за последние 12 месяцев (или за весь период фриланса).</p><p>2. От этого среднего и планируйте бюджет, а не от «хороших» месяцев.</p><p>3. В «жирные» месяцы излишек отправляйте в подушку безопасности.</p><p>4. В «худые» месяцы добирайте из подушки до среднего уровня.</p>', 55, 1, '2026-04-13 12:25:18.668', '2026-04-13 12:25:18.668'),
('d54fdeb4-3733-11f1-a8d2-1278a1aee829', 'd54e990d-3733-11f1-a8d2-1278a1aee829', '<h2>Пенсия самозанятого: три пути</h2><ul><li><strong>Покупать баллы ИПК</strong> — добровольные взносы в СФР (мин. 50 000 ₽ в год)</li><li><strong>Программа долгосрочных сбережений</strong> — софинансирование от государства</li><li><strong>Самостоятельные инвестиции</strong> — ИИС, ETF, облигации</li></ul><p>Оптимальная стратегия: 10-15% от среднего дохода ежемесячно направлять на пенсионный портфель.</p>', 60, 1, '2026-04-13 12:25:18.683', '2026-04-13 12:25:18.683'),
('d7221603-6f1a-4eec-af51-163f4c0170a0', '590ff794-3cc2-4945-92ce-fcbd0c2f41c4', '# Руководство по оптимизации и рефакторингу проекта Economikus\n\n> Единый документ с принципами, правилами и стандартами разработки\n\n---\n\n## Содержание\n\n1. [Принципы разработки](#1-принципы-разработки)\n2. [Архитектура проекта](#2-архитектура-проекта)\n3. [Стандарты именования](#3-стандарты-именования)\n4. [Переиспользуемые компоненты](#4-переиспользуемые-компоненты)\n5. [Хуки для управления состоянием](#5-хуки-для-управления-состоянием)\n6. [Модальные окна](#6-модальные-окна)\n7. [Сервисы API](#7-сервисы-api)\n8. [Константы и типы](#8-константы-и-типы)\n9. [Правила рефакторинга страниц](#9-правила-рефакторинга-страниц)\n10. [Чеклист для новых фич](#10-чеклист-для-новых-фич)\n\n---\n\n## 1. Принципы разработки\n\n### 1.1 Основные принципы\n\n| Принцип | Описание |\n|---------|----------|\n| **DRY** | Don\'t Repeat Yourself — избегаем дублирование кода |\n| **KISS** | Keep It Simple, Stupid — простые решения лучше сложных |\n| **Single Responsibility** | Один компонент/хук — одна задача |\n| **Composition over Inheritance** | Композиция вместо наследования |\n\n### 1.2 Правила написания кода\n\n```typescript\n// ❌ Плохо: дублирование логики\nfunction AdminTags() {\n  const [tags, setTags] = useState([])\n  const [loading, setLoading] = useState(true)\n  \n  useEffect(() => {\n    api.get(\'/admin/tags\').then(res => setTags(res.data.items))\n  }, [])\n  // ...\n}\n\nfunction AdminCourses() {\n  const [courses, setCourses] = useState([])\n  const [loading, setLoading] = useState(true)\n  \n  useEffect(() => {\n    api.get(\'/admin/courses\').then(res => setCourses(res.data.items))\n  }, [])\n  // ...\n}\n\n// ✅ Хорошо: выносим в хук\nfunction AdminTags() {\n  const { tags, loading, handleDelete } = useTagList()\n  // ...\n}\n\nfunction AdminCourses() {\n  const { courses, loading, handleDelete } = useCourseList()\n  // ...\n}\n```\n\n### 1.3 Структура файлов\n\n```\nsrc/\n├── components/           # Переиспользуемые UI компоненты\n│   ├── common/          # Универсальные компоненты (Badge, Dialog, etc.)\n│   ├── modals/          # Модальные окна\n│   ├── tables/          # Компоненты таблиц\n│   ├── cards/           # Карточки\n│   └── layout/          # Layout компоненты\n│\n├── hooks/               # Кастомные хуки\n├── services/            # API сервисы\n├── types/               # TypeScript типы\n├── constants/           # Константы и конфигурации\n├── pages/               # Страницы приложения\n└── layouts/             # Layout обёртки\n```\n\n---\n\n## 2. Архитектура проекта\n\n### 2.1 Уровни абстракции\n\n```\n┌─────────────────────────────────────────────────────────────┐\n│                         PAGES                                │\n│  (Страницы — используют компоненты, хуки, сервисы)          │\n├─────────────────────────────────────────────────────────────┤\n│                       LAYOUTS                                │\n│  (Обёртки страниц — Header, Footer, Sidebar)                │\n├─────────────────────────────────────────────────────────────┤\n│                      COMPONENTS                              │\n│  (UI компоненты — modals, tables, cards, common)            │\n├─────────────────────────────────────────────────────────────┤\n│                         HOOKS                                │\n│  (Бизнес-логика — useTagList, useCourseList, etc.)          │\n├─────────────────────────────────────────────────────────────┤\n│                       SERVICES                               │\n│  (API вызовы — TagService, CourseService, etc.)             │\n├─────────────────────────────────────────────────────────────┤\n│                      CONSTANTS                               │\n│  (Статичные данные — статусы, роли, типы)                   │\n├─────────────────────────────────────────────────────────────┤\n│                         TYPES                                │\n│  (TypeScript интерфейсы и типы)                             │\n└─────────────────────────────────────────────────────────────┘\n```\n\n### 2.2 Поток данных\n\n```\nPage → Hook → Service → API → Backend\n  ↓\nComponent (render)\n```\n\n---\n\n## 3. Стандарты именования\n\n### 3.1 Файлы\n\n| Тип | Паттерн | Пример |\n|-----|---------|--------|\n| Компонент | `PascalCase.tsx` | `StatusBadge.tsx` |\n| Хук | `camelCase.ts` | `useTagList.ts` |\n| Сервис | `camelCase.service.ts` | `tag.service.ts` |\n| Тип | `camelCase.ts` | `tag.ts` |\n| Константа | `camelCase.ts` | `status.ts` |\n| Страница | `PascalCase.tsx` | `AdminTags.tsx` |\n\n### 3.2 Компоненты\n\n```typescript\n// ✅ Хорошо: описательное имя\nexport function ConfirmDialog({ opened, onClose, onConfirm, title, message }: ConfirmDialogProps) {}\n\n// ✅ Хорошо: префикс для типа компонента\nexport function UserModal() {}\nexport function StatusBadge() {}\nexport function StatCard() {}\n\n// ❌ Плохо: неинформативное имя\nexport function Dialog() {}\nexport function Badge() {}\nexport function Card() {}\n```\n\n### 3.3 Хуки\n\n```typescript\n// ✅ Хорошо: префикс use + описательное имя\nexport function useTagList() {}\nexport function useCourseList() {}\nexport function useNotification() {}\n\n// ✅ Хорошо: возвращаемый тип с суффиксом Return\ninterface UseTagListReturn {\n  tags: Tag[]\n  loading: boolean\n  // ...\n}\n```\n\n### 3.4 Переменные и функции\n\n```typescript\n// ✅ Хорошо: глагол для действий\nconst fetchUsers = async () => {}\nconst handleDelete = async (id: string) => {}\nconst openEditModal = (user: User) => {}\n\n// ✅ Хорошо: is/has для булевых значений\nconst isLoading = true\nconst hasPermission = false\nconst isOpened = false\n\n// ✅ Хорошо: описательные имена для состояния\nconst [deleteConfirm, setDeleteConfirm] = useState({ opened: false, id: null })\n```\n\n---\n\n## 4. Переиспользуемые компоненты\n\n### 4.1 Общие компоненты (src/components/common/)\n\n| Компонент | Назначение | Props |\n|-----------|------------|-------|\n| `StatusBadge` | Бейдж статуса | `status, type, size, variant` |\n| `RoleBadge` | Бейдж роли | `role, size, variant` |\n| `LoadingState` | Состояние загрузки | `text, size` |\n| `EmptyState` | Пустое состояние | `title, description, icon` |\n| `ErrorState` | Состояние ошибки | `title, message, onRetry` |\n| `ConfirmDialog` | Диалог подтверждения | `opened, onClose, onConfirm, title, message` |\n| `ColorIndicator` | Индикатор цвета | `color, size` |\n| `AvatarUploader` | Загрузка аватара | `currentAvatar, size, onUploadSuccess` |\n\n### 4.2 Пример использования\n\n```tsx\nimport { StatusBadge, RoleBadge, ConfirmDialog, LoadingState, EmptyState, AvatarUploader } from \'@/components/common\'\nimport { ProtectedRoute } from \'@/components/auth\'\n\n// Статус контента\n<StatusBadge status={course.status} type=\"content\" />\n\n// Роль пользователя\n<RoleBadge role={user.role} />\n\n// Диалог подтверждения\n<ConfirmDialog\n  opened={deleteConfirm.opened}\n  onClose={() => setDeleteConfirm({ opened: false })}\n  onConfirm={handleDelete}\n  title=\"Удалить курс?\"\n  message=\"Это действие нельзя отменить.\"\n  confirmLabel=\"Удалить\"\n  color=\"red\"\n/>\n\n// Состояния\n{loading && <LoadingState text=\"Загрузка...\" />}\n{!loading && items.length === 0 && <EmptyState title=\"Нет данных\" />}\n\n// Загрузка аватара\n<AvatarUploader\n  currentAvatar={profile.avatarUrl}\n  size={80}\n  onUploadSuccess={(url) => console.log(\'Uploaded:\', url)}\n/>\n\n// Защита роутов\n<ProtectedRoute roles={[\'ADMIN\']}>\n  <AdminDashboard />\n</ProtectedRoute>\n```\n\n### 4.3 Создание нового компонента\n\n```tsx\n// src/components/common/NewBadge.tsx\nimport { Badge } from \'@mantine/core\'\nimport { NEW_CONFIG } from \'@/constants\'\n\ninterface NewBadgeProps {\n  type: string\n  size?: \'sm\' | \'md\' | \'lg\'\n}\n\nexport function NewBadge({ type, size = \'md\' }: NewBadgeProps) {\n  const config = NEW_CONFIG[type]\n  \n  return (\n    <Badge color={config?.color || \'gray\'} size={size}>\n      {config?.label || type}\n    </Badge>\n  )\n}\n\n// Экспорт в src/components/common/index.ts\nexport { NewBadge } from \'./NewBadge\'\n```\n\n---\n\n## 5. Хуки для управления состоянием\n\n### 5.1 Структура хука для списка с CRUD\n\n```typescript\n// src/hooks/useEntityList.ts\nimport { useState, useCallback, useEffect } from \'react\'\nimport { EntityService } from \'@/services\'\nimport type { Entity, EntityInput } from \'@/types\'\nimport { useNotification } from \'./useNotification\'\n\ninterface UseEntityListReturn {\n  entities: Entity[]\n  loading: boolean\n  page: number\n  setPage: (page: number) => void\n  totalPages: number\n  search: string\n  setSearch: (search: string) => void\n  filter: string | null\n  setFilter: (filter: string | null) => void\n  modalOpened: boolean\n  editingEntity: Entity | null\n  saving: boolean\n  openCreate: () => void\n  openEdit: (entity: Entity) => void\n  closeModal: () => void\n  handleSave: (data: EntityInput) => Promise<void>\n  handleDelete: (id: string) => Promise<void>\n  refresh: () => Promise<void>\n}\n\nexport function useEntityList(): UseEntityListReturn {\n  const [entities, setEntities] = useState<Entity[]>([])\n  const [loading, setLoading] = useState(true)\n  const [page, setPage] = useState(1)\n  const [totalPages, setTotalPages] = useState(1)\n  const [search, setSearch] = useState(\'\')\n  const [filter, setFilter] = useState<string | null>(null)\n  const [modalOpened, setModalOpened] = useState(false)\n  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)\n  const [saving, setSaving] = useState(false)\n  const { showError, showSuccess } = useNotification()\n\n  // Загрузка данных\n  const fetchEntities = useCallback(async () => {\n    setLoading(true)\n    try {\n      const params: Record<string, string> = { page: page.toString(), limit: \'10\' }\n      if (search) params.search = search\n      if (filter) params.filter = filter\n\n      const result = await EntityService.getAdmin(params)\n      setEntities(result.items)\n      setTotalPages(result.pagination.totalPages)\n    } catch (error) {\n      showError(\'Ошибка загрузки\')\n    } finally {\n      setLoading(false)\n    }\n  }, [page, search, filter, showError])\n\n  useEffect(() => {\n    fetchEntities()\n  }, [fetchEntities])\n\n  // CRUD операции\n  const openCreate = useCallback(() => {\n    setEditingEntity(null)\n    setModalOpened(true)\n  }, [])\n\n  const openEdit = useCallback((entity: Entity) => {\n    setEditingEntity(entity)\n    setModalOpened(true)\n  }, [])\n\n  const closeModal = useCallback(() => {\n    setModalOpened(false)\n    setEditingEntity(null)\n  }, [])\n\n  const handleSave = useCallback(async (data: EntityInput) => {\n    setSaving(true)\n    try {\n      if (editingEntity) {\n        await EntityService.update(editingEntity.id, data)\n        showSuccess(\'Обновлено\')\n      } else {\n        await EntityService.create(data)\n        showSuccess(\'Создано\')\n      }\n      closeModal()\n      fetchEntities()\n    } catch (error) {\n      showError(\'Ошибка сохранения\')\n    } finally {\n      setSaving(false)\n    }\n  }, [editingEntity, closeModal, fetchEntities, showError, showSuccess])\n\n  const handleDelete = useCallback(async (id: string) => {\n    try {\n      await EntityService.delete(id)\n      showSuccess(\'Удалено\')\n      fetchEntities()\n    } catch (error) {\n      showError(\'Ошибка удаления\')\n    }\n  }, [fetchEntities, showError, showSuccess])\n\n  return {\n    entities,\n    loading,\n    page,\n    setPage,\n    totalPages,\n    search,\n    setSearch,\n    filter,\n    setFilter,\n    modalOpened,\n    editingEntity,\n    saving,\n    openCreate,\n    openEdit,\n    closeModal,\n    handleSave,\n    handleDelete,\n    refresh: fetchEntities,\n  }\n}\n```\n\n### 5.2 Существующие хуки\n\n| Хук | Назначение |\n|-----|------------|\n| `useTagList` | Управление списком тегов |\n| `useCourseList` | Управление списком курсов |\n| `useLessonList` | Управление списком уроков |\n| `useUserList` | Управление списком пользователей |\n| `useNotification` | Уведомления (toast) |\n| `useConfirm` | Диалоги подтверждения |\n| `usePagination` | Логика пагинации |\n| `useTable` | Логика таблиц с сортировкой |\n\n---\n\n## 6. Модальные окна\n\n### 6.1 Структура модального окна\n\n```tsx\n// src/components/modals/EntityModal.tsx\nimport { useEffect } from \'react\'\nimport { Modal, Stack, TextInput, Group, Button } from \'@mantine/core\'\nimport { useForm, Controller } from \'react-hook-form\'\nimport { zodResolver } from \'@hookform/resolvers/zod\'\nimport { z } from \'zod\'\nimport type { Entity } from \'@/types\'\n\n// Схема валидации\nconst EntitySchema = z.object({\n  name: z.string().min(2, \'Минимум 2 символа\').max(100, \'Максимум 100 символов\'),\n  description: z.string().max(500).optional(),\n})\n\ntype EntityFormData = z.infer<typeof EntitySchema>\n\ninterface EntityModalProps {\n  opened: boolean\n  onClose: () => void\n  entity: Entity | null\n  onSave: (data: EntityFormData) => Promise<void>\n  loading?: boolean\n}\n\nexport function EntityModal({ opened, onClose, entity, onSave, loading }: EntityModalProps) {\n  const {\n    register,\n    handleSubmit,\n    formState: { errors },\n    control,\n    reset,\n    setValue,\n  } = useForm<EntityFormData>({\n    resolver: zodResolver(EntitySchema),\n    defaultValues: {\n      name: \'\',\n      description: \'\',\n    },\n  })\n\n  // Сброс формы при открытии\n  useEffect(() => {\n    if (opened) {\n      reset({\n        name: entity?.name || \'\',\n        description: entity?.description || \'\',\n      })\n    }\n  }, [opened, entity, reset])\n\n  return (\n    <Modal\n      opened={opened}\n      onClose={onClose}\n      title={entity ? \'Редактировать\' : \'Создать\'}\n      size=\"md\"\n    >\n      <form onSubmit={handleSubmit(onSave)}>\n        <Stack gap=\"md\">\n          <TextInput\n            label=\"Название\"\n            required\n            {...register(\'name\')}\n            error={errors.name?.message}\n          />\n          <Group justify=\"flex-end\" mt=\"md\">\n            <Button variant=\"subtle\" onClick={onClose}>Отмена</Button>\n            <Button type=\"submit\" loading={loading}>\n              {entity ? \'Сохранить\' : \'Создать\'}\n            </Button>\n          </Group>\n        </Stack>\n      </form>\n    </Modal>\n  )\n}\n```\n\n### 6.2 Существующие модальные окна\n\n| Модальное окно | Назначение |\n|----------------|------------|\n| `TagModal` | Создание/редактирование тега |\n| `CourseModal` | Создание/редактирование курса |\n| `LessonModal` | Создание/редактирование урока |\n| `UserModal` | Редактирование пользователя |\n\n---\n\n## 7. Сервисы API\n\n### 7.1 Структура сервиса\n\n```typescript\n// src/services/entity.service.ts\nimport { api } from \'./api\'\nimport type { Entity, EntityInput, PaginatedResponse } from \'@/types\'\n\nexport const EntityService = {\n  // === ПУБЛИЧНЫЕ ===\n\n  /**\n   * Получить список\n   */\n  getAll: (params?: { page?: number; limit?: number; search?: string }) =>\n    api.get<PaginatedResponse<Entity>>(\'/entities\', params),\n\n  /**\n   * Получить по ID\n   */\n  getById: (id: string) =>\n    api.get<Entity>(`/entities/${id}`),\n\n  // === АДМИН ===\n\n  /**\n   * Создать\n   */\n  create: (data: EntityInput) =>\n    api.post<Entity>(\'/admin/entities\', data),\n\n  /**\n   * Обновить\n   */\n  update: (id: string, data: Partial<EntityInput>) =>\n    api.patch<Entity>(`/admin/entities/${id}`, data),\n\n  /**\n   * Удалить\n   */\n  delete: (id: string) =>\n    api.delete(`/admin/entities/${id}`),\n\n  /**\n   * Получить список (админ)\n   */\n  getAdmin: (params?: { page?: number; limit?: number; search?: string }) =>\n    api.get<PaginatedResponse<Entity>>(\'/admin/entities\', params),\n}\n```\n\n### 7.2 Базовый API класс\n\n```typescript\n// src/services/api.ts\nconst API_BASE = import.meta.env.PROD \n  ? (import.meta.env.VITE_API_URL || \'https://api.economikus.ru/api\')\n  : \'/api\'\n\nexport const api = {\n  get: <T>(url: string, params?: Record<string, unknown>) =>\n    fetch(`${API_BASE}${url}?${new URLSearchParams(params as Record<string, string>)}`, {\n      credentials: \'include\',\n    }).then(res => res.json()) as Promise<T>,\n\n  post: <T>(url: string, data?: unknown) =>\n    fetch(`${API_BASE}${url}`, {\n      method: \'POST\',\n      headers: { \'Content-Type\': \'application/json\' },\n      credentials: \'include\',\n      body: JSON.stringify(data),\n    }).then(res => res.json()) as Promise<T>,\n\n  patch: <T>(url: string, data?: unknown) =>\n    fetch(`${API_BASE}${url}`, {\n      method: \'PATCH\',\n      headers: { \'Content-Type\': \'application/json\' },\n      credentials: \'include\',\n      body: JSON.stringify(data),\n    }).then(res => res.json()) as Promise<T>,\n\n  delete: (url: string) =>\n    fetch(`${API_BASE}${url}`, {\n      method: \'DELETE\',\n      credentials: \'include\',\n    }),\n}\n```\n\n---\n\n## 8. Константы и типы\n\n### 8.1 Структура констант\n\n```typescript\n// src/constants/status.ts\nexport const STATUS_COLORS = {\n  course: {\n    DRAFT: \'gray\',\n    PUBLISHED: \'green\',\n    ARCHIVED: \'red\',\n  },\n  lesson: {\n    DRAFT: \'gray\',\n    PUBLISHED: \'green\',\n    ARCHIVED: \'red\',\n  },\n}\n\nexport const STATUS_LABELS = {\n  course: {\n    DRAFT: \'Черновик\',\n    PUBLISHED: \'Опубликован\',\n    ARCHIVED: \'Архив\',\n  },\n  lesson: {\n    DRAFT: \'Черновик\',\n    PUBLISHED: \'Опубликован\',\n    ARCHIVED: \'Архив\',\n  },\n}\n\n// src/constants/roles.ts\nexport const ROLE_COLORS = {\n  USER: \'gray\',\n  AUTHOR: \'blue\',\n  ADMIN: \'red\',\n}\n\nexport const ROLE_LABELS = {\n  USER: \'Пользователь\',\n  AUTHOR: \'Автор\',\n  ADMIN: \'Администратор\',\n}\n```\n\n### 8.2 Структура типов\n\n```typescript\n// src/types/entity.ts\nexport interface Entity {\n  id: string\n  name: string\n  description?: string\n  createdAt?: string\n}\n\nexport interface EntityInput {\n  name: string\n  description?: string\n}\n\n// src/types/api.ts\nexport interface PaginatedResponse<T> {\n  items: T[]\n  pagination: {\n    page: number\n    limit: number\n    total: number\n    totalPages: number\n  }\n}\n```\n\n---\n\n## 9. Правила рефакторинга страниц\n\n### 9.1 Шаги рефакторинга\n\n1. **Создать типы** (если отсутствуют)\n   - `src/types/entity.ts` — интерфейсы Entity, EntityInput\n   - Экспортировать в `src/types/index.ts`\n\n2. **Создать сервис** (если отсутствует)\n   - `src/services/entity.service.ts` — CRUD методы\n   - Экспортировать в `src/services/index.ts`\n\n3. **Создать хук**\n   - `src/hooks/useEntityList.ts` — логика списка с CRUD\n   - Экспортировать в `src/hooks/index.ts`\n\n4. **Создать модальное окно**\n   - `src/components/modals/EntityModal.tsx` — форма создания/редактирования\n   - Экспортировать в `src/components/modals/index.ts`\n\n5. **Обновить страницу**\n   - Импортировать хук, модалку, компоненты\n   - Удалить локальное состояние и логику\n   - Использовать ConfirmDialog вместо confirm()\n\n### 9.2 Шаблон страницы\n\n```tsx\n// src/pages/admin/AdminEntities.tsx\nimport { useState } from \'react\'\nimport { Box, Button, Card, Group, Text, Table, TextInput, Select, Pagination, ActionIcon, Menu, Skeleton, Alert, Stack, Badge } from \'@mantine/core\'\nimport { Plus, Search, MoreVertical, Pencil, Trash2 } from \'lucide-react\'\nimport { EntityModal } from \'@/components/modals\'\nimport { StatusBadge, ConfirmDialog } from \'@/components/common\'\nimport { useEntityList } from \'@/hooks\'\nimport { STATUS_LABELS } from \'@/constants\'\nimport type { EntityInput } from \'@/types\'\n\nexport function AdminEntities() {\n  const {\n    entities,\n    loading,\n    page,\n    setPage,\n    totalPages,\n    search,\n    setSearch,\n    filter,\n    setFilter,\n    modalOpened,\n    editingEntity,\n    saving,\n    openCreate,\n    openEdit,\n    closeModal,\n    handleSave,\n    handleDelete,\n  } = useEntityList()\n\n  // Диалог подтверждения\n  const [deleteConfirm, setDeleteConfirm] = useState({\n    opened: false,\n    id: null as string | null,\n    name: \'\',\n  })\n\n  const confirmDelete = (entity: { id: string; name: string }) => {\n    setDeleteConfirm({ opened: true, id: entity.id, name: entity.name })\n  }\n\n  const executeDelete = async () => {\n    if (deleteConfirm.id) {\n      await handleDelete(deleteConfirm.id)\n      setDeleteConfirm({ opened: false, id: null, name: \'\' })\n    }\n  }\n\n  const onSave = async (data: EntityInput) => {\n    await handleSave(data)\n  }\n\n  return (\n    <Box>\n      {/* Header */}\n      <Group justify=\"space-between\" mb=\"lg\">\n        <Text size=\"xl\" fw={700}>Сущности</Text>\n        <Button leftSection={<Plus size={16} />} onClick={openCreate}>\n          Создать\n        </Button>\n      </Group>\n\n      {/* Filters */}\n      <Card shadow=\"xs\" padding=\"md\" radius=\"md\" withBorder mb=\"lg\">\n        <Group>\n          <TextInput\n            placeholder=\"Поиск...\"\n            leftSection={<Search size={16} />}\n            value={search}\n            onChange={(e) => setSearch(e.target.value)}\n            style={{ flex: 1 }}\n          />\n          <Select\n            placeholder=\"Фильтр\"\n            data={[{ value: \'\', label: \'Все\' }]}\n            value={filter}\n            onChange={(v) => setFilter(v || null)}\n            clearable\n            w={180}\n          />\n        </Group>\n      </Card>\n\n      {/* Table */}\n      {loading ? (\n        <Stack gap=\"sm\">\n          {[...Array(5)].map((_, i) => <Skeleton key={i} height={60} radius=\"md\" />)}\n        </Stack>\n      ) : entities.length === 0 ? (\n        <Alert color=\"gray\">Не найдено</Alert>\n      ) : (\n        <Card shadow=\"xs\" padding={0} radius=\"md\" withBorder>\n          <Table striped highlightOnHover>\n            <Table.Thead>\n              <Table.Tr>\n                <Table.Th>Название</Table.Th>\n                <Table.Th>Статус</Table.Th>\n                <Table.Th></Table.Th>\n              </Table.Tr>\n            </Table.Thead>\n            <Table.Tbody>\n              {entities.map((entity) => (\n                <Table.Tr key={entity.id}>\n                  <Table.Td>\n                    <Text fw={500}>{entity.name}</Text>\n                  </Table.Td>\n                  <Table.Td>\n                    <StatusBadge status={entity.status} type=\"content\" />\n                  </Table.Td>\n                  <Table.Td>\n                    <Menu>\n                      <Menu.Target>\n                        <ActionIcon variant=\"subtle\">\n                          <MoreVertical size={16} />\n                        </ActionIcon>\n                      </Menu.Target>\n                      <Menu.Dropdown>\n                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEdit(entity)}>\n                          Редактировать\n                        </Menu.Item>\n                        <Menu.Item color=\"red\" leftSection={<Trash2 size={14} />} onClick={() => confirmDelete({ id: entity.id, name: entity.name })}>\n                          Удалить\n                        </Menu.Item>\n                      </Menu.Dropdown>\n                    </Menu>\n                  </Table.Td>\n                </Table.Tr>\n              ))}\n            </Table.Tbody>\n          </Table>\n        </Card>\n      )}\n\n      {/* Pagination */}\n      {totalPages > 1 && (\n        <Group justify=\"center\" mt=\"lg\">\n          <Pagination total={totalPages} value={page} onChange={setPage} />\n        </Group>\n      )}\n\n      {/* Modal */}\n      <EntityModal\n        opened={modalOpened}\n        onClose={closeModal}\n        entity={editingEntity}\n        onSave={onSave}\n        loading={saving}\n      />\n\n      {/* Confirm Dialog */}\n      <ConfirmDialog\n        opened={deleteConfirm.opened}\n        onClose={() => setDeleteConfirm({ opened: false, id: null, name: \'\' })}\n        onConfirm={executeDelete}\n        title=\"Удалить?\"\n        message={`\"${deleteConfirm.name}\" будет удалено. Это действие нельзя отменить.`}\n        confirmLabel=\"Удалить\"\n        color=\"red\"\n      />\n    </Box>\n  )\n}\n```\n\n### 9.3 Чеклист рефакторинга\n\n- [ ] Типы созданы и экспортированы\n- [ ] Сервис создан и экспортирован\n- [ ] Хук создан и экспортирован\n- [ ] Модальное окно создано и экспортировано\n- [ ] Страница обновлена\n- [ ] ConfirmDialog используется вместо confirm()\n- [ ] StatusBadge/RoleBadge используются вместо локальных мап\n- [ ] TypeScript компиляция без ошибок\n- [ ] Линтер без ошибок\n\n---\n\n## 10. Чеклист для новых фич\n\n### 10.1 Перед началом\n\n- [ ] Проанализированы существующие компоненты/хуки\n- [ ] Определена необходимость новых абстракций\n- [ ] Согласована структура с командой\n\n### 10.2 Разработка\n\n- [ ] Типы в `src/types/`\n- [ ] Константы в `src/constants/`\n- [ ] Сервис в `src/services/`\n- [ ] Хук в `src/hooks/`\n- [ ] Компоненты в `src/components/`\n- [ ] Страница в `src/pages/`\n\n### 10.3 Проверка\n\n- [ ] `npm run build` — без ошибок\n- [ ] `npm run lint` — без ошибок (warnings допустимы)\n- [ ] `npx tsc --noEmit` — без ошибок\n- [ ] Код отформатирован (Prettier)\n\n### 10.4 Документация\n\n- [ ] JSDoc комментарии для публичных функций\n- [ ] Обновлена TECHNICAL_DOCUMENTATION.md (если нужно)\n- [ ] Обновлен REFACTORING_PLAN.md (если нужно)\n\n---\n\n## Приложение А: Существующие компоненты\n\n### Переиспользуемые компоненты\n\n| Категория | Компонент | Файл |\n|-----------|-----------|------|\n| Common | StatusBadge | `components/common/StatusBadge.tsx` |\n| Common | RoleBadge | `components/common/RoleBadge.tsx` |\n| Common | LoadingState | `components/common/LoadingState.tsx` |\n| Common | EmptyState | `components/common/EmptyState.tsx` |\n| Common | ErrorState | `components/common/ErrorState.tsx` |\n| Common | ConfirmDialog | `components/common/ConfirmDialog.tsx` |\n| Common | ColorIndicator | `components/common/ColorIndicator.tsx` |\n| Common | AvatarUploader | `components/common/AvatarUploader.tsx` |\n| Auth | ProtectedRoute | `components/auth/ProtectedRoute.tsx` |\n| Modals | TagModal | `components/modals/TagModal.tsx` |\n| Modals | CourseModal | `components/modals/CourseModal.tsx` |\n| Modals | LessonModal | `components/modals/LessonModal.tsx` |\n| Modals | UserModal | `components/modals/UserModal.tsx` |\n| Tables | DataTable | `components/tables/DataTable.tsx` |\n| Tables | TableFilters | `components/tables/TableFilters.tsx` |\n| Cards | StatCard | `components/cards/StatCard.tsx` |\n\n### Хуки\n\n| Хук | Файл | Назначение |\n|-----|------|------------|\n| useAuth | `hooks/useAuth.ts` | Авторизация |\n| useNotification | `hooks/useNotification.ts` | Уведомления |\n| useConfirm | `hooks/useConfirm.ts` | Диалоги подтверждения |\n| usePagination | `hooks/usePagination.ts` | Пагинация |\n| useTable | `hooks/useTable.ts` | Таблицы |\n| useTagList | `hooks/useTagList.ts` | Теги |\n| useCourseList | `hooks/useCourseList.ts` | Курсы |\n| useLessonList | `hooks/useLessonList.ts` | Уроки |\n| useUserList | `hooks/useUserList.ts` | Пользователи |\n| useAvatarUpload | `hooks/useAvatarUpload.ts` | Загрузка аватара |\n\n### Сервисы\n\n| Сервис | Файл | Назначение |\n|--------|------|------------|\n| api | `services/api.ts` | Базовый API |\n| AuthService | `services/auth.service.ts` | Авторизация |\n| UserService | `services/user.service.ts` | Пользователи |\n| CourseService | `services/course.service.ts` | Курсы |\n| LessonService | `services/lesson.service.ts` | Уроки |\n| TagService | `services/tag.service.ts` | Теги |\n| ApplicationService | `services/application.service.ts` | Заявки |\n\n---\n\n## Приложение Б: Статус рефакторинга\n\n### Выполнено ✅\n\n#### Админ-страницы\n\n| Страница | Хук | Модалка | Компоненты |\n|----------|-----|---------|------------|\n| AdminDashboard | — | — | StatCard |\n| AdminTags | useTagList | TagModal | ColorIndicator, ConfirmDialog |\n| AdminCourses | useCourseList | CourseModal | StatusBadge, ConfirmDialog |\n| AdminLessons | useLessonList | LessonModal | StatusBadge, ConfirmDialog |\n| AdminUsers | useUserList | UserModal | RoleBadge, ConfirmDialog |\n\n#### Защита роутов\n\n| Компонент | Назначение |\n|-----------|------------|\n| ProtectedRoute | Защита роутов с проверкой авторизации и ролей |\n\n#### Профиль пользователя\n\n| Компонент | Назначение |\n|-----------|------------|\n| ProfileSettingsPage | Рефакторинг с AvatarUploader |\n| AvatarUploader | Загрузка и удаление аватара |\n| useAvatarUpload | Хук для загрузки аватара |\n\n#### Бэкенд endpoints\n\n| Endpoint | Метод | Назначение |\n|----------|-------|------------|\n| `/user/password` | PATCH | Смена пароля |\n| `/user/avatar` | POST | Загрузка аватара |\n| `/user/avatar` | DELETE | Удаление аватара |\n\n### В процессе 🔲\n\n| Страница | Статус |\n|----------|--------|\n| AdminModeration | Требует отдельного подхода (модерация контента) |\n| AdminApplications | Требует отдельного подхода (заявки авторов) |\n| LoginPage | Рефакторинг с useAuthForm |\n| RegisterPage | Рефакторинг с useAuthForm |\n| BecomeAuthorPage | Рефакторинг |\n\n---\n\n## 11. Тестирование API\n\n### 11.1 Обязательные проверки\n\nПри создании новых API endpoints **обязательно** проводить тестирование:\n\n1. **Проверка авторизации**\n   - Запрос без авторизации должен возвращать `401 Unauthorized`\n   - Запрос с авторизацией должен возвращать данные\n\n2. **Проверка прав доступа**\n   - Запрос с недостаточными правами должен возвращать `403 Forbidden`\n\n3. **Проверка валидации**\n   - Невалидные данные должны возвращать `400 Bad Request`\n   - Проверить граничные случаи\n\n4. **Проверка существования данных**\n   - Запрос к несуществующему ресурсу должен возвращать `404 Not Found`\n\n### 11.2 Пример тестирования\n\n```powershell\n# Проверка без авторизации (должен вернуть 401)\nInvoke-RestMethod -Uri \"http://localhost:3000/api/author/analytics\" -Method Get\n\n# Проверка Swagger документации\nInvoke-WebRequest -Uri \"http://localhost:3000/api/swagger\" -UseBasicParsing\n\n# Проверка OpenAPI spec\nInvoke-RestMethod -Uri \"http://localhost:3000/api/doc\" -Method Get\n```\n\n### 11.3 Добавление в Swagger\n\nПосле тестирования endpoint **обязательно** добавить документацию в OpenAPI:\n\n1. Открыть `server/index.ts`\n2. Найти секцию `paths` в `/api/doc` endpoint\n3. Добавить описание endpoint с параметрами и responses\n\nПример:\n```typescript\n\'/author/analytics\': {\n  get: {\n    tags: [\'Author\'],\n    summary: \'Детальная аналитика автора\',\n    description: \'Возвращает расширенную статистику\',\n    responses: {\n      \'200\': { description: \'Детальная аналитика\' },\n      \'401\': { description: \'Не авторизован\' },\n      \'403\': { description: \'Доступ только для авторов\' }\n    }\n  }\n}\n```\n\n### 11.4 Чеклист тестирования API\n\n- [ ] Endpoint доступен по правильному URL\n- [ ] Возвращает правильный HTTP статус\n- [ ] Возвращает правильный формат данных (JSON)\n- [ ] Обрабатывает ошибки корректно\n- [ ] Документация добавлена в Swagger\n- [ ] Документация обновлена в TECHNICAL_DOCUMENTATION_4.md\n\n---\n\n*Документ создан: Январь 2025*\n*Версия: 1.1*\n*Обновлено: Добавлен раздел 11 - Тестирование API*\n', 3330, 17, '2026-03-20 06:54:34.006', '2026-03-20 06:55:01.411');

-- --------------------------------------------------------

--
-- Структура таблицы `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscription_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RUB',
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `course_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_payment_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_response` json DEFAULT NULL,
  `refunded_at` datetime(3) DEFAULT NULL,
  `refund_amount` double DEFAULT NULL,
  `refund_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `completed_at` datetime(3) DEFAULT NULL,
  `failed_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `profile_id`, `subscription_id`, `type`, `amount`, `currency`, `status`, `course_id`, `payment_method_id`, `provider`, `provider_payment_id`, `provider_response`, `refunded_at`, `refund_amount`, `refund_reason`, `created_at`, `updated_at`, `completed_at`, `failed_at`) VALUES
('0bb5e390-01b9-4583-9d4f-0230fd8c9422', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'eef69ccb-2f32-4897-9e71-015ffc869aca', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1775471503281', NULL, NULL, NULL, NULL, '2026-04-06 10:31:43.282', '2026-04-06 10:31:43.282', NULL, NULL),
('0e33378e-33df-4b04-9bd9-5775c793d2df', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '3bffa915-fcbd-472f-9d58-4c7893d2c04f', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1776142256272', NULL, NULL, NULL, NULL, '2026-04-14 04:50:56.273', '2026-04-14 04:50:56.273', NULL, NULL),
('1a9ad381-9cdb-4baa-bead-b10541c932d0', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'eac611f1-4ac3-4110-b0ca-cf4ce1763cc7', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1775470991557', NULL, NULL, NULL, NULL, '2026-04-06 10:23:11.558', '2026-04-06 10:23:11.558', NULL, NULL),
('26cc1927-5ba7-4e6b-b4dd-68eeb535a7b8', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '65469941-9e88-4121-9fed-f5f00b3ea1fe', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1775471232699', NULL, NULL, NULL, NULL, '2026-04-06 10:27:12.701', '2026-04-06 10:27:12.701', NULL, NULL),
('44f58f47-6255-4133-9590-8f6b53e71cef', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '6f17641a-e4a9-4560-8811-3e7c02f19719', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1776142223261', NULL, NULL, NULL, NULL, '2026-04-14 04:50:23.262', '2026-04-14 04:50:23.262', NULL, NULL),
('457c9420-8e5b-402d-9fec-7315ad3b133a', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '65469941-9e88-4121-9fed-f5f00b3ea1fe', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1775471167178', NULL, NULL, NULL, NULL, '2026-04-06 10:26:07.179', '2026-04-06 10:26:07.179', NULL, NULL),
('754a4f34-4560-4568-ba1d-cf8a561d0f16', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '0468a22c-f351-43ce-b7e8-52c6290b0af6', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1775471505736', NULL, NULL, NULL, NULL, '2026-04-06 10:31:45.737', '2026-04-06 10:31:45.737', NULL, NULL),
('8d00c130-a82c-472b-a1c8-e91283b5c865', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '6f17641a-e4a9-4560-8811-3e7c02f19719', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1775471522533', NULL, NULL, NULL, NULL, '2026-04-06 10:32:02.534', '2026-04-06 10:32:02.534', NULL, NULL),
('995c5825-f431-41bb-88b3-161e7e8acee0', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '3bffa915-fcbd-472f-9d58-4c7893d2c04f', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1776142226023', NULL, NULL, NULL, NULL, '2026-04-14 04:50:26.024', '2026-04-14 04:50:26.024', NULL, NULL),
('b7187fe8-5511-414c-ab19-8b4ebdcf1d3a', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', '0468a22c-f351-43ce-b7e8-52c6290b0af6', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1775471520527', NULL, NULL, NULL, NULL, '2026-04-06 10:32:00.529', '2026-04-06 10:32:00.529', NULL, NULL),
('bd4e87d7-6156-4b58-b7bc-7f3dfbea0a79', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd9cce818-9815-45ad-a17e-7ec145cf975e', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1775471149324', NULL, NULL, NULL, NULL, '2026-04-06 10:25:49.325', '2026-04-06 10:25:49.325', NULL, NULL),
('bd6a4217-8c37-42f3-9b1e-1e3dd51008bd', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'eef69ccb-2f32-4897-9e71-015ffc869aca', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1775471459419', NULL, NULL, NULL, NULL, '2026-04-06 10:30:59.420', '2026-04-06 10:30:59.420', NULL, NULL),
('c7b6d6ea-e284-4c78-b16f-ff230e90132f', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'd9cce818-9815-45ad-a17e-7ec145cf975e', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1775471164001', NULL, NULL, NULL, NULL, '2026-04-06 10:26:04.003', '2026-04-06 10:26:04.003', NULL, NULL),
('ed453e03-34c5-4512-9a4f-e4babd0baf3b', '6eb49f6e-5b0d-4356-9cf0-9f67f5b56173', 'eac611f1-4ac3-4110-b0ca-cf4ce1763cc7', 'REFUND', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'refund_1775471010324', NULL, NULL, NULL, NULL, '2026-04-06 10:23:30.325', '2026-04-06 10:23:30.325', NULL, NULL),
('fb911753-6183-4841-9003-8b29f752c4ca', 'e68c2c00-4a04-4400-8fde-d27d8c349b67', 'd078871c-876e-4fa2-983c-11fba0615dbb', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1774358074001', NULL, NULL, NULL, NULL, '2026-03-24 13:14:34.005', '2026-03-24 13:14:34.005', NULL, NULL),
('fd805dbb-241e-4c42-8e62-2137e1237fbc', 'af1383d1-5e50-47a7-833e-26e85c62afae', '231c46d8-e1a7-43e8-b460-a74a43e0d376', 'SUBSCRIPTION_PAYMENT', 299, 'RUB', 'COMPLETED', NULL, NULL, 'test_provider', 'test_1775390385754', NULL, NULL, NULL, NULL, '2026-04-05 11:59:45.755', '2026-04-05 11:59:45.755', NULL, NULL),
('pp0e8400-e29b-41d4-a716-446655441401', '660e8400-e29b-41d4-a716-446655440104', 'oo0e8400-e29b-41d4-a716-446655441301', 'subscription_payment', 499, 'RUB', 'COMPLETED', NULL, 'nn0e8400-e29b-41d4-a716-446655441201', 'yookassa', 'yoo_pay_abc123', NULL, NULL, NULL, NULL, '2026-02-15 10:00:00.000', '2026-03-13 11:16:28.142', NULL, NULL),
('pp0e8400-e29b-41d4-a716-446655441402', '660e8400-e29b-41d4-a716-446655440103', 'oo0e8400-e29b-41d4-a716-446655441302', 'subscription_payment', 3990, 'RUB', 'COMPLETED', NULL, 'nn0e8400-e29b-41d4-a716-446655441202', 'cloudpayments', 'cp_pay_xyz789', NULL, NULL, NULL, NULL, '2026-01-01 00:00:00.000', '2026-03-13 11:16:28.142', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','AUTHOR','MODERATOR','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `email_verified` datetime(3) DEFAULT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT '0',
  `blocked_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
('45f14a8c-2170-4bcd-a8e5-153fc6ec63fd', 'api_test@test.ru', 'API', 'Test', '$2b$10$AxSV8JeWAGIogcNw6444MuCPCQxlxbzDZAZXufnkeEjzQ.3aukCgi', 'ADMIN', '2026-03-15 13:24:35.434', 0, NULL, '2026-04-23 13:19:00.030', '2026-03-15 13:24:35.438', '2026-04-23 13:19:00.031', NULL),
('460a3072-e8a7-4d02-804a-b36748de7d7d', 'ron2@ron.com', 'иван', 'Петров', '$2b$12$X0cpLV3U1lbt4t5DQBHSjObJ.KdI.dfDgtLf/OTb4H.wE8qqZNAea', 'AUTHOR', '2026-04-14 03:09:13.440', 0, NULL, '2026-04-14 03:10:22.950', '2026-04-14 03:09:13.441', '2026-04-14 04:54:35.459', NULL),
('550e8400-e29b-41d4-a716-446655440001', 'admin@economikus.ru', 'Админ', 'Системный', NULL, 'ADMIN', '2026-01-01 10:00:00.000', 0, NULL, NULL, '2026-01-01 10:00:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'anna@author.ru', 'Анна', 'Петрова', NULL, 'AUTHOR', '2026-01-15 12:30:00.000', 0, NULL, NULL, '2026-01-15 12:30:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'ivan@user.ru', 'Иван', 'Сидоров', NULL, 'USER', '2026-02-01 09:15:00.000', 0, NULL, NULL, '2026-02-01 09:15:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440004', 'maria@learner.ru', 'Мария', 'Козлова', NULL, 'USER', '2026-02-10 14:20:00.000', 0, NULL, NULL, '2026-02-10 14:20:00.000', '2026-03-13 11:16:27.249', NULL),
('550e8400-e29b-41d4-a716-446655440005', 'mod@economikus.ru', 'Модер', 'Проверкин', NULL, 'MODERATOR', '2026-01-05 11:00:00.000', 0, NULL, NULL, '2026-01-05 11:00:00.000', '2026-03-13 11:16:27.249', NULL),
('9c406b56-4804-4d86-b612-a11c10826b06', 'test6@test.com', 'New', 'User', '$2b$12$.b5hR6KNeSTflbjqeCxlmuzjWWNKa9lpERoqte72X.ef0c3z1n8R.', 'USER', '2026-03-13 16:21:20.719', 0, NULL, '2026-03-13 16:22:34.894', '2026-03-13 16:21:20.722', '2026-03-13 16:22:34.896', NULL),
('abd55251-2f17-44b1-a0e3-5dac3e418aad', 'petrov2@tge.ru', 'иван', 'Adminov', '$2b$12$M1KgYuS4X.UJiN8AJe46ZeAsJoosBFTFJcTbo68UPKEKA91yHkb8S', 'AUTHOR', '2026-03-15 12:37:39.439', 0, NULL, '2026-04-10 13:02:11.046', '2026-03-15 12:37:39.441', '2026-04-10 13:02:11.047', NULL),
('e0ffdb0a-e7cd-4829-afb5-9da9b510bf33', 'petrov@tge.ru', 'иван', 'авыпуквп', '$2b$10$CuVz5L11qXlrN29/wKkmO.vgPRPIkgTRr.W4aCD1EyoigRQYBPtdW', 'AUTHOR', '2026-03-15 12:28:23.959', 0, NULL, '2026-04-13 12:29:07.688', '2026-03-15 12:28:23.963', '2026-04-13 12:29:07.689', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `VerificationToken`
--

CREATE TABLE `VerificationToken` (
  `identifier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `video_content_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` enum('YOUTUBE','RUTUBE','VIMEO','LOCAL') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'YOUTUBE',
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
('724f744a-3732-11f1-a8d2-1278a1aee829', '724c59f0-3732-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=smart-fin-goals', 'YOUTUBE', 720, NULL, NULL, '2026-04-13 12:15:23.089', '2026-04-13 12:15:23.089'),
('72572274-3732-11f1-a8d2-1278a1aee829', '7254c715-3732-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=antifraud-tips', 'YOUTUBE', 840, NULL, NULL, '2026-04-13 12:15:23.140', '2026-04-13 12:15:23.140'),
('725e564d-3732-11f1-a8d2-1278a1aee829', '725d1543-3732-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=stocks-basics', 'YOUTUBE', 900, NULL, NULL, '2026-04-13 12:15:23.187', '2026-04-13 12:15:23.187'),
('726a9011-3732-11f1-a8d2-1278a1aee829', '72685fe7-3732-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=nalog-lk-instruction', 'YOUTUBE', 720, NULL, NULL, '2026-04-13 12:15:23.267', '2026-04-13 12:15:23.267'),
('bb0e8400-e29b-41d4-a716-446655440601', 'aa0e8400-e29b-41d4-a716-446655440501', 'https://youtube.com/watch?v=macro_gdp_101', 'YOUTUBE', 720, '[\"360p\", \"720p\", \"1080p\"]', '[{\"url\": \"https://cdn.economikus.ru/subs/gdp_ru.vtt\", \"lang\": \"ru\"}]', '2026-01-20 10:00:00.000', '2026-03-13 11:16:27.569'),
('bb0e8400-e29b-41d4-a716-446655440602', 'aa0e8400-e29b-41d4-a716-446655440505', 'https://cdn.economikus.ru/videos/risk_return.mp4', 'LOCAL', 840, '[\"720p\", \"1080p\"]', '[{\"url\": \"https://cdn.economikus.ru/subs/risk_ru.vtt\", \"lang\": \"ru\"}]', '2026-02-01 12:00:00.000', '2026-03-13 11:16:27.569'),
('d5276fef-3733-11f1-a8d2-1278a1aee829', 'd525f441-3733-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=grace-period-secrets', 'YOUTUBE', 720, NULL, NULL, '2026-04-13 12:25:18.418', '2026-04-13 12:25:18.418'),
('d530c3f5-3733-11f1-a8d2-1278a1aee829', 'd52d03aa-3733-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=travel-insurance-guide', 'YOUTUBE', 600, NULL, NULL, '2026-04-13 12:25:18.479', '2026-04-13 12:25:18.479'),
('d53891bc-3733-11f1-a8d2-1278a1aee829', 'd53658e6-3733-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=money-talks-couples', 'YOUTUBE', 720, NULL, NULL, '2026-04-13 12:25:18.530', '2026-04-13 12:25:18.530'),
('d542cdb9-3733-11f1-a8d2-1278a1aee829', 'd53fb3db-3733-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=money-anxiety-fix', 'YOUTUBE', 900, NULL, NULL, '2026-04-13 12:25:18.597', '2026-04-13 12:25:18.597'),
('d54b2c1e-3733-11f1-a8d2-1278a1aee829', 'd548f97f-3733-11f1-a8d2-1278a1aee829', 'https://youtube.com/watch?v=moy-nalog-app-guide', 'YOUTUBE', 720, NULL, NULL, '2026-04-13 12:25:18.652', '2026-04-13 12:25:18.652');

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
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_profile_id` (`profile_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `account_deletion_requests_processed_by_fkey` (`processed_by`);

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
