import { getSessionId } from "$lib/server/session";
import { getUser } from "$lib/server/user";
import { error, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import { validateCaptcha } from "$lib/server/captcha";

export const POST = (async ({ cookies, params, request }) => {
    const cpatchaToken = await request.text()

    if (!validateCaptcha(cpatchaToken)) {
        error(400, 'Invalid captcha token')
    }

    const eventID = +(params.event ?? NaN)

    if (isNaN(eventID)) {
        error(404, 'Event not found');
    }

    const sessionId = getSessionId(cookies);
    const user = await getUser(sessionId);

    if (user == null) {
        error(401, 'Unauthorized');
    }

    const event = await prisma.event.findUnique({
        where: {
            id: eventID
        }
    });

    if (event == null) {
        error(404, 'Event not found');
    }

    await prisma.eventAttendee.upsert({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId: event.id
            }
        },
        update: {
            status: 'PENDING'
        },
        create: {
            status: 'PENDING',
            user: {
                connect: {
                    id: user.id
                }
            },
            event: {
                connect: {
                    id: event.id
                }
            }
        }
    })

    return new Response()
}) satisfies RequestHandler