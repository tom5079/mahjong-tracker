import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db, oneOrThrow, schema } from '$lib/server/drizzle'
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

    const playerPerGame = await db
        .select({
            playerPerGame: schema.ruleset.player,
        })
        .from(schema.event)
        .innerJoin(schema.ruleset, eq(schema.ruleset.id, schema.event.rulesetId))
        .where(eq(schema.event.id, eventId))
        .then(oneOrThrow)

    return {
        attendees,
        playerPerGame,
    }
}) satisfies PageServerLoad
