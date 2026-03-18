// src/services/tag.service.ts
/**
 * Сервис тегов
 */

import { api } from './api'
import type { Tag, TagInput } from '@/types'

export const TagService = {
  // === ПУБЛИЧНЫЕ ===

  /**
   * Получить список тегов
   */
  getAll: () =>
    api.get<{ items: Tag[] }>('/tags'),

  /**
   * Получить тег по slug
   */
  getBySlug: (slug: string) =>
    api.get<Tag>(`/tags/${slug}`),

  // === АДМИН ===

  /**
   * Создать тег
   */
  create: (data: TagInput) =>
    api.post<Tag>('/admin/tags', data),

  /**
   * Обновить тег
   */
  update: (id: string, data: Partial<TagInput>) =>
    api.patch<Tag>(`/admin/tags/${id}`, data),

  /**
   * Удалить тег
   */
  delete: (id: string) =>
    api.delete(`/admin/tags/${id}`),

  /**
   * Получить список тегов (админ)
   */
  getAdmin: () =>
    api.get<{ items: Tag[] }>('/admin/tags'),
}
