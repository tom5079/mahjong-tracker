import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

export const load = (async ({ params }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(400, 'Invalid event')
    }

    return {
        attendee: await prisma.eventAttendee.findMany({
            where: {
                eventId
            },
            include: {
                user: true
            }
        })
    }
}) satisfies PageServerLoad