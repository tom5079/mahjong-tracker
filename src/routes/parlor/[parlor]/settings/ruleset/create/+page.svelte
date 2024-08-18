<script lang="ts">
	import { type ScoringSheet, generateScoringSheet } from '$lib/scoring'
	import { onMount } from 'svelte'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'
	import { todo } from 'node:test'

	let form: HTMLFormElement
	let formData: FormData | null
	let formDataObject: { [key: string]: FormDataEntryValue }

	let note: string
	let textarea: HTMLTextAreaElement

	let scoring: {
		kiriage: boolean
		fixed30fu: boolean
		tsumozon: boolean
	} = { kiriage: true, fixed30fu: false, tsumozon: true }

	let scoringSheet: ScoringSheet | null = null

	let uma: PrismaJson.Uma = {
		type: 'simple',
		uma: [10, 5, -5, -10]
	}

	let chonbo: PrismaJson.Chonbo = {
		type: 'score',
		name: 'Mangan',
		affectsScore: true
	}

	let error = ''

	$: {
		scoringSheet = generateScoringSheet(scoring)
	}

	$: formDataObject = (formData && Object.fromEntries([...formData.entries()])) ?? {}

	function onNoteInput() {
		textarea.style.height = ''
		textarea.style.height = `min(${textarea.scrollHeight}px, 12rem)`
	}

	onMount(() => {
		form.addEventListener('submit', (e) => {
			e.preventDefault()

			window.grecaptcha.ready(() => {
				window.grecaptcha.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'submit' }).then(onSubmit)
			})
		})
	})

	async function onSubmit(token: string) {
		const formData = new FormData(form)

		formData.set('token', token)

		formData.set('scoring', JSON.stringify(scoring))
		formData.set('uma', JSON.stringify(uma))
		formData.set('chonbo', JSON.stringify(chonbo))

		fetch('create', {
			method: 'POST',
			body: formData
		}).then(async (res) => {
			if (res.ok) {
				window.history.back()
			} else {
				error = (await res.json()).message
			}
		})
	}
</script>

