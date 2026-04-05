// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react'
import { Container, Paper, Title, Text, Button, Stack } from '@mantine/core'
import { AlertTriangle, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Paper p="xl" radius="md" withBorder>
            <Stack align="center" gap="md">
              <AlertTriangle size={48} color="var(--mantine-color-red-6)" />
              <Title order={2} ta="center">Что-то пошло не так</Title>
              <Text c="dimmed" ta="center">
                Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.
              </Text>
              {this.state.error && (
                <Paper p="sm" withBorder bg="gray.0" style={{ width: '100%' }}>
                  <Text size="sm" c="red.8" ff="monospace">
                    {this.state.error.message}
                  </Text>
                </Paper>
              )}
              <Button onClick={this.handleReset} variant="light">
                Попробовать снова
              </Button>
              <Button
                component="a"
                href="/"
                variant="subtle"
                leftSection={<Home size={16} />}
              >
                На главную
              </Button>
            </Stack>
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}
