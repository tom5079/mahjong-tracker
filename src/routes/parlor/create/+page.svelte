<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'
	import { onMount } from 'svelte'

	let loading = false
	let error = ''

	let tags = ''
	let textarea: HTMLTextAreaElement

	let form: HTMLFormElement

	function onTagInput() {
		textarea.style.height = ''
		textarea.style.height = `min(${textarea.scrollHeight}px, 12rem)`
	}

	onMount(() => {
		// @ts-ignore
		form.addEventListener('submit', (event) => {
			event.preventDefault()
			// @ts-ignore
			window.grecaptcha.ready(() => {
				// @ts-ignore
				window.grecaptcha.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'submit' }).then(onSubmit)
			})
		})
	})

	function onSubmit(token: string) {
		console.log(token)
		const formData = new FormData(form)
		formData.set('token', token)

		loading = true

		fetch(form.target, {
			method: 'POST',
			body: formData
		})
			.then(async (response) => {
				const body = await response.json()

				console.log(body)

				if (response.ok) {
					goto(`/parlor/${body.id}`)
				} else {
					error = body.error
				}
			})
			.catch((error) => {
				console.error(error)
			})
			.finally(() => {
				loading = false
			})
	}
</script>

<main class="mx-auto max-w-7xl">
	<section class="px-4 py-8">
		<h1 class="text-2xl">New parlor</h1>
	</section>
	<form bind:this={form} method="POST">
		<input type="hidden" name="token" />
		<div class="mx-auto mb-6 grid gap-6 p-4 md:grid-cols-2">
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-900" for="name"
					>Name (required)</label
				>
				<input
					class="bg-grey-50 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					type="text"
					id="name"
					name="name"
					required
					minlength="3"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-900" for="location">Location</label>
				<input
					class="bg-grey-50 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					type="text"
					id="location"
					name="location"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-900" for="website">Website</label>
				<input
					class="bg-grey-50 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					type="text"
					id="website"
					name="website"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-900" for="tags">Tags</label>
				<textarea
					bind:value={tags}
					bind:this={textarea}
					on:input={onTagInput}
					class="bg-grey-50 block w-full resize-none overflow-hidden rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					rows="1"
					id="tags"
					name="tags"
				/>
			</div>
		</div>
		<div class="flex flex-row items-center justify-end space-x-4 px-4">
			<p class="font-semibold tracking-tight text-red-500">{error}</p>
			<button
				type="button"
				on:click={() => window.history.back()}
				class="p-2 px-5 py-2.5 font-semibold">Cancel</button
			>
			<button
				type="submit"
				disabled={loading}
				class="flex flex-row rounded border bg-blue-500 px-5 py-2.5 font-semibold text-white disabled:bg-indigo-500"
				>{#if loading}<svg
						class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg> Processing...{:else}Submit{/if}</button
			>
		</div>
	</form>
</main>
