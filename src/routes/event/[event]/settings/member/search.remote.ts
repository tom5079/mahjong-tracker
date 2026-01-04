import * as z from 'zod'
import { query } from '$app/server'
import { db, schema } from '$lib/server/drizzle'
import { and, eq, ilike, isNull, or } from 'drizzle-orm'

export const searchUsers = query(
    z.object({
        searchTerm: z.string().refine(async (value) => value.length < 100),
        eventId: z.int(),
    }),
    async ({ searchTerm, eventId }) => {
        const users = await db
            .select({
                id: schema.user.id,
                username: schema.user.username,
                avatar: schema.user.avatar,
            })
            .from(schema.user)
            .leftJoin(
                schema.eventAttendee,
                and(
                    eq(schema.user.id, schema.eventAttendee.userId),
                    eq(schema.eventAttendee.eventId, eventId)
                )
            )
            .where(
                and(
                    searchTerm ? ilike(schema.user.username, `%${searchTerm}%`) : undefined,
                    or(
                        isNull(schema.eventAttendee.status),
                        eq(schema.eventAttendee.status, 'REJECTED')
                    )
                )
            )
            .limit(10)

        return users
    }
)
