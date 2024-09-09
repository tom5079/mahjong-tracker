import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

export const load = (async ({ params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    const events = await prisma.event.findMany({
        where: {
            parlorId
        }
    })

    return { events }
}) satisfies PageServerLoad;