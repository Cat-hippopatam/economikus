// server/routes/user.routes.ts
import { Hono } from 'hono';
import { prisma } from '../db';
import { AppError } from '../lib/errors';
import { requireAuth, getCurrentUser, getCurrentProfile } from '../middleware/auth';
import { compare, hash } from 'bcryptjs';
const user = new Hono();
// Защищённые роуты
user.use('/me', requireAuth);
user.use('/profile', requireAuth);
user.use('/password', requireAuth);
user.use('/avatar', requireAuth);
user.use('/history', requireAuth);
user.use('/favorites', requireAuth);
user.use('/progress', requireAuth);
user.use('/certificates', requireAuth);
user.use('/account-deletion', requireAuth);
// === GET /user/me — текущий пользователь ===
user.get('/me', async (c) => {
    const user = getCurrentUser(c);
    const profile = getCurrentProfile(c);
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
    });
});
// === PATCH /user/profile — обновление профиля ===
user.patch('/profile', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const body = await c.req.json();
    const { displayName, bio } = body;
    const updated = await prisma.profile.update({
        where: { id: profile.id },
        data: {
            displayName: displayName || profile.displayName,
            bio: bio ?? profile.bio,
        }
    });
    return c.json({
        message: 'Профиль обновлён',
        profile: {
            id: updated.id,
            nickname: updated.nickname,
            displayName: updated.displayName,
            avatarUrl: updated.avatarUrl,
            bio: updated.bio,
        }
    });
});
// === PATCH /user/password — смена пароля ===
user.patch('/password', async (c) => {
    const user = getCurrentUser(c);
    const body = await c.req.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
        throw new AppError(400, 'Укажите текущий и новый пароль');
    }
    if (newPassword.length < 6) {
        throw new AppError(400, 'Пароль должен быть минимум 6 символов');
    }
    // Проверяем текущий пароль
    const isValid = await compare(currentPassword, user.passwordHash);
    if (!isValid) {
        throw new AppError(400, 'Неверный текущий пароль');
    }
    // Хешируем новый пароль
    const newPasswordHash = await hash(newPassword, 10);
    // Обновляем пароль
    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash }
    });
    return c.json({ message: 'Пароль успешно изменён' });
});
// === POST /user/avatar — загрузка аватара ===
user.post('/avatar', async (c) => {
    try {
        const profile = getCurrentProfile(c);
        if (!profile)
            throw new AppError(400, 'Профиль не найден');
        // Проверяем наличие файла
        const contentType = c.req.header('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            throw new AppError(400, 'Ожидается FormData');
        }
        // Получаем данные из FormData
        const formData = await c.req.parseBody();
        const file = formData.avatar;
        if (!file || !(file instanceof File)) {
            throw new AppError(400, 'Файл не загружен');
        }
        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
            throw new AppError(400, 'Разрешены только изображения');
        }
        // Проверяем размер (макс 2MB для base64)
        if (file.size > 2 * 1024 * 1024) {
            throw new AppError(400, 'Максимальный размер: 2MB');
        }
        // Конвертируем в base64
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        // Проверяем размер dataUrl (MySQL TEXT = 65535 байт)
        if (dataUrl.length > 65535) {
            throw new AppError(400, 'Изображение слишком большое. Загрузите файл меньше 1MB');
        }
        // Обновляем профиль
        const updated = await prisma.profile.update({
            where: { id: profile.id },
            data: { avatarUrl: dataUrl }
        });
        return c.json({
            message: 'Аватар загружен',
            avatarUrl: updated.avatarUrl
        });
    }
    catch (error) {
        console.error('Error uploading avatar:', error);
        if (error instanceof AppError)
            throw error;
        throw new AppError(500, 'Ошибка загрузки аватара');
    }
});
// === DELETE /user/avatar — удаление аватара ===
user.delete('/avatar', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    await prisma.profile.update({
        where: { id: profile.id },
        data: { avatarUrl: null }
    });
    return c.json({ message: 'Аватар удалён' });
});
// === GET /user/history — история просмотров ===
user.get('/history', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        return c.json({ items: [] });
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const skip = (page - 1) * limit;
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
    ]);
    // Получаем данные уроков отдельно
    const lessonIds = items.filter(i => i.historableType === 'LESSON').map(i => i.historableId);
    const lessonsMap = new Map();
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
        });
        lessons.forEach(lesson => {
            lessonsMap.set(lesson.id, lesson);
        });
    }
    // Добавляем данные уроков к результатам
    const itemsWithLessons = items.map(item => ({
        ...item,
        lesson: item.historableType === 'LESSON' ? lessonsMap.get(item.historableId) : null
    }));
    return c.json({ items: itemsWithLessons, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
// === POST /user/history — добавить в историю ===
user.post('/history', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(401, 'Необходима авторизация');
    const { lessonId, watchedSeconds = 0, completed = false } = await c.req.json();
    if (!lessonId) {
        throw new AppError(400, 'Необходимо указать lessonId');
    }
    // Проверяем существование урока и получаем courseId
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
    });
    if (!lesson) {
        throw new AppError(404, 'Урок не найден');
    }
    const courseId = lesson.module?.courseId;
    // Создаём или обновляем запись в истории
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
    });
    // Создаём или обновляем прогресс урока
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
                progressPercent: completed ? 100 : Math.min(50, Math.round((watchedSeconds / 300) * 100)), // Если 5 мин - 50%
                startedAt: new Date(),
                completedAt: completed ? new Date() : null
            },
            update: {
                status: completed ? 'COMPLETED' : 'IN_PROGRESS',
                progressPercent: completed ? 100 : undefined,
                completedAt: completed ? new Date() : undefined,
                lastPosition: watchedSeconds || undefined
            }
        });
    }
    catch (err) {
        console.error('Error updating lesson progress:', err);
    }
    // Обновляем прогресс курса
    if (courseId) {
        try {
            // Получаем все уроки курса
            const modules = await prisma.module.findMany({
                where: { courseId, isPublished: true },
                include: {
                    lessons: {
                        where: { deletedAt: null, status: 'PUBLISHED' },
                        select: { id: true }
                    }
                }
            });
            const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id));
            const totalLessons = allLessonIds.length;
            if (totalLessons > 0) {
                const completedLessons = await prisma.lessonProgress.count({
                    where: {
                        profileId: profile.id,
                        lessonId: { in: allLessonIds },
                        status: 'COMPLETED'
                    }
                });
                const progressPercent = Math.round((completedLessons / totalLessons) * 100);
                const status = progressPercent === 100 ? 'COMPLETED' : progressPercent > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
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
                });
            }
        }
        catch (err) {
            console.error('Error updating course progress:', err);
        }
    }
    return c.json({ message: 'История обновлена', history: historyItem });
});
// === GET /user/favorites — избранное ===
user.get('/favorites', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        return c.json({ items: [] });
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const skip = (page - 1) * limit;
    const collection = c.req.query('collection');
    const where = { profileId: profile.id };
    if (collection)
        where.collection = collection;
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
    ]);
    return c.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
