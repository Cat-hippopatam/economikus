// server/routes/user.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import { requireAuth, getCurrentUser, getCurrentProfile } from '../middleware/auth'
import { compare, hash } from 'bcryptjs'
import type { FavoriteWhereInput } from '../types'

const user = new Hono()

// ���������� �����
user.use('/me', requireAuth)
user.use('/profile', requireAuth)
user.use('/password', requireAuth)
user.use('/avatar', requireAuth)
user.use('/history', requireAuth)
user.use('/favorites', requireAuth)
user.use('/progress', requireAuth)
user.use('/certificates', requireAuth)
user.use('/account-deletion', requireAuth)

// === GET /user/me � ������� ������������ ===
user.get('/me', async (c) => {
  const user = getCurrentUser(c)
  const profile = getCurrentProfile(c)

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profile: profile ? {
        id: profile.id,
        nickname: profile.nickname,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio
      } : null
    }
  })
})

// === PATCH /user/profile � ���������� ������� ===
user.patch('/profile', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(400, '������� �� ������')

  const body = await c.req.json()
  const { displayName, bio, website, telegram, youtube } = body

  // Type assertion для расширенных полей профиля
  const profileData = profile as typeof profile & { website?: string | null; telegram?: string | null; youtube?: string | null }

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: {
      displayName: displayName || profile.displayName,
      bio: bio ?? profile.bio,
      website: website ?? profileData.website,
      telegram: telegram ?? profileData.telegram,
      youtube: youtube ?? profileData.youtube
    }
  })

  return c.json({
    message: '������� �������',
    profile: {
      id: updated.id,
      nickname: updated.nickname,
      displayName: updated.displayName,
      avatarUrl: updated.avatarUrl,
      bio: updated.bio,
      website: updated.website,
      telegram: updated.telegram,
      youtube: updated.youtube
    }
  })
})

// === PATCH /user/password � ����� ������ ===
user.patch('/password', async (c) => {
  const user = getCurrentUser(c)
  const body = await c.req.json()
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw new AppError(400, '������� ������� � ����� ������')
  }

  if (newPassword.length < 6) {
    throw new AppError(400, '������ ������ ���� ������� 6 ��������')
  }

  // ��������� ������� ������
  const isValid = await compare(currentPassword, user.passwordHash)
  if (!isValid) {
    throw new AppError(400, '�������� ������� ������')
  }

  // �������� ����� ������
  const newPasswordHash = await hash(newPassword, 10)

  // ��������� ������
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash }
  })

  return c.json({ message: '������ ������� �������' })
})

// === POST /user/avatar � �������� ������� ===
user.post('/avatar', async (c) => {
  try {
    const profile = getCurrentProfile(c)
    if (!profile) throw new AppError(400, '������� �� ������')

    // ��������� ������� �����
    const contentType = c.req.header('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      throw new AppError(400, '��������� FormData')
    }

    // �������� ������ �� FormData
    const formData = await c.req.parseBody()
    const file = formData.avatar as File | null

    if (!file || !(file instanceof File)) {
      throw new AppError(400, '���� �� ��������')
    }

    // ��������� ��� �����
    if (!file.type.startsWith('image/')) {
      throw new AppError(400, '��������� ������ �����������')
    }

    // ��������� ������ (���� 2MB ��� base64)
    if (file.size > 2 * 1024 * 1024) {
      throw new AppError(400, '������������ ������: 2MB')
    }

    // ������������ � base64
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // ��������� ������ dataUrl (MySQL TEXT = 65535 ����)
    if (dataUrl.length > 65535) {
      throw new AppError(400, '����������� ������� �������. ��������� ���� ������ 1MB')
    }

    // ��������� �������
    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: { avatarUrl: dataUrl }
    })

    return c.json({ 
      message: '������ ��������',
      avatarUrl: updated.avatarUrl 
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    if (error instanceof AppError) throw error
    throw new AppError(500, '������ �������� �������')
  }
})

// === DELETE /user/avatar � �������� ������� ===
user.delete('/avatar', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(400, '������� �� ������')

  await prisma.profile.update({
    where: { id: profile.id },
    data: { avatarUrl: null }
  })

  return c.json({ message: '������ �����' })
})

