# План: Печать отчётов и графики для калькуляторов

> Универсальный модуль печати PDF и визуализация данных

---

## Анализ текущей структуры

### Калькуляторы (существующие)

| Калькулятор | Компонент | Данные для графиков |
|-------------|-----------|---------------------|
| Сложный процент | `CompoundInterestCalculator` | `yearlyBreakdown` — баланс, проценты по годам |
| Кредитный | `LoanCalculator` | `schedule` — платёж, долг, проценты по месяцам |
| Ипотечный | `MortgageCalculator` | `schedule` + налоговые вычеты |

### Структура данных (types/calculator.ts)

```typescript
// CompoundInterestResult
yearlyBreakdown: {
  year: number
  startBalance: number
  contribution: number
  interest: number
  endBalance: number
}[]

// LoanResult / MortgageResult
schedule: {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}[]
```

### Зависимости проекта

- **UI:** Mantine v8, Tailwind CSS v4
- **Графики:** НЕТ (нужно установить)
- **PDF:** НЕТ (нужно установить)

---

## Часть 1: Графики для калькуляторов

### Рекомендуемые библиотеки

| Библиотека | Плюсы | Минусы |
|------------|-------|--------|
| **Recharts** | Популярна, React-native, легкая | Менее гибкая для сложных графиков |
| **Chart.js** | Много возможностей, зрелая | Больше бандл |
| **Nivo** | Красивые графики, React-native | Менее популярна |

**Рекомендация:** `recharts` — лучший баланс функциональности и размера

### Графики для каждого калькулятора

#### 1. Сложный процент

**График 1: Рост капитала (Area Chart)**
- Ось X: Годы
- Ось Y: Сумма (₽)
- Линии: Общий баланс, Ваши взносы, Доход от процентов

**График 2: Соотношение взносов и процентов (Pie/Donut Chart)**
- Ваши взносы
- Доход от процентов

#### 2. Кредитный калькулятор

**График 1: Структура платежа (Stacked Bar)**
- Ось X: Месяцы
- Ось Y: Сумма (₽)
- Сегменты: Основной долг, Проценты

**График 2: Остаток долга (Area Chart)**
- Ось X: Месяцы
- Ось Y: Остаток (₽)

#### 3. Ипотечный калькулятор

**Графики кредитного +**
- График экономии на налоговых вычетах

### План установки

```bash
npm install recharts
```

### Структура компонентов графиков

```
src/
├── components/
│   └── charts/              # НОВОЕ
│       ├── index.ts
│       ├── AreaChart.tsx    # Универсальный график роста
│       ├── DonutChart.tsx   # Универсальная круговая диаграмма
│       ├── StackedBarChart.tsx  # Столбчатая диаграмма
│       └── LineChart.tsx    # Линейный график
```

---

## Часть 2: Универсальный модуль печати PDF

### Варианты реализации

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| **html2canvas + jsPDF** | Просто, React-компонент → PDF | Проблемы с качеством, медленно |
| **react-pdf** | Качественный PDF, нативно | Сложнее, свой синтаксис |
| **Серверная генерация** | Лучшее качество | Требует API |

**Рекомендация:** `html2canvas + jspdf` для MVP — быстрая реализация, затем можно мигрировать на react-pdf

### План установки

```bash
npm install html2canvas jspdf
```

### Архитектура модуля

```
src/
├── components/
│   └── print/               # НОВОЕ
│       ├── index.ts
│       ├── PrintButton.tsx  # Кнопка "Печать/Скачать"
│       ├── ReportLayout.tsx # Макет отчёта для печати
│       └── CalculatorReport.tsx  # Компонент отчёта калькулятора
│
├── hooks/
│   └── usePrintReport.ts    # НОВОЕ — логика генерации PDF
│
└── utils/
    └── pdf-generator.ts     # НОВОЕ — утилиты генерации PDF
```

### Интерфейс модуля печати

```typescript
// Типы для отчёта
interface ReportData {
  title: string
  subtitle?: string
  date: string
  params: Record<string, string>  // Параметры расчёта
  results: Record<string, string> // Результаты
  chartImage?: string             // Изображение графика (base64)
  tableData?: TableRow[]          // Таблица данных
}

interface TableRow {
  label: string
  values: string[]
}

// Хук для генерации PDF
function usePrintReport() {
  const generatePDF = async (data: ReportData) => {
    // 1. Создать скриншот графика (если есть)
    // 2. Сгенерировать PDF с jspdf
    // 3. Скачать
  }
  
  const printToPDF = async (elementId: string, filename: string) => {
    // Альтернативный метод — печать через html2canvas
  }
  
  return { generatePDF, printToPDF }
}
```

### Интеграция с калькуляторами

Каждый калькулятор экспортирует данные для отчёта:

```typescript
// В каждом калькуляторе добавить:
const reportData = useMemo((): ReportData => ({
  title: 'Калькулятор сложного процента',
  date: new Date().toLocaleDateString('ru-RU'),
  params: {
    'Начальная сумма': formatCurrency(params.principal),
    'Ежемесячный взнос': formatCurrency(params.monthlyContribution),
    'Годовая доходность': formatPercent(params.annualRate),
    'Срок': `${params.years} лет`,
  },
  results: {
    'Итоговая сумма': formatCurrency(result.finalAmount),
    'Ваши взносы': formatCurrency(result.totalContributions),
    'Доход от процентов': formatCurrency(result.totalInterest),
  },
  tableData: result.yearlyBreakdown.map(row => ({
    label: `Год ${row.year}`,
    values: [
      formatCurrency(row.startBalance),
      formatCurrency(row.contribution),
      formatCurrency(row.interest),
      formatCurrency(row.endBalance),
    ],
  })),
}), [params, result])

return (
  <Stack gap="xl">
    <CalculatorComponent />
    <PrintButton data={reportData} filename="compound-interest-report.pdf" />
  </Stack>
)
```

