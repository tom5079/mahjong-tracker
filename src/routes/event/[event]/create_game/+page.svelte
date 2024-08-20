<script lang="ts">
	import type { PageData } from './$types'
	import Text from '$lib/form/Text.svelte'
	import Datetime from '$lib/form/Datetime.svelte'
	import Label from '$lib/form/Label.svelte'
	import Fieldset from '$lib/form/Fieldset.svelte'

	import type { User } from '@prisma/client'
	import { dndzone } from 'svelte-dnd-action'
	import { onMount } from 'svelte'
	import { DateTime } from 'luxon'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'
	import { flip } from 'svelte/animate'

	export let data: PageData

	let error = ''

	const numPlayers = data.event.ruleset.player === 'FOUR' ? 4 : 3

	let userSearch = ''
	let searchResult = []

	let dragIndex: number | null = null
	let targetIndex: number | null = null

	let form: HTMLFormElement

	$: searchResult = data.attendees
		.filter((x) => (userSearch ? x.username.includes(userSearch) : true))
		.filter((x) => roster.every((it) => it.user.id !== x.id))

	let roster: {
		id: string
		user: User
	}[] = []

	function shuffle(array: any[]) {
		let currentIndex = array.length
		let temporaryValue
		let randomIndex

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1

			temporaryValue = array[currentIndex]
			array[currentIndex] = array[randomIndex]
			array[randomIndex] = temporaryValue
		}

		return array
	}

	onMount(() => {
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

		const name = body.get('name')?.toString()

		if (!name) {
			body.set('name', `Game ${DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)}`)
		}

		const startTime = DateTime.fromISO(body.get('startTime')?.toString() ?? '')

		if (startTime.isValid) {
			body.set('startTime', startTime.toISO())
		}

		const durationHours = +(body.get('durationHours')?.toString() ?? '0')
		const durationMinutes = +(body.get('durationMinutes')?.toString() ?? '0')

		if (isNaN(durationHours) || isNaN(durationMinutes)) {
			error = 'Invalid duration'
			return
		}

		body.delete('durationHours')
		body.delete('durationMinutes')
		body.set('durationSeconds', (durationHours * 3600 + durationMinutes * 60).toString())

		body.delete('roster')
		roster.forEach((player) => {
			body.append('roster', player.user.id)
		})

		const response = await fetch('create_game', {
			method: 'POST',
			body
		})

		if (response.ok) {
			window.history.back()
		} else {
			const body = await response.json()
			error = body.message
		}
	}

	function handleRoster(event: CustomEvent) {
		roster = event.detail.items
	}
</script>

<main class="mx-auto max-w-2xl">
	<section class="p-4">
		<h1 class="text-2xl font-semibold">New Game @ {data.event.name}</h1>
	</section>
	<section>
		<form bind:this={form}>
			<div class="space-y-8 p-4">
				<Text name="name" label="Name" />
				<Label label="Start time">
					<Datetime name="startTime" min={DateTime.now().toISO().slice(0, 16)} />
				</Label>
				<div class="flex flex-row items-center text-sm">
					<span class="mr-auto font-medium">Duration</span>
					<input
						name="durationHours"
						min="0"
						type="number"
						class="mr-2 w-20 rounded-lg border border-gray-300 bg-gray-50 p-2"
					/>
					<span class="mr-4 font-medium">h</span>
					<input
						name="durationMinutes"
						min="0"
						type="number"
						class="mr-2 w-20 rounded-lg border border-gray-300 bg-gray-50 p-2"
					/>
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
							on:click={() => (roster = shuffle(roster))}
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
									<button
										on:mousedown={() => (roster = [...roster, { id: user.id, user }])}
										class="flex flex-row items-center space-x-2 py-4"
									>
										<img
											src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp"
											alt="avatar of {user.username}"
											class="h-8 w-8 rounded-full"
										/>
										<p>{user.username}</p>
									</button>
								{/each}
							{:else}
								<p>No result</p>
							{/if}
						</div>
					</div>
					<ol
						class="flex flex-col"
						use:dndzone={{ items: roster, flipDurationMs: 300 }}
						on:consider={handleRoster}
						on:finalize={handleRoster}
					>
						{#each roster as player, i (player.id)}
							<li
								animate:flip={{ duration: 300 }}
								class="flex flex-row items-center space-x-4 border-gray-300 px-4 py-2"
								class:bg-gray-300={dragIndex === i}
								class:border-t={i !== 0 && i % numPlayers === 0}
							>
								<span class="material-symbols-rounded cursor-pointer select-none"
									>drag_indicator</span
								>
								<img
									src="https://cdn.discordapp.com/avatars/{player.user.id}/{player.user
										.avatar}.webp"
									alt="avatar of {player.user.username}"
									class="h-8 w-8 rounded-full"
								/>
								<p class="flex-1 truncate">{player.user.username}</p>
								{#if Math.floor(roster.length / numPlayers) * numPlayers > i}
									<p class="text-sm"># {Math.floor(i / numPlayers) + 1}</p>
									<p class="font-mj text-2xl">{'東南西北'.charAt(i % numPlayers)}</p>
								{:else}
									<p class="pr-8">-</p>
								{/if}
								<button
									on:click={() => {
										roster.splice(i, 1)
										roster = roster
									}}
									class="material-symbols-rounded">clear</button
								>
							</li>
						{/each}
					</ol>
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