// === GET /user/history � ������� ���������� ===
user.get('/history', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) return c.json({ items: [] })

  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.history.findMany({
      where: { profileId: profile.id },
      orderBy: { viewedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        historableType: true,
        historableId: true,
        watchedSeconds: true,
        completed: true,
        viewedAt: true
      }
    }),
    prisma.history.count({ where: { profileId: profile.id } })
  ])

  // �������� ������ ������ ��������
  const lessonIds = items.filter(i => i.historableType === 'LESSON').map(i => i.historableId)
  const lessonsMap = new Map()
  
  if (lessonIds.length > 0) {
    const lessons = await prisma.lesson.findMany({
      where: { id: { in: lessonIds } },
      select: {
        id: true,
        title: true,
        slug: true,
        lessonType: true,
        module: {
          select: {
            course: {
              select: {
                slug: true,
                title: true
              }
            }
          }
        }
      }
    })
    
    lessons.forEach(lesson => {
      lessonsMap.set(lesson.id, lesson)
    })
  }

  // ��������� ������ ������ � �����������
  const itemsWithLessons = items.map(item => ({
    ...item,
    lesson: item.historableType === 'LESSON' ? lessonsMap.get(item.historableId) : null
  }))

  return c.json({ items: itemsWithLessons, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

// === POST /user/history � �������� � ������� ===
user.post('/history', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, '���������� �����������')

  const { lessonId, watchedSeconds = 0, completed = false } = await c.req.json()

  if (!lessonId) {
    throw new AppError(400, '���������� ������� lessonId')
  }

  // ��������� ������������� ����� � �������� courseId
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { 
      module: { 
        select: { 
          courseId: true,
          course: {
            select: {
              id: true,
              title: true
            }
          }
        } 
      } 
    }
  })

  if (!lesson) {
    throw new AppError(404, '���� �� ������')
  }

  const courseId = lesson.module?.courseId

  // ������ ��� ��������� ������ � �������
  const historyItem = await prisma.history.upsert({
    where: {
      profileId_historableType_historableId: {
        profileId: profile.id,
        historableType: 'LESSON',
        historableId: lessonId
      }
    },
    create: {
      profileId: profile.id,
      historableType: 'LESSON',
      historableId: lessonId,
      watchedSeconds,
      completed
    },
    update: {
      watchedSeconds,
      completed,
      viewedAt: new Date()
    }
  })

  // ������ ��� ��������� �������� �����
  try {
    await prisma.lessonProgress.upsert({
      where: { 
        profileId_lessonId: {
          profileId: profile.id,
          lessonId
        }
      },
      create: {
        profileId: profile.id,
        lessonId,
        status: completed ? 'COMPLETED' : 'IN_PROGRESS',
        progressPercent: completed ? 100 : Math.min(50, Math.round((watchedSeconds / 300) * 100)), // ���� 5 ��� - 50%
        startedAt: new Date(),
        completedAt: completed ? new Date() : null
      },
      update: {
        status: completed ? 'COMPLETED' : 'IN_PROGRESS',
        progressPercent: completed ? 100 : undefined,
        completedAt: completed ? new Date() : undefined,
        lastPosition: watchedSeconds || undefined
      }
    })
  } catch (err) {
    console.error('Error updating lesson progress:', err)
  }

  // ��������� �������� �����
  if (courseId) {
    try {
      // �������� ��� ����� �����
      const modules = await prisma.module.findMany({
        where: { courseId, isPublished: true },
        include: {
          lessons: {
            where: { deletedAt: null, status: 'PUBLISHED' },
            select: { id: true }
          }
        }
      })

      const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id))
      const totalLessons = allLessonIds.length

      if (totalLessons > 0) {
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            profileId: profile.id,
            lessonId: { in: allLessonIds },
            status: 'COMPLETED'
          }
        })

        const progressPercent = Math.round((completedLessons / totalLessons) * 100)
        const status = progressPercent === 100 ? 'COMPLETED' : progressPercent > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'

        await prisma.courseProgress.upsert({
          where: {
            profileId_courseId: {
              profileId: profile.id,
              courseId
            }
          },
          create: {
            profileId: profile.id,
            courseId,
            status,
            progressPercent,
            completedLessons,
            totalLessons,
            lastViewedAt: new Date()
          },
          update: {
            status,
            progressPercent,
            completedLessons,
            totalLessons,
            lastViewedAt: new Date()
          }
        })
      }
    } catch (err) {
      console.error('Error updating course progress:', err)
    }
  }

  return c.json({ message: '������� ���������', history: historyItem })
})

// === GET /user/favorites � ��������� ===
user.get('/favorites', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) return c.json({ items: [] })

  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const skip = (page - 1) * limit
  const collection = c.req.query('collection')

  const where: FavoriteWhereInput = { profileId: profile.id }
  if (collection) where.collection = collection

  const [items, total] = await Promise.all([
    prisma.favorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        note: true,
        collection: true,
        createdAt: true,
        lesson: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            duration: true,
            lessonType: true,
            module: {
              select: {
                course: {
                  select: {
                    slug: true
                  }
                }
              }
            }
          }
        }
      }
    }),
    prisma.favorite.count({ where })
  ])

  return c.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

// === POST /user/favorites � �������� � ��������� ===
user.post('/favorites', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(400, '������� �� ������')

  const { lessonId, note, collection } = await c.req.json()

  const existing = await prisma.favorite.findUnique({
    where: { profileId_lessonId: { profileId: profile.id, lessonId } }
  })

  if (existing) throw new AppError(400, '��� � ���������')

  const favorite = await prisma.favorite.create({
    data: { profileId: profile.id, lessonId, note, collection }
  })

  return c.json({ message: '��������� � ���������', favorite }, 201)
})

// === DELETE /user/favorites/:id � ������� �� ���������� ===
user.delete('/favorites/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(400, '������� �� ������')

  const id = c.req.param('id')

  const favorite = await prisma.favorite.findFirst({
    where: { id, profileId: profile.id }
  })

  if (!favorite) throw new AppError(404, '�� �������')

  await prisma.favorite.delete({ where: { id } })

  return c.json({ message: '������� �� ����������' })
})

