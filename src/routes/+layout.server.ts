import { getUser } from "$lib/server/discord";
import { getUserToken } from "$lib/server/user";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
    const sessionId = cookies.get('SESSION_ID')

    if (!sessionId) {
        return {
            user: null
        }
    }

    try {
        const accessToken = await getUserToken(sessionId)

        return {
            user: accessToken && await getUser(accessToken)
        }
    } catch {
        return {
            user: null
        }
    }
}) satisfies LayoutServerLoad;