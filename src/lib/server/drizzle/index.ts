import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export { schema }

export const db = drizzle(process.env.DATABASE_URL!)

export function oneOrNull<T>(x: T[]): T | null {
    if (x.length !== 1) return null
    return x[0]
}

export function oneOrThrow<T>(x: T[]): T {
    if (x.length !== 1) throw new Error('Expected exactly one result, got ' + x.length)
    return x[0]
}

export type User = typeof schema.user.$inferSelect
