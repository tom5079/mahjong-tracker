import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

export const load = (async ({ params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    return {
        rulesets: await prisma.ruleset.findMany({
            where: {
                parlorId: parlorId
            }
        })
    }
}) satisfies PageServerLoad