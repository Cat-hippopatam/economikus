import { useEffect } from 'react';
import { 
  Table, Container, Button, Group, Title, LoadingOverlay, Paper
} from '@mantine/core';
import { useAppStore } from './store/useAppStore';
import { Plus } from 'lucide-react';

export default function App() {
  const { users, isLoading, fetchUsers } = useAppStore();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  return (
    <Container size="md" py="xl" className="relative">
      <LoadingOverlay visible={isLoading} />
      
      {/* Панель навигации */}
      <Group justify="space-between" mb="lg">
        <Title order={2}>Economikus DB</Title>
        <Group>
          <Button variant="outline" component="a" href="/login">
            Войти
          </Button>
        </Group>
      </Group>
      
      <Paper shadow="sm" p="md" withBorder radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Economikus DB</Title>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Имя Фамилия</Table.Th>
              <Table.Th>Роль</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{user.id}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{`${user.firstName} ${user.lastName}`}</Table.Td>
                <Table.Td>{user.role}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}
