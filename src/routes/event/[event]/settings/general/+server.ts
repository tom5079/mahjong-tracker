import { validateCaptcha } from '$lib/server/captcha.js'
import prisma from '$lib/server/prisma.js'
import { error } from '@sveltejs/kit'

export const DELETE = (async ({ params, request }) => {
    const captchaToken = await request.text()

    if (!validateCaptcha(captchaToken)) {
        error(400, 'Invalid Captcha')
    }

    const eventId = +(params.event ?? NaN);

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    await prisma.event.delete({
        where: {
            id: eventId
        }
    })

    return new Response(null)
})