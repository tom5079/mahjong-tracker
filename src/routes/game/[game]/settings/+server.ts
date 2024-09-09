import { validateCaptcha } from '$lib/server/captcha.js'
import prisma from '$lib/server/prisma.js'
import { error } from '@sveltejs/kit'

export const DELETE = (async ({ params, request }) => {
    const captchaToken = await request.text()

    if (!validateCaptcha(captchaToken)) {
        error(400, 'Invalid Captcha')
    }

    const gameId = +(params.game ?? NaN);

    if (isNaN(gameId)) {
        error(404, 'Game not found')
    }

    await prisma.game.delete({
        where: {
            id: gameId
        }
    })

    return new Response(null)
})