<script lang="ts">
	import Richi from '$lib/Richi.svelte'
	import Repeat from '$lib/Repeat.svelte'
	import HistoryEntry from '$lib/record/history-entry.svelte'
	import PlayerScore from '$lib/record/player-score.svelte'
	import { convertWind } from '$lib/record/wind'

	const state: {
		round: string
		richi: number
		repeat: number
		players: {
			id: string
			score: number
			wind: string
			richi: boolean
		}[]
		history: {
			round: string
			repeat: number
			result: {
				player: string
				wind: string
				score?: string
				richi?: boolean
				chonbo?: boolean
			}[]
		}[]
	} = {
		round: 'E2',
		richi: 0,
		repeat: 0,
		players: [
			{ id: 'akadora3', score: 50, wind: 'N', richi: false },
			{ id: 'tookoo', score: 370, wind: 'E', richi: true },
			{ id: 'eviltaxi', score: 330, wind: 'S', richi: false },
			{ id: 'ichigo', score: 250, wind: 'W', richi: false }
		],
		history: [
			{
				round: 'E1',
				repeat: 0,
				result: [
					{ player: 'akadora3', wind: 'E', score: '-20000' },
					{ player: 'tookoo', wind: 'S', score: '+12000', richi: true },
					{ player: 'eviltaxi', wind: 'W', score: '+8000' },
					{ player: 'ichigo', wind: 'N' }
				]
			},
			{
				round: 'E1',
				repeat: 0,
				result: [
					{ player: 'akadora3', wind: 'E', chonbo: true },
					{ player: 'tookoo', wind: 'S' },
					{ player: 'eviltaxi', wind: 'W' },
					{ player: 'ichigo', wind: 'N' }
				]
			}
		]
	}

	let action:
		| {
				type: 'ron'
				loser: number
				scores: number[]
		  }
		| {
				type: 'tsumo'
		  }
		| {
				type: 'draw'
		  }
		| {
				type: 'chonbo'
		  }
		| null = null

	function ron() {
		action = { type: 'ron', loser: 1, scores: [0, 0, 0, 0] }
	}
</script>

<header class="p-4">
	<p class="text-2xl font-bold">Berkeley Mahjong League</p>
	<p>Semi-final #2</p>
</header>
<section class="relative mx-auto aspect-square max-w-lg rounded-xl bg-slate-200">
	<p class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
		<span class="font-mj text-4xl">{convertWind(state.round)}</span>
		<Richi count="0" />
		<Repeat count="0" />
	</p>
	<button class="absolute bottom-2 left-1/2 -translate-x-1/2">
		<PlayerScore player={state.players[0]} />
	</button>
	<button class="absolute right-2 top-1/2 -translate-y-1/2">
		<PlayerScore player={state.players[1]} />
	</button>
	<button class="absolute left-1/2 top-2 -translate-x-1/2">
		<PlayerScore player={state.players[2]} />
	</button>
	<button class="absolute left-2 top-1/2 -translate-y-1/2">
		<PlayerScore player={state.players[3]} />
	</button>
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
		<path
			d="M 160 230
			   Q 224 224 224 160"
			stroke="currentColor"
			fill="none"
			marker-start="url(#arrow)"
			marker-end="url(#arrow)"
		/>
		<!-- 0 -> 2 -->
		<path
			d="M 100 200
			   Q 60 128 100 40"
			stroke="currentColor"
			fill="none"
			marker-start="url(#arrow)"
			marker-end="url(#arrow)"
		/>
		<!-- 0 -> 3 -->
		<path
			d="M 90 230
			   Q 32 224 32 160"
			stroke="currentColor"
			fill="none"
			marker-start="url(#arrow)"
			marker-end="url(#arrow)"
		/>
		<!-- 1 -> 2 -->
		<path
			d="M 224 100
			   Q 224 32 160 32"
			stroke="currentColor"
			fill="none"
			marker-start="url(#arrow)"
			marker-end="url(#arrow)"
		/>
		<!-- 1 -> 3 -->
		<path
			d="M 200 100
			   Q 128 64 60 100"
			stroke="currentColor"
			fill="none"
			marker-start="url(#arrow)"
			marker-end="url(#arrow)"
		/>
		<!-- 2 -> 3 -->
		<path
			d="M 100 32
			   Q 32 32 32 100"
			stroke="currentColor"
			fill="none"
			marker-start="url(#arrow)"
			marker-end="url(#arrow)"
		/>
	</svg>
	<p class="absolute bottom-[10%] right-[10%]">16000</p>
	<p class="absolute right-[10%] top-[10%]">16000</p>
	<p class="absolute left-[10%] top-[10%]">16000</p>
	<p class="absolute bottom-[10%] left-[10%]">16000</p>
	<p class="absolute left-[40%] top-[70%]">16000</p>
	<p class="absolute left-1/2 top-1/4 -translate-x-1/2">16000</p>
</section>
{#if action == null}
	<section class="mx-auto max-w-lg p-4">
		<p class="font-bold">Action</p>
		<div class="my-4 grid grid-cols-2 gap-x-8 gap-y-4">
			<button on:click={ron} class="h-12 rounded bg-red-500 text-xl font-bold text-white"
				>Ron</button
			>
			<button
				on:click={() => (action = { type: 'tsumo' })}
				class="h-12 rounded bg-blue-500 text-xl font-bold text-white">Tsumo</button
			>
			<button
				on:click={() => (action = { type: 'draw' })}
				class="h-12 rounded bg-gray-500 text-xl font-bold text-white">Draw</button
			>
			<button
				on:click={() => (action = { type: 'chonbo' })}
				class="h-12 rounded bg-yellow-500 text-xl font-bold text-white">Chonbo</button
			>
		</div>
		<p class="font-bold">History</p>
		<div>
			{#each state.history as history}
				<div>
					<div class="flex flex-row items-center justify-between">
						<p class="my-4 text-2xl">
							<span class="font-mj">{convertWind(history.round)}</span> /
							{history.repeat}<span class="font-mj">本場</span>
						</p>
						<img src="edit.svg" alt="edit" class="h-6 w-6" />
					</div>
					<div class="grid grid-cols-2 gap-2">
						<HistoryEntry result={history.result[0]} />
						<HistoryEntry result={history.result[1]} />
						<HistoryEntry result={history.result[2]} />
						<HistoryEntry result={history.result[3]} />
					</div>
				</div>
				<div class="my-4 h-px w-full bg-slate-300" />
			{/each}
		</div>
	</section>
{:else if action.type === 'ron'}
	<section class="mx-auto max-w-lg">
		<div class="flex flex-row items-center">
			<button on:click={() => (action = null)} class="material-symbols-rounded p-4 text-3xl">
				arrow_back
			</button>
			<p class="text-2xl">Ron</p>
		</div>
	</section>
{/if}
