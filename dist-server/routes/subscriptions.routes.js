// server/routes/subscriptions.routes.ts
import { Hono } from 'hono';
import { prisma } from '../db';
import { AppError } from '../lib/errors';
import { requireAuth, getCurrentUser, getCurrentProfile } from '../middleware/auth';
const subscriptions = new Hono();
// Защищённые роуты
subscriptions.use('/*', requireAuth);
// === GET /subscriptions — список подписок пользователя ===
subscriptions.get('/subscriptions', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        return c.json({ items: [] });
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        prisma.subscription.findMany({
            where: {
                profileId: profile.id,
                deletedAt: null
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                planType: true,
                status: true,
                startDate: true,
                endDate: true,
                trialEndsAt: true,
                autoRenew: true,
                price: true,
                currency: true,
                paymentMethod: {
                    select: {
                        id: true,
                        type: true,
                        last4: true,
                        cardType: true
                    }
                }
            }
        }),
        prisma.subscription.count({
            where: {
                profileId: profile.id,
                deletedAt: null
            }
        })
    ]);
    return c.json({
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});
// === POST /subscriptions — оформление новой подписки ===
subscriptions.post('/subscriptions', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const body = await c.req.json();
    const { planType, paymentMethodId, autoRenew = true } = body;
    // Проверка обязательных полей
    if (!planType) {
        throw new AppError(400, 'Укажите тип подписки');
    }
    // Проверка существования метода оплаты (если указан)
    if (paymentMethodId) {
        const paymentMethod = await prisma.paymentMethod.findUnique({
            where: {
                id: paymentMethodId,
                profileId: profile.id,
                deletedAt: null
            }
        });
        if (!paymentMethod) {
            throw new AppError(400, 'Метод оплаты не найден');
        }
    }
    // Создание подписки (в реальной системе здесь будет интеграция с платежной системой)
    const subscription = await prisma.subscription.create({
        data: {
            profileId: profile.id,
            planType,
            status: 'ACTIVE',
            startDate: new Date(),
            autoRenew,
            price: 299.00, // В реальной системе будет браться из конфигурации
            currency: 'RUB',
            paymentMethodId: paymentMethodId || null
        },
        select: {
            id: true,
            planType: true,
            status: true,
            startDate: true,
            endDate: true,
            price: true,
            currency: true,
            autoRenew: true
        }
    });
    // Создание транзакции
    const transaction = await prisma.transaction.create({
        data: {
            profileId: profile.id,
            subscriptionId: subscription.id,
            type: 'SUBSCRIPTION_PAYMENT',
            amount: subscription.price,
            currency: subscription.currency,
            status: 'COMPLETED',
            provider: 'test_provider',
            providerPaymentId: `test_${Date.now()}`
        },
        select: {
            id: true,
            type: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true
        }
    });
    return c.json({
        message: 'Подписка оформлена',
        subscription,
        transaction
    }, 201);
});
// === DELETE /subscriptions/:id — отмена подписки ===
subscriptions.delete('/subscriptions/:id', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const id = c.req.param('id');
    // Проверка существования подписки
    const subscription = await prisma.subscription.findUnique({
        where: {
            id,
            profileId: profile.id,
            deletedAt: null
        }
    });
    if (!subscription) {
        throw new AppError(404, 'Подписка не найдена');
    }
    // Обновление статуса подписки
    await prisma.subscription.update({
        where: { id },
        data: {
            status: 'CANCELED',
            canceledAt: new Date(),
            deletedAt: new Date()
        }
    });
    // Создание транзакции отмены
    await prisma.transaction.create({
        data: {
            profileId: profile.id,
            subscriptionId: subscription.id,
            type: 'REFUND',
            amount: subscription.price,
            currency: subscription.currency,
            status: 'COMPLETED',
            provider: 'test_provider',
            providerPaymentId: `refund_${Date.now()}`
        }
    });
    return c.json({ message: 'Подписка отменена' });
});
// === GET /payment-methods — список методов оплаты ===
subscriptions.get('/payment-methods', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        return c.json({ items: [] });
    const paymentMethods = await prisma.paymentMethod.findMany({
        where: {
            profileId: profile.id,
            deletedAt: null
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            type: true,
            provider: true,
            last4: true,
            cardType: true,
            expiryMonth: true,
            expiryYear: true,
            isDefault: true,
            isVerified: true
        }
    });
    return c.json({ items: paymentMethods });
});
// === POST /payment-methods — добавление метода оплаты ===
subscriptions.post('/payment-methods', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const body = await c.req.json();
    const { type, provider, providerToken } = body;
    // Проверка обязательных полей
    if (!type || !provider || !providerToken) {
        throw new AppError(400, 'Укажите тип, провайдера и токен');
    }
    // Создание метода оплаты (в реальной системе здесь будет интеграция с платежной системой)
    const paymentMethod = await prisma.paymentMethod.create({
        data: {
            profileId: profile.id,
            type,
            provider,
            providerToken,
            isDefault: false,
            isVerified: true
        },
        select: {
            id: true,
            type: true,
            provider: true,
            last4: true,
            cardType: true,
            expiryMonth: true,
            expiryYear: true,
            isDefault: true,
            isVerified: true
        }
    });
    return c.json({
        message: 'Метод оплаты добавлен',
        paymentMethod
    }, 201);
});
// === DELETE /payment-methods/:id — удаление метода оплаты ===
subscriptions.delete('/payment-methods/:id', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        throw new AppError(400, 'Профиль не найден');
    const id = c.req.param('id');
    // Проверка существования метода оплаты
    const paymentMethod = await prisma.paymentMethod.findUnique({
        where: {
            id,
            profileId: profile.id,
            deletedAt: null
        }
    });
    if (!paymentMethod) {
        throw new AppError(404, 'Метод оплаты не найден');
    }
    // Помечаем как удалённый
    await prisma.paymentMethod.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    });
    return c.json({ message: 'Метод оплаты удален' });
});
// === GET /check-access — проверка доступа к премиум контенту ===
subscriptions.get('/check-access', async (c) => {
    const profile = getCurrentProfile(c);
    // Если не авторизован - нет доступа
    if (!profile) {
        return c.json({
            hasAccess: false,
            planType: null,
            status: null,
            expiresAt: null
        });
    }
    // Ищем активную подписку
    const subscription = await prisma.subscription.findFirst({
        where: {
            profileId: profile.id,
            status: 'ACTIVE',
            deletedAt: null
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            planType: true,
            status: true,
            endDate: true
        }
    });
    if (!subscription) {
        return c.json({
            hasAccess: false,
            planType: null,
            status: null,
            expiresAt: null
        });
    }
    // Проверяем, не истекла ли подписка
    const now = new Date();
    const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
    if (endDate && endDate < now) {
        return c.json({
            hasAccess: false,
            planType: subscription.planType,
            status: 'EXPIRED',
            expiresAt: subscription.endDate
        });
    }
    return c.json({
        hasAccess: true,
        planType: subscription.planType,
        status: subscription.status,
        expiresAt: subscription.endDate
    });
});
// === GET /transactions — история транзакций ===
subscriptions.get('/transactions', async (c) => {
    const profile = getCurrentProfile(c);
    if (!profile)
        return c.json({ items: [] });
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const status = c.req.query('status');
    const skip = (page - 1) * limit;
    const whereClause = {
        profileId: profile.id
    };
    if (status) {
        whereClause.status = status;
    }
    const [items, total] = await Promise.all([
        prisma.transaction.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                type: true,
                amount: true,
                currency: true,
                status: true,
                createdAt: true,
                subscription: {
                    select: {
                        id: true,
                        planType: true
                    }
                }
            }
        }),
        prisma.transaction.count({ where: whereClause })
    ]);
    return c.json({
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});
// === GET /admin/subscriptions — список всех подписок (для админов) ===
subscriptions.get('/admin/subscriptions', async (c) => {
    const user = getCurrentUser(c);
    if (user.role !== 'ADMIN') {
        throw new AppError(403, 'Доступ запрещен');
    }
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const status = c.req.query('status');
    const profileId = c.req.query('profileId');
    const skip = (page - 1) * limit;
    const whereClause = {};
    if (status) {
        whereClause.status = status;
    }
    if (profileId) {
        whereClause.profileId = profileId;
    }
    const [items, total] = await Promise.all([
        prisma.subscription.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                profileId: true,
                planType: true,
                status: true,
                startDate: true,
                endDate: true,
                price: true,
                currency: true,
                createdAt: true,
                profile: {
                    select: {
                        id: true,
                        nickname: true,
                        displayName: true
                    }
                }
            }
        }),
        prisma.subscription.count({ where: whereClause })
    ]);
    return c.json({
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});
// === PATCH /admin/subscriptions/:id — изменение статуса подписки ===
subscriptions.patch('/admin/subscriptions/:id', async (c) => {
    const user = getCurrentUser(c);
    if (user.role !== 'ADMIN') {
        throw new AppError(403, 'Доступ запрещен');
    }
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;
    if (!status) {
        throw new AppError(400, 'Укажите статус');
    }
    // Проверка существования подписки
    const subscription = await prisma.subscription.findUnique({
        where: { id }
    });
    if (!subscription) {
        throw new AppError(404, 'Подписка не найдена');
    }
    // Обновление статуса
    const updated = await prisma.subscription.update({
        where: { id },
        data: { status },
        select: {
            id: true,
            status: true
        }
    });
    return c.json({
        message: 'Статус подписки обновлен',
        subscription: updated
    });
});
// === GET /admin/transactions — список всех транзакций (для админов) ===
subscriptions.get('/admin/transactions', async (c) => {
    const user = getCurrentUser(c);
    if (user.role !== 'ADMIN') {
        throw new AppError(403, 'Доступ запрещен');
    }
    const page = Math.max(1, parseInt(c.req.query('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')));
    const status = c.req.query('status');
    const skip = (page - 1) * limit;
    const whereClause = {};
    if (status) {
        whereClause.status = status;
    }
    const [items, total] = await Promise.all([
        prisma.transaction.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                profileId: true,
                type: true,
                amount: true,
                currency: true,
                status: true,
                createdAt: true,
                profile: {
                    select: {
                        id: true,
                        nickname: true,
                        displayName: true
                    }
                }
            }
        }),
        prisma.transaction.count({ where: whereClause })
    ]);
    return c.json({
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});
export default subscriptions;
//# sourceMappingURL=subscriptions.routes.js.map