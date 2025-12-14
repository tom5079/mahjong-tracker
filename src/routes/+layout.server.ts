import { db, schema, oneOrNull } from '$lib/server/drizzle'
import { eq } from 'drizzle-orm'
import type { LayoutServerLoad } from './$types'

export const load = (async ({ cookies }) => {
    const sessionId = cookies.get('SESSION_ID')

    if (!sessionId) {
        return {
            user: null,
        }
    }

    const user = await db
        .select({
            id: schema.user.id,
            avatar: schema.user.avatar,
            username: schema.user.username,
        })
        .from(schema.userToken)
        .innerJoin(schema.user, eq(schema.user.id, schema.userToken.userId))
        .where(eq(schema.userToken.sessionId, sessionId))
        .limit(1)
        .then(oneOrNull)

    return {
        user,
    }
}) satisfies LayoutServerLoad
