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

    const accessToken = await getUserToken(sessionId)

    return {
        user: accessToken != null ? await getUser(accessToken) : null
    }
}) satisfies LayoutServerLoad;