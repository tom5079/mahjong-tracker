import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { exchangeToken } from "$lib/server/discord";
import { getSessionId } from "$lib/server/session";
import { registerUserToken } from "$lib/server/user";

export const GET: RequestHandler = async ({ url, cookies }) => {
    const code = url.searchParams.get("code")

    if (!code) {
        error(400, "No code provided")
    }

    const {
        accessToken,
        expiresAt,
        refreshToken
    } = await exchangeToken(code)

    const sessionId = getSessionId(cookies)

    await registerUserToken({ sessionId, accessToken, refreshToken, expiresAt })

    redirect(308, '/')
}