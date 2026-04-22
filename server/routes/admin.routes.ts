// server/routes/admin.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { requireAdmin, getCurrentProfile } from '../middleware/auth'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModuleWhereInput = any

const admin = new Hono()

// ��� ����� ������� ����� ADMIN
admin.use('*', requireAdmin)

// === DASHBOARD ===
admin.get('/stats', async (c) => {
  const [usersCount, coursesCount, lessonsCount, publishedCourses, publishedLessons, totalViews, premiumUsers] = await Promise.all([
    prisma.profile.count(),
    prisma.course.count({ where: { deletedAt: null } }),
    prisma.lesson.count({ where: { deletedAt: null } }),
    prisma.course.count({ where: { deletedAt: null, status: 'PUBLISHED' } }),
    prisma.lesson.count({ where: { deletedAt: null, status: 'PUBLISHED' } }),
    prisma.course.aggregate({ _sum: { viewsCount: true } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } })
  ])

  return c.json({
    usersCount, coursesCount, lessonsCount, publishedCourses, publishedLessons,
    totalViews: totalViews._sum.viewsCount || 0, premiumUsers
  })
})

// === USERS ===
admin.get('/users', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const search = c.req.query('search')
  const role = c.req.query('role')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { user: { email: { contains: search } } },
      { nickname: { contains: search } },
      { displayName: { contains: search } }
    ]
  }
  if (role) where.user = { role }

  const [items, total] = await Promise.all([
    prisma.profile.findMany({
      where, skip, take: limit, orderBy: { createdAt: 'desc' },
      select: { id: true, nickname: true, displayName: true, avatarUrl: true, bio: true, createdAt: true, user: { select: { id: true, email: true, role: true } }, _count: { select: { courses: true, lessons: true } } }
    }),
    prisma.profile.count({ where })
  ])

  return c.json({ items: items.map(i => ({ ...i, email: i.user.email, role: i.user.role })), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

admin.patch('/users/:id', async (c) => {
  const id = c.req.param('id')
  const { role, displayName, bio } = await c.req.json()
  const profile = await prisma.profile.findUnique({ where: { id } })
  if (!profile) return c.json({ error: '������� �� ������' }, 404)
  if (role) await prisma.user.update({ where: { id: profile.userId }, data: { role } })
  const user = await prisma.profile.update({ where: { id }, data: { displayName, bio }, include: { user: { select: { id: true, email: true, role: true } } } })
  return c.json(user)
})

admin.delete('/users/:id', async (c) => {
  await prisma.profile.delete({ where: { id: c.req.param('id') } })
  return c.json({ message: '������������ �����' })
})

// === COURSES ===
admin.get('/courses', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const status = c.req.query('status')
  const search = c.req.query('search')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { deletedAt: null }
  if (status) where.status = status
  if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }]

  const [items, total] = await Promise.all([
    prisma.course.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { author: { select: { id: true, nickname: true, displayName: true } }, tags: { include: { tag: true } }, _count: { select: { modules: true, progress: true } } } }),
    prisma.course.count({ where })
  ])

  return c.json({ items: items.map(course => ({ ...course, tags: course.tags.map(t => t.tag) })), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

admin.post('/courses', async (c) => {
  const profile = getCurrentProfile(c)
  const { title, slug, description, coverImage, difficultyLevel, duration, isPremium, status, tagIds } = await c.req.json()
  
  if (await prisma.course.findUnique({ where: { slug } })) return c.json({ error: '���� � ����� slug ��� ����������' }, 400)

  const course = await prisma.course.create({
    data: { title, slug, description, coverImage, difficultyLevel: difficultyLevel || 'BEGINNER', duration: duration || 0, lessonsCount: 0, modulesCount: 0, isPremium: isPremium || false, status: status || 'DRAFT', authorProfileId: profile!.id, tags: tagIds ? { create: tagIds.map((tagId: string) => ({ tagId })) } : undefined },
    include: { tags: { include: { tag: true } } }
  })
  return c.json(course, 201)
})

admin.patch('/courses/:id', async (c) => {
  const id = c.req.param('id')
  const { title, slug, description, coverImage, difficultyLevel, duration, isPremium, status, tagIds } = await c.req.json()

  if (slug && await prisma.course.findFirst({ where: { slug, NOT: { id } } })) return c.json({ error: '���� � ����� slug ��� ����������' }, 400)

  if (tagIds !== undefined) {
    await prisma.courseTag.deleteMany({ where: { courseId: id } })
    if (tagIds.length > 0) await prisma.courseTag.createMany({ data: tagIds.map((tagId: string) => ({ courseId: id, tagId })) })
  }

  const course = await prisma.course.update({ where: { id }, data: { title, slug, description, coverImage, difficultyLevel, duration, isPremium, status }, include: { author: { select: { id: true, nickname: true, displayName: true } }, tags: { include: { tag: true } }, modules: { orderBy: { sortOrder: 'asc' } } } })
  return c.json({ ...course, tags: course.tags.map(t => t.tag) })
})

admin.delete('/courses/:id', async (c) => {
  await prisma.course.update({ where: { id: c.req.param('id') }, data: { deletedAt: new Date() } })
  return c.json({ message: '���� �����' })
})

// === MODULES ===
admin.get('/modules', async (c) => {
  const courseId = c.req.query('courseId')
  if (!courseId) return c.json({ error: 'courseId ����������' }, 400)
  
  const modules = await prisma.module.findMany({ 
    where: { courseId }, 
    orderBy: { sortOrder: 'asc' }, 
    include: { 
      _count: { select: { lessons: true } },
      lessons: {
        where: { deletedAt: null },
        select: { id: true, title: true, lessonType: true, status: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' }
      },
      course: {
        select: { id: true, title: true }
      }
    }
  })
  return c.json({ items: modules })
})

admin.post('/modules', async (c) => {
  const { courseId, title, description, sortOrder } = await c.req.json()
  const maxOrder = await prisma.module.findFirst({ where: { courseId, deletedAt: null }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
  const module = await prisma.module.create({ data: { courseId, title, description, sortOrder: sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1, lessonsCount: 0, duration: 0 } })
  await prisma.course.update({ where: { id: courseId }, data: { modulesCount: { increment: 1 } } })
  return c.json(module, 201)
})

admin.patch('/modules/:id', async (c) => {
  const { title, description, sortOrder } = await c.req.json()
  const module = await prisma.module.update({ where: { id: c.req.param('id') }, data: { title, description, sortOrder } })
  return c.json(module)
})

admin.delete('/modules/:id', async (c) => {
  const id = c.req.param('id')
  const module = await prisma.module.findUnique({ where: { id } })
  if (!module) return c.json({ error: '������ �� ������' }, 404)
  await prisma.module.update({ where: { id }, data: { deletedAt: new Date() } })
  await prisma.course.update({ where: { id: module.courseId }, data: { modulesCount: { decrement: 1 } } })
  return c.json({ message: '������ �����' })
})

// === LESSONS ===
admin.get('/lessons', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const moduleId = c.req.query('moduleId')
  const status = c.req.query('status')
  const search = c.req.query('search')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { deletedAt: null }
  if (moduleId) where.moduleId = moduleId
  if (status) where.status = status
  if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }]

  const [items, total] = await Promise.all([
    prisma.lesson.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { author: { select: { id: true, nickname: true, displayName: true } }, module: { select: { id: true, title: true, course: { select: { id: true, title: true } } } }, tags: { include: { tag: true } } } }),
    prisma.lesson.count({ where })
  ])

  return c.json({ items: items.map(l => ({ ...l, tags: l.tags.map(t => t.tag) })), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

admin.post('/lessons', async (c) => {
  const profile = getCurrentProfile(c)
  const { moduleId, title, slug, description, lessonType, duration, isPremium, status, sortOrder, tagIds } = await c.req.json()
  
  if (await prisma.lesson.findUnique({ where: { slug } })) return c.json({ error: '���� � ����� slug ��� ����������' }, 400)

  const maxOrder = await prisma.lesson.findFirst({ where: { moduleId, deletedAt: null }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
  const lesson = await prisma.lesson.create({
    data: { moduleId, title, slug, description, lessonType: lessonType || 'ARTICLE', duration: duration || 0, isPremium: isPremium || false, status: status || 'DRAFT', sortOrder: sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1, authorProfileId: profile!.id, tags: tagIds ? { create: tagIds.map((tagId: string) => ({ tagId })) } : undefined },
    include: { tags: { include: { tag: true } } }
  })
  await prisma.module.update({ where: { id: moduleId }, data: { lessonsCount: { increment: 1 } } })
  return c.json(lesson, 201)
})

admin.patch('/lessons/:id', async (c) => {
  const id = c.req.param('id')
  const { title, slug, description, lessonType, duration, isPremium, status, sortOrder, moduleId, tagIds } = await c.req.json()

  if (slug && await prisma.lesson.findFirst({ where: { slug, NOT: { id } } })) return c.json({ error: '���� � ����� slug ��� ����������' }, 400)

  if (tagIds !== undefined) {
    await prisma.lessonTag.deleteMany({ where: { lessonId: id } })
    if (tagIds.length > 0) await prisma.lessonTag.createMany({ data: tagIds.map((tagId: string) => ({ lessonId: id, tagId })) })
  }

  const lesson = await prisma.lesson.update({ where: { id }, data: { title, slug, description, lessonType, duration, isPremium, status, sortOrder, moduleId }, include: { author: { select: { id: true, nickname: true, displayName: true } }, module: { select: { id: true, title: true, course: { select: { id: true, title: true } } } }, tags: { include: { tag: true } } } })
  return c.json({ ...lesson, tags: lesson.tags.map(t => t.tag) })
})

admin.delete('/lessons/:id', async (c) => {
  const id = c.req.param('id')
  const lesson = await prisma.lesson.findUnique({ where: { id } })
  if (!lesson) return c.json({ error: '���� �� ������' }, 404)
  await prisma.lesson.update({ where: { id }, data: { deletedAt: new Date() } })
  await prisma.module.update({ where: { id: lesson.moduleId }, data: { lessonsCount: { decrement: 1 } } })
  return c.json({ message: '���� �����' })
})

// === TAGS ===
admin.get('/tags', async (c) => {
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { courses: true, lessons: true } } } })
  return c.json({ items: tags })
})

admin.post('/tags', async (c) => {
  const { name, slug, color } = await c.req.json()
  if (await prisma.tag.findUnique({ where: { slug } })) return c.json({ error: '��� � ����� slug ��� ����������' }, 400)
  const tag = await prisma.tag.create({ data: { name, slug, color: color || '#3B82F6' } })
  return c.json(tag, 201)
})

admin.patch('/tags/:id', async (c) => {
  const id = c.req.param('id')
  const { name, slug, color } = await c.req.json()
  if (slug && await prisma.tag.findFirst({ where: { slug, NOT: { id } } })) return c.json({ error: '��� � ����� slug ��� ����������' }, 400)
  const tag = await prisma.tag.update({ where: { id }, data: { name, slug, color } })
  return c.json(tag)
})

admin.delete('/tags/:id', async (c) => {
  await prisma.tag.delete({ where: { id: c.req.param('id') } })
  return c.json({ message: '��� �����' })
})

// === AUTHOR APPLICATIONS ===
admin.get('/applications', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
  const status = c.req.query('status')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (status) where.status = status

  const [items, total] = await Promise.all([
    prisma.authorApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } },
        reviewer: { select: { id: true, nickname: true, displayName: true } }
      }
    }),
    prisma.authorApplication.count({ where })
  ])

  return c.json({
    items: items.map(a => ({
      id: a.id,
      motivation: a.motivation,
      experience: a.experience,
      portfolioUrl: a.portfolioUrl,
      status: a.status,
      rejectionReason: a.rejectionReason,
      createdAt: a.createdAt,
      reviewedAt: a.reviewedAt,
      profile: a.profile,
      reviewer: a.reviewer
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  })
})

admin.patch('/applications/:id', async (c) => {
 const profile = getCurrentProfile(c)
 if (!profile) return c.json({ error: '������� �� ������' },404)

 const id = c.req.param('id')
 const { action, rejectionReason } = await c.req.json() // action: 'approve' | 'reject'

 const application = await prisma.authorApplication.findUnique({ where: { id } })
 if (!application) return c.json({ error: '������ �� �������' },404)

 if (application.status !== 'PENDING') {
 return c.json({ error: '������ ��� �����������' },400)
 }

 if (action === 'approve') {
 // ������ ������ ������
 await prisma.authorApplication.update({
 where: { id },
 data: { status: 'APPROVED', reviewedBy: profile.id, reviewedAt: new Date() }
 })
 // ������ ���� ������������ �� AUTHOR
 const userProfile = await prisma.profile.findUnique({ where: { id: application.profileId } })
 if (userProfile) {
 await prisma.user.update({
 where: { id: userProfile.userId },
 data: { role: 'AUTHOR' }
 })
 }
 return c.json({ message: '������ ��������, ������������ ������ �����' })
 } else if (action === 'reject') {
 await prisma.authorApplication.update({
 where: { id },
 data: {
 status: 'REJECTED',
 reviewedBy: profile.id,
 reviewedAt: new Date(),
 rejectionReason: rejectionReason || '������� �� �������'
 }
 })
 return c.json({ message: '������ ���������' })
 }

 return c.json({ error: '�������� ��������' },400)
})

// === ACCOUNT DELETION REQUESTS ===
admin.get('/account-deletion-requests', async (c) => {
 const page = Math.max(1, parseInt(c.req.query('page') || '1'))
 const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
 const status = c.req.query('status')
 const skip = (page -1) * limit

 const where: Record<string, unknown> = {}
 if (status) where.status = status

 const [items, total] = await Promise.all([
 prisma.accountDeletionRequest.findMany({
 where,
 skip,
 take: limit,
 orderBy: { createdAt: 'desc' },
 include: {
 profile: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } },
 processor: { select: { id: true, nickname: true, displayName: true } }
 }
 }),
 prisma.accountDeletionRequest.count({ where })
 ])

 return c.json({
 items: items.map(r => ({
 id: r.id,
 email: r.email,
 reason: r.reason,
 status: r.status,
 rejectionReason: r.rejectionReason,
 createdAt: r.createdAt,
 processedAt: r.processedAt,
 profile: r.profile,
 processor: r.processor
 })),
 pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
 })
})

