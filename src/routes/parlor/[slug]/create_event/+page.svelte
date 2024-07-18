<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
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
			</div>
			<div class="md:col-span-2">
				<label for="end" class="mb-2 block text-sm font-medium text-gray-900">End</label>
				<input
					type="datetime-local"
					id="end"
					name="end"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>
			<fieldset class="rounded border border-solid border-gray-300 p-2">
				<legend class="mb-2 block text-sm font-medium text-gray-900">Format</legend>
				<div class="flex flex-row space-x-2">
					<div class="flex-1 rounded border">
						<input
							class="peer hidden h-0 w-0"
							type="radio"
							id="casual"
							name="format"
							value="casual"
							checked
						/>
						<label
							class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
							for="casual">Casual</label
						>
					</div>
					<div class="flex-1 rounded border">
						<input
							class="peer hidden h-0 w-0"
							type="radio"
							id="league"
							name="format"
							value="league"
						/>
						<label
							class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
							for="league">League</label
						>
					</div>
					<div class="flex-1 rounded border">
						<input
							class="peer hidden h-0 w-0"
							type="radio"
							id="tournament"
							name="format"
							value="tournament"
						/>
						<label
							class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
							for="tournament">Tournament</label
						>
					</div>
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
