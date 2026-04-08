/**
 * Универсальная Area Chart для визуализации роста
 */

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Box, Text, Paper } from '@mantine/core'
import { formatCurrency } from '@/utils/calculators'

export interface AreaChartLine {
  key: string
  name: string
  color: string
}

interface AreaChartProps {
  data: Record<string, unknown>[]
  xKey: string
  lines: AreaChartLine[]
  height?: number
  formatY?: (value: number) => string
  formatX?: (value: unknown) => string
}

const defaultFormatY = (value: number) => formatCurrency(value)
const defaultFormatX = (value: unknown) => String(value)

export function AreaChart({
  data,
  xKey,
  lines,
  height = 300,
  formatY = defaultFormatY,
  formatX = defaultFormatX,
}: AreaChartProps) {
  return (
    <Box style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {lines.map((line) => (
              <linearGradient key={line.key} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-3)" />
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
            <Area
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${line.key})`}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Box>
  )
}
