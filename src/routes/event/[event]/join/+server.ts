import { getUser } from '$lib/server/user'
import { error, type RequestHandler } from '@sveltejs/kit'
import { db, schema } from '$lib/server/drizzle'
import { validateCaptcha } from '$lib/server/captcha'
import { getSessionId } from '$lib/server/session'

export const POST = (async ({ cookies, params, request }) => {
    const data = await request.json()

    const sessionId = getSessionId(cookies)
    const userId = data.user ?? (await getUser(sessionId))?.id
    const captchaToken = data.token

    if (!validateCaptcha(captchaToken)) {
        error(400, 'Invalid captcha token')
    }

    if (userId == null) {
        error(401, 'Unauthorized')
    }

    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    await db
        .insert(schema.eventAttendee)
        .values({
            eventId,
            userId,
            status: 'PENDING',
        })
        .onConflictDoUpdate({
            target: [schema.eventAttendee.userId, schema.eventAttendee.eventId],
            set: {
                status: 'PENDING',
            },
        })

    return new Response()
}) satisfies RequestHandler
