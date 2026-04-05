import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
const globalForPrisma = global;
// Для Prisma 7.x нужно использовать adapter
// Пробуем старый подход без параметров - Prisma сама возьмет из схемы
export const prisma = globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'error', 'warn'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
//# sourceMappingURL=db.js.map