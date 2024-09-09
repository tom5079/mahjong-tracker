import type { Cookies } from "@sveltejs/kit";
import { v4 as uuid } from "uuid";

export function getSessionId(cookies: Cookies) {
    return cookies.get('SESSION_ID') ?? (() => {
        const sessionId = uuid()
        cookies.set('SESSION_ID', sessionId, { path: '/' })
        return sessionId
    })()
}