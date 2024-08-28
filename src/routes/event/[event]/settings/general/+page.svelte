<script lang="ts">
	import type { PageData } from './$types'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'

	export let data: PageData

	function deleteEvent() {
		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'delete_event' })
				.then(async (token) => {
					await fetch('general', { method: 'DELETE', body: token })
					window.location.href = '/parlor/' + data.event.parlorId
				})
		})
	}
</script>

<main class="mx-auto max-w-2xl">
	<section class="p-4">
		<h1 class="text-2xl font-bold">{data.event.name} @ {data.event.parlor.name} Settings</h1>
	</section>
	<section class="px-4">
		<h2 class="text-red py-2 font-bold text-red-500">Danger Zone</h2>
		<div class="divide-y rounded-xl border">
			<button on:click={deleteEvent} class="p-6 font-bold"> Delete Event </button>
		</div>
	</section>
</main>
