// src/components/tables/DataTable.tsx
/**
 * Переиспользуемая таблица данных
 */

import { Table, Card, Group, ActionIcon, Menu } from '@mantine/core'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import { LoadingTable } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'

export interface Column<T> {
  key: keyof T | string
  label: string
  width?: string | number
  render?: (item: T) => React.ReactNode
}

export interface TableAction<T> {
  icon?: React.ReactNode
  label: string
  onClick: (item: T) => void
  color?: string
  show?: (item: T) => boolean
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  actions?: TableAction<T>[]
  onRowClick?: (item: T) => void
  striped?: boolean
  highlightOnHover?: boolean
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  loading,
  emptyMessage = 'Нет данных',
  emptyDescription,
  actions,
  onRowClick,
  striped = true,
  highlightOnHover = true,
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingTable rows={5} />
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} description={emptyDescription} />
  }

  return (
    <Card shadow="xs" padding={0} radius="md" withBorder>
      <Table striped={striped} highlightOnHover={highlightOnHover}>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={String(col.key)} style={{ width: col.width }}>
                {col.label}
              </Table.Th>
            ))}
            {actions && <Table.Th style={{ width: 60 }}></Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item) => (
            <Table.Tr
              key={item.id}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <Table.Td key={String(col.key)}>
                  {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                </Table.Td>
              ))}
              {actions && (
                <Table.Td>
                  <TableActions item={item} actions={actions} />
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  )
}

/**
 * Компонент действий в таблице
 */
function TableActions<T extends { id: string }>({
  item,
  actions,
}: {
  item: T
  actions: TableAction<T>[]
}) {
  const visibleActions = actions.filter((action) => 
    action.show ? action.show(item) : true
  )

  if (visibleActions.length === 0) return null

  if (visibleActions.length <= 2) {
    return (
      <Group gap="xs" justify="flex-end">
        {visibleActions.map((action, index) => (
          <ActionIcon
            key={index}
            variant="subtle"
            color={action.color}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick(item)
            }}
          >
            {action.icon || <Pencil size={16} />}
          </ActionIcon>
        ))}
      </Group>
    )
  }

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="subtle" onClick={(e) => e.stopPropagation()}>
          <MoreVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {visibleActions.map((action, index) => (
          <Menu.Item
            key={index}
            color={action.color}
            leftSection={action.icon}
            onClick={() => action.onClick(item)}
          >
            {action.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

/**
 * Стандартные действия для CRUD
 */
export function createStandardActions<T extends { id: string }>(
  onEdit: (item: T) => void,
  onDelete: (item: T) => void,
  extraActions?: TableAction<T>[]
): TableAction<T>[] {
  const actions: TableAction<T>[] = [
    {
      icon: <Pencil size={14} />,
      label: 'Редактировать',
      onClick: onEdit,
    },
    {
      icon: <Trash2 size={14} />,
      label: 'Удалить',
      onClick: onDelete,
      color: 'red',
    },
  ]

  if (extraActions) {
    actions.push(...extraActions)
  }

  return actions
}
