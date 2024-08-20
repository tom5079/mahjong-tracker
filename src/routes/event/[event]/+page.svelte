<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { computeState } from '$lib/game/state'
	import { convertRound } from '$lib/game/wind'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'
	import { onMount } from 'svelte'
	import UserAvatar from '$lib/UserAvatar.svelte'

	export let data: PageData

	$: states = data.games.map((game) => ({
		game,
		state: computeState({
			players: game.players.map((player) => player.user),
			ruleset: data.event.ruleset,
			actions: game.actions
		})
	}))

	$: currentPage = +($page.url.searchParams.get('page') ?? 1)

	$: leaderboard = Object.entries(
		states.reduce<Record<string, number>>(
			(acc, { state }) => {
				if (!state.ok) return acc
				const match = state.value.match
				if (match.state !== 'ENDED') return acc
				match.result.forEach((player) => {
					acc[player.player] += player.soten - player.penalty
				})
				return acc
			},
			Object.fromEntries(data.attendees.map((attendee) => [attendee.userId, 0]))
		)
	).sort((a, b) => b[1] - a[1])

	onMount(() => {
		const refresh = setInterval(() => {
			invalidateAll()
		}, 5000)

		return () => clearInterval(refresh)
	})

	async function join() {
		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'submit' })
				.then(async (token) => {
					await fetch(`${data.event.id}/join`, { method: 'POST', body: token })
					invalidateAll()
				})
		})
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
		<div class="flex flex-col space-y-4">
			<h2 class="text-xl font-semibold">Leaderboard</h2>
			<div class="grid grid-cols-leaderboard rounded-lg border">
				<th class="p-4 text-right text-lg">#</th>
				<th class="p-4 text-left text-lg">Player</th>
				<th class="p-4 text-right text-lg">Score</th>
				{#each leaderboard as [player, score], i}
					{@const playerUser = data.attendees.find((p) => p.user.id === player)?.user}
					{#if playerUser != null}
						<td class="p-4 text-right text-lg">{i + 1}</td>
						<td class="flex flex-row items-center p-4 text-lg">
							<UserAvatar user={playerUser} />
							<span class="ml-4 truncate">{playerUser?.username}</span>
						</td>
						<td class="p-4 text-right text-lg">{score / 10}</td>
					{/if}
				{/each}
			</div>
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
		<div class="mx-auto w-fit divide-x overflow-clip rounded-lg border">
			{#each { length: Math.ceil(data.games.length / 10) } as _, page}
				<button
					on:click={() => goto(`?page=${page + 1}`)}
					class="px-6 py-4 text-lg"
					class:bg-blue-500={currentPage === page + 1}
					class:text-white={currentPage === page + 1}
				>
					{page + 1}
				</button>
			{/each}
		</div>
		{#each states.slice((currentPage - 1) * 10, currentPage * 10) as { game, state }}
			<a href="/game/{game.id}" class="my-4 flex flex-row rounded-lg border p-2">
				<div class="flex-1">
					<p class="text-2xl">{game.name}</p>
					<p class="">Table {game.table}</p>
					<p class="flex flex-row items-center font-semibold">
						{#if state.ok}
							{@const match = state.value.match}
							{#if match.state === 'WAITING'}
								Scheduled{#if game.startTime}
									{` at ${new Date(game.startTime).toLocaleString()}`}
								{/if}
							{:else if match.state === 'ENDED'}
								Ended
							{:else}
								<span class="relative mr-2 flex h-3 w-3">
									<span
										class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
									></span>
									<span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
								</span>
								Running
								<span class="ml-2 font-mj">{convertRound(state.value.round)} </span>
							{/if}
						{:else}
							<span class="text-red-500">Error</span>
						{/if}
					</p>

					{#if state.ok}
						<table class="mt-4 table-auto">
							<tbody>
								{#each state.value.players.sort((a, b) => {
									const match = state.value.match
									if (match.state === 'ENDED') {
										const scores = match.result.map( (it) => ({ ...it, score: it.soten - it.penalty }) )

										const aScore = scores.find((it) => it.player === a.user.id)?.score ?? 0
										const bScore = scores.find((it) => it.player === b.user.id)?.score ?? 0

										return bScore - aScore
									}
									return b.score - a.score
								}) as player}
									<tr class="text-lg">
										<td class="pr-2 font-mj">{'東南西北'.charAt(player.wind)}</td>
										<td class="truncate pr-8">
											{player.user.username}
										</td>
										{#if state.value.match.state === 'ENDED'}
											{@const score = state.value.match.result.find(
												(p) => p.player === player.user.id
											)}
											{#if score == null}
												<td class="text-red-500">Error</td>
											{:else}
												{@const finalScore = score.soten - score.penalty}
												<td
													class="relative"
													class:text-blue-500={finalScore > 0}
													class:text-red-500={finalScore < 0}
												>
													{#if finalScore < 0}<span class="absolute -left-2">-</span>{/if}
													<span>
														{Math.abs(finalScore) / 10}
													</span>
												</td>
											{/if}
										{:else if state.value.match.state !== 'WAITING'}
											{@const score = state.value.players.find(
												(p) => p.user.id === player.user.id
											)?.score}
											{#if score == null}
												<td class="text-red-500">Error</td>
											{:else}
												<td
													class="relative"
													class:text-blue-500={score > data.event.ruleset.startScore}
													class:text-red-500={score < data.event.ruleset.startScore}
												>
													{#if score < 0}<span class="absolute -left-2">-</span>{/if}
													<span>
														{Math.abs(score)}
													</span>
												</td>
											{/if}
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
				<span class="material-symbols-rounded my-auto">chevron_right</span>
			</a>
		{/each}
	</section>
	<div class="mx-auto mb-4 w-fit divide-x overflow-clip rounded-lg border">
		{#each { length: Math.ceil(data.games.length / 10) } as _, page}
			<button
				on:click={() => goto(`?page=${page + 1}`)}
				class="px-6 py-4 text-lg"
				class:bg-blue-500={currentPage === page + 1}
				class:text-white={currentPage === page + 1}
			>
				{page + 1}
			</button>
		{/each}
	</div>
</main>
