// src/types/api.ts

// === API RESPONSE ===
export interface ApiResponse<T> {
  data: T
  message?: string
}

// === PAGINATED RESPONSE ===
export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

// === PAGINATION ===
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// === PAGINATION PARAMS ===
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  [key: string]: string | number | undefined
}

// === API ERROR ===
export interface ApiError {
  error: string
  message?: string
  code?: string
  status?: number
}
