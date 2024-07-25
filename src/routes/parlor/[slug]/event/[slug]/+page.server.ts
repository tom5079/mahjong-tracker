import prisma from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const ruleset = await prisma.event.findUnique({
        where: {
            id: +(params.slug ?? -1)
        }
    })

    if (ruleset == null) {
        error(404, 'Event not found')
    }

    return { ruleset }
}) satisfies PageServerLoad;