<script lang="ts">
	import Richi from '$lib/Richi.svelte'
	import Repeat from '$lib/Repeat.svelte'
	import HistoryEntry from '$lib/game/history-entry.svelte'
	import PlayerScore from '$lib/game/player-score.svelte'
	import RonScoring from '$lib/game/ron-scoring.svelte'
	import TsumoScoring from '$lib/game/tsumo-scoring.svelte'
	import { convertRound } from '$lib/game/wind'
	import { KiriageDealer, KiriageNonDealer } from '$lib/game/scoring'
	import { computeState, type State } from '$lib/game/state'
	import type { PageData } from './$types'

	export let data: PageData

	const state: State = computeState({
		players: data.game.players.map((player) => player.user),
		ruleset: data.game.event.ruleset,
		actions: data.game.actions
	})
		.onFailure((error) => {
			console.error(error)
		})
		.getOrNull()!

	let action:
		| {
				type: 'ron'
				loser: string | null
				scores: Record<string, number>
		  }
		| {
				type: 'tsumo'
				winner: string | null
				scores: Record<string, number>
		  }
		| {
				type: 'draw'
				tenpai: string[]
		  }
		| {
				type: 'nagashi'
				players: string[]
		  }
		| {
				type: 'chonbo'
				player: string | null
		  }
		| null = null

	let activeWinner: string | null = null
	let displayArrow: ('U' | 'D' | null)[] = [null, null, null, null, null, null]
	let displayPoint: number[] = [0, 0, 0, 0, 0, 0]

	function displayRon() {
		const loserIndex = state.players.findIndex(
			(player) => action?.type === 'ron' && player.user.id === action.loser
		)
		const winners = state.players.map((player) =>
			action?.type === 'ron' ? action.scores[player.user.id] ?? 0 : 0
		)
		const activeWinnerIndex = state.players.findIndex((player) => player.user.id === activeWinner)
		displayArrow = [
			loserIndex === 0 && (winners[1] !== 0 || activeWinnerIndex === 1)
				? 'U'
				: loserIndex === 1 && (winners[0] !== 0 || activeWinnerIndex === 0)
					? 'D'
					: null,
			loserIndex === 0 && (winners[2] !== 0 || activeWinnerIndex === 2)
				? 'U'
				: loserIndex === 2 && (winners[0] !== 0 || activeWinnerIndex === 0)
					? 'D'
					: null,
			loserIndex === 0 && (winners[3] !== 0 || activeWinnerIndex === 3)
				? 'U'
				: loserIndex === 3 && (winners[0] !== 0 || activeWinnerIndex === 0)
					? 'D'
					: null,
			loserIndex === 1 && (winners[2] !== 0 || activeWinnerIndex === 2)
				? 'U'
				: loserIndex === 2 && (winners[1] !== 0 || activeWinnerIndex === 1)
					? 'D'
					: null,
			loserIndex === 1 && (winners[3] !== 0 || activeWinnerIndex === 3)
				? 'U'
				: loserIndex === 3 && (winners[1] !== 0 || activeWinnerIndex === 1)
					? 'D'
					: null,
			loserIndex === 2 && (winners[3] !== 0 || activeWinnerIndex === 3)
				? 'U'
				: loserIndex === 3 && (winners[2] !== 0 || activeWinnerIndex === 2)
					? 'D'
					: null
		]
		displayPoint = [
			loserIndex === 0 && winners[1] !== 0
				? winners[1]
				: loserIndex === 1 && winners[0] !== 0
					? winners[0]
					: 0,
			loserIndex === 0 && winners[2] !== 0
				? winners[2]
				: loserIndex === 2 && winners[0] !== 0
					? winners[0]
					: 0,
			loserIndex === 0 && winners[3] !== 0
				? winners[3]
				: loserIndex === 3 && winners[0] !== 0
					? winners[0]
					: 0,
			loserIndex === 1 && winners[2] !== 0
				? winners[2]
				: loserIndex === 2 && winners[1] !== 0
					? winners[1]
					: 0,
			loserIndex === 1 && winners[3] !== 0
				? winners[3]
				: loserIndex === 3 && winners[1] !== 0
					? winners[1]
					: 0,
			loserIndex === 2 && winners[3] !== 0
				? winners[3]
				: loserIndex === 3 && winners[2] !== 0
					? winners[2]
					: 0
		]
	}

	function displayTsumo() {
		const winnerIndex = state.players.findIndex(
			(player) => action?.type === 'tsumo' && player.user.id === action.winner
		)

		const pointsLost = state.players.map((player) =>
			action?.type === 'tsumo' ? action.scores[player.user.id] ?? 0 : 0
		)

		displayArrow = [
			winnerIndex === 0 ? 'D' : winnerIndex === 1 ? 'U' : null,
			winnerIndex === 0 ? 'D' : winnerIndex === 2 ? 'U' : null,
			winnerIndex === 0 ? 'D' : winnerIndex === 3 ? 'U' : null,
			winnerIndex === 1 ? 'D' : winnerIndex === 2 ? 'U' : null,
			winnerIndex === 1 ? 'D' : winnerIndex === 3 ? 'U' : null,
			winnerIndex === 2 ? 'D' : winnerIndex === 3 ? 'U' : null
		]

		displayPoint = [
			winnerIndex === 0 ? pointsLost[1] : winnerIndex === 1 ? pointsLost[0] : 0,
			winnerIndex === 0 ? pointsLost[2] : winnerIndex === 2 ? pointsLost[0] : 0,
			winnerIndex === 0 ? pointsLost[3] : winnerIndex === 3 ? pointsLost[0] : 0,
			winnerIndex === 1 ? pointsLost[2] : winnerIndex === 2 ? pointsLost[1] : 0,
			winnerIndex === 1 ? pointsLost[3] : winnerIndex === 3 ? pointsLost[1] : 0,
			winnerIndex === 2 ? pointsLost[3] : winnerIndex === 3 ? pointsLost[2] : 0
		]
	}

	function displayDraw() {
		const tenpai = state.players.map(
			(player) => action?.type === 'draw' && action.tenpai.includes(player.user.id)
		)

		const numTenpai = tenpai.filter((it) => it).length
		const tenpaiScore = numTenpai === 1 || numTenpai === 3 ? 1000 : numTenpai === 2 ? 1500 : 0

		displayArrow = [
			!tenpai[0] && tenpai[1]
				? 'U'
				: tenpai[0] && !tenpai[1] && !(tenpai[2] && !tenpai[3])
					? 'D'
					: null,
			!tenpai[0] && tenpai[2] && tenpai[1] == tenpai[3]
				? 'U'
				: tenpai[0] && !tenpai[2] && tenpai[1] == tenpai[3]
					? 'D'
					: null,
			!tenpai[0] && tenpai[3] && !(tenpai[1] && !tenpai[2])
				? 'U'
				: tenpai[0] && !tenpai[3]
					? 'D'
					: null,
			!tenpai[1] && tenpai[2]
				? 'U'
				: tenpai[1] && !tenpai[2] && !(!tenpai[0] && tenpai[3])
					? 'D'
					: null,
			!tenpai[1] && tenpai[3] && tenpai[0] == tenpai[2]
				? 'U'
				: tenpai[1] && !tenpai[3] && tenpai[0] == tenpai[2]
					? 'D'
					: null,
			!tenpai[2] && tenpai[3]
				? 'U'
				: tenpai[2] && !tenpai[3] && !(tenpai[0] && !tenpai[1])
					? 'D'
					: null
		]

		displayPoint = [
			(!tenpai[0] && tenpai[1]) || (tenpai[0] && !tenpai[1] && !(tenpai[2] && !tenpai[3]))
				? tenpaiScore
				: 0,
			(!tenpai[0] && tenpai[2] && tenpai[1] == tenpai[3]) ||
			(tenpai[0] && !tenpai[2] && tenpai[1] == tenpai[3])
				? tenpaiScore
				: 0,
			(!tenpai[0] && tenpai[3] && !(tenpai[1] && !tenpai[2])) || (tenpai[0] && !tenpai[3])
				? tenpaiScore
				: 0,
			(!tenpai[1] && tenpai[2]) || (tenpai[1] && !tenpai[2] && !(!tenpai[0] && tenpai[3]))
				? tenpaiScore
				: 0,
			(!tenpai[1] && tenpai[3] && tenpai[0] == tenpai[2]) ||
			(tenpai[1] && !tenpai[3] && tenpai[0] == tenpai[2])
				? tenpaiScore
				: 0,
			(!tenpai[2] && tenpai[3]) || (tenpai[2] && !tenpai[3] && !(tenpai[0] && !tenpai[1]))
				? tenpaiScore
				: 0
		]
	}

	$: {
		switch (action?.type) {
			case 'ron':
				displayRon()
				break
			case 'tsumo':
				displayTsumo()
				break
			case 'draw':
				displayDraw()
				break
			default:
				activeWinner = null
				displayArrow = [null, null, null, null, null, null]
				displayPoint = [0, 0, 0, 0, 0, 0]
				break
		}
	}

	function onPlayerClick(player: string) {
		if (action?.type == null) {
		} else if (action.type === 'ron') {
			if (action.loser == null) {
				action = {
					type: 'ron',
					loser: player,
					scores: {}
				}
			} else {
				activeWinner = player
				action.scores[player] = 0
			}
		} else if (action.type === 'tsumo') {
			action = {
				type: 'tsumo',
				winner: player,
				scores: {}
			}
		} else if (action.type === 'draw') {
			if (action.tenpai.includes(player)) {
				action.tenpai = action.tenpai.filter((p) => p != player)
			} else {
				action.tenpai.push(player)
			}
			action = action
		} else if (action.type === 'chonbo') {
			action.player = player
			action = action
		}
	}

	function submit() {
		if (action) {
			const data = JSON.stringify(action)
			console.log(data)
		}

		action = null
	}

	function ron() {
		action = { type: 'ron', loser: null, scores: {} }
	}

	function tsumo() {
		action = { type: 'tsumo', winner: null, scores: {} }
	}

	function draw() {
		action = { type: 'draw', tenpai: [] }
	}

	function chonbo() {
		action = { type: 'chonbo', player: null }
	}
