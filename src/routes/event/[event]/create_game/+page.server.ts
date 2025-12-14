import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db, schema } from '$lib/server/drizzle'
import { eq, and } from 'drizzle-orm'

export const load = (async ({ params }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    const attendees = await db
        .select({
            id: schema.user.id,
            username: schema.user.username,
            avatar: schema.user.avatar,
        })
        .from(schema.eventAttendee)
        .innerJoin(schema.user, eq(schema.user.id, schema.eventAttendee.userId))
        .where(
            and(
                eq(schema.eventAttendee.eventId, eventId),
                eq(schema.eventAttendee.status, 'ACCEPTED')
            )
        )

    return {
        attendees,
    }
}) satisfies PageServerLoad