<main class="mx-auto max-w-2xl p-4">
	<section>
		<h1 class="text-2xl font-bold">Create new ruleset</h1>
	</section>
	<section>
		<form bind:this={form} on:change={(_) => (formData = new FormData(form))}>
			<div class="grid gap-6 py-4">
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
				<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Type</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="four-players"
								name="player"
								value="four"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="four-players">4 Players</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="three-players"
								name="player"
								value="three"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="three-players">3 Players</label
							>
						</div>
					</div>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="hanchan"
								name="length"
								value="hanchan"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="hanchan">Hanchan</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="tonpu"
								name="length"
								value="tonpu"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="tonpu">East only</label
							>
						</div>
					</div>
				</fieldset>
				<div>
					<label for="start" class="mb-2 block text-sm font-medium text-gray-900"
						>Starting Score</label
					>
					<input
						type="number"
						id="start"
						name="start"
						value="25000"
						step="1000"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="return" class="mb-2 block text-sm font-medium text-gray-900"
						>Return Score</label
					>
					<input
						type="number"
						id="return"
						name="return"
						value="30000"
						step="1000"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Uma</legend>
					<button
						type="button"
						on:click={() => {
							if (uma.type === 'simple') {
								uma = {
									type: 'floating',
									A: [15, 5, -5, -15],
									B: [15, 5, 0, -20],
									C: [20, 0, -5, -15]
								}
							} else {
								uma = {
									type: 'simple',
									uma: [15, 5, -5, -15]
								}
							}
						}}
						class="group flex w-full cursor-pointer flex-row items-center justify-between"
					>
						<span class="text-sm font-medium text-gray-900">Floating Uma</span>
						<div
							class="peer relative h-6 w-11 rounded-full after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:ring-4 group-focus:ring-blue-300 rtl:group-checked:after:-translate-x-full"
							class:bg-gray-200={uma.type !== 'floating'}
							class:bg-blue-600={uma.type === 'floating'}
							class:after:translate-x-full={uma.type === 'floating'}
							class:after:border-white={uma.type === 'floating'}
							class:rtl:after:-translate-x-full={uma.type === 'floating'}
						/>
					</button>
					{#if uma.type === 'simple'}
						<div class="flex flex-row items-center space-x-2">
							<input
								type="number"
								bind:value={uma.uma[0]}
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">-</span>
							<input
								type="number"
								bind:value={uma.uma[1]}
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">-</span>
							<input
								type="number"
								bind:value={uma.uma[2]}
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
							{#if formDataObject?.player !== 'three'}
								<span class="text-sm text-gray-900">-</span>
								<input
									type="number"
									bind:value={uma.uma[3]}
									class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
							{/if}
						</div>
					{:else}
						{#each Object.entries(uma).filter(([k, v]) => Array.isArray(v)) as [key, value] (key)}
							<div class="flex flex-row items-center space-x-2">
								<p class="mr-4 text-sm">{key} Top</p>
								<input
									type="number"
									bind:value={value[0]}
									class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
								<span class="text-sm text-gray-900">-</span>
								<input
									type="number"
									bind:value={value[1]}
									class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
								<span class="text-sm text-gray-900">-</span>
								<input
									type="number"
									bind:value={value[2]}
									class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
								{#if formDataObject?.player !== 'three'}
									<span class="text-sm text-gray-900">-</span>
									<input
										type="number"
										bind:value={value[3]}
										class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
									/>
								{/if}
							</div>
						{/each}
					{/if}
				</fieldset>
				<div>
					<label for="honba" class="mb-2 block text-sm font-medium text-gray-900">Honba</label>
					<input
						type="number"
						id="honba"
						name="honba"
						value="300"
						step="100"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="tenpai" class="mb-2 block text-sm font-medium text-gray-900">Tenpai fee</label
					>
					<input
						type="number"
						id="tenpai"
						name="tenpai"
						value="3000"
						step="1000"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">End game pot</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="endgame_top"
								name="endgame"
								value="top"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="endgame_top">Top</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="endgame_disappears"
								name="endgame"
								value="disappears"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="endgame_disappears">Disappears</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Tiebreaker</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="tiebreaker_wind"
								name="tiebreaker"
								value="wind"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="tiebreaker_wind">Wind</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="tiebreaker_split"
								name="tiebreaker"
								value="split"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="tiebreaker_split">Split</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Renchan</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_tenpai"
								name="renchan"
								value="tenpai"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_tenpai">Tenpai</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_agari"
								name="renchan"
								value="agari"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_agari">Agari</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_none"
								name="renchan"
								value="none"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_none">None</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_always"
								name="renchan"
								value="always"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_always">Always</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-2 rounded-lg border border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">All Last</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_agariyame"
								name="alllast"
								value="agariyame"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_agariyame">Agariyame</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_tenpaiyame"
								name="alllast"
								value="tenpaiyame"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_tenpaiyame">Tenpaiyame</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_none"
								name="alllast"
								value="none"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_none">None</label
							>
						</div>
					</div>
					<div class="flex flex-row space-x-2" class:hidden={formDataObject?.alllast === 'none'}>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_placement_first"
								name="alllastPlacement"
								value="1"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_placement_first">1st</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_placement_second"
								name="alllastPlacement"
								value="2"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_placement_second">2nd</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_placement_third"
								name="alllastPlacement"
								value="3"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_placement_third">3rd</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_placement_any"
								name="alllastPlacement"
								value="4"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_placement_any">Any</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Multiple ron</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="checkbox"
								id="double_ron"
								name="doubleRon"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="double_ron">Double</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="checkbox"
								id="triple_ron"
								name="tripleRon"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="triple_ron">Triple</label
							>
						</div>
					</div>
					<div class="flex flex-row items-center space-x-2">
						<p class="text-sm">Riichi sticks</p>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="multiron_pot_atamahane"
								name="multiRonPot"
								value="atamahane"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_pot_atamahane">Atamahane</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="multiron_pot_split"
								name="multiRonPot"
								value="split"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_pot_split">Split</label
							>
						</div>
					</div>
					<div class="flex flex-row items-center space-x-2">
						<p class="text-sm">Honba</p>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="multiron_honba_atamahane"
								name="multiRonHonba"
								value="atamahane"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_honba_atamahane">Atamahane</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="multiron_honba_split"
								name="multiRonHonba"
								value="split"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_honba_split">Split</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="multiron_honba_all"
								name="multiRonHonba"
								value="all"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_honba_all">All</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-4 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Scoring</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="record_game"
								name="record"
								value="game"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="record_game">Every Game</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="record_hand"
								name="record"
								value="hand"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="record_hand">Every Hand</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="record_turn"
								name="record"
								value="turn"
							/>
							<label
								class="pointer-events-none flex h-full items-center justify-center rounded-lg border bg-gray-200 py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="record_turn">Every Turn</label
							>
						</div>
					</div>
					<button
						type="button"
						on:click={() => (scoring = { ...scoring, kiriage: !scoring.kiriage })}
						class="group flex w-full cursor-pointer items-center justify-between"
					>
						<span class="ms-3 text-sm font-medium text-gray-900">Kiriage</span>
						<div
							class="relative h-6 w-11 rounded-full after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:outline-none group-focus:ring-4 group-focus:ring-blue-300"
							class:bg-blue-600={scoring.kiriage}
							class:bg-gray-200={!scoring.kiriage}
							class:after:translate-x-full={scoring.kiriage}
							class:after:border-white={scoring.kiriage}
							class:rtl:after:-translate-x-full={scoring.kiriage}
						/>
					</button>
					<button
						type="button"
						on:click={() => (scoring = { ...scoring, fixed30fu: !scoring.fixed30fu })}
						class="group flex w-full cursor-pointer items-center justify-between"
					>
						<span class="ms-3 text-sm font-medium text-gray-900">Fixed 30 Fu</span>
						<div
							class="relative h-6 w-11 rounded-full after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:outline-none group-focus:ring-4 group-focus:ring-blue-300"
							class:bg-gray-200={!scoring.fixed30fu}
							class:bg-blue-600={scoring.fixed30fu}
							class:after:translate-x-full={scoring.fixed30fu}
							class:after:border-white={scoring.fixed30fu}
							class:rtl:after:-translate-x-full={scoring.fixed30fu}
						/>
					</button>
					{#if formDataObject?.player === 'three'}
						<button
							type="button"
							on:click={() => (scoring = { ...scoring, tsumozon: !scoring.tsumozon })}
							class="group flex w-full cursor-pointer items-center justify-between"
						>
							<span class="ms-3 text-sm font-medium text-gray-900">Tsumozon</span>
							<div
								class="relative h-6 w-11 rounded-full after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:outline-none group-focus:ring-4 group-focus:ring-blue-300"
								class:bg-gray-200={!scoring.tsumozon}
								class:bg-blue-600={scoring.tsumozon}
								class:after:translate-x-full={scoring.tsumozon}
								class:after:border-white={scoring.tsumozon}
								class:rtl:after:-translate-x-full={scoring.tsumozon}
							/>
						</button>
					{/if}
				</fieldset>
				<div>
					<label for="start" class="mb-2 block text-sm font-medium text-gray-900">Nagashi</label>
					<select
						id="nagashi"
						name="nagashi"
						value="Mangan"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					>
						<option value="none">None</option>
						{#each scoringSheet?.dealer?.ron?.filter(([han, item]) => !Array.isArray(item)) ?? [] as [name, _] (name)}
							<option value={name}>{name}</option>
						{/each}
					</select>
				</div>

				<label class="inline-flex cursor-pointer items-center">
					<input type="checkbox" name="nagashiIsTsumo" class="peer sr-only" />
					<span class="text-sm font-medium text-gray-900">Nagashi is tsumo</span>
					<div
						class="peer relative ml-auto h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
					/>
				</label>

				<fieldset class="space-y-2 rounded-lg border border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Chonbo</legend>
					<div class="flex flex-col space-y-4">
						<div class="flex flex-row space-x-2">
							<button
								type="button"
								on:click={() => {
									chonbo = { type: 'score', name: 'Mangan', affectsScore: true }
								}}
								class="flex-1 rounded-lg border py-4 text-sm"
								class:bg-blue-500={chonbo.type === 'score'}
								class:text-white={chonbo.type === 'score'}>Score</button
							>
							<button
								type="button"
								on:click={() => {
									chonbo = { type: 'fixed', point: 12000, affectsScore: false }
								}}
								class="flex-1 rounded-lg border py-4 text-sm"
								class:bg-blue-500={chonbo.type === 'fixed'}
								class:text-white={chonbo.type === 'fixed'}>Fixed</button
							>
							<button
								type="button"
								on:click={() => {
									chonbo = {
										type: 'custom',
										dealer: {
											toDealer: 0,
											toNonDealer: 4000
										},
										nonDealer: {
											toDealer: 4000,
											toNonDealer: 2000
										},
										affectsScore: true
									}
								}}
								class="flex-1 rounded-lg border py-4 text-sm"
								class:bg-blue-500={chonbo.type === 'custom'}
								class:text-white={chonbo.type === 'custom'}>Custom</button
							>
						</div>
						{#if chonbo.type === 'score'}
							<select
								id="chonbo"
								bind:value={chonbo.name}
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							>
								{#each scoringSheet?.dealer?.ron?.filter(([_, item]) => !Array.isArray(item)) ?? [] as [name, _] (name)}
									<option value={name}>{name}</option>
								{/each}
							</select>
						{:else if chonbo.type === 'fixed'}
							<div class="flex flex-row items-center space-x-4 text-sm">
								<p class="flex-1">Score</p>
								<input
									type="number"
									id="chonbo"
									step="100"
									min="0"
									bind:value={chonbo.point}
									class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
								{#if chonbo.affectsScore}
									<p>ALL</p>
								{/if}
							</div>
						{:else if chonbo.type === 'custom'}
							<div class="flex flex-row items-center space-x-4 text-sm">
								<p class="flex-1">Dealer</p>
								<input
									type="number"
									id="chonbo"
									step="100"
									min="0"
									bind:value={chonbo.dealer.toNonDealer}
									class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
								<p>ALL</p>
							</div>
							<div class="flex flex-row items-center text-sm">
								<p class="flex-1">Non Dealer</p>
								<input
									type="number"
									id="chonbo"
									step="100"
									min="0"
									bind:value={chonbo.nonDealer.toNonDealer}
									class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
								<span class="mx-2">/</span>
								<input
									type="number"
									id="chonbo"
									step="100"
									min="0"
									bind:value={chonbo.nonDealer.toDealer}
									class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>
						{/if}
						<label class="inline-flex cursor-pointer items-center">
							<input type="checkbox" class="peer sr-only" bind:checked={chonbo.affectsScore} />
							<span class="ms-3 text-sm font-medium text-gray-900">Chonbo affects score</span>
							<div
								class="peer relative ml-auto h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
							/>
						</label>
					</div>
				</fieldset>

				<label class="inline-flex cursor-pointer items-center">
					<input type="checkbox" name="oyaNagashi" class="peer sr-only" />
					<span class="text-sm font-medium text-gray-900">Can give up dealership</span>
					<div
						class="peer relative ml-auto h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
					/>
				</label>

				<label class="inline-flex cursor-pointer items-center">
					<input type="checkbox" name="tobi" class="peer sr-only" checked />
					<span class="text-sm font-medium text-gray-900">Tobi</span>
					<div
						class="peer relative ml-auto h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
					/>
				</label>

				<label class="inline-flex cursor-pointer items-center">
					<input type="checkbox" name="tobiAtZero" class="peer sr-only" />
					<span class="text-sm font-medium text-gray-900">Tobi at Zero</span>
					<div
						class="peer relative ml-auto h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
					/>
				</label>

				<label
					class="inline-flex cursor-pointer items-center"
					class:hidden={formDataObject?.tobi === 'on'}
				>
					<input type="checkbox" name="riichiBelow1000" class="peer sr-only" checked />
					<span class="text-sm font-medium text-gray-900">Riichi below 1000</span>
					<div
						class="peer relative ml-auto h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
					/>
				</label>

				<div class="flex w-full flex-col space-y-2">
					<label class="flex w-full cursor-pointer flex-row items-center justify-between">
						<input type="checkbox" name="suddenDeath" class="peer sr-only" />
						<span class="text-sm font-medium text-gray-900">Sudden Death</span>
						<div
							class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
						/>
					</label>

					<input
						type="number"
						id="suddenDeathPoint"
						name="suddenDeathPoint"
						value="40000"
						step="1000"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						class:hidden={formDataObject?.suddenDeath !== 'on'}
					/>
				</div>

				<div class="flex w-full flex-col space-y-2">
					<label class="flex w-full cursor-pointer flex-row items-center justify-between">
						<input type="checkbox" name="calledGame" class="peer sr-only" />
						<span class="text-sm font-medium text-gray-900">Called Game</span>
						<div
							class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
						/>
					</label>

					<input
						type="number"
						id="calledGamePoint"
						name="calledGamePoint"
						value="55000"
						step="1000"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						class:hidden={formDataObject?.calledGame !== 'on'}
					/>
				</div>
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-900" for="note">Note</label>
					<textarea
						bind:value={note}
						bind:this={textarea}
						on:input={onNoteInput}
						class="block w-full resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						rows="1"
						id="note"
						name="note"
					/>
				</div>
			</div>
			<div class="flex flex-row items-center space-x-4">
				<p class="flex-1 text-end font-bold text-red-500">{error}</p>
				<button
					type="submit"
					class="rounded-lg border border-gray-300 bg-blue-500 p-4 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
				>
					Create
				</button>
			</div>
		</form>
	</section>
</main>
