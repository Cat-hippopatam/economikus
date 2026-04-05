// server/routes/moderation.routes.ts
import { Hono } from 'hono';
import { prisma } from '../db';
import { requireAdmin } from '../middleware/auth';
const moderation = new Hono();
// ��� ����� ������� ����� ADMIN (��� MODERATOR � �������)
moderation.use('*', requireAdmin);
// === GET /admin/moderation/comments � ����������� �� ��������� ===
moderation.get('/comments', async (c) => {
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const status = c.req.query('status') || 'PENDING';
    const skip = (page - 1) * limit;
    const where = { deletedAt: null };
    if (status !== 'ALL')
        where.status = status;
    const [items, total] = await Promise.all([
        prisma.comment.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                text: true,
                status: true,
                createdAt: true,
                commentableType: true,
                commentableId: true,
                author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } }
            }
        }),
        prisma.comment.count({ where })
    ]);
    return c.json({
        items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
});
// === PATCH /admin/moderation/comments/:id � �������� ������ ����������� ===
moderation.patch('/comments/:id', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return c.json({ error: '�������� ������' }, 400);
    }
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment)
        return c.json({ error: '����������� �� ������' }, 404);
    const updated = await prisma.comment.update({
        where: { id },
        data: { status }
    });
    return c.json({ message: '������ �������', comment: updated });
});
// === DELETE /admin/moderation/comments/:id � ������� ����������� ===
moderation.delete('/comments/:id', async (c) => {
    const id = c.req.param('id');
    await prisma.comment.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
    return c.json({ message: '����������� �����' });
});
// === GET /admin/moderation/content � ������� �� ��������� ===
moderation.get('/content', async (c) => {
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const status = c.req.query('status') || 'PENDING_REVIEW';
    const type = c.req.query('type');
    const skip = (page - 1) * limit;
    const results = [];
    let total = 0;
    if (!type || type === 'COURSE') {
        const where = { deletedAt: null, status };
        const [courses, count] = await Promise.all([
            prisma.course.findMany({
                where,
                skip: type ? skip : undefined,
                take: type ? limit : undefined,
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    createdAt: true,
                    author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } }
                }
            }),
            prisma.course.count({ where })
        ]);
        results.push(...courses.map(c => ({ ...c, type: 'COURSE' })));
        total += count;
    }
    if (!type || type === 'LESSON') {
        const where = { deletedAt: null, status };
        const [lessons, count] = await Promise.all([
            prisma.lesson.findMany({
                where,
                skip: type ? skip : undefined,
                take: type ? limit : undefined,
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    createdAt: true,
                    author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } }
                }
            }),
            prisma.lesson.count({ where })
        ]);
        results.push(...lessons.map(l => ({ ...l, type: 'LESSON' })));
        total += count;
    }
    results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const paginated = type ? results : results.slice(skip, skip + limit);
    return c.json({
        items: paginated,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
});
// === GET /admin/moderation/stats � ���������� ��������� ===
moderation.get('/stats', async (c) => {
    const [pendingComments, pendingCourses, pendingLessons] = await Promise.all([
        prisma.comment.count({ where: { status: 'PENDING', deletedAt: null } }),
        prisma.course.count({ where: { status: 'PENDING_REVIEW', deletedAt: null } }),
        prisma.lesson.count({ where: { status: 'PENDING_REVIEW', deletedAt: null } })
    ]);
    return c.json({
        pendingComments,
        pendingContent: pendingCourses + pendingLessons,
        pendingCourses,
        pendingLessons
    });
});
export default moderation;
//# sourceMappingURL=moderation.routes.js.map