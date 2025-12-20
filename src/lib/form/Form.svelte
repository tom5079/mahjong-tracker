<script lang="ts">
    import { applyAction, deserialize } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'
    import type { ActionResult } from '@sveltejs/kit'
    import type { Snippet } from 'svelte'
    import type { EventHandler } from 'svelte/elements'

    interface PropType {
        children: Snippet
        onSubmit?: (
            formData: FormData,
            event: SubmitEvent,
            token: string
        ) => Promise<FormData | null | undefined>
    }

    let { children, onSubmit }: PropType = $props()

    async function submitForm(currentTarget: HTMLFormElement, data: FormData, token: string) {
        data.set('token', token)

        const response = await fetch(currentTarget.action, {
            method: currentTarget.method,
            body: data,
            headers: {
                'x-sveltekit-action': 'true',
            },
        })

        const result: ActionResult = deserialize(await response.text())

        if (result.type === 'success') {
            await invalidateAll()
        }

        applyAction(result)
    }

    const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget, event.submitter)

        const token = await new Promise<string>((resolve) => {
            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'submit' })
                    .then(resolve)
            })
        })

        if (onSubmit != null) {
            const result = await onSubmit(formData, event, token)
            if (result != null) {
                await submitForm(event.currentTarget, result, token)
            }
        } else {
            await submitForm(event.currentTarget, formData, token)
        }
    }
</script>

<form method="POST" onsubmit={handleSubmit}>
    {@render children()}
</form>
