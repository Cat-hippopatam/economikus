// server/lib/auth.ts
import { HonoAuth } from '@hono/auth-js';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../db';
import { compare } from 'bcryptjs';
export const { handlers, auth, signIn, signOut } = HonoAuth({
    adapter: PrismaAdapter(prisma),
    // Секрет для JWT (обязательно в .env: AUTH_SECRET)
    secret: process.env.AUTH_SECRET,
    // Провайдеры аутентификации
    providers: [
        // Credentials (email/password)
        {
            id: 'credentials',
            name: 'Credentials',
            type: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { profile: true }
                });
                if (!user || !user.passwordHash) {
                    return null;
                }
                const isValid = await compare(credentials.password, user.passwordHash);
                if (!isValid || user.isBlocked) {
                    return null;
                }
                // Возвращаем безопасные данные пользователя
                return {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    profile: user.profile ? {
                        id: user.profile.id,
                        nickname: user.profile.nickname,
                        displayName: user.profile.displayName
                    } : undefined
                };
            }
        },
        // Google OAuth (опционально)
        // {
        //   id: 'google',
        //   name: 'Google',
        //   type: 'oauth',
        //   authorization: { params: { prompt: 'consent' } },
        //   // ... остальные настройки из @auth/core/providers/google
        // },
    ],
    // Настройки сессии
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 дней
    },
    // Настройки JWT
    jwt: {
        maxAge: 30 * 24 * 60 * 60,
    },
    // Callbacks для кастомизации
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.profile = user.profile;
            }
            // Обновление данных при изменении профиля
            if (trigger === 'update' && session?.name) {
                token.name = session.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.profile = token.profile;
            }
            return session;
        }
    },
    // Страницы (опционально)
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    // Логирование в dev-режиме
    debug: process.env.NODE_ENV === 'development',
});
//# sourceMappingURL=auth.js.map