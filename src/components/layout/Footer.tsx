// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom'
import { 
  Container, 
  Group, 
  Text, 
  Stack, 
  Anchor,
  Divider,
  Grid,
  ActionIcon
} from '@mantine/core'
import { BookOpen, Github, Mail, Send } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { to: '/catalog', label: 'Каталог курсов' },
      { to: '/courses', label: 'Все курсы' },
      { to: '/calculators', label: 'Калькуляторы' },
      { to: '/faq', label: 'FAQ' },
    ],
    company: [
      { to: '/about', label: 'О нас' },
      { to: '/contacts', label: 'Контакты' },
      { to: '/team', label: 'Команда' },
    ],
    legal: [
      { to: '/terms', label: 'Условия использования' },
      { to: '/privacy', label: 'Политика конфиденциальности' },
      { to: '/cookies', label: 'Политика cookie' },
    ],
  }

  return (
    <footer 
      style={{ 
        backgroundColor: '#264653', 
        color: '#fff',
        marginTop: 'auto'
      }}
    >
      <Container size="lg" py="xl">
        <Grid>
          {/* Логотип и описание */}
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                color: '#fff',
                marginBottom: 16
              }}
            >
              <BookOpen size={28} />
              <Text fw={700} size="xl">Экономикус</Text>
            </Link>
            <Text size="sm" c="dimmed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Образовательная платформа для изучения финансов и инвестиций. 
              Учим управлять деньгами с 2024 года.
            </Text>
            
            <Group mt="md" gap="xs">
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                size="lg"
                component="a"
                href="https://t.me/economikus"
                target="_blank"
                title="Telegram"
              >
                <Send size={20} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                size="lg"
                component="a"
                href="mailto:hello@economikus.ru"
                title="Email"
              >
                <Mail size={20} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                size="lg"
                component="a"
                href="https://github.com/Cat-hippopatam/fin"
                target="_blank"
                title="GitHub"
              >
                <Github size={20} />
              </ActionIcon>
            </Group>
          </Grid.Col>

          {/* Платформа */}
          <Grid.Col span={{ base: 6, sm: 2 }}>
            <Text fw={600} mb="sm">Платформа</Text>
            <Stack gap="xs">
              {footerLinks.platform.map((link) => (
                <Anchor
                  key={link.to}
                  component={Link}
                  to={link.to}
                  size="sm"
                  style={{ 
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          </Grid.Col>

          {/* Компания */}
          <Grid.Col span={{ base: 6, sm: 2 }}>
            <Text fw={600} mb="sm">Компания</Text>
            <Stack gap="xs">
              {footerLinks.company.map((link) => (
                <Anchor
                  key={link.to}
                  component={Link}
                  to={link.to}
                  size="sm"
                  style={{ 
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          </Grid.Col>

          {/* Правовая информация */}
          <Grid.Col span={{ base: 6, sm: 2 }}>
            <Text fw={600} mb="sm">Правовая информация</Text>
            <Stack gap="xs">
              {footerLinks.legal.map((link) => (
                <Anchor
                  key={link.to}
                  component={Link}
                  to={link.to}
                  size="sm"
                  style={{ 
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" color="rgba(255,255,255,0.1)" />

        <Group justify="space-between" wrap="wrap" gap="sm">
          <Text size="sm" c="dimmed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © {currentYear} Экономикус. Все права защищены.
          </Text>
          <Text size="sm" c="dimmed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Сделано с ❤️ для финансового образования
          </Text>
        </Group>
      </Container>
    </footer>
  )
}
