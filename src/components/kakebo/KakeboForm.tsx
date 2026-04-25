import { useState } from 'react'
import { Group, TextInput, NumberInput, Switch, Text, Button, Stack } from '@mantine/core'
import { Calendar } from 'lucide-react'
import { useAddKakeboEntry } from '@/hooks/useKakebo'
import { CategorySelector } from './CategorySelector'
import type { KakeboCategoryLegacy } from '@/types/kakebo'

interface KakeboFormProps {
  onSuccess?: () => void
}

export function KakeboForm({ onSuccess }: KakeboFormProps) {
  const addMutation = useAddKakeboEntry()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    categoryId: null as string | null,
    categoryOld: 'LIFE' as KakeboCategoryLegacy, // fallback для совместимости
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
        date: formData.date,
        categoryId: formData.categoryId,
        categoryOld: formData.categoryOld,
        description: formData.description,
        amount: parseFloat(formData.amount.toString()),
        isNecessary: formData.isNecessary,
      },
      {
        onSuccess: () => {
          setFormData({
            date: new Date().toISOString().split('T')[0],
            categoryId: null,
            categoryOld: 'LIFE',
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

  const handleCategoryChange = (categoryId: string | null) => {
    setFormData({ ...formData, categoryId })
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Stack gap="sm">
        <Group gap="sm" wrap="wrap">
          <TextInput
            label="Дата"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.currentTarget.value })}
            leftSection={<Calendar size={16} />}
            style={{ flex: 1, minWidth: 150 }}
          />
          <CategorySelector
            value={formData.categoryId}
            onChange={handleCategoryChange}
            placeholder="Выберите категорию"
          />
        </Group>
        <TextInput
          label="Описание"
          placeholder="Что купили?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
        />
        <Group gap="sm" align="flex-end">
          <NumberInput
            label="Сумма (у.е.)"
            placeholder="0"
            min={0}
            step={10}
            value={formData.amount}
            onChange={(v) => setFormData({ ...formData, amount: v as number })}
            style={{ flex: 1 }}
          />
          <Switch
            label="Необязательно"
            checked={formData.isNecessary}
            onChange={(e) => setFormData({ ...formData, isNecessary: e.currentTarget.checked })}
            style={{ flex: 1 }}
          />
          <Button
            type="submit"
            w={120}
            loading={addMutation.isPending}
            style={{ flex: 1 }}
          >
            Добавить
          </Button>
        </Group>
      </Stack>
      {error && (
        <Text c="red" size="sm" mt="xs">{error}</Text>
      )}
    </form>
  )
}
