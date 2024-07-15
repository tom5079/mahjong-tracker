import type { Handle } from "@sveltejs/kit"
import { createClient } from "$lib/server/db"

export const handle: Handle = async ({ event, resolve }) => {

    const client = await createClient()
    event.locals.client = client

    const response = await resolve(event)
    client.release()

    return response
}