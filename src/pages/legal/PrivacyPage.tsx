// src/pages/legal/PrivacyPage.tsx
import { Container, Title, Text, Stack, Divider, Paper, Anchor, Box, List, Group } from '@mantine/core'
import { GraduationCap, Shield, Eye } from 'lucide-react'

export default function PrivacyPage() {
 return (
<Container size="md" py="xl">
<Paper shadow="sm" radius="md" p="xl" withBorder>
<Stack gap="lg">
 {/* Заголовок */}
<Box>
<Title order={1} mb="xs">Политика обработки персональных данных</Title>
<Text c="dimmed" size="sm">
 Редакция от {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
</Text>
</Box>

 {/* УЧЕБНЫЙ ДИСКЛЕЙМЕР */}
<Paper 
 p="md" 
 radius="md" 
 style={{ 
 backgroundColor: 'var(--mantine-color-yellow-0)',
 borderLeft: '4px solid var(--mantine-color-yellow-6)'
 }}
 >
<Group gap="xs" mb="xs">
<GraduationCap size={20} style={{ color: 'var(--mantine-color-yellow-7)' }} />
<Text fw={600} c="yellow.8">Учебный проект — важная информация</Text>
</Group>
<Text size="sm" c="yellow.9">
 Настоящий Сайт является учебным (дипломным) проектом и не осуществляет деятельность 
 оператора персональных данных в коммерческом смысле. Сбор, хранение и обработка 
 информации производятся исключительно в целях демонстрации функциональных возможностей 
 разработанной системы.
</Text>
</Paper>

<Divider />

 {/*1. Общие положения */}
<Stack gap="md">
<Title order={2}>1. Общие положения</Title>
<Text>
1.1. Настоящая Политика определяет подходы к обработке информации о пользователях 
 Сайта <Anchor href="https://economikus.ru" target="_blank">economikus.ru </Anchor>  
 (далее — «Сайт») в рамках учебного (дипломного) проекта.
</Text>
<Text>
1.2. Администрация Сайта не является оператором персональных данных в смысле 
 Федерального закона от  с поправками и изменениями от 2025 и еще не вступивших изменений от 1 марта 2027 года (Федеральный закон от 07.07.2025 № 200-ФЗ), поскольку 
 обработка данных не является основной деятельностью и осуществляется исключительно 
 в учебных целях.
</Text>
</Stack>

 {/*2. Какие данные собираются */}
<Stack gap="md">
<Title order={2}>2. Какие данные собираются (в демонстрационных целях)</Title>
<Text>
2.1. Для работы учебного проекта могут собираться следующие данные, вводимые 
 Пользователем добровольно:
</Text>
<List spacing="xs" withPadding>
<List.Item>
<Group gap="xs">
<Eye size={16} />
<Text fw={500}>Адрес электронной почты</Text>
</Group>
<Text size="sm" c="dimmed">— для входа в демо-режиме и идентификации пользователя.</Text>
</List.Item>
<List.Item>
<Group gap="xs">
<Eye size={16} />
<Text fw={500}>Имя и фамилия</Text>
</Group>
<Text size="sm" c="dimmed">— для отображения в профиле и на сертификатах (демо).</Text>
</List.Item>
<List.Item>
<Group gap="xs">
<Eye size={16} />
<Text fw={500}>Никнейм</Text>
</Group>
<Text size="sm" c="dimmed">— для публичного отображения на Сайте.</Text>
</List.Item>
<List.Item>
<Group gap="xs">
<Eye size={16} />
<Text fw={500}>Данные о прогрессе обучения</Text>
</Group>
<Text size="sm" c="dimmed">— для демонстрации функционала отслеживания.</Text>
</List.Item>
<List.Item>
<Group gap="xs">
<Eye size={16} />
<Text fw={500}>История просмотров и избранное</Text>
</Group>
<Text size="sm" c="dimmed">— для демонстрации персонализации.</Text>
</List.Item>
<List.Item>
<Group gap="xs">
<Eye size={16} />
<Text fw={500}>IP-адрес и User-Agent</Text>
</Group>
<Text size="sm" c="dimmed">— для аналитики работы платформы (хранятся в БД в таблице business_events - чисто проверка количественных показателей действий пользователей).</Text>
</List.Item>
</List>
<Text>
2.2.<Text span fw={600}>Важно:</Text> Все собираемые данные:
</Text>
<List spacing="xs" withPadding>
<List.Item>не передаются третьим лицам за пределами учебного проекта;</List.Item>
<List.Item>не используются для маркетинговых или коммерческих целей;</List.Item>
<List.Item>могут быть удалены в любой момент без возможности восстановления.</List.Item>
</List>

 {/* Технические логи сервера */}
<Text fw={600} mt="md">2.3. Технические логи сервера</Text>
<Text size="sm">
 Помимо данных, указанных выше, сервер автоматически ведёт технические логи для 
 обеспечения безопасности и анализа статистики посещений. Эти данные не позволяют 
 идентифицировать конкретного пользователя и используются исключительно в технических целях.
</Text>
<Paper 
 p="md" 
 radius="md" 
 style={{ 
 backgroundColor: 'var(--mantine-color-gray-0)',
 border: '1px solid var(--mantine-color-gray-2)'
 }}
>
<Stack gap="xs">
<Text size="sm" fw={500}>В технических логах фиксируются:</Text>
<List spacing="xs" size="sm">
<List.Item>IP-адрес посетителя (для определения региона и провайдера);</List.Item>
<List.Item>Дата и время обращения к серверу;</List.Item>
<List.Item>Тип браузера и операционной системы (из заголовка User-Agent);</List.Item>
<List.Item>Запрашиваемые страницы и ресурсы;</List.Item>
<List.Item>Статус выполнения запроса (коды ответа HTTP).</List.Item>
</List>
</Stack>
</Paper>

<Text size="sm" mt="sm">
 Для анализа статистики посещений используется <Text span fw={500}>AWStats</Text> — 
 открытый инструмент веб-аналитики, который обрабатывает данные логов сервера и формирует 
 статистические отчёты. AWStats работает локально на сервере и{' '}
 <Text span fw={600}>не передаёт данные третьим лицам</Text>. 
 Результаты анализа используются исключительно для оценки посещаемости Сайта и 
 выявления технических проблем.
</Text>
</Stack>

 {/*3. Цели обработки данных */}
<Stack gap="md">
<Title order={2}>3. Цели обработки данных</Title>
<Text>Обработка данных осуществляется исключительно в следующих целях:</Text>
<List spacing="xs" withPadding>
<List.Item>обеспечение функционирования Сайта в демонстрационном режиме;</List.Item>
<List.Item>идентификация пользователя при входе в систему;</List.Item>
<List.Item>отображение прогресса обучения и истории просмотров;</List.Item>
<List.Item>проведение тестирования функциональных возможностей платформы;</List.Item>
<List.Item>подготовка к защите дипломной работы.</List.Item>
</List>
</Stack>

 {/*4. Cookies */}
<Stack gap="md">
<Title order={2}>4. Использование cookies</Title>
<Text>
4.1. На Сайте используется техническая cookie <Text span fs="italic">session</Text>, 
 необходимая для идентификации пользователя в демонстрационном режиме. 
 Эта cookie хранит токен сессии и имеет атрибуты <Text span fs="italic">HttpOnly</Text> и <Text span fs="italic">SameSite=Strict</Text>.
</Text>
<Text>
4.2. Аналитические и рекламные cookies (Google Analytics, Яндекс.Метрика и аналоги) 
<Text span fw={600}> НЕ ИСПОЛЬЗУЮТСЯ</Text>, так как проект является учебным.
</Text>
<Text>
4.3. Подробная информация о cookies представлена на отдельной странице 
<Anchor href="/cookies"> «Политика использования cookies»</Anchor>.
</Text>
</Stack>

 {/*5. Передача данных третьим лицам */}
<Stack gap="md">
<Title order={2}>5. Передача данных третьим лицам</Title>
<Text>
5.1. В рамках учебного проекта данные пользователей <Text span fw={600}>НЕ ПЕРЕДАЮТСЯ</Text> третьим лицам, за исключением случаев, предусмотренных законодательством РФ.
</Text>
<Text>
5.2. Хостинг-провайдер и серверное оборудование расположены на территории РФ. 
 Администрация обеспечивает конфиденциальность данных при их хранении.
</Text>
</Stack>

 {/*6. Защита данных */}
<Stack gap="md">
<Title order={2}>6. Защита данных</Title>
<Text>Администрация принимает следующие меры для защиты данных:</Text>
<List spacing="xs" withPadding>
<List.Item>
<Group gap="xs">
<Shield size={16} />
<Text>хранение паролей в хешированном виде (bcrypt);</Text>
</Group>
</List.Item>
<List.Item>
<Group gap="xs">
<Shield size={16} />
<Text>использование HTTPS-соединения;</Text>
</Group>
</List.Item>
<List.Item>
<Group gap="xs">
<Shield size={16} />
<Text>использование HttpOnly cookies для сессий;</Text>
</Group>
</List.Item>
<List.Item>
<Group gap="xs">
<Shield size={16} />
<Text>разграничение прав доступа.</Text>
</Group>
</List.Item>
</List>
</Stack>

 {/*7. Права пользователей */}
<Stack gap="md">
<Title order={2}>7. Права пользователей</Title>
<Text>Пользователь имеет право:</Text>
<List spacing="xs" withPadding>
<List.Item>
 получить информацию о том, какие данные о нем хранятся (по запросу на{' '}
<Anchor href="mailto:hello@economikus.ru">hello@economikus.ru</Anchor>);
</List.Item>
<List.Item>изменить свои данные в настройках профиля;</List.Item>
<List.Item>
 удалить свою учетную запись через меню профиля, выбрав «Отказаться от условий использования»;
</List.Item>
<List.Item>отозвать согласие на обработку данных (что приведет к удалению учетной записи).</List.Item>
</List>
</Stack>

 {/*8. Удаление данных */}
<Stack gap="md">
<Title order={2}>8. Удаление данных</Title>
<Text>
8.1. Для удаления учетной записи пользователь должен:
</Text>
<Text component="ol" pl="lg">
<li>Войти в свой аккаунт на Сайте;</li>
<li>Открыть меню профиля (иконка пользователя в шапке сайта);</li>
<li>Выбрать пункт «Отказаться от условий использования»;</li>
<li>Подтвердить удаление в появившемся окне (при желании указать причину).</li>
</Text>
<Text>
8.2. После подачи заявки на удаление аккаунт будет обработан Администрацией. 
 При удалении безвозвратно удаляются: профиль пользователя, история обучения, 
 избранное, сертификаты, комментарии и все связанные данные.
</Text>
<Text>
8.3. По завершении дипломного проекта все данные могут быть полностью удалены 
 Администрацией без предварительного уведомления.
</Text>
</Stack>

 {/*9. Контакты */}
<Stack gap="md">
<Title order={2}>9. Контактная информация</Title>
<Text>По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться:</Text>
<Text>
<Text component="span" fw={600}>Email:</Text><Anchor href="mailto:hello@economikus.ru">hello@economikus.ru</Anchor>
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
