import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { removeUserToken } from "$lib/server/user";
import { getSessionId } from "$lib/server/session";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = getSessionId(cookies)

    try {
        if (sessionId) {
            await removeUserToken(sessionId)
        }
    } finally {
        redirect(302, '/')
    }
}