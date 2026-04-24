import { useState } from 'react'
import { Group, TextInput, Select, NumberInput, Switch, Text, Button } from '@mantine/core'
import { Calendar } from 'lucide-react'
import { useAddKakeboEntry } from '@/hooks/useKakebo'
import type { KakeboCategory } from '@/types/kakebo'

const CATEGORIES: { value: KakeboCategory; label: string }[] = [
  { value: 'LIFE', label: 'Жизнь (еда, транспорт, жильё)' },
  { value: 'CULTURE', label: 'Культура (книги, развлечения)' },
  { value: 'EXTRA', label: 'Дополнительное (покупки)' },
  { value: 'UNEXPECTED', label: 'Непредвиденное' },
]

interface KakeboFormProps {
  onSuccess?: () => void
}

export function KakeboForm({ onSuccess }: KakeboFormProps) {
  const addMutation = useAddKakeboEntry()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'LIFE' as KakeboCategory,
    description: '',
    amount: 0,
    isNecessary: false,
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    setError(null)
    
    if (!formData.description.trim()) {
      setError('Введите описание')
      return
    }
    
    if (formData.amount <= 0) {
      setError('Сумма должна быть больше 0')
      return
    }

    addMutation.mutate(
      {
        ...formData,
        amount: parseFloat(formData.amount.toString()),
      },
      {
        onSuccess: () => {
          setFormData({
            date: new Date().toISOString().split('T')[0],
            category: 'LIFE',
            description: '',
            amount: 0,
            isNecessary: false,
          })
          onSuccess?.()
        },
        onError: (err: any) => {
          setError(err.message || 'Ошибка добавления')
        }
      }
    )
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Group gap="sm" grow>
        <TextInput
          label="Дата"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.currentTarget.value })}
          leftSection={<Calendar size={16} />}
        />
        <Select
          label="Категория"
          data={CATEGORIES}
          value={formData.category}
          onChange={(v) => setFormData({ ...formData, category: v as KakeboCategory })}
          searchable
        />
        <TextInput
          label="Описание"
          placeholder="Что купили?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
        />
        <NumberInput
          label="Сумма (у.е.)"
          placeholder="0"
          min={0}
          step={10}
          value={formData.amount}
          onChange={(v) => setFormData({ ...formData, amount: v as number })}
        />
        <Switch
          label="Необязательно"
          checked={formData.isNecessary}
          onChange={(e) => setFormData({ ...formData, isNecessary: e.currentTarget.checked })}
          mt={30}
        />
        <Button
          type="submit"
          w={120}
          loading={addMutation.isPending}
        >
          Добавить
        </Button>
      </Group>
      {error && (
        <Group mt="xs">
          <Text c="red" size="sm">{error}</Text>
        </Group>
      )}
    </form>
  )
}
