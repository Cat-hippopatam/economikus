// src/components/profile/CertificatesTab.tsx
import { Link } from 'react-router-dom'
import { Stack, Card, Group, Text, Badge, Button, SimpleGrid } from '@mantine/core'
import { Award, Download, ExternalLink, Calendar } from 'lucide-react'
import { LoadingState, EmptyState, ErrorState } from '../common'
import { useUserCertificates } from '../../hooks'

export function CertificatesTab() {
  const { items, loading, error, fetchCertificates } = useUserCertificates()

  if (loading) {
    return <LoadingState text="Загрузка сертификатов..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchCertificates} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="Сертификатов пока нет"
        description="Завершите курс, чтобы получить сертификат"
        icon={<Award size={40} />}
      />
    )
  }

  return (
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
              {certificate.pdfUrl && (
                <Button
                  component="a"
                  href={certificate.pdfUrl}
                  target="_blank"
                  variant="subtle"
                  size="sm"
                  leftSection={<Download size={14} />}
                >
                  Скачать PDF
                </Button>
              )}
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
