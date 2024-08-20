<script lang="ts">
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'
	import type { PageData } from './$types'

	export let data: PageData

	function deleteGame() {
		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'delete_game' })
				.then(async (token) => {
					fetch(`settings`, { method: 'DELETE', body: token }).then(() => {
						window.location.href = '/event/' + data.game.event.id
					})
				})
		})
	}
</script>

<main class="mx-auto max-w-lg">
	<header class="py-4">
		<div class="flex flex-row items-center justify-between">
			<div>
				<p class="text-2xl font-bold">{data.game.name} - Settings</p>
				<p>Table {data.game.table}</p>
			</div>
		</div>
	</header>

	<section class="rounded-lg border p-4">
		<button on:click={deleteGame} class="p-2 font-bold text-red-500">Delete Game</button>
	</section>
</main>
