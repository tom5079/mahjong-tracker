import prisma from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const rulesets = await prisma.ruleset.findMany({
        where: {
            parlorId: +(params.slug ?? -1)
        }
    })

    return {
        rulesets
    }
}) satisfies PageServerLoad;