import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import prisma from "$lib/server/prisma";

export const POST = (async ({ params, request }) => {
    const data = await request.formData()

    const name = data.get('name')?.toString()

    const parlorId = +(params.slug ?? -1)

    if (isNaN(parlorId) || parlorId < 0) {
        error(400, 'Invalid parlor')
    }

    if (name == null || name.length < 3) {
        error(400, 'Name must be at least 3 characters long')
    }

    const rulesetId = +(params.slug ?? -1)

    if (rulesetId < 0 || (await prisma.ruleset.findUnique({ where: { id: rulesetId } }))?.parlorId !== +(params.slug ?? -1)) {
        error(400, 'Invalid ruleset')
    }

    const event = await prisma.event.create({
        data: {
            name,
            location: data.get('location')?.toString() ?? '',
            description: data.get('description')?.toString() ?? '',
            parlorId: +(params.slug ?? -1),
            rulesetId
        }
    })

    return new Response(JSON.stringify({ eventId: event.id }))
}) satisfies RequestHandler;