import { getParlor } from '$lib/server/parlor';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load = (async ({ params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(404, 'Parlor not found')
    }

    const parlor = await getParlor(+params.parlor)

    if (parlor == null) {
        error(404, 'Parlor not found')
    }

    return { parlor }
}) satisfies LayoutServerLoad;