</script>

<header class="p-4">
	<p class="text-2xl font-bold">Berkeley Mahjong League</p>
	<p>Semi-final #2</p>
</header>
<section class="relative mx-auto aspect-square max-w-lg rounded-xl bg-slate-200">
	<p class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
		<span class="font-mj text-4xl">{convertRound(state.round)}</span>
		<Richi count={state.richi} />
		<Repeat count={state.repeat} />
	</p>
	<svg
		class="absolute left-0 right-0 h-full w-full text-red-500"
		viewBox="0 0 256 256"
		xmlns="http://www.w3.org/2000/svg"
	>
		<defs>
			<!-- A marker to be used as an arrowhead -->
			<marker
				id="arrow"
				viewBox="0 0 10 10"
				refX="5"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
			</marker>
		</defs>

		<!-- 0 -> 1 -->
		{#if displayArrow[0] != null}
			<path
				d="M 160 230
			   Q 224 224 224 160"
				stroke="currentColor"
				fill="none"
				marker-start={displayArrow[0] === 'D' ? 'url(#arrow)' : ''}
				marker-end={displayArrow[0] === 'U' ? 'url(#arrow)' : ''}
			/>
		{/if}
		<!-- 0 -> 2 -->
		{#if displayArrow[1] != null}
			<path
				d="M 100 200
			   Q 60 128 100 40"
				stroke="currentColor"
				fill="none"
				marker-start={displayArrow[1] === 'D' ? 'url(#arrow)' : ''}
				marker-end={displayArrow[1] === 'U' ? 'url(#arrow)' : ''}
			/>
		{/if}
		<!-- 0 -> 3 -->
		{#if displayArrow[2] != null}
			<path
				d="M 90 230
			   Q 32 224 32 160"
				stroke="currentColor"
				fill="none"
				marker-start={displayArrow[2] === 'D' ? 'url(#arrow)' : ''}
				marker-end={displayArrow[2] === 'U' ? 'url(#arrow)' : ''}
			/>
		{/if}
		<!-- 1 -> 2 -->
		{#if displayArrow[3] != null}
			<path
				d="M 224 100
			   Q 224 32 160 32"
				stroke="currentColor"
				fill="none"
				marker-start={displayArrow[3] === 'D' ? 'url(#arrow)' : ''}
				marker-end={displayArrow[3] === 'U' ? 'url(#arrow)' : ''}
			/>
		{/if}
		{#if displayArrow[4] != null}
			<!-- 1 -> 3 -->
			<path
				d="M 200 100
			   Q 128 64 60 100"
				stroke="currentColor"
				fill="none"
				marker-start={displayArrow[4] === 'D' ? 'url(#arrow)' : ''}
				marker-end={displayArrow[4] === 'U' ? 'url(#arrow)' : ''}
			/>
		{/if}
		{#if displayArrow[5] != null}
			<!-- 2 -> 3 -->
			<path
				d="M 100 32
			   Q 32 32 32 100"
				stroke="currentColor"
				fill="none"
				marker-start={displayArrow[5] === 'D' ? 'url(#arrow)' : ''}
				marker-end={displayArrow[5] === 'U' ? 'url(#arrow)' : ''}
			/>
		{/if}
	</svg>
	{#if displayPoint[0]}
		<p class="absolute bottom-[10%] right-[10%]">{displayPoint[0]}</p>
	{/if}
	{#if displayPoint[1]}
		<p class="absolute left-[40%] top-[70%]">{displayPoint[1]}</p>
	{/if}
	{#if displayPoint[2]}
		<p class="absolute bottom-[10%] left-[10%]">{displayPoint[2]}</p>
	{/if}
	{#if displayPoint[3]}
		<p class="absolute right-[10%] top-[10%]">{displayPoint[3]}</p>
	{/if}
	{#if displayPoint[4]}
		<p class="absolute left-1/2 top-1/4 -translate-x-1/2">{displayPoint[4]}</p>
	{/if}
	{#if displayPoint[5]}
		<p class="absolute left-[10%] top-[10%]">{displayPoint[5]}</p>
	{/if}
	<button
		on:click={() => onPlayerClick(state.players[0].user.id)}
		class="absolute bottom-2 left-1/2 -translate-x-1/2 border-b-4"
		class:border-gray-500={action?.type === 'draw' &&
			action.tenpai.includes(state.players[0].user.id)}
		class:border-yellow-500={action?.type === 'chonbo' && action.player == state.players[0].user.id}
	>
		<PlayerScore {...state.players[0]} username={state.players[0].user.username} />
	</button>
	<button
		on:click={() => onPlayerClick(state.players[1].user.id)}
		class="absolute right-2 top-1/2 -translate-y-1/2 border-b-4"
		class:border-gray-500={action?.type === 'draw' &&
			action.tenpai.includes(state.players[1].user.id)}
		class:border-yellow-500={action?.type === 'chonbo' && action.player == state.players[1].user.id}
	>
		<PlayerScore {...state.players[1]} username={state.players[1].user.username} />
	</button>
	<button
		on:click={() => onPlayerClick(state.players[2].user.id)}
		class="absolute left-1/2 top-2 -translate-x-1/2 border-b-4"
		class:border-gray-500={action?.type === 'draw' &&
			action.tenpai.includes(state.players[2].user.id)}
		class:border-yellow-500={action?.type === 'chonbo' && action.player == state.players[2].user.id}
	>
		<PlayerScore {...state.players[2]} username={state.players[2].user.username} />
	</button>
	<button
		on:click={() => onPlayerClick(state.players[3].user.id)}
		class="absolute left-2 top-1/2 -translate-y-1/2 border-b-4"
		class:border-gray-500={action?.type === 'draw' &&
			action.tenpai.includes(state.players[3].user.id)}
		class:border-yellow-500={action?.type === 'chonbo' && action.player == state.players[3].user.id}
	>
		<PlayerScore {...state.players[3]} username={state.players[3].user.username} />
	</button>
</section>
{#if action == null}
	<section class="mx-auto max-w-lg p-4">
		<p class="font-bold">Action</p>
		<div class="my-4 grid grid-cols-2 gap-x-8 gap-y-4">
			<button on:click={ron} class="h-12 rounded bg-red-500 text-xl font-bold text-white"
				>Ron</button
			>
			<button on:click={tsumo} class="h-12 rounded bg-blue-500 text-xl font-bold text-white"
				>Tsumo</button
			>
			<button on:click={draw} class="h-12 rounded bg-gray-500 text-xl font-bold text-white"
				>Draw</button
			>
			<button on:click={chonbo} class="h-12 rounded bg-yellow-500 text-xl font-bold text-white"
				>Chonbo</button
			>
		</div>
		<p class="font-bold">History</p>
		<div>
			{#each state.history as history}
				<div>
					<div class="flex flex-row items-center justify-between">
						<p class="my-4 text-2xl">
							<span class="font-mj">{convertRound(history.round)}</span> /
							{history.repeat}<span class="font-mj">本場</span>
						</p>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<HistoryEntry
							{...history.result[0]}
							username={state.players.find((player) => player.user.id === history.result[0].player)
								?.user?.username ?? 'unknown user'}
						/>
						<HistoryEntry
							{...history.result[1]}
							username={state.players.find((player) => player.user.id === history.result[0].player)
								?.user?.username ?? 'unknown user'}
						/>
						<HistoryEntry
							{...history.result[2]}
							username={state.players.find((player) => player.user.id === history.result[0].player)
								?.user?.username ?? 'unknown user'}
						/>
						<HistoryEntry
							{...history.result[3]}
							username={state.players.find((player) => player.user.id === history.result[0].player)
								?.user?.username ?? 'unknown user'}
						/>
					</div>
				</div>
				<div class="my-4 h-px w-full bg-slate-300" />
			{/each}
		</div>
	</section>
{:else if action.type === 'ron'}
	<section class="mx-auto max-w-lg">
		<div class="flex flex-row items-center">
			<button
				on:click={() => {
					if (action?.type === 'ron') {
						if (activeWinner) {
							activeWinner = null
							return
						}

						if (action.loser != null) {
							ron()
							return
						}
					}

					action = null
				}}
				class="material-symbols-rounded p-4 text-3xl"
			>
				arrow_back
			</button>
			<p class="text-2xl">
				Ron {#if action.loser != null}
					@ {action.loser}{/if}
			</p>
			{#if Object.keys(action.scores).length > 0 && action.loser != null && activeWinner == null}
				<button
					on:click={submit}
					class="ml-auto flex flex-row items-center space-x-4 p-4 text-green-500"
				>
					<span class="material-symbols-rounded text-3xl">check</span> Submit
				</button>
			{/if}
		</div>
		{#if action.loser == null}
			<p class="w-full py-16 text-center text-2xl">Select loser from above</p>
		{:else if activeWinner == null}
			<p class="w-full py-16 text-center text-2xl">
				Select winner from above{#if Object.keys(action.scores).length > 0}
					<br />or click Submit{/if}
			</p>
		{:else}
			<p class="px-4 text-2xl">Winner: {activeWinner}</p>
			<RonScoring
				scores={state.players.find((player) => player.user.id === activeWinner)?.wind === 0
					? KiriageDealer
					: KiriageNonDealer}
				onScore={(score) => {
					if (action?.type !== 'ron' || activeWinner == null) {
						throw new Error('Inconsistent action')
					}

					action.scores[activeWinner] = score
					action = action

					activeWinner = null
				}}
			/>
		{/if}
	</section>
{:else if action.type === 'tsumo'}
	<section class="mx-auto max-w-lg">
		<div class="flex flex-row items-center">
			<button
				on:click={() => {
					if (action?.type === 'tsumo' && action.winner != null) {
						tsumo()
						return
					}

					action = null
				}}
				class="material-symbols-rounded p-4 text-3xl"
			>
				arrow_back
			</button>
			<p class="text-2xl">
				Tsumo {#if action.winner != null}
					@ {action.winner}{/if}
			</p>
			{#if action.winner != null && Object.keys(action.scores).length > 0}
				<button
					on:click={submit}
					class="ml-auto flex flex-row items-center space-x-4 p-4 text-green-500"
				>
					<span class="material-symbols-rounded text-3xl">check</span> Submit
				</button>
			{/if}
		</div>
		{#if action.winner == null}
			<p class="w-full py-16 text-center text-2xl">Select winner from above</p>
		{:else}
			<TsumoScoring
				scores={state.players.find(
					(player) => action?.type === 'tsumo' && player.user.id === action.winner
				)?.wind === 0
					? KiriageDealer
					: KiriageNonDealer}
				onScore={(score) => {
					if (action?.type !== 'tsumo') {
						return
					}

					action.scores = Object.fromEntries(
						state.players
							.map((player) => {
								if (action?.type !== 'tsumo') {
									return null
								}
								if (player.user.id === action.winner) {
									return null
								}

								return [player.user.id, player.wind === 0 ? score.fromDealer : score.fromNonDealer]
							})
							.filter((it) => it != null)
					)
					action = action
				}}
			/>
		{/if}
	</section>
{:else if action.type === 'draw' || action.type === 'nagashi'}
	<section class="mx-auto max-w-lg">
		<div class="flex flex-row items-center">
			<button on:click={() => (action = null)} class="material-symbols-rounded p-4 text-3xl">
				arrow_back
			</button>
			<p class="text-2xl">Draw</p>
			<button
				on:click={() => {
					if (action?.type === 'draw') {
						action = { type: 'nagashi', players: [] }
					} else {
						action = { type: 'draw', tenpai: [] }
					}
				}}
				class:bg-blue-500={action.type === 'nagashi'}
				class:text-white={action.type === 'nagashi'}
				class="mx-4 rounded border px-4 py-2">Nagashi</button
			>
			{#if action.type === 'draw' || Object.keys(action.players).length > 0}
				<button
					on:click={submit}
					class="ml-auto flex flex-row items-center space-x-4 p-4 text-green-500"
				>
					<span class="material-symbols-rounded text-3xl">check</span> Submit
				</button>
			{/if}
		</div>
		{#if action.type === 'nagashi'}
			<p class="w-full py-16 text-center text-2xl">Select player from above</p>
		{:else}
			<p class="w-full py-16 text-center text-2xl">Select tenpai players from above</p>
		{/if}
	</section>
{:else if action.type === 'chonbo'}
	<section class="mx-auto max-w-lg">
		<div class="flex flex-row items-center">
			<button on:click={() => (action = null)} class="material-symbols-rounded p-4 text-3xl">
				arrow_back
			</button>
			<p class="text-2xl">Chonbo</p>
			{#if action.player != null}
				<button
					on:click={submit}
					class="ml-auto flex flex-row items-center space-x-4 p-4 text-green-500"
				>
					<span class="material-symbols-rounded text-3xl">check</span> Submit
				</button>
			{/if}
		</div>
		<p class="w-full py-16 text-center text-2xl">Select player from above</p>
	</section>
{/if}
