<script lang="ts">
	import {
		type ScoringSheet,
		type TsumoScoring,
		generateScoringSheet,
		isTsumoScoring
	} from '$lib/scoring'
	import { onMount } from 'svelte'
	import { flip } from 'svelte/animate'
	import { dndzone } from 'svelte-dnd-action'

	let form: HTMLFormElement
	let formData: FormData | null
	let formDataObject: { [key: string]: FormDataEntryValue }

	let scoring:
		| {
				type: 'simple'
				kiriage: boolean
				fixed30fu: boolean
				tsumozon: boolean
		  }
		| {
				type: 'custom'
		  } = { type: 'simple', kiriage: true, fixed30fu: false, tsumozon: true }

	let scoringSheet: ScoringSheet | null = null
	let scoringSheetEditorState: {
		player: 'dealer' | 'nonDealer'
		type: 'ron' | 'tsumo'
		han: string | null
	} = {
		player: 'dealer',
		type: 'ron',
		han: null
	}

	let scoringListToDisplay: [
		string,
		number | TsumoScoring | [string, number][] | [string, TsumoScoring][]
	][] = []

	$: {
		if (scoring.type === 'simple') {
			scoringSheet = generateScoringSheet(scoring)
		}
	}

	$: {
		if (scoringSheetEditorState.han === null) {
			scoringListToDisplay =
				scoringSheet?.[scoringSheetEditorState.player]?.[scoringSheetEditorState.type] ?? []
		} else {
			const [_, chosen] = scoringSheet?.[scoringSheetEditorState.player]?.[
				scoringSheetEditorState.type
			]?.find(([han]) => han === scoringSheetEditorState.han) ?? [null, null]

			if (Array.isArray(chosen)) {
				scoringListToDisplay = chosen
			}
		}
	}

	$: formDataObject = (formData && Object.fromEntries([...formData.entries()])) ?? {}
	$: console.log(formDataObject)

	onMount(() => {
		formData = new FormData(form)
	})
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
					<div class="flex flex-row items-center space-x-2">
						{#if formDataObject?.player !== 'three'}
							<input
								type="number"
								name="uma_first"
								value="10"
								min="0"
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">-</span>
							<input
								type="number"
								name="uma_second"
								value="5"
								min="0"
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
						{:else}
							<input
								type="number"
								name="uma_first"
								value="10"
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">-</span>
							<input
								type="number"
								name="uma_second"
								value="0"
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">-</span>
							<input
								type="number"
								name="uma_third"
								value="-10"
								class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
						{/if}
					</div>
					<div class="flex flex-row items-center space-x-4">
						<p class="text-sm">Shizumiuma</p>
						<input
							type="number"
							name="shizumi"
							value="0"
							min="0"
							class="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div class="flex flex-row items-center space-x-4">
						<p class="text-sm">Binta</p>
						<input
							type="number"
							name="binta"
							value="0"
							min="0"
							class="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
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
								value="none"
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
					{#if formDataObject?.alllast !== 'none'}
						<div class="flex flex-row space-x-2">
							<div class="flex-1">
								<input
									class="peer hidden h-0 w-0"
									type="radio"
									id="alllast_placement_first"
									name="alllast_placement"
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
									name="alllast_placement"
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
									name="alllast_placement"
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
									name="alllast_placement"
									value="4"
								/>
								<label
									class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
									for="alllast_placement_any">Any</label
								>
							</div>
						</div>
					{/if}
				</fieldset>
				<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Multiron</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="checkbox"
								id="multiron_double"
								name="multiron_double"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_double">Double</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="checkbox"
								id="multiron_triple"
								name="multiron_triple"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_triple">Triple</label
							>
						</div>
					</div>
					<div class="flex flex-row items-center space-x-2">
						<p class="text-sm">Pot</p>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="multiron_pot_atamahane"
								name="multiron_pot"
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
								name="multiron_pot"
								value="split"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_pot_split">Split</label
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
								id="scoring_game"
								name="scoring"
								value="game"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="scoring_game">Every Game</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="scoring_hand"
								name="scoring"
								value="hand"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="scoring_hand">Every Hand</label
							>
						</div>
						<div class="flex-1">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="scoring_turn"
								name="scoring"
								value="turn"
							/>
							<label
								class="pointer-events-none flex h-full items-center justify-center rounded-lg border bg-gray-200 py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="scoring_turn">Every Turn</label
							>
						</div>
					</div>
					{#if formDataObject?.scoring === 'hand'}
						<div class="flex flex-row space-x-2">
							<button
								type="button"
								class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								class:bg-blue-500={scoring.type === 'simple'}
								class:text-white={scoring.type === 'simple'}
								on:click={() =>
									(scoring = { type: 'simple', kiriage: true, fixed30fu: false, tsumozon: true })}
								>Simple
							</button>
							<button
								type="button"
								class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg border py-4 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								class:bg-blue-500={scoring.type === 'custom'}
								class:text-white={scoring.type === 'custom'}
								on:click={() => (scoring = { type: 'custom' })}>Custom</button
							>
						</div>
						{#if scoring.type === 'simple'}
							<button
								type="button"
								on:click={() => {
									if (scoring.type === 'simple') {
										scoring = { ...scoring, kiriage: !scoring.kiriage }
									}
								}}
								class="group flex w-full cursor-pointer items-center justify-between"
							>
								<span class="ms-3 text-sm font-medium text-gray-900">Kiriage</span>
								<div
									class="relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:outline-none group-focus:ring-4 group-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700"
									class:bg-blue-600={scoring.kiriage}
									class:after:translate-x-full={scoring.kiriage}
									class:after:border-white={scoring.kiriage}
									class:rtl:after:-translate-x-full={scoring.kiriage}
									class:dark:ring-blue-800={scoring.kiriage}
								/>
							</button>
							<button
								type="button"
								on:click={() => {
									if (scoring.type === 'simple') {
										scoring = { ...scoring, fixed30fu: !scoring.fixed30fu }
									}
								}}
								class="group flex w-full cursor-pointer items-center justify-between"
							>
								<span class="ms-3 text-sm font-medium text-gray-900">Fixed 30 Fu</span>
								<div
									class="relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:outline-none group-focus:ring-4 group-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700"
									class:bg-blue-600={scoring.fixed30fu}
									class:after:translate-x-full={scoring.fixed30fu}
									class:after:border-white={scoring.fixed30fu}
									class:rtl:after:-translate-x-full={scoring.fixed30fu}
									class:dark:ring-blue-800={scoring.fixed30fu}
								/>
							</button>
							{#if formDataObject?.player === 'three'}
								<button
									type="button"
									on:click={() => {
										if (scoring.type === 'simple') {
											scoring = { ...scoring, tsumozon: !scoring.tsumozon }
										}
									}}
									class="group flex w-full cursor-pointer items-center justify-between"
								>
									<span class="ms-3 text-sm font-medium text-gray-900">Tsumozon</span>
									<div
										class="relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:outline-none group-focus:ring-4 group-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700"
										class:bg-blue-600={scoring.tsumozon}
										class:after:translate-x-full={scoring.tsumozon}
										class:after:border-white={scoring.tsumozon}
										class:rtl:after:-translate-x-full={scoring.tsumozon}
										class:dark:ring-blue-800={scoring.tsumozon}
									/>
								</button>
							{/if}
						{:else}
							<div class="flex w-full flex-col space-y-4 border-t pt-4">
								<div class="flex w-full flex-row space-x-2">
									<button
										type="button"
										class="flex-1 items-center justify-center rounded-lg border py-4 text-sm"
										class:bg-blue-500={scoringSheetEditorState.player === 'dealer'}
										class:text-white={scoringSheetEditorState.player === 'dealer'}
										on:click={() =>
											(scoringSheetEditorState = {
												player: 'dealer',
												type: scoringSheetEditorState.type,
												han: null
											})}
									>
										Dealer
									</button>
									<button
										type="button"
										class="flex-1 items-center justify-center rounded-lg border py-4 text-sm"
										class:bg-blue-500={scoringSheetEditorState.player === 'nonDealer'}
										class:text-white={scoringSheetEditorState.player === 'nonDealer'}
										on:click={() =>
											(scoringSheetEditorState = {
												player: 'nonDealer',
												type: scoringSheetEditorState.type,
												han: null
											})}
									>
										Non Dealer
									</button>
								</div>
								<div class="flex w-full flex-row space-x-2">
									<button
										type="button"
										class="flex-1 items-center justify-center rounded-lg border py-4 text-sm"
										class:bg-blue-500={scoringSheetEditorState.type === 'ron'}
										class:text-white={scoringSheetEditorState.type === 'ron'}
										on:click={() =>
											(scoringSheetEditorState = {
												player: scoringSheetEditorState.player,
												type: 'ron',
												han: null
											})}
									>
										Ron
									</button>
									<button
										type="button"
										class="flex-1 items-center justify-center rounded-lg border py-4 text-sm"
										class:bg-blue-500={scoringSheetEditorState.type === 'tsumo'}
										class:text-white={scoringSheetEditorState.type === 'tsumo'}
										on:click={() =>
											(scoringSheetEditorState = {
												player: scoringSheetEditorState.player,
												type: 'tsumo',
												han: null
											})}
									>
										Tsumo
									</button>
								</div>
								<div class="w-full divide-y">
									{#if scoringSheetEditorState.han !== null}
										<div class="flex flex-row items-center">
											<button
												on:click={() => (scoringSheetEditorState.han = null)}
												type="button"
												class="flex flex-row items-center space-x-4 p-4"
											>
												<span class="material-symbols-rounded">arrow_back</span>
												<span class="text-lg font-semibold">{scoringSheetEditorState.han}</span
												></button
											>
										</div>
									{/if}
									{#each scoringListToDisplay as [name, item]}
										<div class="flex w-full flex-row items-center p-4">
											<p class="mr-8 text-lg font-semibold">
												{name}
											</p>
											{#if typeof item === 'number'}
												<input
													type="number"
													bind:value={item}
													class="ml-auto w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
												/>
											{:else if isTsumoScoring(item)}
												<input
													type="text"
													bind:value={item.fromNonDealer}
													class="ml-auto w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
												/>
												{#if scoringSheetEditorState.player === 'dealer'}
													<span class="px-2 text-sm">ALL</span>
												{:else}
													<span class="px-2 text-sm">/</span>
													<input
														type="text"
														bind:value={item.fromDealer}
														class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
													/>
												{/if}
											{:else}
												<button
													on:click={() =>
														(scoringSheetEditorState = {
															player: scoringSheetEditorState.player,
															type: scoringSheetEditorState.type,
															han: name
														})}
													type="button"
													class="material-symbols-rounded flex-1 py-4 pr-4 text-right"
												>
													chevron_right
												</button>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
					{/if}
				</fieldset>
			</div>
			<div>
				<button
					type="submit"
					class="block w-full rounded-lg border border-gray-300 bg-blue-500 py-4 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
				>
					Create
				</button>
			</div>
		</form>
	</section>
</main>
