// server/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import authRoutes from './routes/auth.routes'
import coursesRoutes from './routes/courses.routes'
import lessonsRoutes from './routes/lessons.routes'
import userRoutes from './routes/user.routes'
import tagsRoutes from './routes/tags.routes'
import reactionsRoutes from './routes/reactions.routes'
import commentsRoutes from './routes/comments.routes'
import adminRoutes from './routes/admin.routes'
import 'dotenv/config'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))

// OpenAPI документация
app.get('/api/doc', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: 'Economikus API',
      version: '1.0.0',
      description: 'API образовательной платформы Economikus'
    },
    servers: [
      { url: '/api', description: 'API Server' }
    ],
    tags: [
      { name: 'Auth', description: 'Авторизация и регистрация' },
      { name: 'Courses', description: 'Курсы' },
      { name: 'Lessons', description: 'Уроки' },
      { name: 'User', description: 'Пользователь' },
      { name: 'Tags', description: 'Теги' },
      { name: 'Reactions', description: 'Реакции' },
      { name: 'Comments', description: 'Комментарии' }
    ],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Регистрация пользователя',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'firstName', 'lastName', 'nickname', 'acceptTerms'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    nickname: { type: 'string', minLength: 3, maxLength: 30 },
                    acceptTerms: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Пользователь создан' },
            '400': { description: 'Ошибка валидации' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Авторизация',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Успешный вход' },
            '401': { description: 'Неверные данные' }
          }
        }
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Выход из системы',
          responses: {
            '200': { description: 'Успешный выход' }
          }
        }
      },
      '/courses': {
        get: {
          tags: ['Courses'],
          summary: 'Список курсов',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] } },
            { name: 'difficulty', in: 'query', schema: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] } },
            { name: 'tag', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'isPremium', in: 'query', schema: { type: 'boolean' } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['newest', 'popular', 'title'] } }
          ],
          responses: {
            '200': { description: 'Список курсов' }
          }
        }
      },
      '/courses/{slug}': {
        get: {
          tags: ['Courses'],
          summary: 'Детали курса',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': { description: 'Детали курса' },
            '404': { description: 'Курс не найден' }
          }
        }
      },
      '/courses/{slug}/modules': {
        get: {
          tags: ['Courses'],
          summary: 'Модули курса',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': { description: 'Список модулей' }
          }
        }
      },
      '/lessons': {
        get: {
          tags: ['Lessons'],
          summary: 'Список уроков',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
            { name: 'lessonType', in: 'query', schema: { type: 'string', enum: ['ARTICLE', 'VIDEO', 'AUDIO', 'QUIZ', 'CALCULATOR'] } },
            { name: 'tag', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'isPremium', in: 'query', schema: { type: 'boolean' } }
          ],
          responses: {
            '200': { description: 'Список уроков' }
          }
        }
      },
      '/lessons/{slug}': {
        get: {
          tags: ['Lessons'],
          summary: 'Детали урока',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': { description: 'Детали урока' },
            '404': { description: 'Урок не найден' }
          }
        }
      },
      '/lessons/{slug}/content': {
        get: {
          tags: ['Lessons'],
          summary: 'Контент урока',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': { description: 'Контент урока' },
            '404': { description: 'Урок не найден' }
          }
        }
      },
      '/user/me': {
        get: {
          tags: ['User'],
          summary: 'Текущий пользователь',
          responses: {
            '200': { description: 'Профиль пользователя' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/user/profile': {
        patch: {
          tags: ['User'],
          summary: 'Обновить профиль',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    displayName: { type: 'string' },
                    bio: { type: 'string' },
                    avatarUrl: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Профиль обновлён' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/user/profile/{nickname}': {
        get: {
          tags: ['User'],
          summary: 'Публичный профиль',
          parameters: [
            { name: 'nickname', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': { description: 'Профиль пользователя' },
            '404': { description: 'Пользователь не найден' }
          }
        }
      },
      '/user/favorites': {
        get: {
          tags: ['User'],
          summary: 'Избранное',
          responses: {
            '200': { description: 'Список избранного' },
            '401': { description: 'Не авторизован' }
          }
        },
        post: {
          tags: ['User'],
          summary: 'Добавить в избранное',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['lessonId'],
                  properties: {
                    lessonId: { type: 'string', format: 'uuid' },
                    note: { type: 'string' },
                    collection: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Добавлено' },
            '400': { description: 'Уже в избранном' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/user/favorites/{id}': {
        delete: {
          tags: ['User'],
          summary: 'Удалить из избранного',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          responses: {
            '200': { description: 'Удалено' },
            '404': { description: 'Не найдено' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/user/history': {
        get: {
          tags: ['User'],
          summary: 'История просмотров',
          responses: {
            '200': { description: 'История' },
            '401': { description: 'Не авторизован' }
          }
        },
        post: {
          tags: ['User'],
          summary: 'Добавить в историю',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['lessonId'],
                  properties: {
                    lessonId: { type: 'string', format: 'uuid' },
                    watchedSeconds: { type: 'integer' },
                    completed: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'История обновлена' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/user/progress/courses': {
        get: {
          tags: ['User'],
          summary: 'Прогресс по курсам',
          responses: {
            '200': { description: 'Прогресс' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/user/progress/lessons/{id}': {
        get: {
          tags: ['User'],
          summary: 'Прогресс по уроку',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          responses: {
            '200': { description: 'Прогресс' },
            '401': { description: 'Не авторизован' }
          }
        },
        post: {
          tags: ['User'],
          summary: 'Обновить прогресс урока',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    progressPercent: { type: 'integer' },
                    lastPosition: { type: 'integer' },
                    quizScore: { type: 'integer' },
                    quizCompleted: { type: 'boolean' },
                    completed: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Прогресс обновлён' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/user/certificates': {
        get: {
          tags: ['User'],
          summary: 'Сертификаты',
          responses: {
            '200': { description: 'Сертификаты' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/tags': {
        get: {
          tags: ['Tags'],
          summary: 'Список тегов',
          responses: {
            '200': { description: 'Список тегов' }
          }
        }
      },
      '/tags/{slug}/courses': {
        get: {
          tags: ['Tags'],
          summary: 'Курсы по тегу',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': { description: 'Список курсов' }
          }
        }
      },
      '/tags/{slug}/lessons': {
        get: {
          tags: ['Tags'],
          summary: 'Уроки по тегу',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': { description: 'Список уроков' }
          }
        }
      },
      '/reactions': {
        get: {
          tags: ['Reactions'],
          summary: 'Получить реакции',
          parameters: [
            { name: 'type', in: 'query', required: true, schema: { type: 'string', enum: ['COURSE', 'LESSON', 'COMMENT'] } },
            { name: 'id', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          responses: {
            '200': { description: 'Реакции' }
          }
        },
        post: {
          tags: ['Reactions'],
          summary: 'Добавить реакцию',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['type', 'id', 'reactionType'],
                  properties: {
                    type: { type: 'string', enum: ['COURSE', 'LESSON', 'COMMENT'] },
                    id: { type: 'string', format: 'uuid' },
                    reactionType: { type: 'string', enum: ['LIKE', 'DISLIKE'] }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Реакция добавлена' },
            '401': { description: 'Не авторизован' }
          }
        },
        delete: {
          tags: ['Reactions'],
          summary: 'Удалить реакцию',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['type', 'id'],
                  properties: {
                    type: { type: 'string', enum: ['COURSE', 'LESSON', 'COMMENT'] },
                    id: { type: 'string', format: 'uuid' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Реакция удалена' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/comments': {
        get: {
          tags: ['Comments'],
          summary: 'Список комментариев',
          parameters: [
            { name: 'type', in: 'query', required: true, schema: { type: 'string', enum: ['COURSE', 'LESSON'] } },
            { name: 'id', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          responses: {
            '200': { description: 'Комментарии' }
          }
        },
        post: {
          tags: ['Comments'],
          summary: 'Добавить комментарий',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['type', 'id', 'text'],
                  properties: {
                    type: { type: 'string', enum: ['COURSE', 'LESSON'] },
                    id: { type: 'string', format: 'uuid' },
                    text: { type: 'string', minLength: 1, maxLength: 2000 }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Комментарий добавлен' },
            '401': { description: 'Не авторизован' }
          }
        }
      },
      '/comments/{id}': {
        patch: {
          tags: ['Comments'],
          summary: 'Редактировать комментарий',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['text'],
                  properties: {
                    text: { type: 'string', minLength: 1, maxLength: 2000 }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Комментарий обновлён' },
            '401': { description: 'Не авторизован' },
            '404': { description: 'Комментарий не найден' }
          }
        },
        delete: {
          tags: ['Comments'],
          summary: 'Удалить комментарий',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          responses: {
            '200': { description: 'Комментарий удалён' },
            '401': { description: 'Не авторизован' },
            '404': { description: 'Комментарий не найден' }
          }
        }
      }
    }
  })
})

// Swagger UI
app.get('/api/swagger', swaggerUI({ url: '/api/doc' }))

// API роуты
app.route('/api/auth', authRoutes)
app.route('/api/courses', coursesRoutes)
app.route('/api/lessons', lessonsRoutes)
app.route('/api/user', userRoutes)
app.route('/api/tags', tagsRoutes)
app.route('/api/reactions', reactionsRoutes)
app.route('/api/comments', commentsRoutes)
app.route('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT) || 3000

console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

export default app