admin.post('/account-deletion-requests/:id/complete', async (c) => {
 const profile = getCurrentProfile(c)
 if (!profile) return c.json({ error: '������� �� ������' },404)

 const id = c.req.param('id')

 const request = await prisma.accountDeletionRequest.findUnique({ where: { id } })
 if (!request) return c.json({ error: '������ �� �������' },404)

 if (request.status !== 'PENDING') {
 return c.json({ error: '������ ��� �����������' },400)
 }

 // ������� ��������� ������ ������ (�� �������� ������!)
 await prisma.accountDeletionRequest.update({
 where: { id },
 data: {
 status: 'COMPLETED',
 processedBy: profile.id,
 processedAt: new Date()
 }
 })

 // ������� ��� ������ ������������
 await prisma.session.deleteMany({ where: { userId: request.userId } })

 // ������� �������� (OAuth)
 await prisma.account.deleteMany({ where: { userId: request.userId } })

 // ������� ������� (�������� �������� ��� ��������� ������)
 await prisma.profile.delete({ where: { id: request.profileId } })

 // ������� ������������
 await prisma.user.delete({ where: { id: request.userId } })

 return c.json({ message: '������� �����, ������ ���������' })
})

admin.post('/account-deletion-requests/:id/reject', async (c) => {
 const profile = getCurrentProfile(c)
 if (!profile) return c.json({ error: '������� �� ������' },404)

 const id = c.req.param('id')
 const { rejectionReason } = await c.req.json()

 const request = await prisma.accountDeletionRequest.findUnique({ where: { id } })
 if (!request) return c.json({ error: '������ �� �������' },404)

 if (request.status !== 'PENDING') {
 return c.json({ error: '������ ��� �����������' },400)
 }

 await prisma.accountDeletionRequest.update({
 where: { id },
 data: {
 status: 'REJECTED',
 processedBy: profile.id,
 processedAt: new Date(),
 rejectionReason: rejectionReason || '������� �� �������'
 }
 })

 return c.json({ message: '������ ���������' })
})

