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
      <Stack gap="xs">
        <Group gap="xs" wrap="wrap">
          <TextInput
            label="Дата"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.currentTarget.value })}
            leftSection={<Calendar size={14} />}
            style={{ flex: 1, minWidth: 120 }}
            size="sm"
          />
          <CategorySelector
            value={formData.categoryId}
            onChange={handleCategoryChange}
            placeholder="Категория"
          />
        </Group>
        <TextInput
          label="Описание"
          placeholder="Что купили?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
          size="sm"
        />
        <Stack gap="xs">
          <Group gap="xs" wrap="wrap">
            <NumberInput
              label="Сумма (у.е.)"
              placeholder="0"
              min={0}
              step={10}
              value={formData.amount}
              onChange={(v) => setFormData({ ...formData, amount: v as number })}
              style={{ flex: 1, minWidth: 120 }}
              size="sm"
            />
            <Switch
              label="Необязательно"
              checked={formData.isNecessary}
              onChange={(e) => setFormData({ ...formData, isNecessary: e.currentTarget.checked })}
              style={{ flex: 1, minWidth: 120 }}
              size="sm"
            />
            <Button
              type="submit"
              style={{ flex: 1, minWidth: 120 }}
              loading={addMutation.isPending}
              size="sm"
            >
              Добавить
            </Button>
          </Group>
        </Stack>
      </Stack>
      {error && (
        <Text c="red" size="xs" mt="xs">{error}</Text>
      )}
    </form>
  )
}
