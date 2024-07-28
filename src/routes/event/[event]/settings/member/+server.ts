import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import prisma from "$lib/server/prisma";

export const POST = (async ({ cookies, params, request }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(400, 'Invalid event')
    }

    const data = await request.json()

    const userId = data.user

    if (userId == null) {
        error(400, 'User ID is required')
    }

    const action = data.action

    switch (action) {
        case 'accept':
            await prisma.eventAttendee.update({
                where: {
                    userId_eventId: {
                        userId,
                        eventId
                    }
                },
                data: {
                    status: 'ACCEPTED'
                }
            })
            break
        case 'reject':
            await prisma.eventAttendee.update({
                where: {
                    userId_eventId: {
                        userId,
                        eventId
                    }
                },
                data: {
                    status: 'REJECTED'
                }
            })
            break
        default:
            error(400, 'Invalid action')
    }

    return new Response()
}) satisfies RequestHandler;