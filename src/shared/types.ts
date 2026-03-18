// src/shared/types.ts
import { z } from 'zod'

// === ENUMS ===
export const RoleEnum = z.enum(['USER', 'AUTHOR', 'MODERATOR', 'ADMIN'])
export type Role = z.infer<typeof RoleEnum>

/**
 * Функция для очистки строки от потенциально опасных символов
 * Защита от XSS: удаляет HTML-теги и JavaScript
 */
function sanitizeString(val: string): string {
  return val
    .trim()
    // Удаляем HTML теги
    .replace(/<[^>]*>/g, '')
    // Удаляем javascript:
    .replace(/javascript:/gi, '')
    // Удаляем on* атрибуты (onclick, onerror, etc.)
    .replace(/on\w+\s*=/gi, '')
}

// === РЕГИСТРАЦИЯ ===
export const RegisterSchema = z.object({
  email: z.string()
    .email('Некорректный формат email')
    .min(5, 'Email слишком короткий')
    .max(255, 'Email слишком длинный')
    .transform((val) => val.toLowerCase().trim()),
  
  firstName: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .transform(sanitizeString)
    .refine(
      (val) => /^[\p{L}\s'-]+$/u.test(val),
      'Имя может содержать только буквы, пробелы, дефисы и апострофы'
    ),
  
  lastName: z.string()
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .max(100, 'Фамилия слишком длинная')
    .transform(sanitizeString)
    .refine(
      (val) => /^[\p{L}\s'-]+$/u.test(val),
      'Фамилия может содержать только буквы, пробелы, дефисы и апострофы'
    ),
  
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(100, 'Пароль слишком длинный')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  
  nickname: z.string()
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .max(50, 'Никнейм слишком длинный')
    .transform(sanitizeString)
    .refine(
      (val) => /^[a-zA-Z0-9_]+$/.test(val),
      'Никнейм может содержать только латинские буквы, цифры и подчёркивание'
    ),
  
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Необходимо принять условия использования'
  })
})

export type RegisterInput = z.infer<typeof RegisterSchema>

// === ВХОД ===
export const LoginSchema = z.object({
  email: z.string()
    .email('Некорректный email')
    .min(5)
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, 'Пароль слишком короткий'),
  remember: z.boolean().optional()
})

export type LoginInput = z.infer<typeof LoginSchema>

// === ОТВЕТЫ ===
export interface AuthResponse {
  message: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: Role
    profile?: {
      id: string
      nickname: string
      displayName: string
      avatarUrl?: string
    }
  }
}

export interface ErrorResponse {
  error: string
  message?: string
  details?: Array<{ field: string; message: string }>
  code?: string
}

// === USER ===
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  profile?: {
    id: string
    nickname: string
    displayName: string
    avatarUrl?: string
  }
}