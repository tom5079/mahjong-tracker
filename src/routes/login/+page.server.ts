import { redirect } from '@sveltejs/kit'
import { CLIENT_ID } from '$env/static/private'
import { REDIRECT_URI } from '$env/static/private'

export function load() {
    const authorizeUrl = new URL('https://discord.com/api/oauth2/authorize')

    authorizeUrl.searchParams.append('client_id', CLIENT_ID)
    authorizeUrl.searchParams.append('redirect_uri', REDIRECT_URI)
    authorizeUrl.searchParams.append('response_type', 'code')
    authorizeUrl.searchParams.append('scope', 'identify guilds')

    redirect(308, authorizeUrl.href)
}