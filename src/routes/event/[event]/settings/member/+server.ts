import { error } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import { validateCaptcha } from "$lib/server/captcha";

export const POST = (async ({ params, request }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(400, 'Invalid event')
    }

    const data = await request.json()

    if (!validateCaptcha(data.token)) {
        error(400, 'Invalid captcha')
    }

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
        case 'remove':
            await prisma.eventAttendee.delete({
                where: {
                    userId_eventId: {
                        userId,
                        eventId
                    }
                }
            })
            break
        default:
            error(400, 'Invalid action')
    }

    return new Response()
})