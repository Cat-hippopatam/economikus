// server/routes/comments.routes.ts
import { Hono } from 'hono';
import { prisma } from '../db';
import { AppError } from '../lib/errors';
import { requireAuth, optionalAuth, getCurrentProfile } from '../middleware/auth';
const comments = new Hono();
// GET публичный, POST/PATCH/DELETE требуют авторизации
comments.use('/', requireAuth, { methods: ['POST'] });
comments.use('/:id', requireAuth, { methods: ['PATCH', 'DELETE'] });
// === GET /comments — список комментариев (публичный) ===
comments.get('/', optionalAuth, async (c) => {
    const type = c.req.query('type');
    const id = c.req.query('id');
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const skip = (page - 1) * limit;
    if (!type || !id)
        throw new AppError(400, 'Не указан тип или ID контента');
    const where = { commentableType: type, commentableId: id, deletedAt: null, status: 'APPROVED' };
    const [items, total] = await Promise.all([
        prisma.comment.findMany({
            where, skip, take: limit, orderBy: { createdAt: 'desc' },
            include: { author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } } }
        }),
        prisma.comment.count({ where })
    ]);
    return c.json({
        items: items.map(comment => ({
            id: comment.id, text: comment.text, likesCount: comment.likesCount, createdAt: comment.createdAt, author: comment.author
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
});
// === POST /comments — добавить комментарий ===
comments.post('/', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(401, 'Не авторизован');
    const { type, id, text } = await c.req.json();
    if (!['COURSE', 'LESSON'].includes(type))
        throw new AppError(400, 'Неверный тип контента');
    if (!text || text.trim().length < 1)
        throw new AppError(400, 'Комментарий не может быть пустым');
    if (text.length > 2000)
        throw new AppError(400, 'Комментарий слишком длинный (макс. 2000 символов)');
    const comment = await prisma.comment.create({
        data: { commentableType: type, commentableId: id, authorProfileId: profile.id, text: text.trim(), status: 'APPROVED' },
        include: { author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } } }
    });
    return c.json({
        message: 'Комментарий добавлен',
        comment: { id: comment.id, text: comment.text, likesCount: comment.likesCount, createdAt: comment.createdAt, author: comment.author }
    }, 201);
});
// === PATCH /comments/:id — редактировать комментарий ===
comments.patch('/:id', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(401, 'Не авторизован');
    const id = c.req.param('id');
    const { text } = await c.req.json();
    const comment = await prisma.comment.findFirst({ where: { id, authorProfileId: profile.id, deletedAt: null } });
    if (!comment)
        throw new AppError(404, 'Комментарий не найден');
    if (!text || text.trim().length < 1)
        throw new AppError(400, 'Комментарий не может быть пустым');
    const updated = await prisma.comment.update({
        where: { id },
        data: { text: text.trim() },
        include: { author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } } }
    });
    return c.json({
        message: 'Комментарий обновлён',
        comment: { id: updated.id, text: updated.text, likesCount: updated.likesCount, createdAt: updated.createdAt, author: updated.author }
    });
});
// === DELETE /comments/:id — удалить комментарий ===
comments.delete('/:id', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(401, 'Не авторизован');
    const id = c.req.param('id');
    const comment = await prisma.comment.findFirst({ where: { id, authorProfileId: profile.id, deletedAt: null } });
    if (!comment)
        throw new AppError(404, 'Комментарий не найден');
    await prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
    return c.json({ message: 'Комментарий удалён' });
});
export default comments;
//# sourceMappingURL=comments.routes.js.map