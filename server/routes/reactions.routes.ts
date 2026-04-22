// server/routes/reactions.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import { requireAuth, optionalAuth, getCurrentProfile } from '../middleware/auth'

const reactions = new Hono()

// POST и DELETE требуют авторизации
reactions.use('/', requireAuth)

// === GET /reactions — получить реакции для контента ===
reactions.get('/', optionalAuth, async (c) => {
  const type = c.req.query('type') as 'COURSE' | 'LESSON' | 'COMMENT' | null
  const id = c.req.query('id')

  if (!type || !id) return c.json({ likes: 0, dislikes: 0, userReaction: null })

  const [likes, dislikes] = await Promise.all([
    prisma.reaction.count({ where: { reactionableType: type, reactionableId: id, type: 'LIKE' } }),
    prisma.reaction.count({ where: { reactionableType: type, reactionableId: id, type: 'DISLIKE' } })
  ])

  let userReaction = null
  const profile = getCurrentProfile(c)
  if (profile) {
    const reaction = await prisma.reaction.findUnique({
      where: { profileId_reactionableType_reactionableId: { profileId: profile.id, reactionableType: type, reactionableId: id } }
    })
    userReaction = reaction?.type || null
  }

  return c.json({ likes, dislikes, userReaction })
})

// === POST /reactions — поставить/изменить реакцию ===
reactions.post('/', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Не авторизован')

  const { type, reactionType, id: reactionableId } = await c.req.json()

  if (!['COURSE', 'LESSON', 'COMMENT'].includes(type)) throw new AppError(400, 'Неверный тип контента')
  if (!['LIKE', 'DISLIKE'].includes(reactionType)) throw new AppError(400, 'Неверный тип реакции')

  const existing = await prisma.reaction.findUnique({
    where: { profileId_reactionableType_reactionableId: { profileId: profile.id, reactionableType: type, reactionableId } }
  })

  if (existing) {
    if (existing.type === reactionType) {
      await prisma.reaction.delete({ where: { id: existing.id } })
      if (type === 'COURSE') await prisma.course.update({ where: { id: reactionableId }, data: { likesCount: { decrement: reactionType === 'LIKE' ? 1 : 0 } } })
      else if (type === 'LESSON') await prisma.lesson.update({ where: { id: reactionableId }, data: { likesCount: { decrement: reactionType === 'LIKE' ? 1 : 0 } } })
      return c.json({ message: 'Реакция удалена', reaction: null })
    } else {
      const updated = await prisma.reaction.update({ where: { id: existing.id }, data: { type: reactionType } })
      return c.json({ message: 'Реакция изменена', reaction: updated })
    }
  }

  const reaction = await prisma.reaction.create({
    data: { profileId: profile.id, reactionableType: type, reactionableId, type: reactionType }
  })

  if (type === 'COURSE') await prisma.course.update({ where: { id: reactionableId }, data: { likesCount: { increment: reactionType === 'LIKE' ? 1 : 0 } } })
  else if (type === 'LESSON') await prisma.lesson.update({ where: { id: reactionableId }, data: { likesCount: { increment: reactionType === 'LIKE' ? 1 : 0 } } })

  return c.json({ message: 'Реакция добавлена', reaction }, 201)
})

// === DELETE /reactions — удалить реакцию ===
reactions.delete('/', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Не авторизован')

  const { type, id } = await c.req.json()

  const reaction = await prisma.reaction.findUnique({
    where: { profileId_reactionableType_reactionableId: { profileId: profile.id, reactionableType: type, reactionableId: id } }
  })

  if (!reaction) throw new AppError(404, 'Реакция не найдена')

  await prisma.reaction.delete({ where: { id: reaction.id } })

  if (type === 'COURSE') await prisma.course.update({ where: { id }, data: { likesCount: { decrement: reaction.type === 'LIKE' ? 1 : 0 } } })
  else if (type === 'LESSON') await prisma.lesson.update({ where: { id }, data: { likesCount: { decrement: reaction.type === 'LIKE' ? 1 : 0 } } })

  return c.json({ message: 'Реакция удалена' })
})

export default reactions


