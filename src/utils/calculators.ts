/**
 * Утилиты для финансовых расчётов
 */

import type { 
  CompoundInterestParams, 
  CompoundInterestResult,
  LoanParams,
  LoanResult,
  MortgageParams,
  MortgageResult 
} from '@/types/calculator'

/**
 * Форматирование валюты
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Форматирование числа с разделителями
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Форматирование процентов
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${formatNumber(value, decimals)}%`
}

/**
 * Расчёт сложного процента
 */
export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
  const { principal, monthlyContribution, annualRate, years, compoundFrequency } = params
  
  const rate = annualRate / 100
  const monthsPerPeriod = compoundFrequency === 'monthly' ? 1 : compoundFrequency === 'quarterly' ? 3 : 12
  const periodsPerYear = 12 / monthsPerPeriod
  const periodRate = rate / periodsPerYear
  
  let balance = principal
  const yearlyBreakdown: CompoundInterestResult['yearlyBreakdown'] = []
  
  for (let year = 1; year <= years; year++) {
    const startBalance = balance
    const yearlyContribution = monthlyContribution * 12
    
    // Начисляем проценты и взносы за год
    for (let period = 0; period < periodsPerYear; period++) {
      // Добавляем взносы за период
      balance += monthlyContribution * monthsPerPeriod
      // Начисляем проценты
      balance *= (1 + periodRate)
    }
    
    const interest = balance - startBalance - yearlyContribution
    
    yearlyBreakdown.push({
      year,
      startBalance,
      contribution: yearlyContribution,
      interest,
      endBalance: balance,
    })
  }
  
  const totalContributions = principal + monthlyContribution * 12 * years
  const totalInterest = balance - totalContributions
  
  return {
    finalAmount: Math.round(balance * 100) / 100,
    totalContributions,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  }
}

/**
 * Расчёт аннуитетного платежа
 */
export function calculateAnnuityPayment(principal: number, annualRate: number, termMonths: number): number {
  if (annualRate === 0) return principal / termMonths
  
  const monthlyRate = annualRate / 100 / 12
  const factor = Math.pow(1 + monthlyRate, termMonths)
  return principal * monthlyRate * factor / (factor - 1)
}

/**
 * Расчёт дифференцированного платежа (первый платёж)
 */
export function calculateDifferentiatedPayment(principal: number, annualRate: number, termMonths: number, month: number): number {
  const monthlyRate = annualRate / 100 / 12
  const principalPart = principal / termMonths
  const remainingPrincipal = principal - principalPart * (month - 1)
  const interestPart = remainingPrincipal * monthlyRate
  return principalPart + interestPart
}

/**
 * Расчёт кредита
 */
export function calculateLoan(params: LoanParams): LoanResult {
  const { amount, annualRate, termMonths, type } = params
  
  const schedule: LoanResult['schedule'] = []
  let remainingBalance = amount
  let totalInterest = 0
  
  if (type === 'annuity') {
    const monthlyPayment = calculateAnnuityPayment(amount, annualRate, termMonths)
    const monthlyRate = annualRate / 100 / 12
    
    for (let month = 1; month <= termMonths; month++) {
      const interest = remainingBalance * monthlyRate
      const principalPart = monthlyPayment - interest
      
      schedule.push({
        month,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principalPart * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(Math.max(0, remainingBalance - principalPart) * 100) / 100,
      })
      
      totalInterest += interest
      remainingBalance -= principalPart
    }
    
    const totalPayment = amount + totalInterest
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      overpaymentPercent: Math.round((totalInterest / amount) * 100 * 100) / 100,
      schedule,
    }
  } else {
    // Дифференцированный платёж
    const principalPart = amount / termMonths
    const monthlyRate = annualRate / 100 / 12
    let totalPayment = 0
    
    for (let month = 1; month <= termMonths; month++) {
      const interest = remainingBalance * monthlyRate
      const payment = principalPart + interest
      
      schedule.push({
        month,
        payment: Math.round(payment * 100) / 100,
        principal: Math.round(principalPart * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(Math.max(0, remainingBalance - principalPart) * 100) / 100,
      })
      
      totalInterest += interest
      totalPayment += payment
      remainingBalance -= principalPart
    }
    
    return {
      monthlyPayment: schedule[0].payment, // Первый платёж (максимальный)
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      overpaymentPercent: Math.round((totalInterest / amount) * 100 * 100) / 100,
      schedule,
    }
  }
}

/**
 * Расчёт ипотеки
 */
export function calculateMortgage(params: MortgageParams): MortgageResult {
  const { 
    propertyValue, 
    downPayment, 
    useMaternityCapital, 
    maternityCapitalAmount,
    ...loanParams 
  } = params
  
  // Корректируем сумму кредита с учётом маткапитала
  let actualDownPayment = downPayment
  if (useMaternityCapital) {
    actualDownPayment += maternityCapitalAmount
  }
  
  const loanAmount = Math.max(0, propertyValue - actualDownPayment)
  
  // Базовый расчёт кредита
  const loanResult = calculateLoan({
    ...loanParams,
    amount: loanAmount,
  })
  
  // Рекомендуемый доход (платёж не более 40% от дохода)
  const requiredIncome = Math.round(loanResult.monthlyPayment / 0.4)
  
  // Налоговый вычет (13% от стоимости недвижимости и процентов, максимум 260 000 + 390 000)
  const maxPropertyDeduction = 260000
  const maxInterestDeduction = 390000
  
  const propertyDeductionBase = Math.min(propertyValue, 2000000) * 0.13
  const taxDeduction = Math.min(propertyDeductionBase, maxPropertyDeduction)
  
  const interestDeductionBase = Math.min(loanResult.totalInterest, 3000000) * 0.13
  const interestDeduction = Math.min(interestDeductionBase, maxInterestDeduction)
  
  return {
    ...loanResult,
    requiredIncome,
    taxDeduction: Math.round(taxDeduction),
    interestDeduction: Math.round(interestDeduction),
  }
}
