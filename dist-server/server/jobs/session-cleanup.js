// server/jobs/session-cleanup.ts
/**
 * Утилита для очистки просроченных сессий
 *
 * Использование:
 * 1. При каждом входе (простой вариант)
 * 2. По cron (рекомендуется для продакшена)
 */
import { prisma } from '../db';
/**
 * Удаляет просроченные сессии из базы данных
 * @returns количество удалённых сессий
 */
export async function cleanupExpiredSessions() {
    try {
        const result = await prisma.session.deleteMany({
            where: {
                expires: {
                    lt: new Date()
                }
            }
        });
        console.log(`[Session Cleanup] Удалено ${result.count} просроченных сессий`);
        return result.count;
    }
    catch (error) {
        console.error('[Session Cleanup] Ошибка при очистке сессий:', error);
        return 0;
    }
}
/**
 * Ограничивает количество сессий для пользователя
 * @param userId ID пользователя
 * @param maxSessions максимальное количество сессий (по умолчанию 5)
 * @returns количество удалённых старых сессий
 */
export async function limitUserSessions(userId, maxSessions = 5) {
    try {
        const existingCount = await prisma.session.count({
            where: { userId }
        });
        if (existingCount <= maxSessions) {
            return 0;
        }
        // Находим старые сессии для удаления
        const oldSessions = await prisma.session.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            select: { id: true },
            take: existingCount - maxSessions
        });
        if (oldSessions.length === 0) {
            return 0;
        }
        const result = await prisma.session.deleteMany({
            where: {
                id: { in: oldSessions.map(s => s.id) }
            }
        });
        console.log(`[Session Limit] Удалено ${result.count} старых сессий для пользователя ${userId}`);
        return result.count;
    }
    catch (error) {
        console.error('[Session Limit] Ошибка при ограничении сессий:', error);
        return 0;
    }
}
/**
 * Полная очистка и оптимизация сессий
 * - Удаляет просроченные
 * - Ограничивает количество на пользователя
 */
export async function optimizeSessions() {
    const expired = await cleanupExpiredSessions();
    // Получаем всех пользователей с более чем 5 сессиями
    const usersWithManySessions = await prisma.$queryRaw `
    SELECT user_id as userId, COUNT(*) as count 
    FROM sessions 
    GROUP BY user_id 
    HAVING COUNT(*) > 5
  `;
    let limited = 0;
    for (const user of usersWithManySessions) {
        limited += await limitUserSessions(user.userId, 5);
    }
    return { expired, limited };
}
// Автозапуск при импорте (опционально)
// cleanupExpiredSessions()
export default {
    cleanupExpiredSessions,
    limitUserSessions,
    optimizeSessions
};
//# sourceMappingURL=session-cleanup.js.map