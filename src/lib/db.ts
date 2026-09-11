import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __valuvedaPrisma: PrismaClient | undefined
}

export const db =
  globalThis.__valuvedaPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__valuvedaPrisma = db
}
