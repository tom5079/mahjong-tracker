import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { db, schema } from '$lib/server/drizzle'

export const load = (async ({ params }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(400, 'Invalid event')
    }

    return {
        attendee: await db
            .select({
                user: {
                    id: schema.user.id,
                    username: schema.user.username,
                    avatar: schema.user.avatar,
                },
                status: schema.eventAttendee.status,
            })
            .from(schema.eventAttendee)
            .innerJoin(schema.user, eq(schema.user.id, schema.eventAttendee.userId))
            .where(eq(schema.eventAttendee.eventId, eventId)),
    }
}) satisfies PageServerLoad
