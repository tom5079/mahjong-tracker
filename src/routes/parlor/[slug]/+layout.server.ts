import { getUser } from '$lib/server/discord';
import { getParlor } from '$lib/server/parlor';
import { getSessionId } from '$lib/server/session';
import { getUserToken } from '$lib/server/user';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load = (async ({ cookies, params }) => {
    // const sessionId = getSessionId(cookies)
    // const userToken = await getUserToken(sessionId)
    // const user = userToken && await getUser(userToken)
    const parlor = await getParlor(+params.slug)

    if (!parlor) {
        error(404, 'Parlor not found')
    }

    return {
        parlor: parlor,
        slug: params.slug
    }
}) satisfies LayoutServerLoad;