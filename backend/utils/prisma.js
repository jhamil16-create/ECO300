const { PrismaClient } = require('@prisma/client');

// Singleton para cliente de Prisma
let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    prisma = global.prisma;
}

module.exports = prisma;
