// src/components/tables/TableFilters.tsx
/**
 * Фильтры для таблиц
 */

import { Card, Group, TextInput, Select, Button } from '@mantine/core'
import { Search, X } from 'lucide-react'

export interface FilterConfig {
  key: string
  type: 'search' | 'select' | 'date'
  placeholder?: string
  label?: string
  options?: { value: string; label: string }[]
  width?: number | string
}

interface TableFiltersProps {
  filters: Record<string, string>
  onFilterChange: (filters: Record<string, string>) => void
  config: FilterConfig[]
  onReset?: () => void
}

export function TableFilters({
  filters,
  onFilterChange,
  config,
  onReset,
}: TableFiltersProps) {
  const handleFilterChange = (key: string, value: string | null) => {
    onFilterChange({ ...filters, [key]: value || '' })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== '')

  return (
    <Card shadow="xs" padding="md" radius="md" withBorder mb="lg">
      <Group>
        {config.map((filter) => {
          if (filter.type === 'search') {
            return (
              <TextInput
                key={filter.key}
                placeholder={filter.placeholder || 'Поиск...'}
                leftSection={<Search size={16} />}
                value={filters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                style={{ flex: 1, minWidth: 200 }}
              />
            )
          }

          if (filter.type === 'select') {
            return (
              <Select
                key={filter.key}
                placeholder={filter.placeholder || filter.label}
                data={filter.options || []}
                value={filters[filter.key] || null}
                onChange={(v) => handleFilterChange(filter.key, v)}
                clearable
                w={filter.width || 180}
              />
            )
          }

          return null
        })}

        {hasActiveFilters && onReset && (
          <Button
            variant="subtle"
            size="sm"
            leftSection={<X size={14} />}
            onClick={onReset}
          >
            Сбросить
          </Button>
        )}
      </Group>
    </Card>
  )
}

/**
 * Стандартная конфигурация фильтров
 */
export const STANDARD_FILTERS = {
  search: (key = 'search', placeholder = 'Поиск...'): FilterConfig => ({
    key,
    type: 'search',
    placeholder,
  }),

  status: (options: { value: string; label: string }[]): FilterConfig => ({
    key: 'status',
    type: 'select',
    placeholder: 'Статус',
    options,
  }),

  role: (options: { value: string; label: string }[]): FilterConfig => ({
    key: 'role',
    type: 'select',
    placeholder: 'Роль',
    options,
  }),

  lessonType: (options: { value: string; label: string }[]): FilterConfig => ({
    key: 'lessonType',
    type: 'select',
    placeholder: 'Тип',
    options,
  }),
}
