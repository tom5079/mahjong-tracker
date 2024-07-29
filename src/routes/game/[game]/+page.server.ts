import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

export const load = (async ({ params }) => {
    const gameId = +(params.game ?? NaN);

    if (isNaN(gameId)) {
        error(404, 'Game not found')
    }

    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        },
        include: {
            event: {
                include: {
                    ruleset: true
                }
            },
            players: {
                include: {
                    user: true
                }
            }
        }
    })

    if (game == null) {
        error(404, 'Game not found')
    }

    return { game }
}) satisfies PageServerLoad;