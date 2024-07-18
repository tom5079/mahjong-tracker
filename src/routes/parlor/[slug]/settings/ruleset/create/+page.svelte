<script lang="ts">
	import { onMount } from 'svelte'

	let form: HTMLFormElement
	let formData: FormData | null
	let formDataObject: { [key: string]: FormDataEntryValue }

	$: formDataObject = (formData && Object.fromEntries([...formData.entries()])) ?? {}

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
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Type</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="four-players"
								name="player"
								value="four"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="four-players">4 Players</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="three-players"
								name="player"
								value="three"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="three-players">3 Players</label
							>
						</div>
					</div>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="hanchan"
								name="length"
								value="hanchan"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="hanchan">Hanchan</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="tonpu"
								name="length"
								value="tonpu"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
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
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
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
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">End game pot</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="endgame_top"
								name="endgame"
								value="top"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="endgame_top">Top</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="endgame_disappears"
								name="endgame"
								value="disappears"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="endgame_disappears">Disappears</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Tiebreaker</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="tiebreaker_wind"
								name="tiebreaker"
								value="wind"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="tiebreaker_wind">Wind</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="tiebreaker_split"
								name="tiebreaker"
								value="split"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="tiebreaker_split">Split</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Renchan</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_tenpai"
								name="renchan"
								value="tenpai"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_tenpai">Tenpai</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_agari"
								name="renchan"
								value="agari"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_agari">Agari</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_none"
								name="renchan"
								value="none"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_none">None</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="renchan_always"
								name="renchan"
								value="none"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="renchan_always">Always</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">All Last</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_agariyame"
								name="alllast"
								value="agariyame"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_agariyame">Agariyame</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_tenpaiyame"
								name="alllast"
								value="tenpaiyame"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_tenpaiyame">Tenpaiyame</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="alllast_none"
								name="alllast"
								value="none"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="alllast_none">None</label
							>
						</div>
					</div>
					{#if formDataObject?.alllast !== 'none'}
						<div class="flex flex-row space-x-2">
							<div class="flex-1 rounded border">
								<input
									class="peer hidden h-0 w-0"
									type="radio"
									id="alllast_placement_first"
									name="alllast_placement"
									value="1"
									checked
								/>
								<label
									class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
									for="alllast_placement_first">1st</label
								>
							</div>
							<div class="flex-1 rounded border">
								<input
									class="peer hidden h-0 w-0"
									type="radio"
									id="alllast_placement_second"
									name="alllast_placement"
									value="2"
								/>
								<label
									class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
									for="alllast_placement_second">2nd</label
								>
							</div>
							<div class="flex-1 rounded border">
								<input
									class="peer hidden h-0 w-0"
									type="radio"
									id="alllast_placement_third"
									name="alllast_placement"
									value="3"
								/>
								<label
									class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
									for="alllast_placement_third">3rd</label
								>
							</div>
							<div class="flex-1 rounded border">
								<input
									class="peer hidden h-0 w-0"
									type="radio"
									id="alllast_placement_any"
									name="alllast_placement"
									value="4"
								/>
								<label
									class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
									for="alllast_placement_any">Any</label
								>
							</div>
						</div>
					{/if}
				</fieldset>
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Multiron</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="checkbox"
								id="multiron_double"
								name="multiron_double"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_double">Double</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="checkbox"
								id="multiron_triple"
								name="multiron_triple"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_triple">Triple</label
							>
						</div>
					</div>
					<div class="flex flex-row items-center space-x-2">
						<p class="text-sm">Pot</p>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="multiron_pot_atamahane"
								name="multiron_pot"
								value="atamahane"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_pot_atamahane">Atamahane</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="checkbox"
								id="multiron_pot_split"
								name="multiron_pot_split"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="multiron_pot_split">Split</label
							>
						</div>
					</div>
				</fieldset>
				<fieldset class="space-y-4 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Scoring</legend>
					<label class="flex cursor-pointer items-center">
						<input type="checkbox" class="peer sr-only" checked />
						<span class="mr-auto ms-3 text-sm font-medium text-gray-900">Kiriage</span>
						<div
							class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
						/>
					</label>
					<label class="flex cursor-pointer items-center">
						<input type="checkbox" class="peer sr-only" />
						<span class="mr-auto ms-3 text-sm font-medium text-gray-900">Fixed 30fu</span>
						<div
							class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
						/>
					</label>
					{#if formDataObject?.player === 'three'}
						<label class="flex cursor-pointer items-center">
							<input type="checkbox" class="peer sr-only" checked />
							<span class="mr-auto ms-3 text-sm font-medium text-gray-900">Tsumorizon</span>
							<div
								class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
							/>
						</label>
					{/if}
				</fieldset>
			</div>
			<div>
				<button
					type="submit"
					class="block w-full rounded-lg border border-gray-300 bg-blue-500 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
				>
					Create
				</button>
			</div>
		</form>
	</section>
</main>
