<script lang="ts">
	import type { PageData } from './$types'
	import Text from '$lib/form/Text.svelte'
	import Datetime from '$lib/form/Datetime.svelte'
	import Label from '$lib/form/Label.svelte'
	import Fieldset from '$lib/form/Fieldset.svelte'

	import type { User } from '@prisma/client'

	export let data: PageData

	let error = ''

	const numPlayers = data.event.ruleset.player === 'FOUR' ? 4 : 3

	let userSearch = ''
	let searchResult = []

	$: searchResult = data.attendees.filter((x) =>
		userSearch ? x.username.includes(userSearch) : true
	)

	const roster: User[] = Array(10).fill(data.attendees[0])
</script>

<main class="mx-auto max-w-2xl">
	<section class="p-4">
		<h1 class="text-2xl font-semibold">New Game @ {data.event.name}</h1>
	</section>
	<section>
		<form>
			<div class="space-y-8 p-4">
				<Text name="name" label="Name (optional)" />
				<Label label="Start time">
					<Datetime name="start" />
				</Label>
				<div class="flex flex-row items-center text-sm">
					<span class="mr-auto font-medium">Duration</span>
					<input type="number" class="mr-2 w-20 rounded-lg border border-gray-300 bg-gray-50 p-2" />
					<span class="mr-4 font-medium">h</span>
					<input type="number" class="mr-2 w-20 rounded-lg border border-gray-300 bg-gray-50 p-2" />
					<span class="font-medium">min</span>
				</div>
				<Fieldset label="Roster">
					<div class="relative flex flex-row space-x-2 px-2">
						<input
							type="text"
							bind:value={userSearch}
							placeholder="Add player"
							class="peer w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
						<button
							type="button"
							class="material-symbols-rounded ml-auto flex flex-row items-center rounded-lg bg-blue-500 p-2 text-white"
						>
							casino
						</button>
						<div
							class="absolute -left-1 top-10 hidden w-[calc(100%-4rem)] flex-col divide-y rounded-lg border border-gray-300 bg-gray-50 p-2 shadow-lg peer-focus:flex"
						>
							{#if searchResult.length > 0}
								{#each searchResult as user}
									<div class="flex flex-row items-center space-x-2">
										<img
											src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp"
											alt="avatar of {user.username}"
											class="h-8 w-8 rounded-full"
										/>
										<p>{user.username}</p>
									</div>
								{/each}
							{:else}
								<p>No result</p>
							{/if}
						</div>
					</div>
					<div class="flex flex-col">
						{#each roster as player, i}
							<div
								class="flex flex-row items-center space-x-4 border-gray-300 px-4 py-2"
								class:border-t={i !== 0 && i % numPlayers === 0}
							>
								<img
									src="https://cdn.discordapp.com/avatars/{player.id}/{player.avatar}.webp"
									alt="avatar of {player.username}"
									class="h-8 w-8 rounded-full"
								/>
								<p class="flex-1">{player.username}</p>
								{#if Math.floor((roster.length - 1) / numPlayers) * numPlayers > i}
									<p class="text-sm"># {Math.floor(i / numPlayers) + 1}</p>
									<p class="font-mj text-2xl">{'東南西北'.charAt(i % numPlayers)}</p>
								{:else}
									<p class="pr-8">-</p>
								{/if}
							</div>
						{/each}
					</div>
				</Fieldset>
				<div class="flex flex-row pt-4">
					<p class="ml-auto text-red-500">{error}</p>
					<button on:click={() => window.history.back()} class="p-4 font-semibold" type="button"
						>Cancel</button
					>
					<button class="rounded-lg border bg-blue-500 p-4 font-semibold text-white">Submit</button>
				</div>
			</div>
		</form>
	</section>
</main>
