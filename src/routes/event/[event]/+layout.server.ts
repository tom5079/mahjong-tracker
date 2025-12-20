import { eq } from 'drizzle-orm'
import { db, schema } from '$lib/server/drizzle'
import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async ({ params }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    const eventInfo = await db
        .select({
            eventId: schema.event.id,
            eventName: schema.event.name,
            parlorName: schema.parlor.name,
        })
        .from(schema.event)
        .innerJoin(schema.parlor, eq(schema.parlor.id, schema.event.parlorId))
        .where(eq(schema.event.id, eventId))
        .then((rows) => {
            if (rows.length !== 1) {
                error(404, 'Event not found')
            }

            return rows[0]
        })

    return eventInfo
}) satisfies LayoutServerLoad
