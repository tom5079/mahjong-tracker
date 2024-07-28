import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'

export const load = (async ({ params }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    const attendees = await prisma.eventAttendee.findMany({
        where: {
            eventId,
            status: 'ACCEPTED'
        },
        include: {
            user: true
        }
    })

    return {
        attendees: attendees.map(attendee => attendee.user)
    }
}) satisfies PageServerLoad