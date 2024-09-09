import prisma from '$lib/server/prisma.js'
import { error } from '@sveltejs/kit'

export const load = (async ({ params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    const rulesetId = +(params.ruleset ?? NaN)

    if (isNaN(rulesetId)) {
        error(400, 'Invalid ruleset')
    }

    const ruleset = await prisma.ruleset.findUnique({
        where: {
            id: rulesetId
        }
    })

    if (ruleset == null || ruleset.parlorId !== parlorId) {
        error(404, 'Ruleset not found')
    }

    return { ruleset }
})