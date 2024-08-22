<script lang="ts">
	import Richi from '$lib/Richi.svelte'
	import Repeat from '$lib/Repeat.svelte'
	import HistoryEntry from '$lib/game/history-entry.svelte'
	import PlayerScore from '$lib/game/player-score.svelte'
	import RonScoring from '$lib/game/ron-scoring.svelte'
	import TsumoScoring from '$lib/game/tsumo-scoring.svelte'
	import { convertRound } from '$lib/game/wind'
	import {
		calculateRonPayment,
		calculateTsumoPayment,
		canPassDealership,
		computeState,
		type State
	} from '$lib/game/state'
	import type { PageData } from './$types'
	import type { User } from '@prisma/client'
	import { invalidateAll } from '$app/navigation'
	import { DateTime, Duration } from 'luxon'
	import { onMount } from 'svelte'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'

	export let data: PageData
	let error = ''

	let state: State | null

	$: state = computeState({
		user: data.user,
		players: data.game.players.map((player) => player.user),
		ruleset: data.game.event.ruleset,
		actions: data.game.actions
	})
		.onFailure((e) => {
			if (typeof e === 'string') {
				error = e
			} else if (e instanceof Error) {
				error = e.message
			} else {
				error = 'An unknown error occurred'
			}
		})
		.getOrNull()

	let action:
		| {
				type: 'ron'
				loser: User | null
				scores: Record<string, number>
		  }
		| {
				type: 'tsumo'
				winner: User | null
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
				player: User | null
		  }
		| {
				type: 'end'
		  }
		| {
				type: 'oyaNagashi'
		  }
		| {
				type: 'undo'
		  }
		| null = null

	let activeWinner: User | null = null
	let displayArrow: ('U' | 'D' | null)[] = Array(10).fill(null)
	let displayPoint: number[] = Array(10).fill(0)

	let timer: Duration | null = Duration.fromMillis(0)
	let timeLeftToStart: Duration | null = null

	const historyActions = {
		ron: ['Ron', 'bg-red-500'],
		tsumo: ['Tsumo', 'bg-blue-500'],
		draw: ['Draw', 'bg-gray-500'],
		chonbo: ['Chonbo', 'bg-yellow-500']
	}

	onMount(() => {
		const timerUpdateInterval = setInterval(() => {
			switch (data.game.timer.state) {
				case 'waiting': {
					const startTime = data.game.startTime

					if (startTime) {
						timeLeftToStart = DateTime.fromISO(startTime.toISOString()).diffNow()
					}
					break
				}
				case 'running': {
					if (data.game.durationSeconds) {
						timer = DateTime.fromISO(data.game.timer.startedAt)
							.plus({ seconds: data.game.durationSeconds })
							.plus(Duration.fromISO(data.game.timer.pausedBy))
							.diffNow()
					} else {
						timer = DateTime.now().diff(DateTime.fromISO(data.game.timer.startedAt))
					}
					break
				}
				case 'paused': {
					timer = DateTime.fromISO(data.game.timer.startedAt)
						.plus({ seconds: data.game.durationSeconds })
						.plus(Duration.fromISO(data.game.timer.pausedBy))
						.diff(DateTime.fromISO(data.game.timer.pausedAt))
					break
				}
				default: {
					timer = null
					break
				}
			}
		}, 200)

		return () => clearInterval(timerUpdateInterval)
	})

	function displayRon() {
		if (!state) {
			return
		}

		const loserIndex = state.players.findIndex(
			(player) => action?.type === 'ron' && player.user.id === action.loser?.id
		)

		const payments =
			action?.type === 'ron' && action.loser != null
				? calculateRonPayment({
						ruleset: data.game.event.ruleset,
						state,
						loser: action.loser.id,
						scores: action.scores ?? {}
					})
				: {}

		const winners = state.players.map((player) => payments[player.user.id] ?? null)

		const activeWinnerIndex = state.players.findIndex(
			(player) => player.user.id === activeWinner?.id
		)

		displayArrow = [
			loserIndex === 0 && (winners[1] != null || activeWinnerIndex === 1)
				? 'U'
				: loserIndex === 1 && (winners[0] != null || activeWinnerIndex === 0)
					? 'D'
					: null,
			loserIndex === 0 && (winners[2] != null || activeWinnerIndex === 2)
				? 'U'
				: loserIndex === 2 && (winners[0] != null || activeWinnerIndex === 0)
					? 'D'
					: null,
			loserIndex === 0 && (winners[3] != null || activeWinnerIndex === 3)
				? 'U'
				: loserIndex === 3 && (winners[0] != null || activeWinnerIndex === 0)
					? 'D'
					: null,
			loserIndex === 1 && (winners[2] != null || activeWinnerIndex === 2)
				? 'U'
				: loserIndex === 2 && (winners[1] != null || activeWinnerIndex === 1)
					? 'D'
					: null,
			loserIndex === 1 && (winners[3] != null || activeWinnerIndex === 3)
				? 'U'
				: loserIndex === 3 && (winners[1] != null || activeWinnerIndex === 1)
					? 'D'
					: null,
			loserIndex === 2 && (winners[3] != null || activeWinnerIndex === 3)
				? 'U'
				: loserIndex === 3 && (winners[2] != null || activeWinnerIndex === 2)
					? 'D'
					: null,
			winners[0]?.fromPot ? 'D' : null,
			winners[1]?.fromPot ? 'D' : null,
			winners[2]?.fromPot ? 'D' : null,
			winners[3]?.fromPot ? 'D' : null
		]
		displayPoint = [
			loserIndex === 0 && winners[1] != null
				? winners[1].payment
				: loserIndex === 1 && winners[0] != null
					? winners[0].payment
					: 0,
			loserIndex === 0 && winners[2] != null
				? winners[2].payment
				: loserIndex === 2 && winners[0] != null
					? winners[0].payment
					: 0,
			loserIndex === 0 && winners[3] != null
				? winners[3].payment
				: loserIndex === 3 && winners[0] != null
					? winners[0].payment
					: 0,
			loserIndex === 1 && winners[2] != null
				? winners[2].payment
				: loserIndex === 2 && winners[1] != null
					? winners[1].payment
					: 0,
			loserIndex === 1 && winners[3] != null
				? winners[3].payment
				: loserIndex === 3 && winners[1] != null
					? winners[1].payment
					: 0,
			loserIndex === 2 && winners[3] != null
				? winners[3].payment
				: loserIndex === 3 && winners[2] != null
					? winners[2].payment
					: 0,
			winners[0]?.fromPot ?? 0,
			winners[1]?.fromPot ?? 0,
			winners[2]?.fromPot ?? 0,
			winners[3]?.fromPot ?? 0
		]
	}

	function displayTsumo() {
		if (!state) {
			return
		}

		const winnerIndex = state.players.findIndex(
			(player) => action?.type === 'tsumo' && player.user.id === action.winner?.id
		)

		const payments =
			action?.type === 'tsumo'
				? calculateTsumoPayment({
						ruleset: data.game.event.ruleset,
						state,
						scores: action.scores
					})
				: {
						payments: {},
						fromPot: 0
					}

		const pointsLost = state.players.map((player) => payments.payments[player.user.id] ?? 0)

		displayArrow = [
			winnerIndex === 0 ? 'D' : winnerIndex === 1 ? 'U' : null,
			winnerIndex === 0 ? 'D' : winnerIndex === 2 ? 'U' : null,
			winnerIndex === 0 ? 'D' : winnerIndex === 3 ? 'U' : null,
			winnerIndex === 1 ? 'D' : winnerIndex === 2 ? 'U' : null,
			winnerIndex === 1 ? 'D' : winnerIndex === 3 ? 'U' : null,
			winnerIndex === 2 ? 'D' : winnerIndex === 3 ? 'U' : null,
			winnerIndex === 0 && payments.fromPot ? 'U' : null,
			winnerIndex === 1 && payments.fromPot ? 'U' : null,
			winnerIndex === 2 && payments.fromPot ? 'U' : null,
			winnerIndex === 3 && payments.fromPot ? 'U' : null
		]

		displayPoint = [
			winnerIndex === 0 ? pointsLost[1] : winnerIndex === 1 ? pointsLost[0] : 0,
			winnerIndex === 0 ? pointsLost[2] : winnerIndex === 2 ? pointsLost[0] : 0,
			winnerIndex === 0 ? pointsLost[3] : winnerIndex === 3 ? pointsLost[0] : 0,
			winnerIndex === 1 ? pointsLost[2] : winnerIndex === 2 ? pointsLost[1] : 0,
			winnerIndex === 1 ? pointsLost[3] : winnerIndex === 3 ? pointsLost[1] : 0,
			winnerIndex === 2 ? pointsLost[3] : winnerIndex === 3 ? pointsLost[2] : 0,
			winnerIndex === 0 ? payments.fromPot : 0,
			winnerIndex === 1 ? payments.fromPot : 0,
			winnerIndex === 2 ? payments.fromPot : 0,
			winnerIndex === 3 ? payments.fromPot : 0
		]
	}

	function displayDraw() {
		if (!state) {
			return
		}

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

	async function onSubmitAction(token: string, action: PrismaJson.Action | PrismaJson.TimerAction) {
		error = ''

		const response = await fetch(`${data.game.id}/actions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...action, token })
		})

		if (!response.ok) {
			error = (await response.json()).message
		}

		invalidateAll()
	}

	async function submitAction(action: PrismaJson.Action | PrismaJson.TimerAction) {
		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'submit' })
				.then((token) => onSubmitAction(token, action))
		})
	}

	function onPlayerClick(player: User) {
		if (action?.type == null) {
			submitAction({
				type: 'riichi',
				player: player.id
			})
		} else if (action.type === 'ron') {
			if (action.loser == null) {
				action = {
					type: 'ron',
					loser: player,
					scores: {}
				}
			} else {
				activeWinner = player
				action.scores[player.id] = 0
			}
		} else if (action.type === 'tsumo') {
			action = {
				type: 'tsumo',
				winner: player,
				scores: {}
			}
		} else if (action.type === 'draw') {
			if (action.tenpai.includes(player.id)) {
				action.tenpai = action.tenpai.filter((p) => p != player.id)
			} else {
				action.tenpai.push(player.id)
			}
			action = action
		} else if (action.type === 'chonbo') {
			action.player = player
			action = action
		}
	}

	function submit() {
		if (action) {
			switch (action.type) {
				case 'ron':
					if (action.loser == null || action.scores.length === 0 || action.scores.length > 3) {
						error = 'Invalid ron action'
						break
					}
					submitAction({
						type: 'ron',
						loser: action.loser.id,
						scores: action.scores
					})
					break
				case 'tsumo':
					if (action.winner == null) {
						error = 'Invalid tsumo action'
						break
					}
					submitAction({
						type: 'tsumo',
						winner: action.winner.id,
						scores: action.scores
					})
					break
				case 'draw':
					submitAction({
						type: 'draw',
						tenpai: action.tenpai
					})
					break
				case 'chonbo':
					if (action.player == null) {
						error = 'Invalid chonbo action'
						break
					}
					submitAction({
						type: 'chonbo',
						player: action.player.id
					})
					break
				case 'oyaNagashi':
					submitAction({
						type: 'oyaNagashi'
					})
					break
				case 'end':
					submitAction({ type: 'end' })
					break
				case 'undo':
					undo()
					break
			}
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

	function undo() {
		window.grecaptcha.ready(() => {
			window.grecaptcha.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'undo' }).then((token) => {
				fetch(`${data.game.id}/actions`, {
					method: 'DELETE',
					body: token
				}).then(async (r) => {
					if (!r.ok) {
						error = (await r.json()).message
					}

					invalidateAll()
				})
			})
		})
	}
</script>

<main class="mx-auto max-w-lg px-4">
	<header class="py-4">
		<div class="flex flex-row items-center justify-between">
			<div>
				<p class="text-2xl font-bold">{data.game.name}</p>
				<p>Table {data.game.table}</p>
			</div>
			<a href="{data.game.id}/settings" class="material-symbols-rounded filled"> settings </a>
		</div>
	</header>
	{#if state == null}
		{error}
	{:else}
		<section class="relative my-4 aspect-square rounded-xl bg-slate-200">
			<button
				on:click={() => onPlayerClick(state.players[0].user)}
				class="absolute bottom-2 left-1/2 max-w-[33%] -translate-x-1/2"
				class:border-b-4={action?.type === 'draw' || action?.type === 'chonbo'}
				class:border-gray-500={action?.type === 'draw' &&
					action.tenpai.includes(state.players[0].user.id)}
				class:border-yellow-500={action?.type === 'chonbo' &&
					action.player?.id === state.players[0].user.id}
			>
				<PlayerScore {...state.players[0]} username={state.players[0].user.username} />
			</button>
			<button
				on:click={() => onPlayerClick(state.players[1].user)}
				class="absolute right-2 top-1/2 max-w-[33%] -translate-y-1/2"
				class:border-b-4={action?.type === 'draw' || action?.type === 'chonbo'}
				class:border-gray-500={action?.type === 'draw' &&
					action.tenpai.includes(state.players[1].user.id)}
				class:border-yellow-500={action?.type === 'chonbo' &&
					action.player?.id === state.players[1].user.id}
			>
				<PlayerScore {...state.players[1]} username={state.players[1].user.username} />
			</button>
			<button
				on:click={() => onPlayerClick(state.players[2].user)}
				class="absolute left-1/2 top-2 max-w-[33%] -translate-x-1/2"
				class:border-b-4={action?.type === 'draw' || action?.type === 'chonbo'}
				class:border-gray-500={action?.type === 'draw' &&
					action.tenpai.includes(state.players[2].user.id)}
				class:border-yellow-500={action?.type === 'chonbo' &&
					action.player?.id === state.players[2].user.id}
			>
				<PlayerScore {...state.players[2]} username={state.players[2].user.username} />
			</button>
			<button
				on:click={() => onPlayerClick(state.players[3].user)}
				class="absolute left-2 top-1/2 max-w-[33%] -translate-y-1/2"
				class:border-b-4={action?.type === 'draw' || action?.type === 'chonbo'}
				class:border-gray-500={action?.type === 'draw' &&
					action.tenpai.includes(state.players[3].user.id)}
				class:border-yellow-500={action?.type === 'chonbo' &&
					action.player?.id === state.players[3].user.id}
			>
				<PlayerScore {...state.players[3]} username={state.players[3].user.username} />
			</button>
			<div
				class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
			>
				<span class="font-mj text-4xl">{convertRound(state.round)}</span>
				<div class="flex flex-col items-start">
					<Richi count={state.richi} />
					<Repeat count={state.repeat} />
				</div>
			</div>
			<svg
				class="pointer-events-none absolute left-0 right-0 h-full w-full text-red-500"
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
				{#if displayArrow[6] != null}
					<path d="M 128 160 128 200" stroke="currentColor" fill="none" marker-end="url(#arrow)" />
				{/if}
				{#if displayArrow[7] != null}
					<path d="M 150 128 180 128" stroke="currentColor" fill="none" marker-end="url(#arrow)" />
				{/if}
				{#if displayArrow[8] != null}
					<path d="M 128 100 128 50" stroke="currentColor" fill="none" marker-end="url(#arrow)" />
				{/if}
				{#if displayArrow[9] != null}
					<path d="M 100 128 70 128" stroke="currentColor" fill="none" marker-end="url(#arrow)" />
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
			{#if displayPoint[6]}
				<p class="absolute left-[52%] top-[67%]">{displayPoint[6]}</p>
			{/if}
			{#if displayPoint[7]}
				<p class="absolute left-[61%] top-[45%]">{displayPoint[7]}</p>
			{/if}
			{#if displayPoint[8]}
				<p class="absolute left-[52%] top-[27%]">{displayPoint[8]}</p>
			{/if}
			{#if displayPoint[9]}
				<p class="absolute left-[31%] top-[45%]">{displayPoint[9]}</p>
			{/if}
		</section>
		{#if data.game.timer.state === 'waiting'}
			<div class="mx-auto flex max-w-lg">
				<button
					on:click={() => submitAction({ type: 'start' })}
					class="my-8 flex-1 rounded-lg bg-red-500 py-8 text-2xl text-white"
				>
					<p>
						Start Game{#if timeLeftToStart}
							{`-${timeLeftToStart.toFormat('hh:mm:ss')}`}{/if}
					</p>
				</button>
			</div>
		{:else}
			{#if timer}
				<div class="my-4 flex w-full flex-row items-center justify-between rounded-lg border p-8">
					<p class="text-2xl font-bold">
						{#if timer.toMillis() > 0}{timer.toFormat('hh:mm:ss')}{:else}Last Round{/if}
					</p>
					{#if data.game.timer.state === 'running' && data.game.durationSeconds}
						<button
							on:click={() => submitAction({ type: 'pause' })}
							class="rounded-lg bg-blue-500 p-4 text-white"
						>
							Pause
						</button>
					{:else if data.game.timer.state === 'paused'}
						<button
							on:click={() => submitAction({ type: 'resume' })}
							class="rounded-lg bg-blue-500 p-4 text-white"
						>
							Resume
						</button>
					{/if}
				</div>
			{/if}
			{#if action == null}
				<section class="mx-auto max-w-lg">
					{#if data.game.timer.state === 'running'}
						<div class="flex flex-row items-baseline space-x-4">
							<p class="font-bold">Action</p>
							<p class="text-xl font-bold text-red-500">{error}</p>
						</div>
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
							<button
								on:click={chonbo}
								class="h-12 rounded bg-yellow-500 text-xl font-bold text-white">Chonbo</button
							>
							<button
								on:click={() => (action = { type: 'end' })}
								class="h-12 rounded bg-green-600 text-xl font-bold text-white">End Game</button
							>
							{#if canPassDealership( { state, ruleset: data.game.event.ruleset, actions: data.game.actions } )}
								<button
									on:click={() => (action = { type: 'oyaNagashi' })}
									class="h-12 rounded bg-pink-500 text-xl font-bold text-white"
									>Pass Dealership</button
								>
							{/if}
						</div>
					{:else if state.match.state === 'ENDED'}
						<div class="my-4 space-y-2 rounded-lg border p-2">
							<p class="font-bold">Result</p>
							<div class="grid grid-cols-2 gap-2">
								{#each state.match.result as result}
									{@const score = Math.round(result.soten + result.penalty) / 10}
									<p class="flex flex-row items-center space-x-2">
										<span class="space-x-2 truncate rounded p-1">
											{state.players.find((player) => player.user.id === result.player)?.user
												.username}
										</span>
										<span class:text-red-700={score < 0} class:text-blue-700={score > 0}
											>{#if score > 0}+{/if}{score}</span
										>
									</p>
								{/each}
							</div>
						</div>
					{/if}
					<div class="flex flex-row items-center justify-between">
						<p class="font-bold">History</p>
						<button
							on:click={() => (action = { type: 'undo' })}
							class="flex flex-row items-center rounded-lg border border-red-500 p-4 text-red-500 transition-all hover:bg-red-500 hover:text-white"
							><span class="material-symbols-rounded mr-2">remove</span> Undo</button
						>
					</div>
					<div>
						{#each [...state.history].reverse() as history}
							<div>
								<div class="flex flex-row items-center justify-between">
									<p class="my-4 font-mj text-2xl">
										{convertRound(history.round)} / {history.repeat}本場
									</p>
									<p class="rounded-lg px-4 py-2 text-white {historyActions[history.action][1]}">
										{historyActions[history.action][0]}
									</p>
								</div>
								<div class="grid grid-cols-2 gap-2">
									<HistoryEntry
										{...history.result[0]}
										username={state.players.find(
											(player) => player.user.id === history.result[0].player
										)?.user?.username ?? 'unknown user'}
									/>
									<HistoryEntry
										{...history.result[1]}
										username={state.players.find(
											(player) => player.user.id === history.result[1].player
										)?.user?.username ?? 'unknown user'}
									/>
									<HistoryEntry
										{...history.result[2]}
										username={state.players.find(
											(player) => player.user.id === history.result[2].player
										)?.user?.username ?? 'unknown user'}
									/>
									<HistoryEntry
										{...history.result[3]}
										username={state.players.find(
											(player) => player.user.id === history.result[3].player
										)?.user?.username ?? 'unknown user'}
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
										delete action.scores[activeWinner.id]
										activeWinner = null
										action = action
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
								@ {action.loser.username}{/if}
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
						<p class="px-4 text-2xl">Winner: {activeWinner.username}</p>
						<RonScoring
							scores={state.players.find((player) => player.user.id === activeWinner?.id)?.wind ===
							0
								? data.game.event.ruleset.scores.dealer
								: data.game.event.ruleset.scores.nonDealer}
							onScore={(score) => {
								if (action?.type !== 'ron' || activeWinner == null) {
									throw new Error('Inconsistent action')
								}

								action.scores[activeWinner.id] = score
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
								@ {action.winner.username}{/if}
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
								(player) => action?.type === 'tsumo' && player.user.id === action.winner?.id
							)?.wind === 0
								? data.game.event.ruleset.scores.dealer
								: data.game.event.ruleset.scores.nonDealer}
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
											if (player.user.id === action.winner?.id) {
												return null
											}

											return [
												player.user.id,
												player.wind === 0 ? score.fromDealer : score.fromNonDealer
											]
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
			{:else if action.type === 'end'}
				<section class="mx-auto max-w-lg">
					<div class="flex flex-row items-center">
						<button on:click={() => (action = null)} class="material-symbols-rounded p-4 text-3xl">
							arrow_back
						</button>
						<p class="text-2xl">End game</p>
						<button
							on:click={submit}
							class="ml-auto flex flex-row items-center space-x-4 p-4 text-green-500"
						>
							<span class="material-symbols-rounded text-3xl">check</span> Submit
						</button>
					</div>
					<p class="w-full py-16 text-center text-2xl">Click submit to end the game</p>
				</section>
			{:else if action.type === 'oyaNagashi'}
				<section class="mx-auto max-w-lg">
					<div class="flex flex-row items-center">
						<button on:click={() => (action = null)} class="material-symbols-rounded p-4 text-3xl">
							arrow_back
						</button>
						<p class="text-2xl">Pass Dealership</p>
						<button
							on:click={submit}
							class="ml-auto flex flex-row items-center space-x-4 p-4 text-green-500"
						>
							<span class="material-symbols-rounded text-3xl">check</span> Submit
						</button>
					</div>
					<p class="w-full py-16 text-center text-2xl">Click submit to pass the dealership</p>
				</section>
			{:else if action.type === 'undo'}
				<section class="mx-auto max-w-lg">
					<div class="flex flex-row items-center">
						<button on:click={() => (action = null)} class="material-symbols-rounded p-4 text-3xl">
							arrow_back
						</button>
						<p class="text-2xl">Undo last action</p>
						<button
							on:click={submit}
							class="ml-auto flex flex-row items-center space-x-4 p-4 text-green-500"
						>
							<span class="material-symbols-rounded text-3xl">check</span> Submit
						</button>
					</div>
					<p class="w-full py-16 text-center text-2xl">Click submit to undo last action</p>
				</section>
			{/if}
		{/if}
	{/if}
</main>
