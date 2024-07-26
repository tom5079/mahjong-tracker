import { getSessionId } from "$lib/server/session";
import { getUserToken } from "$lib/server/user";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getUser } from "$lib/server/discord";
import prisma from "$lib/server/prisma";

export const POST = (async ({ cookies, params }) => {
    const eventID = +(params.event ?? NaN)

    if (isNaN(eventID)) {
        error(404, 'Event not found');
    }

    const sessionId = getSessionId(cookies);
    const userToken = await getUserToken(sessionId);

    if (userToken == null) {
        error(401, 'Unauthorized');
    }

    const user = await getUser(userToken);

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
}) satisfies RequestHandler;