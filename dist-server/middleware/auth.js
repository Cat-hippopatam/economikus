// server/middleware/auth.ts
/**
 * Middleware для проверки авторизации и ролей
 */
import { prisma } from '../db';
import { AppError } from '../lib/errors';
function extractSessionToken(c) {
    const cookie = c.req.header('Cookie');
    if (!cookie)
        return null;
    const match = cookie.match(/session=([^;]+)/);
    return match ? match[1] : null;
}
async function getSessionData(sessionToken) {
    const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
            user: {
                include: {
                    profile: {
                        select: { id: true, nickname: true, displayName: true, avatarUrl: true, bio: true }
                    }
                }
            }
        }
    });
    if (!session)
        return null;
    if (session.expires < new Date()) {
        await prisma.session.delete({ where: { id: session.id } });
        return null;
    }
    if (session.user.isBlocked)
        return null;
    return {
        user: {
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            role: session.user.role,
            isBlocked: session.user.isBlocked,
            passwordHash: session.user.passwordHash,
        },
        profile: session.user.profile
    };
}
export const requireAuth = async (c, next) => {
    const sessionToken = extractSessionToken(c);
    if (!sessionToken)
        throw new AppError(401, 'Требуется авторизация', 'UNAUTHORIZED');
    const sessionData = await getSessionData(sessionToken);
    if (!sessionData) {
        c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
        throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED');
    }
    c.set('user', sessionData.user);
    c.set('profile', sessionData.profile);
    await next();
};
export const requireRole = (...roles) => {
    return async (c, next) => {
        const user = c.get('user');
        if (!user || !roles.includes(user.role)) {
            throw new AppError(403, 'Доступ запрещён', 'FORBIDDEN');
        }
        await next();
    };
};
export const requireAdmin = async (c, next) => {
    const sessionToken = extractSessionToken(c);
    if (!sessionToken)
        throw new AppError(401, 'Требуется авторизация', 'UNAUTHORIZED');
    const sessionData = await getSessionData(sessionToken);
    if (!sessionData) {
        c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
        throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED');
    }
    if (sessionData.user.role !== 'ADMIN') {
        throw new AppError(403, 'Доступ запрещён. Требуются права администратора', 'FORBIDDEN');
    }
    c.set('user', sessionData.user);
    c.set('profile', sessionData.profile);
    await next();
};
export const requireModerator = async (c, next) => {
    const sessionToken = extractSessionToken(c);
    if (!sessionToken)
        throw new AppError(401, 'Требуется авторизация', 'UNAUTHORIZED');
    const sessionData = await getSessionData(sessionToken);
    if (!sessionData) {
        c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
        throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED');
    }
    if (!['MODERATOR', 'ADMIN'].includes(sessionData.user.role)) {
        throw new AppError(403, 'Доступ запрещён. Требуются права модератора', 'FORBIDDEN');
    }
    c.set('user', sessionData.user);
    c.set('profile', sessionData.profile);
    await next();
};
export const optionalAuth = async (c, next) => {
    const sessionToken = extractSessionToken(c);
    if (sessionToken) {
        const sessionData = await getSessionData(sessionToken);
        if (sessionData) {
            c.set('user', sessionData.user);
            c.set('profile', sessionData.profile);
        }
    }
    await next();
};
export function getCurrentUser(c) { return c.get('user'); }
export function getCurrentProfile(c) { return c.get('profile'); }
export function isAuthenticated(c) { return !!c.get('user'); }
//# sourceMappingURL=auth.js.map