// === GET /user/progress/courses � �������� �� ������ ===
user.get('/progress/courses', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) return c.json({ items: [] })

  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.courseProgress.findMany({
      where: { profileId: profile.id },
      orderBy: { lastViewedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        progressPercent: true,
        completedLessons: true,
        totalLessons: true,
        lastViewedAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            lessonsCount: true,
            modulesCount: true
          }
        }
      }
    }),
    prisma.courseProgress.count({ where: { profileId: profile.id } })
  ])

  return c.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

// === GET /user/certificates � ����������� ===
user.get('/certificates', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) return c.json({ items: [] })

  const certificates = await prisma.certificate.findMany({
    where: { profileId: profile.id },
    orderBy: { issuedAt: 'desc' },
    select: {
      id: true,
      certificateNumber: true,
      issuedAt: true,
      course: { select: { id: true, title: true, slug: true } }
    }
  })

  return c.json({ items: certificates })
})

// === PUBLIC: GET /user/profile/:nickname � ��������� ������� ===
user.get('/profile/:nickname', async (c) => {
  const nickname = c.req.param('nickname')

  const profile = await prisma.profile.findUnique({
    where: { nickname },
    select: {
      id: true,
      nickname: true,
      displayName: true,
      avatarUrl: true,
      coverImage: true,
      bio: true,
      website: true,
      telegram: true,
      youtube: true,
      totalViews: true,
      subscribers: true,
      createdAt: true,
      user: { select: { id: true, role: true } }
    }
  })

  if (!profile) return c.json({ error: '������� �� ������' }, 404)

  // �������� ����� ������, ���� ��� �����
  let courses: Record<string, unknown>[] = []
  let coursesCount = 0
  let lessonsCount = 0
  
  if (profile.user.role === 'AUTHOR') {
    // ������ �������������� �����
    courses = await prisma.course.findMany({
      where: { authorProfileId: profile.id, deletedAt: null, status: 'PUBLISHED' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, coverImage: true, difficultyLevel: true, viewsCount: true, lessonsCount: true }
    })
    
    // ������� ������ �������������� ������
    coursesCount = await prisma.course.count({
      where: { authorProfileId: profile.id, deletedAt: null, status: 'PUBLISHED' }
    })
    
    // ������� ������ �������������� ������
    lessonsCount = await prisma.lesson.count({
      where: { 
        authorProfileId: profile.id, 
        deletedAt: null, 
        status: 'PUBLISHED' 
      }
    })
  }

  // ������� ������������
  const certificatesCount = await prisma.certificate.count({
    where: { profileId: profile.id }
  })

 return c.json({ 
 profile, 
 courses,
 counts: {
 courses: coursesCount,
 lessons: lessonsCount,
 certificates: certificatesCount
 }
 })
})

// === POST /user/account-deletion � ������ ������ �� �������� �������� ===
user.post('/account-deletion', async (c) => {
 const user = getCurrentUser(c)
 const profile = getCurrentProfile(c)
  
 if (!profile) throw new AppError(400, '������� �� ������')
  
 const { reason } = await c.req.json().catch(() => ({}))

 // ���������, ��� �� ��� �������� ������
 const existingRequest = await prisma.accountDeletionRequest.findFirst({
 where: { 
 userId: user.id,
 status: 'PENDING'
 }
 })

 if (existingRequest) {
 throw new AppError(400, '� ��� ��� ���� �������� ������ �� �������� ��������')
 }

 // ������ ������
 const deletionRequest = await prisma.accountDeletionRequest.create({
 data: {
 userId: user.id,
 profileId: profile.id,
 email: user.email,
 reason: reason || null,
 status: 'PENDING'
 }
 })

 return c.json({ 
 message: '������ �� �������� �������� ������. �� �������� � ���� �� email ��� �������������.',
 requestId: deletionRequest.id,
 status: deletionRequest.status
 },201)
})

// === GET /user/account-deletion/status � ��������� ������ ������ ===
user.get('/account-deletion/status', async (c) => {
 const user = getCurrentUser(c)
  
 const request = await prisma.accountDeletionRequest.findFirst({
 where: { 
 userId: user.id,
 status: 'PENDING'
 },
 orderBy: { createdAt: 'desc' }
 })

 if (!request) {
 return c.json({ hasPendingRequest: false })
 }

 return c.json({ 
 hasPendingRequest: true,
 requestId: request.id,
 status: request.status,
 createdAt: request.createdAt
 })
})

// === DELETE /user/account-deletion � �������� ������ ===
user.delete('/account-deletion', async (c) => {
 const user = getCurrentUser(c)
  
 const request = await prisma.accountDeletionRequest.findFirst({
 where: { 
 userId: user.id,
 status: 'PENDING'
 }
 })

 if (!request) {
 throw new AppError(404, '�������� ������ �� �������')
 }

 await prisma.accountDeletionRequest.update({
 where: { id: request.id },
 data: { status: 'CANCELLED' }
 })

 return c.json({ message: '������ ��������' })
})

export default user


