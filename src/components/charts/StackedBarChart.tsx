/**
 * Универсальная столбчатая диаграмма с накоплением (Stacked Bar Chart)
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Box, Text, Paper } from '@mantine/core'
import { formatCurrency } from '@/utils/calculators'

export interface StackedBarData {
  [key: string]: unknown
}

export interface StackedBarConfig {
  dataKey: string
  name: string
  color: string
}

interface StackedBarChartProps {
  data: StackedBarData[]
  xKey: string
  bars: StackedBarConfig[]
  height?: number
  formatX?: (value: unknown) => string
  formatY?: (value: number) => string
  barSize?: number
}

const defaultFormatY = (value: number) => formatCurrency(value)

export function StackedBarChart({
  data,
  xKey,
  bars,
  height = 300,
  formatX = (v) => String(v),
  formatY = defaultFormatY,
  barSize = 20,
}: StackedBarChartProps) {
  return (
    <Box style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-3)" />
          <XAxis
            dataKey={xKey}
            tickFormatter={formatX}
            tick={{ fontSize: 11, fill: 'var(--mantine-color-gray-6)' }}
            axisLine={{ stroke: 'var(--mantine-color-gray-4)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 11, fill: 'var(--mantine-color-gray-6)' }}
            axisLine={{ stroke: 'var(--mantine-color-gray-4)' }}
            width={90}
          />
          <Tooltip
            content={({ active, payload, label }: any) => {
              if (!active || !payload?.length) return null

              return (
                <Paper p="sm" shadow="md" withBorder>
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
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              stackId="a"
              fill={bar.color}
              barSize={barSize}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
