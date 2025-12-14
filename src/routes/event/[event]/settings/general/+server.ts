import { validateCaptcha } from '$lib/server/captcha.js'
import { db, schema } from '$lib/server/drizzle'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const DELETE = async ({ params, request }) => {
    const captchaToken = await request.text()

    if (!validateCaptcha(captchaToken)) {
        error(400, 'Invalid Captcha')
    }

    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    await db.delete(schema.event).where(eq(schema.event.id, eventId))

    return new Response(null)
}