// === LESSON CONTENT (Moderation) ===
admin.get('/lessons/:id/content', async (c) => {
 const id = c.req.param('id')

 const lesson = await prisma.lesson.findUnique({
 where: { id, deletedAt: null },
 select: {
 id: true,
 title: true,
 slug: true,
 lessonType: true,
 status: true,
 module: {
 select: {
 id: true,
 title: true,
 course: { select: { id: true, title: true, slug: true } }
 }
 },
 author: { select: { id: true, nickname: true, displayName: true } }
 }
 })

 if (!lesson) {
 return c.json({ error: '���� �� ������' },404)
 }

 // �������� ������� � ����������� �� ���� �����
 let content = null

 if (lesson.lessonType === 'ARTICLE') {
 const textContent = await prisma.textContent.findUnique({
 where: { lessonId: id }
 })
 content = textContent ? { type: 'text', body: textContent.body } : null
 } else if (lesson.lessonType === 'VIDEO') {
 const videoContent = await prisma.videoContent.findUnique({
 where: { lessonId: id }
 })
 content = videoContent ? { type: 'video', videoUrl: videoContent.videoUrl, platform: videoContent.platform } : null
 } else if (lesson.lessonType === 'AUDIO') {
 const audioContent = await prisma.audioContent.findUnique({
 where: { lessonId: id }
 })
 content = audioContent ? { type: 'audio', audioUrl: audioContent.audioUrl } : null
 } else if (lesson.lessonType === 'QUIZ') {
 const quizContent = await prisma.quizContent.findUnique({
 where: { lessonId: id }
 })
 content = quizContent ? { type: 'quiz', questions: quizContent.questions, passingScore: quizContent.passingScore } : null
 }

 return c.json({
 lesson,
 content
 })
})

export default admin


