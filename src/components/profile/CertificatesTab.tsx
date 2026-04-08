// src/components/profile/CertificatesTab.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Stack, Card, Group, Text, Badge, Button, SimpleGrid, Box } from '@mantine/core'
import { Award, ExternalLink, Calendar, Plus } from 'lucide-react'
import { LoadingState, EmptyState, ErrorState } from '../common'
import { useUserCertificates, useAuth } from '../../hooks'
import { CertificateButton } from '../print'

export function CertificatesTab() {
  const { items, loading, error, fetchCertificates } = useUserCertificates()
  const { profile } = useAuth()
  const [showTest, setShowTest] = useState(false)

  if (loading) {
    return <LoadingState text="Загрузка сертификатов..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchCertificates} />
  }

  if (items.length === 0 && !showTest) {
    return (
      <Stack gap="md">
        <EmptyState
          message="Сертификатов пока нет"
          description="Завершите курс, чтобы получить сертификат"
          icon={<Award size={40} />}
        />
        
        {/* Временная тестовая кнопка */}
        <Box ta="center">
          <Button
            variant="subtle"
            size="sm"
            leftSection={<Plus size={14} />}
            onClick={() => setShowTest(true)}
          >
            Тест: создать сертификат
          </Button>
        </Box>
      </Stack>
    )
  }

  return (
    <Stack gap="md">
      {/* Тестовый сертификат */}
      {showTest && (
        <Card withBorder padding="lg" radius="md" bg="yellow.0" style={{ borderColor: 'var(--mantine-color-yellow-6)' }}>
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={600} c="yellow.9">Тестовый режим</Text>
              <Badge color="yellow" variant="filled">TEST</Badge>
            </Group>
            
            <Text size="sm" c="dimmed">
              Это тестовый сертификат для проверки генерации PDF
            </Text>
            
            <CertificateButton
              data={{
                studentName: profile?.displayName || profile?.nickname || 'Тестовый Пользователь',
                courseTitle: 'Тестовый курс',
                courseAuthor: 'Экономикус',
                completedAt: new Date().toISOString(),
                duration: '10 уроков / 2 часа',
                grade: 'Отлично'
              }}
              variant="filled"
              size="md"
            />
            
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setShowTest(false)}
            >
              Скрыть тест
            </Button>
          </Stack>
        </Card>
      )}

      {/* Реальные сертификаты */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {items.map((certificate) => (
          <Card key={certificate.id} withBorder padding="lg" radius="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Award size={32} color="var(--mantine-color-yellow-6)" />
                <Badge color="green" variant="light">
                  Получен
                </Badge>
              </Group>
              
              <Stack gap={4}>
                <Text fw={600} size="lg">
                  {certificate.course.title}
                </Text>
                <Group gap="xs">
                  <Calendar size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                  <Text size="sm" c="dimmed">
                    Выдан: {new Date(certificate.issuedAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  № сертификата: {certificate.certificateNumber}
                </Text>
              </Stack>
              
              <Group>
                <Button
                  component={Link}
                  to={`/courses/${certificate.course.slug}`}
                  variant="light"
                  size="sm"
                  leftSection={<ExternalLink size={14} />}
                >
                  К курсу
                </Button>
                
                <CertificateButton
                  data={{
                    studentName: profile?.displayName || profile?.nickname || 'Студент',
                    courseTitle: certificate.course.title,
                    courseAuthor: 'Экономикус',
                    completedAt: certificate.issuedAt,
                  }}
                  variant="subtle"
                  size="sm"
                />
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