// === POST /user/favorites — добавить в избранное ===
user.post('/favorites', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const { lessonId, note, collection } = await c.req.json();
    const existing = await prisma.favorite.findUnique({
        where: { profileId_lessonId: { profileId: profile.id, lessonId } }
    });
    if (existing)
        throw new AppError(400, 'Уже в избранном');
    const favorite = await prisma.favorite.create({
        data: { profileId: profile.id, lessonId, note, collection }
    });
    return c.json({ message: 'Добавлено в избранное', favorite }, 201);
});
// === DELETE /user/favorites/:id — удалить из избранного ===
user.delete('/favorites/:id', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const id = c.req.param('id');
    const favorite = await prisma.favorite.findFirst({
        where: { id, profileId: profile.id }
    });
    if (!favorite)
        throw new AppError(404, 'Не найдено');
    await prisma.favorite.delete({ where: { id } });
    return c.json({ message: 'Удалено из избранного' });
});
// === GET /user/progress/courses — прогресс по курсам ===
user.get('/progress/courses', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        return c.json({ items: [] });
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const skip = (page - 1) * limit;
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
    ]);
    return c.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
// === GET /user/certificates — сертификаты ===
user.get('/certificates', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        return c.json({ items: [] });
    const certificates = await prisma.certificate.findMany({
        where: { profileId: profile.id },
        orderBy: { issuedAt: 'desc' },
        select: {
            id: true,
            certificateNumber: true,
            issuedAt: true,
            course: { select: { id: true, title: true, slug: true } }
        }
    });
    return c.json({ items: certificates });
});
// === PUBLIC: GET /user/profile/:nickname — публичный профиль ===
user.get('/profile/:nickname', async (c) => {
    const nickname = c.req.param('nickname');
    const profile = await prisma.profile.findUnique({
        where: { nickname },
        select: {
            id: true,
            nickname: true,
            displayName: true,
            avatarUrl: true,
            coverImage: true,
            bio: true,
            totalViews: true,
            subscribers: true,
            createdAt: true,
            user: { select: { id: true, role: true } }
        }
    });
    if (!profile)
        return c.json({ error: 'Профиль не найден' }, 404);
    // Получаем курсы автора, если это автор
    let courses = [];
    let coursesCount = 0;
    let lessonsCount = 0;
    if (profile.user.role === 'AUTHOR') {
        // Только опубликованные курсы
        courses = await prisma.course.findMany({
            where: { authorProfileId: profile.id, deletedAt: null, status: 'PUBLISHED' },
            take: 6,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, slug: true, coverImage: true, difficultyLevel: true, viewsCount: true, lessonsCount: true }
        });
        // Подсчёт только опубликованных курсов
        coursesCount = await prisma.course.count({
            where: { authorProfileId: profile.id, deletedAt: null, status: 'PUBLISHED' }
        });
        // Подсчёт только опубликованных уроков
        lessonsCount = await prisma.lesson.count({
            where: {
                authorProfileId: profile.id,
                deletedAt: null,
                status: 'PUBLISHED'
            }
        });
    }
    // Подсчёт сертификатов
    const certificatesCount = await prisma.certificate.count({
        where: { profileId: profile.id }
    });
    return c.json({
        profile,
        courses,
        counts: {
            courses: coursesCount,
            lessons: lessonsCount,
            certificates: certificatesCount
        }
    });
});
// === POST /user/account-deletion — подать заявку на удаление аккаунта ===
user.post('/account-deletion', async (c) => {
    const user = getCurrentUser(c);
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const { reason } = await c.req.json().catch(() => ({}));
    // Проверяем, нет ли уже активной заявки
    const existingRequest = await prisma.accountDeletionRequest.findFirst({
        where: {
            userId: user.id,
            status: 'PENDING'
        }
    });
    if (existingRequest) {
        throw new AppError(400, 'У вас уже есть активная заявка на удаление аккаунта');
    }
    // Создаём заявку
    const deletionRequest = await prisma.accountDeletionRequest.create({
        data: {
            userId: user.id,
            profileId: profile.id,
            email: user.email,
            reason: reason || null,
            status: 'PENDING'
        }
    });
    return c.json({
        message: 'Заявка на удаление аккаунта подана. Мы свяжемся с вами по email для подтверждения.',
        requestId: deletionRequest.id,
        status: deletionRequest.status
    }, 201);
});
// === GET /user/account-deletion/status — проверить статус заявки ===
user.get('/account-deletion/status', async (c) => {
    const user = getCurrentUser(c);
    const request = await prisma.accountDeletionRequest.findFirst({
        where: {
            userId: user.id,
            status: 'PENDING'
        },
        orderBy: { createdAt: 'desc' }
    });
    if (!request) {
        return c.json({ hasPendingRequest: false });
    }
    return c.json({
        hasPendingRequest: true,
        requestId: request.id,
        status: request.status,
        createdAt: request.createdAt
    });
});
// === DELETE /user/account-deletion — отозвать заявку ===
user.delete('/account-deletion', async (c) => {
    const user = getCurrentUser(c);
    const request = await prisma.accountDeletionRequest.findFirst({
        where: {
            userId: user.id,
            status: 'PENDING'
        }
    });
    if (!request) {
        throw new AppError(404, 'Активная заявка не найдена');
    }
    await prisma.accountDeletionRequest.update({
        where: { id: request.id },
        data: { status: 'CANCELLED' }
    });
    return c.json({ message: 'Заявка отозвана' });
});
export default user;
//# sourceMappingURL=user.routes.js.map