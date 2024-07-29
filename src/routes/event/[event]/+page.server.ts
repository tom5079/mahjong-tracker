import prisma from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getSessionId } from "$lib/server/session";
import { getUserToken } from "$lib/server/user";
import { getUser } from "$lib/server/discord";

export const load = (async ({ cookies, params }) => {
    const eventId = +(params.event ?? NaN);

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    const sessionId = getSessionId(cookies);
    const userToken = await getUserToken(sessionId);

    const user = userToken != null ? await getUser(userToken) : null;

    const joinRequest = user && (await prisma.eventAttendee.findUnique({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId
            }
        }
    }))

    return { joinRequestStatus: joinRequest?.status }
}) satisfies PageServerLoad;