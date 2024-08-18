import { getUser } from "$lib/server/user";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
    const sessionId = cookies.get('SESSION_ID')

    if (!sessionId) {
        return {
            user: null
        }
    }

    return {
        user: await getUser(sessionId)
    }
}) satisfies LayoutServerLoad;