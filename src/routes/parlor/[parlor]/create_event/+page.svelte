<script lang="ts">
	import { onMount } from 'svelte'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import Fieldset from '$lib/form/Fieldset.svelte'
	import Radio from '$lib/form/Radio.svelte'
	import Label from '$lib/form/Label.svelte'
	import Datetime from '$lib/form/Datetime.svelte'
	import { DateTime } from 'luxon'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'

	export let data: PageData

	let form: HTMLFormElement
	let formData: Record<string, FormDataEntryValue>

	let description = ''
	let textarea: HTMLTextAreaElement

	let error = ''

	function onDescriptionInput() {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	onMount(() => {
		formData = Object.fromEntries([...new FormData(form).entries()])
		form.addEventListener('submit', async (event) => {
			event.preventDefault()

			window.grecaptcha.ready(() => {
				window.grecaptcha.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'submit' }).then(onSubmit)
			})
		})
	})

	async function onSubmit(token: string) {
		const body = new FormData(form)

		body.set('token', token)

		const joinPolicyUntil = DateTime.fromISO(body.get('joinPolicyUntil')?.toString() ?? '')

		if (joinPolicyUntil.isValid) {
			body.set('joinPolicyUntil', joinPolicyUntil.toISO())
		}

		const response = await fetch(`create_event`, {
			method: 'POST',
			body
		})

		const json = await response.json()

		if (response.ok) {
			goto(`/event/${json.eventId}`)
		} else {
			error = json.message
		}
	}
</script>

<main class="mx-auto max-w-2xl space-y-4 p-4">
	<h1 class="text-2xl">New event @ {data.parlor.name}</h1>
	<form
		on:change={() => (formData = Object.fromEntries([...new FormData(form).entries()]))}
		bind:this={form}
	>
		<div class="flex flex-col space-y-4">
			<div>
				<label for="name" class="mb-2 block text-sm font-medium text-gray-900">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					required
				/>
			</div>
			<div>
				<label for="location" class="mb-2 block text-sm font-medium text-gray-900">Location</label>
				<input
					type="text"
					id="location"
					name="location"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>
			<div>
				<label for="description" class="mb-2 block text-sm font-medium text-gray-900"
					>Description</label
				>
				<textarea
					bind:value={description}
					bind:this={textarea}
					on:input={onDescriptionInput}
					class="block w-full resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					rows="1"
					id="description"
					name="description"
				/>
			</div>
			<div>
				<div class="flex flex-row items-center justify-between py-2">
					<label for="ruleset" class="mb-2 block text-sm font-medium text-gray-900">Ruleset</label>
					<a href="settings/ruleset/create" class="rounded-lg bg-blue-500 px-5 py-2.5 text-white"
						>New Ruleset</a
					>
				</div>
				<select
					id="ruleset"
					name="ruleset"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				>
					{#each data.rulesets as ruleset}
						<option value={ruleset.id}>{ruleset.name}</option>
					{/each}
				</select>
			</div>
			<Fieldset label="Join Policy">
				<Radio
					name="joinPolicy"
					values={[
						{
							value: 'manual',
							label: 'Manual'
						},
						{
							value: 'auto',
							label: 'Auto Approve'
						}
					]}
					selected={formData?.joinPolicy?.toString()}
				/>
				<div class="p-2" class:hidden={formData?.joinPolicy?.toString() !== 'auto'}>
					<Label label="Until">
						<Datetime name="joinPolicyUntil" min={DateTime.now().toISO().slice(0, 16)} />
					</Label>
				</div>
			</Fieldset>
		</div>
		<div class="mt-8 flex flex-row items-center justify-end">
			<p class="flex-1 text-right font-bold text-red-500">{error}</p>
			<button type="button" on:click={() => window.history.back()} class="p-2 px-5 py-4"
				>Cancel</button
			>
			<button type="submit" class="rounded-lg bg-blue-500 p-2 px-5 py-4 text-white">Create</button>
		</div>
	</form>
</main>
