import prisma from '$lib/server/prisma'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getSessionId } from '$lib/server/session'
import { getUser } from '$lib/server/user'
import { db, oneOrThrow, schema } from '$lib/server/drizzle'
import { eq, getTableColumns } from 'drizzle-orm'

export const load = (async ({ cookies, params, url }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    const sessionId = getSessionId(cookies)

    const user = await getUser(sessionId)

    const joinRequest =
        user &&
        (await prisma.eventAttendee.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId,
                },
            },
        }))

    const page = +(url.searchParams.get('page') ?? '1')

    if (page < 1) {
        error(404, 'Page not found')
    }

    const attendees = await prisma.eventAttendee.findMany({
        where: {
            eventId,
            status: 'ACCEPTED',
        },
        include: {
            user: true,
        },
    })

    const games = await prisma.game.findMany({
        where: {
            eventId,
        },
        include: {
            players: {
                include: {
                    user: true,
                },
                orderBy: {
                    index: 'asc',
                },
            },
        },
        orderBy: {
            id: 'desc',
        },
    })

    // To be removed
    const ruleset = await db
        .select({
            ...getTableColumns(schema.ruleset),
        })
        .from(schema.ruleset)
        .innerJoin(schema.event, eq(schema.event.rulesetId, schema.ruleset.id))
        .where(eq(schema.event.id, eventId))
        .then(oneOrThrow)

    const startScore = await db
        .select({ startScore: schema.ruleset.startScore })
        .from(schema.event)
        .innerJoin(schema.ruleset, eq(schema.ruleset.id, schema.event.rulesetId))
        .where(eq(schema.event.id, eventId))
        .then(oneOrThrow)

    return {
        joinRequestStatus: joinRequest?.status,
        games,
        attendees,
        startScore: startScore?.startScore,
        ruleset,
    }
}) satisfies PageServerLoad
