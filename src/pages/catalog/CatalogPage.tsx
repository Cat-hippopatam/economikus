// src/pages/catalog/CatalogPage.tsx
/**
 * Страница каталога курсов
 */

import { Container, Title, Text, Grid, Stack, Group, TextInput, Select, Pagination, Skeleton, Alert, Box, Paper } from '@mantine/core'
import { Search, BookOpen } from 'lucide-react'
import { CourseCard } from '@/components/courses/CourseCard'
import { useCourseCatalog } from '@/hooks/useCourseCatalog'
import { DIFFICULTY_OPTIONS, SORT_OPTIONS } from '@/constants'

export default function CatalogPage() {
  const {
    courses,
    loading,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    sort,
    setSort,
  } = useCourseCatalog()

  return (
    <Box style={{ backgroundColor: '#F8F6F3', minHeight: '100vh' }}>
      <Container size="lg" py="xl">
        {/* Заголовок */}
        <Stack gap="xs" mb="xl">
          <Title order={1} c="#264653">
            Каталог курсов
          </Title>
          <Text c="dimmed" size="lg">
            Выберите курс для изучения финансовой грамотности
          </Text>
        </Stack>

        {/* Фильтры */}
        <Paper shadow="xs" p="md" radius="md" withBorder mb="xl">
          <Group gap="md" align="flex-end">
            <TextInput
              placeholder="Поиск курсов..."
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
              styles={{
                input: {
                  backgroundColor: '#fff',
                },
              }}
            />
            
            <Select
              placeholder="Уровень"
              data={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={(v) => setDifficulty(v || null)}
              clearable
              w={180}
              styles={{
                input: {
                  backgroundColor: '#fff',
                },
              }}
            />
            
            <Select
              placeholder="Сортировка"
              data={SORT_OPTIONS}
              value={sort}
              onChange={(v) => setSort(v || 'created_at_desc')}
              w={200}
              styles={{
                input: {
                  backgroundColor: '#fff',
                },
              }}
            />
          </Group>
        </Paper>

        {/* Результаты */}
        <Group justify="space-between" mb="md">
          <Text c="dimmed">
            {loading ? (
              'Загрузка...'
            ) : (
              <>
                Найдено: <b>{total}</b> курсов
              </>
            )}
          </Text>
        </Group>

        {/* Список курсов */}
        {loading ? (
          <Grid>
            {[...Array(6)].map((_, i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                <Skeleton height={320} radius="md" />
              </Grid.Col>
            ))}
          </Grid>
        ) : courses.length === 0 ? (
          <Alert color="gray" icon={<BookOpen size={16} />} title="Курсы не найдены">
            Попробуйте изменить параметры поиска или фильтры
          </Alert>
        ) : (
          <Grid>
            {courses.map((course) => (
              <Grid.Col key={course.id} span={{ base: 12, sm: 6, md: 4 }}>
                <CourseCard course={course} />
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Пагинация */}
        {totalPages > 1 && (
          <Group justify="center" mt="xl">
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              color="teal"
            />
          </Group>
        )}
      </Container>
    </Box>
  )
}
