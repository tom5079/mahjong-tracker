import { validateCaptcha } from "$lib/server/captcha";
import { registerParlor } from "$lib/server/parlor";
import { getSessionId } from "$lib/server/session";
import { getUser } from "$lib/server/user";
import { error, json } from "@sveltejs/kit";

export const POST = (async ({ cookies, request }) => {
    const data = await request.formData()

    if (!validateCaptcha(data.get('token')?.toString())) {
        error(400, 'Invalid captcha')
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
})