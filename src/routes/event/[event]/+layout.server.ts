import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const eventId = +(params.event ?? NaN);

    if (isNaN(eventId)) {
        error(404, 'Event not found');
    }

    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        },
        include: {
            ruleset: true,
            parlor: true,
            games: {
                include: {
                    players: {
                        include: {
                            user: true
                        },
                        orderBy: {
                            index: 'asc'
                        }
                    }
                }
            }
        }
    });

    if (event == null) {
        error(404, 'Event not found');
    }

    return { event }
}) satisfies LayoutServerLoad;