---

## Часть 3: Следующие этапы (сертификаты)

> После реализации печати отчётов

### Сертификаты

Текущая реализация:
- `pdfUrl` — внешняя ссылка на PDF
- Кнопка "Скачать PDF" в CertificatesTab

План:
1. Использовать тот же модуль печати
2. Создать компонент `CertificatePrint` с дизайном сертификата
3. Генерировать PDF на клиенте
4. Сохранять в Blob и предлагать скачать

### Структура сертификата

```tsx
// components/print/CertificatePrint.tsx
interface CertificatePrintProps {
  userName: string
  courseTitle: string
  completedAt: Date
  certificateNumber: string
}

function CertificatePrint({ userName, courseTitle, completedAt, certificateNumber }) {
  return (
    <div className="certificate">
      <div className="certificate-header">
        <Logo />
        <Title>Экономикус</Title>
      </div>
      <div className="certificate-body">
        <Text>Сертификат о прохождении курса</Text>
        <Title>{courseTitle}</Title>
        <Text>Выдан {userName}</Text>
        <Text>Дата: {completedAt}</Text>
        <Text>№ {certificateNumber}</Text>
      </div>
    </div>
  )
}
```

---

## Реализация — Этап 1: Графики

### Задачи

1. **Установить Recharts**
   ```bash
   npm install recharts
   ```

2. **Создать переиспользуемые компоненты графиков**
   - `src/components/charts/AreaChart.tsx`
   - `src/components/charts/DonutChart.tsx`
   - `src/components/charts/StackedBarChart.tsx`

3. **Интегрировать графики в калькуляторы**
   - CompoundInterestCalculator — график роста капитала
   - LoanCalculator — структура платежей
   - MortgageCalculator — как кредитный + вычеты

4. **Добавить переключатель Таблица/График**
   - Состояние в калькуляторе: `viewMode: 'table' | 'chart'`

---

## Реализация — Этап 2: Печать PDF

### Задачи

1. **Установить зависимости**
   ```bash
   npm install html2canvas jspdf
   ```

2. **Создать хук usePrintReport**
   - `src/hooks/usePrintReport.ts`

3. **Создать компонент PrintButton**
   - `src/components/print/PrintButton.tsx`
   - `src/components/print/ReportLayout.tsx`

4. **Интегрировать в калькуляторы**
   - Добавить кнопку "Скачать отчёт" в каждый калькулятор

5. **Тестирование**
   - Проверить на разных размерах экрана
   - Проверить качество PDF

---

## Реализация — Этап 3: Сертификаты (после этапов 1-2)

### Задачи

1. **Создать компонент дизайна сертификата**
   - `src/components/print/CertificatePrint.tsx`

2. **Интегрировать с существующими сертификатами**
   - Обновить CertificatesTab

3. **Добавить генерацию PDF**
   - Использовать тот же модуль печати

---

## Приоритеты реализации

| Приоритет | Задача | Сложность |
|-----------|--------|-----------|
| 1 | Графики для сложного процента | Средняя |
| 2 | Графики для кредитного | Средняя |
| 3 | Графики для ипотечного | Средняя |
| 4 | Универсальный модуль PDF | Высокая |
| 5 | Кнопка печати в калькуляторах | Низкая |
| 6 | Сертификаты | Средняя |

---

## Пример использования после реализации

```tsx
// В калькуляторе
import { AreaChart, DonutChart } from '@/components/charts'
import { PrintButton } from '@/components/print'
import { usePrintReport } from '@/hooks/usePrintReport'
import { formatCurrency } from '@/utils/calculators'

export function CompoundInterestCalculator() {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table')
  const { generatePDF } = usePrintReport()
  
  const result = useMemo(() => calculateCompoundInterest(params), [params])
  
  const reportData = useMemo(() => ({
    title: 'Калькулятор сложного процента',
    date: new Date().toLocaleDateString('ru-RU'),
    params: {
      'Начальная сумма': formatCurrency(params.principal),
      'Ежемесячный взнос': formatCurrency(params.monthlyContribution),
      'Годовая доходность': `${params.annualRate}%`,
      'Срок': `${params.years} лет`,
    },
    results: {
      'Итоговая сумма': formatCurrency(result.finalAmount),
      'Ваши взносы': formatCurrency(result.totalContributions),
      'Доход от процентов': formatCurrency(result.totalInterest),
    },
  }), [params, result])
  
  return (
    <Stack gap="xl">
      {/* Форма ввода */}
      <CalculatorForm />
      
      {/* Результаты */}
      <Paper withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600}>Результаты</Text>
          <SegmentedControl
            value={viewMode}
            onChange={(v) => setViewMode(v as 'table' | 'chart')}
            data={[
              { value: 'table', label: 'Таблица' },
              { value: 'chart', label: 'График' },
            ]}
          />
        </Group>
        
        {viewMode === 'chart' ? (
          <AreaChart
            data={result.yearlyBreakdown}
            lines={[
              { key: 'endBalance', name: 'Общий баланс', color: '#2A9D8F' },
              { key: 'totalContributions', name: 'Ваши взносы', color: '#264653' },
              { key: 'interest', name: 'Проценты', color: '#F4A261' },
            ]}
          />
        ) : (
          <ResultsTable data={result.yearlyBreakdown} />
        )}
      </Paper>
      
      {/* Кнопка печати */}
      <PrintButton data={reportData} filename="investment-report.pdf" />
    </Stack>
  )
}
```

---

*План создан: Апрель 2026*
