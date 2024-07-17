<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	let textarea: HTMLTextAreaElement
	let tags: string
</script>

<main class="mx-auto max-w-7xl space-y-8 p-4">
	<h1 class="text-2xl">New event @ {data.parlor.name}</h1>
	<form>
		<div class="mb-8 grid gap-6 md:grid-cols-2">
			<div>
				<label for="name" class="mb-2 block text-sm font-medium text-gray-900">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>
			<div class="relative md:col-span-2">
				<label for="start" class="mb-2 block text-sm font-medium text-gray-900">Start</label>
				<p class="absolute right-0 top-0 ml-auto mt-auto text-xs">
					Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
				</p>
				<input
					type="datetime-local"
					id="start"
					name="start"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
			</divs
			<div class="md:col-span-2">
				<label for="end" class="mb-2 block text-sm font-medium text-gray-900">End</label>
				<input
					type="datetime-local"
					id="end"
					name="end"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>
			<fieldset class="flex flex-row space-x-2 rounded border border-solid border-gray-300 p-4">
				<legend class="mb-2 block text-sm font-medium text-gray-900">Format</legend>
				<div class="flex-1 rounded border p-4">
					<input type="radio" id="riichi" name="format" value="riichi" />
					<label class="text-sm" for="riichi">League</label>
					<p class="">What</p>
				</div>
				<div class="flex-1 rounded border p-4">
					<input type="radio" id="tournament" name="format" value="tournament" />
					<label class="text-sm" for="tournament">Tournament</label>
				</div>
			</fieldset>
		</div>
		<div class="flex flex-row justify-end">
			<button type="button" on:click={() => window.history.back()} class="rounded p-2 px-5 py-2.5"
				>Cancel</button
			>
			<button type="submit" class="rounded bg-blue-500 p-2 px-5 py-2.5 text-white">Create</button>
		</div>
	</form>
</main>
