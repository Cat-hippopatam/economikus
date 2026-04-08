/**
 * Универсальная линейная диаграмма (Line Chart)
 */

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Box, Text, Paper } from '@mantine/core'
import { formatCurrency } from '@/utils/calculators'

export interface LineChartConfig {
  key: string
  name: string
  color: string
  strokeWidth?: number
  strokeDasharray?: string
}

interface LineChartProps {
  data: Record<string, unknown>[]
  xKey: string
  lines: LineChartConfig[]
  height?: number
  formatY?: (value: number) => string
  formatX?: (value: unknown) => string
  showGrid?: boolean
}

const defaultFormatY = (value: number) => formatCurrency(value)
const defaultFormatX = (value: unknown) => String(value)

export function LineChart({
  data,
  xKey,
  lines,
  height = 300,
  formatY = defaultFormatY,
  formatX = defaultFormatX,
  showGrid = true,
}: LineChartProps) {
  return (
    <Box style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-3)" />
          )}
          <XAxis
            dataKey={xKey}
            tickFormatter={formatX}
            tick={{ fontSize: 12, fill: 'var(--mantine-color-gray-6)' }}
            axisLine={{ stroke: 'var(--mantine-color-gray-4)' }}
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 12, fill: 'var(--mantine-color-gray-6)' }}
            axisLine={{ stroke: 'var(--mantine-color-gray-4)' }}
            width={100}
          />
          <Tooltip
            content={({ active, payload, label }: any) => {
              if (!active || !payload?.length) return null
              return (
                <Paper
                  p="sm"
                  shadow="md"
                  withBorder
                  style={{ background: 'var(--mantine-color-white)' }}
                >
                  <Text size="sm" fw={600} mb="xs">
                    {formatX(label)}
                  </Text>
                  {payload.map((entry: any) => (
                    <Box key={entry.dataKey} style={{ color: entry.color }}>
                      <Text size="xs">
                        {entry.name}: {formatY(Number(entry.value))}
                      </Text>
                    </Box>
                  ))}
                </Paper>
              )
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => <span style={{ color: 'var(--mantine-color-gray-7)' }}>{value}</span>}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.strokeDasharray}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </Box>
  )
}
