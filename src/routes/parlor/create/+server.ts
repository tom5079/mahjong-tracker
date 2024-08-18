import { CAPTCHA_SERVER_KEY } from "$env/static/private";
import { registerParlor } from "$lib/server/parlor";
import { getSessionId } from "$lib/server/session";
import { getUser } from "$lib/server/user";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ cookies, request }) => {
    const data = await request.formData()

    const captchaToken = data.get('token')?.toString()

    if (!captchaToken) {
        error(400, 'Captcha token missing')
    }

    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            secret: CAPTCHA_SERVER_KEY,
            response: captchaToken
        })
    }).then(res => res.json())

    if (!captchaResponse.success) {
        error(400, 'Captcha failed')
    }

    const sessionId = getSessionId(cookies)
    const owner = await getUser(sessionId)
    if (!owner) {
        error(401, 'Unauthorized')
    }

    const name = data.get('name')?.toString()

    if ((name?.length ?? 0) < 3) {
        error(400, 'Name must be at least 3 characters long')
    }


    const parlor = await registerParlor({
        name: name!,
        location: data.get('location')?.toString() ?? '',
        owner: owner.id,
        website: data.get('website')?.toString(),
        note: data.get('note')?.toString() ?? ''
    })

    return json({ id: parlor.id })
}) satisfies RequestHandler