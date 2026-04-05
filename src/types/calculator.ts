// Типы для калькуляторов

export type CalculatorType = 
  | 'compound-interest'    // Сложный процент
  | 'loan'                 // Кредитный калькулятор
  | 'mortgage'             // Ипотечный калькулятор
  | 'investment'           // Доходность инвестиций
  | 'inflation'            // Калькулятор инфляции
  | 'tax'                  // Налоговый калькулятор

export interface CalculatorMeta {
  id: CalculatorType
  slug: string
  title: string
  description: string
  icon: string
  category: 'investment' | 'credit' | 'tax' | 'other'
  tags: string[]
}

// Результаты расчёта сложного процента
export interface CompoundInterestResult {
  finalAmount: number
  totalContributions: number
  totalInterest: number
  yearlyBreakdown: {
    year: number
    startBalance: number
    contribution: number
    interest: number
    endBalance: number
  }[]
}

// Результаты кредитного калькулятора
export interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  overpaymentPercent: number
  schedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

// Результаты ипотечного калькулятора
export interface MortgageResult extends LoanResult {
  requiredIncome: number
  taxDeduction: number
  interestDeduction: number
}

// Параметры для калькуляторов
export interface CompoundInterestParams {
  principal: number        // Начальная сумма
  monthlyContribution: number  // Ежемесячный взнос
  annualRate: number       // Годовая ставка (%)
  years: number            // Срок в годах
  compoundFrequency: 'monthly' | 'quarterly' | 'annually'  // Частота капитализации
}

export interface LoanParams {
  amount: number           // Сумма кредита
  annualRate: number       // Годовая ставка (%)
  termMonths: number       // Срок в месяцах
  type: 'annuity' | 'differentiated'  // Тип платежа
}

export interface MortgageParams extends LoanParams {
  propertyValue: number    // Стоимость недвижимости
  downPayment: number      // Первоначальный взнос
  useMaternityCapital: boolean  // Материнский капитал
  maternityCapitalAmount: number  // Сумма маткапитала
}
