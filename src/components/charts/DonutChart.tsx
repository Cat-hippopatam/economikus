/**
 * Универсальная круговая диаграмма (Donut Chart)
 */

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Box, Text, Paper } from '@mantine/core'

export interface DonutChartData {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutChartData[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  showPercentage?: boolean
  formatValue?: (value: number) => string
}

const defaultFormatValue = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function DonutChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  showPercentage = true,
  formatValue = defaultFormatValue,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
    if (!showPercentage || percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Box style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }: any) => {
              if (!active || !payload?.length) return null
              const item = payload[0].payload as DonutChartData
              const percent = ((item.value / total) * 100).toFixed(1)
              return (
                <Paper p="sm" shadow="md" withBorder>
                  <Text size="sm" fw={600}>
                    {item.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {formatValue(item.value)} ({percent}%)
                  </Text>
                </Paper>
              )
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry: any) => {
              const item = entry.payload as DonutChartData
              const percent = ((item.value / total) * 100).toFixed(1)
              return (
                <span style={{ color: 'var(--mantine-color-gray-7)', fontSize: 13 }}>
                  {value}: {formatValue(item.value)} ({percent}%)
                </span>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}
