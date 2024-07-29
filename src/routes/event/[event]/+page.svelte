<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import moment from 'moment'
	import type { PageData } from './$types'

	export let data: PageData

	async function join() {
		await fetch(`${data.event.id}/join`, { method: 'POST' })
		invalidateAll()
	}
</script>

<main class="mx-auto max-w-2xl">
	<section class="p-4">
		<div class="flex flex-row items-center">
			<h1 class="mr-auto text-2xl font-bold">{data.event.name} @ {data.event.parlor.name}</h1>
			{#if data.joinRequestStatus === 'PENDING'}
				<p class="flex flex-row items-center p-4 text-sm text-violet-500">
					<span class="material-symbols-rounded mr-2">hourglass</span>Join request pending
				</p>
			{:else if data.joinRequestStatus === 'ACCEPTED'}
				<p class="flex flex-row items-center text-sm text-green-500">
					<span class="material-symbols-rounded mr-2">check</span>Joined
				</p>
			{:else if data.joinRequestStatus === 'REJECTED'}
				<button
					on:click={join}
					class="flex flex-row items-center rounded-lg border border-red-500 p-4 text-sm text-red-500 transition duration-300 hover:bg-red-500 hover:text-white"
				>
					<span class="material-symbols-rounded mr-2">close</span>Join request rejected
				</button>
			{:else}
				<button on:click={join} class="flex flex-row rounded-lg bg-blue-500 p-4 text-white">
					<span class="material-symbols-rounded mr-2">people</span> Join
				</button>
			{/if}
			<a
				href="{data.event.id}/settings"
				class="material-symbols-rounded filled px-5 py-2.5 text-2xl">settings</a
			>
		</div>
	</section>
	<section class="p-4">
		<div class="flex flex-row items-center justify-between">
			<h2 class="text-xl font-semibold">Leaderboard</h2>
		</div>
	</section>
	<section class="p-4">
		<div class="flex flex-row items-center justify-between">
			<h2 class="text-xl font-semibold">Games</h2>
			<a
				href="{data.event.id}/create_game"
				class="flex flex-row rounded-lg bg-blue-500 p-4 text-white"
			>
				<span class="material-symbols-rounded">add</span> New Game
			</a>
		</div>
		{#each data.event.games as game}
			<a href="/game/{game.id}" class="my-4 flex flex-row rounded-lg border p-2">
				<div class="mr-auto">
					<p class="text-2xl">{game.name}</p>
					<p class="">Table {game.table}</p>
					<p class="flex flex-row items-center font-semibold">
						Scheduled{#if game.startTime}
							{` at ${new Date(game.startTime).toLocaleString()}`}{/if}
					</p>
					<div class="mt-4 flex flex-col">
						{#each game.players as player, i}
							<p>
								<span class="font-mj">{'東南西北'.charAt(i)}</span>
								{player.user.username}
							</p>
						{/each}
					</div>
				</div>
				<span class="material-symbols-rounded my-auto">chevron_right</span>
			</a>
		{/each}
	</section>
</main>
