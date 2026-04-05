// src/pages/legal/CookiesPage.tsx
import { Container, Title, Text, Stack, Divider, Paper, Anchor, Box, List, Group } from '@mantine/core'
import { GraduationCap, Cookie } from 'lucide-react'

export default function CookiesPage() {
 return (
<Container size="md" py="xl">
<Paper shadow="sm" radius="md" p="xl" withBorder>
<Stack gap="lg">
 {/* Заголовок */}
<Box>
<Title order={1} mb="xs">Политика использования cookies</Title>
<Text c="dimmed" size="sm">
 Редакция от {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
</Text>
</Box>

 {/* УЧЕБНЫЙ ДИСКЛЕЙМЕР */}
<Paper 
 p="md" 
 radius="md" 
 style={{ 
 backgroundColor: 'var(--mantine-color-blue-0)',
 borderLeft: '4px solid var(--mantine-color-blue-6)'
 }}
 >
<Group gap="xs" mb="xs">
<GraduationCap size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
<Text fw={600} c="blue.8">Учебный проект</Text>
</Group>
<Text size="sm" c="blue.9">
 Сайт является учебным (дипломным) проектом. Используются только технически 
 необходимые cookies. Аналитические и рекламные cookies не используются.
</Text>
</Paper>

<Divider />

 {/*1. Что такое cookies */}
<Stack gap="md">
<Title order={2}>1. Что такое cookies?</Title>
<Text>
 Cookies — это небольшие текстовые файлы, которые веб-сайт сохраняет на устройстве 
 пользователя (компьютере, планшете, смартфоне) для хранения данных о настройках, 
 предпочтениях и действиях пользователя.
</Text>
</Stack>

 {/*2. Какие cookies используются */}
<Stack gap="md">
<Title order={2}>2. Какие cookies используются на Сайте</Title>
<Text>
 На Сайте <Anchor href="https://economikus.ru" target="_blank">economikus.ru </Anchor> 
 используется <Text span fw={600}>ТОЛЬКО ОДНА</Text> технически необходимая cookie:
</Text>

<Paper p="md" radius="md" withBorder mt="md">
<Stack gap="sm">
<Group gap="xs">
<Cookie size={18} />
<Text fw={600}>session</Text>
</Group>
<Text size="sm">Идентификация сессии пользователя для аутентификации</Text>
<Group gap="lg" mt="xs">
<Text size="xs" c="dimmed">
<Text span fw={600}>Срок хранения:</Text>30 дней (или до выхода из системы)
</Text>
<Text size="xs" c="dimmed">
<Text span fw={600}>Атрибуты:</Text> HttpOnly, SameSite=Strict, Secure
</Text>
</Group>
</Stack>
</Paper>

<Text mt="md">
<Text span fw={600}>Важно:</Text> Эта cookie является строго необходимой для 
 функционирования Сайта (авторизация, сессии). Она не требует отдельного согласия 
 пользователя в соответствии с законодательством.
</Text>
</Stack>

 {/*3. Какие cookies НЕ используются */}
<Stack gap="md">
<Title order={2}>3. Какие cookies НЕ используются</Title>
<Text>В рамках учебного проекта НЕ используются следующие типы cookies:</Text>
<List spacing="xs" withPadding>
<List.Item>
<Text span fw={600}>Аналитические cookies</Text>
<Text size="sm" c="dimmed"> — Google Analytics, Яндекс.Метрика и аналоги</Text>
</List.Item>
<List.Item>
<Text span fw={600}>Рекламные cookies</Text>
<Text size="sm" c="dimmed"> — для таргетинга и ретаргетинга</Text>
</List.Item>
<List.Item>
<Text span fw={600}>Функциональные cookies</Text>
<Text size="sm" c="dimmed"> — для запоминания языковых предпочтений и настроек</Text>
</List.Item>
</List>
<Text>
 Если в будущем функционал Сайта будет расширен, информация об изменениях будет 
 опубликована в актуальной версии настоящей Политики.
</Text>
</Stack>

 {/*4. Управление cookies */}
<Stack gap="md">
<Title order={2}>4. Как управлять cookies</Title>
<Text>
 Большинство браузеров позволяют управлять cookies через настройки. Вы можете:
</Text>
<List spacing="xs" withPadding>
<List.Item>заблокировать все cookies;</List.Item>
<List.Item>удалить уже сохраненные cookies;</List.Item>
<List.Item>настроить уведомления перед сохранением cookies.</List.Item>
</List>
<Text>
 Однако отключение технически необходимых cookies (session) приведет к невозможности 
 входа в личный кабинет и использования большинства функций Сайта.
</Text>
<Text>Инструкции для популярных браузеров:</Text>
<List spacing="xs" withPadding>
<List.Item><Anchor href="https://support.google.com/chrome/answer/95647" target="_blank">Google Chrome</Anchor></List.Item>
<List.Item><Anchor href="https://support.mozilla.org/ru/kb/udalenie-kukov" target="_blank">Mozilla Firefox</Anchor></List.Item>
<List.Item><Anchor href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac" target="_blank">Safari</Anchor></List.Item>
<List.Item><Anchor href="https://support.microsoft.com/ru-ru/microsoft-edge/удаление-cookie-в-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">Microsoft Edge</Anchor></List.Item>
</List>
</Stack>

 {/*5. Изменения в Политике */}
<Stack gap="md">
<Title order={2}>5. Изменения в Политике использования cookies</Title>
<Text>
 Администрация оставляет за собой право вносить изменения в настоящую Политику 
 в любое время. Актуальная версия всегда доступна по адресу{' '}
<Anchor href="/cookies">/cookies</Anchor>.
</Text>
</Stack>

 {/*6. Контакты */}
<Stack gap="md">
<Title order={2}>6. Контактная информация</Title>
<Text>По всем вопросам, связанным с использованием cookies, вы можете обратиться:</Text>
<Text>
<Text component="span" fw={600}>Email:</Text>
<Anchor href="mailto:hello@economikus.ru">hello@economikus.ru</Anchor>
</Text>
</Stack>

<Divider my="lg" />

<Text size="sm" c="dimmed" ta="center">
 © {new Date().getFullYear()} Экономикус. Учебный (дипломный) проект. Все права защищены.
</Text>
</Stack>
</Paper>
</Container>
 )
}
