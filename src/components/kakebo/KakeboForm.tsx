import { useState } from 'react'
import { useForm } from '@mantine/form'
import { Group, TextInput, Select, NumberInput, Switch } from '@mantine/core'
import { Button } from '@mantine/core'
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
  const form = useForm({
    initialValues: {
      date: new Date().toISOString().split('T')[0],
      category: 'LIFE' as KakeboCategory,
      description: '',
      amount: 0,
      isNecessary: false,
    },
    validate: {
      description: (value) => (value.trim().length < 1 ? 'Введите описание' : null),
      amount: (value) => (value <= 0 ? 'Сумма должна быть больше 0' : null),
    },
  })

  const handleSubmit = form.onSubmit((values) => {
    addMutation.mutate(
      {
        ...values,
        amount: parseFloat(values.amount.toString()),
      },
      {
        onSuccess: () => {
          form.reset()
          form.setFieldValue('date', new Date().toISOString().split('T')[0])
          onSuccess?.()
        },
      }
    )
  })

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="sm" grow>
        <TextInput
          label="Дата"
          type="date"
          {...form.getInputProps('date')}
          leftSection={<Calendar size={16} />}
        />
        <Select
          label="Категория"
          data={CATEGORIES}
          {...form.getInputProps('category')}
          searchable
        />
        <TextInput
          label="Описание"
          placeholder="Что купили?"
          {...form.getInputProps('description')}
        />
        <NumberInput
          label="Сумма (у.е.)"
          placeholder="0"
          precision={2}
          min={0}
          step={10}
          {...form.getInputProps('amount')}
        />
        <Switch
          label="Необязательно"
          checked={form.values.isNecessary}
          onChange={(e) => form.setFieldValue('isNecessary', e.currentTarget.checked)}
          mt={30}
        />
        <Button
          type="submit"
          w={120}
          loading={addMutation.isPending}
          disabled={!form.isValid()}
        >
          Добавить
        </Button>
      </Group>
      {(form.errors.description || form.errors.amount) && (
        <Group mt="xs">
          <Text c="red" size="sm">
            {form.errors.description || form.errors.amount}
          </Text>
        </Group>
      )}
    </form>
  )
}
