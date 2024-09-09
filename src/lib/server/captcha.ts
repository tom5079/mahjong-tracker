import { CAPTCHA_SERVER_KEY } from "$env/static/private"

export async function validateCaptcha(token: string | undefined | null) {
    if (!token) {
        return false
    }

    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            secret: CAPTCHA_SERVER_KEY,
            response: token
        })
    }).then(res => res.json())

    return captchaResponse.success
}