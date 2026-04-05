// server/routes/author.routes.ts
import { Hono } from 'hono';
import { prisma } from '../db';
import { AppError } from '../lib/errors';
import { requireAuth, getCurrentUser, getCurrentProfile } from '../middleware/auth';
const author = new Hono();
// Все роуты требуют авторизации
author.use('/*', requireAuth);
// Все роуты требуют авторизации
author.use('*', requireAuth);
// === GET /author/application — получить текущую заявку ===
author.get('/application', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(401, 'Профиль не найден');
    const application = await prisma.authorApplication.findFirst({
        where: { profileId: profile.id },
        orderBy: { createdAt: 'desc' },
        include: {
            reviewer: { select: { id: true, nickname: true, displayName: true } }
        }
    });
    return c.json({ application });
});
// === POST /author/apply — подать заявку на статус автора ===
author.post('/apply', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(401, 'Профиль не найден');
    // Проверяем, что пользователь ещё не автор
    if (user.role === 'AUTHOR' || user.role === 'MODERATOR' || user.role === 'ADMIN') {
        throw new AppError(400, 'Вы уже имеете статус автора или выше');
    }
    // Проверяем, нет ли уже pending заявки
    const existingPending = await prisma.authorApplication.findFirst({
        where: { profileId: profile.id, status: 'PENDING' }
    });
    if (existingPending) {
        throw new AppError(400, 'У вас уже есть заявка на рассмотрении');
    }
    const { motivation, experience, portfolioUrl } = await c.req.json();
    if (!motivation || motivation.trim().length < 50) {
        throw new AppError(400, 'Мотивация должна содержать минимум 50 символов');
    }
    const application = await prisma.authorApplication.create({
        data: {
            profileId: profile.id,
            motivation: motivation.trim(),
            experience: experience?.trim() || null,
            portfolioUrl: portfolioUrl?.trim() || null,
        }
    });
    return c.json({ message: 'Заявка успешно отправлена', application }, 201);
});
// === GET /author/my-content — контент автора (заглушка) ===
author.get('/my-content', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(401, 'Профиль не найден');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    // Получаем курсы и уроки автора
    const [courses, lessons] = await Promise.all([
        prisma.course.findMany({
            where: { authorProfileId: profile.id, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { _count: { select: { modules: true, progress: true } } }
        }),
        prisma.lesson.findMany({
            where: { authorProfileId: profile.id, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { module: { select: { id: true, title: true, course: { select: { id: true, title: true } } } } }
        })
    ]);
    // Статистика
    const stats = await prisma.profile.findUnique({
        where: { id: profile.id },
        select: { totalViews: true, subscribers: true }
    });
    return c.json({
        stats: {
            totalViews: stats?.totalViews || 0,
            subscribers: stats?.subscribers || 0,
            coursesCount: courses.length,
            lessonsCount: lessons.length
        },
        courses: courses.map(c => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            status: c.status,
            viewsCount: c.viewsCount,
            modulesCount: c._count.modules,
            studentsCount: c._count.progress,
            createdAt: c.createdAt
        })),
        lessons: lessons.map(l => ({
            id: l.id,
            title: l.title,
            slug: l.slug,
            status: l.status,
            viewsCount: l.viewsCount,
            course: l.module?.course,
            createdAt: l.createdAt
        }))
    });
});
// === GET /author/stats — статистика автора ===
author.get('/stats', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const [coursesCount, lessonsCount, totalViews, totalStudents] = await Promise.all([
        prisma.course.count({ where: { authorProfileId: profile.id, deletedAt: null } }),
        prisma.lesson.count({ where: { authorProfileId: profile.id, deletedAt: null } }),
        prisma.course.aggregate({
            where: { authorProfileId: profile.id, deletedAt: null },
            _sum: { viewsCount: true }
        }),
        prisma.courseProgress.count({
            where: { course: { authorProfileId: profile.id } }
        })
    ]);
    return c.json({
        coursesCount,
        lessonsCount,
        totalViews: totalViews._sum.viewsCount || 0,
        totalStudents
    });
});
// === GET /author/analytics — детальная аналитика автора ===
author.get('/analytics', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    // Получаем все курсы автора с детальной статистикой
    const courses = await prisma.course.findMany({
        where: { authorProfileId: profile.id, deletedAt: null },
        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            viewsCount: true,
            createdAt: true,
            publishedAt: true,
            _count: { select: { modules: true, progress: true } },
            progress: {
                select: { completedAt: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    // Получаем все уроки автора
    const lessons = await prisma.lesson.findMany({
        where: { authorProfileId: profile.id, deletedAt: null },
        select: {
            id: true,
            title: true,
            lessonType: true,
            status: true,
            viewsCount: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    });
    // Подсчёт статистики по статусам
    const coursesByStatus = {
        DRAFT: courses.filter(c => c.status === 'DRAFT').length,
        PENDING_REVIEW: courses.filter(c => c.status === 'PENDING_REVIEW').length,
        PUBLISHED: courses.filter(c => c.status === 'PUBLISHED').length,
        ARCHIVED: courses.filter(c => c.status === 'ARCHIVED').length,
    };
    const lessonsByStatus = {
        DRAFT: lessons.filter(l => l.status === 'DRAFT').length,
        PENDING_REVIEW: lessons.filter(l => l.status === 'PENDING_REVIEW').length,
        PUBLISHED: lessons.filter(l => l.status === 'PUBLISHED').length,
    };
    const lessonsByType = {
        ARTICLE: lessons.filter(l => l.lessonType === 'ARTICLE').length,
        VIDEO: lessons.filter(l => l.lessonType === 'VIDEO').length,
        AUDIO: lessons.filter(l => l.lessonType === 'AUDIO').length,
        QUIZ: lessons.filter(l => l.lessonType === 'QUIZ').length,
    };
    // Общая статистика
    const totalViews = courses.reduce((sum, c) => sum + c.viewsCount, 0) +
        lessons.reduce((sum, l) => sum + l.viewsCount, 0);
    const totalStudents = courses.reduce((sum, c) => sum + c._count.progress, 0);
    // Завершённые курсы
    const completedCourses = courses.reduce((sum, c) => sum + c.progress.filter(p => p.completedAt).length, 0);
    // Топ курсы по просмотрам
    const topCourses = courses
        .sort((a, b) => b.viewsCount - a.viewsCount)
        .slice(0, 5)
        .map(c => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        viewsCount: c.viewsCount,
        studentsCount: c._count.progress,
        modulesCount: c._count.modules,
    }));
    // Топ уроки по просмотрам
    const topLessons = lessons
        .sort((a, b) => b.viewsCount - a.viewsCount)
        .slice(0, 5)
        .map(l => ({
        id: l.id,
        title: l.title,
        lessonType: l.lessonType,
        viewsCount: l.viewsCount,
    }));
    // Последняя активность (последние 5 курсов/уроков)
    const recentActivity = [
        ...courses.map(c => ({
            type: 'course',
            id: c.id,
            title: c.title,
            status: c.status,
            createdAt: c.createdAt,
        })),
        ...lessons.map(l => ({
            type: 'lesson',
            id: l.id,
            title: l.title,
            status: l.status,
            createdAt: l.createdAt,
        }))
    ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
    return c.json({
        overview: {
            totalCourses: courses.length,
            totalLessons: lessons.length,
            totalViews,
            totalStudents,
            completedCourses,
        },
        coursesByStatus,
        lessonsByStatus,
        lessonsByType,
        topCourses,
        topLessons,
        recentActivity,
    });
});
// === GET /author/courses — список курсов автора ===
author.get('/courses', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';
    const where = {
        authorProfileId: profile.id,
        deletedAt: null,
        ...(search && {
            OR: [
                { title: { contains: search } },
                { description: { contains: search } },
            ]
        }),
        ...(status && { status }),
    };
    const [items, total] = await Promise.all([
        prisma.course.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                _count: { select: { modules: true, progress: true } },
                tags: true,
            }
        }),
        prisma.course.count({ where }),
    ]);
    return c.json({
        items: items.map(course => ({
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            coverImage: course.coverImage,
            status: course.status,
            difficultyLevel: course.difficultyLevel,
            isPremium: course.isPremium,
            lessonsCount: course._count.modules,
            modulesCount: course._count.modules,
            viewsCount: course.viewsCount,
            createdAt: course.createdAt,
            publishedAt: course.publishedAt,
            tags: course.tags,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    });
});
// === POST /author/courses — создать курс ===
author.post('/courses', async (c) => {
    try {
        const profile = getCurrentProfile(c);
        const user = getCurrentUser(c);
        if (!profile)
            throw new AppError(400, 'Профиль не найден. Создайте профиль.');
        if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
            throw new AppError(403, 'Доступ только для авторов');
        }
        const body = await c.req.json();
        console.log('Creating course with data:', JSON.stringify(body, null, 2));
        const { title, slug, description, coverImage, difficultyLevel, isPremium, tags, status } = body;
        if (!title || title.trim().length < 3) {
            throw new AppError(400, 'Название курса должно содержать минимум 3 символа');
        }
        // Валидация статуса - автор может создавать только DRAFT и PENDING_REVIEW
        const allowedStatuses = ['DRAFT', 'PENDING_REVIEW'];
        const finalStatus = allowedStatuses.includes(status) ? status : 'DRAFT';
        // Проверка уникальности slug (исключая удалённые)
        const newSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const existingCourse = await prisma.course.findFirst({
            where: { slug: newSlug, deletedAt: null }
        });
        if (existingCourse) {
            throw new AppError(400, 'Курс с таким URL уже существует');
        }
        const courseData = {
            title: title.trim(),
            slug: newSlug,
            description: description?.trim() || null,
            coverImage: coverImage || null,
            difficultyLevel: difficultyLevel || null,
            isPremium: isPremium || false,
            status: finalStatus,
            authorProfileId: profile.id,
        };
        console.log('Course data to create:', JSON.stringify(courseData, null, 2));
        const course = await prisma.course.create({
            data: courseData,
            include: { tags: true }
        });
        console.log('Course created:', course.id);
        return c.json({ course }, 201);
    }
    catch (error) {
        console.error('Error creating course:', error);
        if (error instanceof AppError)
            throw error;
        throw new AppError(500, 'Ошибка создания курса: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
});
// === GET /author/courses/:id — детали курса ===
author.get('/courses/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const course = await prisma.course.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null },
        include: {
            modules: {
                orderBy: { sortOrder: 'asc' },
                include: {
                    _count: { select: { lessons: true } }
                }
            },
            tags: true,
        }
    });
    if (!course) {
        throw new AppError(404, 'Курс не найден');
    }
    return c.json({ course });
});
// === PATCH /author/courses/:id — обновить курс ===
author.patch('/courses/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const existing = await prisma.course.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!existing) {
        throw new AppError(404, 'Курс не найден');
    }
    const { title, slug, description, coverImage, difficultyLevel, isPremium, status, tags } = await c.req.json();
    // Валидация статуса - автор может устанавливать только DRAFT и PENDING_REVIEW
    const allowedStatuses = ['DRAFT', 'PENDING_REVIEW'];
    const finalStatus = allowedStatuses.includes(status) ? status : existing.status;
    // Проверка уникальности slug (исключая текущий курс)
    const newSlug = slug || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null);
    if (newSlug) {
        const existingSlug = await prisma.course.findFirst({
            where: {
                slug: newSlug,
                id: { not: id }, // исключаем текущий курс
                deletedAt: null
            }
        });
        if (existingSlug) {
            throw new AppError(400, 'Курс с таким URL уже существует');
        }
    }
    const course = await prisma.course.update({
        where: { id },
        data: {
            ...(title && { title: title.trim() }),
            ...(slug && { slug }),
            ...(description !== undefined && { description: description?.trim() || null }),
            ...(coverImage !== undefined && { coverImage }),
            ...(difficultyLevel !== undefined && { difficultyLevel }),
            ...(isPremium !== undefined && { isPremium }),
            status: finalStatus,
            ...(tags && {
                tags: {
                    set: [],
                    connect: tags.map((id) => ({ id }))
                }
            }),
        },
        include: { tags: true }
    });
    return c.json({ course });
});
// === DELETE /author/courses/:id — удалить курс ===
author.delete('/courses/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const existing = await prisma.course.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!existing) {
        throw new AppError(404, 'Курс не найден');
    }
    // Мягкое удаление
    await prisma.course.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
    return c.json({ message: 'Курс удалён' });
});
// === GET /author/lessons — список уроков автора ===
author.get('/lessons', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';
    const lessonType = c.req.query('lessonType') || '';
    const where = {
        authorProfileId: profile.id,
        deletedAt: null,
        ...(search && {
            OR: [
                { title: { contains: search } },
                { description: { contains: search } },
            ]
        }),
        ...(status && { status }),
        ...(lessonType && { lessonType }),
    };
    const [items, total] = await Promise.all([
        prisma.lesson.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                module: {
                    include: {
                        course: { select: { id: true, title: true } }
                    }
                },
                tags: true,
            }
        }),
        prisma.lesson.count({ where }),
    ]);
    return c.json({
        items: items.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            description: lesson.description,
            lessonType: lesson.lessonType,
            status: lesson.status,
            isPremium: lesson.isPremium,
            duration: lesson.duration,
            viewsCount: lesson.viewsCount,
            createdAt: lesson.createdAt,
            publishedAt: lesson.publishedAt,
            module: lesson.module ? {
                id: lesson.module.id,
                title: lesson.module.title,
                course: lesson.module.course,
            } : null,
            tags: lesson.tags,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    });
});
// === POST /author/lessons — создать урок ===
author.post('/lessons', async (c) => {
    try {
        const profile = getCurrentProfile(c);
        const user = getCurrentUser(c);
        if (!profile)
            throw new AppError(400, 'Профиль не найден. Создайте профиль.');
        if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
            throw new AppError(403, 'Доступ только для авторов');
        }
        const body = await c.req.json();
        console.log('Creating lesson with data:', JSON.stringify(body, null, 2));
        const { title, slug, description, lessonType, moduleId, duration, isPremium, tags, status, coverImage } = body;
        if (!title || title.trim().length < 3) {
            throw new AppError(400, 'Название урока должно содержать минимум 3 символа');
        }
        if (!lessonType) {
            throw new AppError(400, 'Укажите тип урока');
        }
        // Валидация статуса - автор может создавать только DRAFT и PENDING_REVIEW
        const allowedStatuses = ['DRAFT', 'PENDING_REVIEW'];
        const finalStatus = allowedStatuses.includes(status) ? status : 'DRAFT';
        // Генерация slug
        const newSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        // Проверка уникальности slug
        const existingSlug = await prisma.lesson.findFirst({
            where: { slug: newSlug, deletedAt: null }
        });
        if (existingSlug) {
            throw new AppError(400, 'Урок с таким URL уже существует');
        }
        // Проверка что модуль принадлежит автору
        if (moduleId) {
            const module = await prisma.module.findFirst({
                where: {
                    id: moduleId,
                    course: { authorProfileId: profile.id }
                }
            });
            if (!module) {
                throw new AppError(400, 'Модуль не найден или не принадлежит вам');
            }
        }
        const lesson = await prisma.lesson.create({
            data: {
                title: title.trim(),
                slug: newSlug,
                description: description?.trim() || null,
                lessonType,
                moduleId: moduleId || null,
                coverImage: coverImage || null,
                duration: duration || null,
                isPremium: isPremium || false,
                status: finalStatus,
                authorProfileId: profile.id,
                ...(tags && tags.length > 0 && {
                    tags: {
                        connect: tags.map((id) => ({ id }))
                    }
                }),
            },
            include: { tags: true }
        });
        console.log('Lesson created:', lesson.id);
        return c.json({ lesson }, 201);
    }
    catch (error) {
        console.error('Error creating lesson:', error);
        if (error instanceof AppError)
            throw error;
        throw new AppError(500, 'Ошибка создания урока: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
});
// === GET /author/lessons/:id — детали урока ===
author.get('/lessons/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const lesson = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null },
        include: {
            module: {
                include: {
                    course: { select: { id: true, title: true } }
                }
            },
            tags: true,
        }
    });
    if (!lesson) {
        throw new AppError(404, 'Урок не найден');
    }
    return c.json({ lesson });
});
// === PATCH /author/lessons/:id — обновить урок ===
author.patch('/lessons/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const existing = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!existing) {
        throw new AppError(404, 'Урок не найден');
    }
    const { title, slug, description, lessonType, moduleId, duration, isPremium, status, tags, coverImage } = await c.req.json();
    // Валидация статуса - автор может устанавливать только DRAFT и PENDING_REVIEW
    const allowedStatuses = ['DRAFT', 'PENDING_REVIEW'];
    const finalStatus = allowedStatuses.includes(status) ? status : existing.status;
    // Проверка уникальности slug
    const newSlug = slug || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null);
    if (newSlug && newSlug !== existing.slug) {
        const existingSlug = await prisma.lesson.findFirst({
            where: {
                slug: newSlug,
                id: { not: id },
                deletedAt: null
            }
        });
        if (existingSlug) {
            throw new AppError(400, 'Урок с таким URL уже существует');
        }
    }
    const lesson = await prisma.lesson.update({
        where: { id },
        data: {
            ...(title && { title: title.trim() }),
            ...(newSlug && { slug: newSlug }),
            ...(description !== undefined && { description: description?.trim() || null }),
            ...(lessonType && { lessonType }),
            ...(moduleId !== undefined && { moduleId }),
            ...(coverImage !== undefined && { coverImage }),
            ...(duration !== undefined && { duration }),
            ...(isPremium !== undefined && { isPremium }),
            status: finalStatus,
            ...(tags && {
                tags: {
                    set: [],
                    connect: tags.map((id) => ({ id }))
                }
            }),
        },
        include: { tags: true }
    });
    return c.json({ lesson });
});
// === DELETE /author/lessons/:id — удалить урок ===
author.delete('/lessons/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const existing = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!existing) {
        throw new AppError(404, 'Урок не найден');
    }
    // Мягкое удаление
    await prisma.lesson.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
    return c.json({ message: 'Урок удалён' });
});
// === GET /author/modules — список модулей автора ===
author.get('/modules', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const courses = await prisma.course.findMany({
        where: { authorProfileId: profile.id, deletedAt: null, status: { not: 'DELETED' } },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            modules: {
                orderBy: { sortOrder: 'asc' },
                select: {
                    id: true,
                    title: true,
                    _count: { select: { lessons: true } }
                }
            }
        }
    });
    // Группируем по курсам
    const result = courses.map(course => ({
        id: course.id,
        title: course.title,
        modules: course.modules.map(m => ({
            id: m.id,
            title: m.title,
            lessonsCount: m._count.lessons,
        }))
    }));
    return c.json({ courses: result });
});
// === GET /author/courses/:id/modules — модули курса ===
author.get('/courses/:id/modules', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const courseId = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    // Проверяем что курс принадлежит автору
    const course = await prisma.course.findFirst({
        where: { id: courseId, authorProfileId: profile.id, deletedAt: null }
    });
    if (!course) {
        throw new AppError(404, 'Курс не найден');
    }
    const modules = await prisma.module.findMany({
        where: { courseId },
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: { select: { lessons: true } }
        }
    });
    return c.json({
        modules: modules.map(m => ({
            id: m.id,
            title: m.title,
            description: m.description,
            sortOrder: m.sortOrder,
            lessonsCount: m._count.lessons,
        }))
    });
});
// === POST /author/modules — создать модуль ===
author.post('/modules', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const { courseId, title, description } = await c.req.json();
    if (!title || title.trim().length < 2) {
        throw new AppError(400, 'Название модуля должно содержать минимум 2 символа');
    }
    // Проверяем что курс принадлежит автору
    const course = await prisma.course.findFirst({
        where: { id: courseId, authorProfileId: profile.id, deletedAt: null }
    });
    if (!course) {
        throw new AppError(404, 'Курс не найден');
    }
    // Получаем максимальный sortOrder
    const maxSort = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true }
    });
    const module = await prisma.module.create({
        data: {
            title: title.trim(),
            description: description?.trim() || null,
            courseId,
            sortOrder: (maxSort?.sortOrder || 0) + 1,
        }
    });
    // Обновляем счётчик модулей в курсе
    await prisma.course.update({
        where: { id: courseId },
        data: { modulesCount: { increment: 1 } }
    });
    return c.json({ module }, 201);
});
// === PATCH /author/modules/:id — обновить модуль ===
author.patch('/modules/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    // Проверяем что модуль принадлежит автору через курс
    const existing = await prisma.module.findFirst({
        where: {
            id,
            course: { authorProfileId: profile.id, deletedAt: null }
        }
    });
    if (!existing) {
        throw new AppError(404, 'Модуль не найден');
    }
    const { title, description, sortOrder } = await c.req.json();
    const module = await prisma.module.update({
        where: { id },
        data: {
            ...(title && { title: title.trim() }),
            ...(description !== undefined && { description: description?.trim() || null }),
            ...(sortOrder !== undefined && { sortOrder }),
        }
    });
    return c.json({ module });
});
// === DELETE /author/modules/:id — удалить модуль ===
author.delete('/modules/:id', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    // Проверяем что модуль принадлежит автору
    const existing = await prisma.module.findFirst({
        where: {
            id,
            course: { authorProfileId: profile.id, deletedAt: null }
        },
        include: { _count: { select: { lessons: true } } }
    });
    if (!existing) {
        throw new AppError(404, 'Модуль не найден');
    }
    if (existing._count.lessons > 0) {
        throw new AppError(400, 'Нельзя удалить модуль с уроками. Сначала удалите уроки.');
    }
    const courseId = existing.courseId;
    await prisma.module.delete({ where: { id } });
    // Обновляем счётчик модулей в курсе
    await prisma.course.update({
        where: { id: courseId },
        data: { modulesCount: { decrement: 1 } }
    });
    return c.json({ message: 'Модуль удалён' });
});
// === GET /author/lessons/:id/content — контент урока ===
author.get('/lessons/:id/content', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const lesson = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null },
        include: {
            textContent: true,
            videoContent: true,
            audioContent: true,
            quizContent: true,
        }
    });
    if (!lesson) {
        throw new AppError(404, 'Урок не найден');
    }
    return c.json({
        lessonType: lesson.lessonType,
        textContent: lesson.textContent,
        videoContent: lesson.videoContent,
        audioContent: lesson.audioContent,
        quizContent: lesson.quizContent,
    });
});
// === POST /author/lessons/:id/content/text — сохранить текстовый контент ===
author.post('/lessons/:id/content/text', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const lesson = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!lesson) {
        throw new AppError(404, 'Урок не найден');
    }
    const { body } = await c.req.json();
    if (!body || typeof body !== 'string') {
        throw new AppError(400, 'Текст обязателен');
    }
    // Подсчёт слов и времени чтения
    const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 слов в минуту
    const content = await prisma.textContent.upsert({
        where: { lessonId: id },
        create: {
            lessonId: id,
            body,
            wordCount,
            readingTime,
        },
        update: {
            body,
            wordCount,
            readingTime,
        }
    });
    // Обновляем тип урока
    await prisma.lesson.update({
        where: { id },
        data: { lessonType: 'ARTICLE' }
    });
    return c.json({ content });
});
// === POST /author/lessons/:id/content/video — сохранить видео контент ===
author.post('/lessons/:id/content/video', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const lesson = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!lesson) {
        throw new AppError(404, 'Урок не найден');
    }
    const { videoUrl, provider, duration } = await c.req.json();
    if (!videoUrl) {
        throw new AppError(400, 'URL видео обязателен');
    }
    // Определяем провайдера по URL если не указан
    let videoProvider = provider || 'YOUTUBE';
    if (!provider) {
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            videoProvider = 'YOUTUBE';
        }
        else if (videoUrl.includes('rutube.ru')) {
            videoProvider = 'RUTUBE';
        }
        else if (videoUrl.includes('vimeo.com')) {
            videoProvider = 'VIMEO';
        }
    }
    const content = await prisma.videoContent.upsert({
        where: { lessonId: id },
        create: {
            lessonId: id,
            videoUrl,
            provider: videoProvider,
            duration: duration || 0,
        },
        update: {
            videoUrl,
            provider: videoProvider,
            duration: duration || 0,
        }
    });
    // Обновляем тип урока
    await prisma.lesson.update({
        where: { id },
        data: { lessonType: 'VIDEO', duration: duration || 0 }
    });
    return c.json({ content });
});
// === POST /author/lessons/:id/content/audio — сохранить аудио контент ===
author.post('/lessons/:id/content/audio', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const lesson = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!lesson) {
        throw new AppError(404, 'Урок не найден');
    }
    const { audioUrl, duration } = await c.req.json();
    if (!audioUrl) {
        throw new AppError(400, 'URL аудио обязателен');
    }
    const content = await prisma.audioContent.upsert({
        where: { lessonId: id },
        create: {
            lessonId: id,
            audioUrl,
            duration: duration || 0,
        },
        update: {
            audioUrl,
            duration: duration || 0,
        }
    });
    // Обновляем тип урока
    await prisma.lesson.update({
        where: { id },
        data: { lessonType: 'AUDIO', duration: duration || 0 }
    });
    return c.json({ content });
});
// === POST /author/lessons/:id/content/quiz — сохранить тест ===
author.post('/lessons/:id/content/quiz', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    const id = c.req.param('id');
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const lesson = await prisma.lesson.findFirst({
        where: { id, authorProfileId: profile.id, deletedAt: null }
    });
    if (!lesson) {
        throw new AppError(404, 'Урок не найден');
    }
    const { questions, passingScore, attemptsAllowed } = await c.req.json();
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        throw new AppError(400, 'Вопросы обязательны');
    }
    const content = await prisma.quizContent.upsert({
        where: { lessonId: id },
        create: {
            lessonId: id,
            questions,
            passingScore: passingScore || 70,
            attemptsAllowed: attemptsAllowed || null,
        },
        update: {
            questions,
            passingScore: passingScore || 70,
            attemptsAllowed: attemptsAllowed || null,
        }
    });
    // Обновляем тип урока
    await prisma.lesson.update({
        where: { id },
        data: { lessonType: 'QUIZ' }
    });
    return c.json({ content });
});
// === POST /author/modules/reorder — изменить порядок модулей ===
author.post('/modules/reorder', async (c) => {
    const profile = getCurrentProfile(c);
    const user = getCurrentUser(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден. Создайте профиль.');
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        throw new AppError(403, 'Доступ только для авторов');
    }
    const { courseId, moduleIds } = await c.req.json();
    // Проверяем что курс принадлежит автору
    const course = await prisma.course.findFirst({
        where: { id: courseId, authorProfileId: profile.id, deletedAt: null }
    });
    if (!course) {
        throw new AppError(404, 'Курс не найден');
    }
    // Обновляем порядок
    const updates = moduleIds.map((id, index) => prisma.module.update({
        where: { id },
        data: { sortOrder: index + 1 }
    }));
    await prisma.$transaction(updates);
    return c.json({ message: 'Порядок обновлён' });
});
export default author;
//# sourceMappingURL=author.routes.js.map