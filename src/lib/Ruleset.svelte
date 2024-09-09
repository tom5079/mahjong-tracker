<script lang="ts">
	import type { Ruleset } from '@prisma/client'

	export let ruleset: Ruleset
	export let readonly: boolean = false

	let textarea: HTMLTextAreaElement

	let scoring: {
		kiriage: boolean
		fixed30fu: boolean
		tsumozon: boolean
	} = { kiriage: true, fixed30fu: false, tsumozon: true }

	function onNoteInput() {
		textarea.style.height = ''
		textarea.style.height = `min(${textarea.scrollHeight}px, 12rem)`
	}

	function four() {
		if (readonly) {
			return
		}

		ruleset.player = 'FOUR'
		ruleset.startScore = 25000
		ruleset.returnScore = 30000
		ruleset.uma = {
			type: 'simple',
			uma: [15, 5, -5, -15]
		}
		ruleset.honba = 300
		ruleset.tenpaiFee = 3000
		ruleset.allLastPlacement = 1
	}

	function three() {
		if (readonly) {
			return
		}

		ruleset.player = 'THREE'
		ruleset.startScore = 35000
		ruleset.returnScore = 40000
		ruleset.uma = {
			type: 'simple',
			uma: [15, 0, -15, 0]
		}
		ruleset.honba = 1000
		ruleset.tenpaiFee = 2000
		ruleset.allLastPlacement = 1
	}

	const defaultFourFloatingUma: PrismaJson.Uma = {
		type: 'floating',
		A: [30, 0, -10, -20],
		B: [20, 10, -10, -20],
		C: [20, 10, 0, -30]
	}

	const defaultThreeFloatingUma: PrismaJson.Uma = {
		type: 'floating',
		A: [30, -10, -20, 0],
		B: [15, 0, -15, 0],
		C: [0, 0, 0, 0]
	}
</script>

<div class="grid gap-6 py-4">
	<div>
		<label for="name" class="mb-2 block text-sm font-medium text-gray-900">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={ruleset.name}
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			required
			{readonly}
		/>
	</div>
	<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
		<legend class="block text-sm font-medium text-gray-900">Type</legend>
		<div class="flex flex-row space-x-2">
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.player === 'FOUR'}
				class:text-white={ruleset.player === 'FOUR'}
				on:click={four}
			>
				4 Players
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.player === 'THREE'}
				class:text-white={ruleset.player === 'THREE'}
				on:click={three}
			>
				3 Players
			</button>
		</div>
		<div class="flex flex-row space-x-2">
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.length === 'HANCHAN'}
				class:text-white={ruleset.length === 'HANCHAN'}
				on:click={() => (ruleset.length = readonly ? ruleset.length : 'HANCHAN')}
			>
				Hanchan
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.length === 'TONPU'}
				class:text-white={ruleset.length === 'TONPU'}
				on:click={() => (ruleset.length = readonly ? ruleset.length : 'TONPU')}
			>
				East only
			</button>
		</div>
	</fieldset>
	<div>
		<label for="start" class="mb-2 block text-sm font-medium text-gray-900">Starting Score</label>
		<input
			type="number"
			id="start"
			bind:value={ruleset.startScore}
			step="1000"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			{readonly}
		/>
	</div>
	<div>
		<label for="return" class="mb-2 block text-sm font-medium text-gray-900">Return Score</label>
		<input
			type="number"
			id="return"
			bind:value={ruleset.returnScore}
			step="1000"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			{readonly}
		/>
	</div>
	<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
		<legend class="block text-sm font-medium text-gray-900">Uma</legend>
		<button
			type="button"
			on:click={() => {
				if (ruleset.uma.type === 'simple') {
					ruleset.uma =
						ruleset.player === 'THREE' ? defaultThreeFloatingUma : defaultFourFloatingUma
				} else {
					ruleset.uma = {
						type: 'simple',
						uma: ruleset.player === 'THREE' ? [15, 0, -15, 0] : [15, 5, -5, -15]
					}
				}
			}}
			class="group flex w-full cursor-pointer flex-row items-center justify-between"
		>
			<span class="text-sm font-medium text-gray-900">Floating Uma</span>
			<div
				class="peer relative h-6 w-11 rounded-full after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] group-focus:ring-4 group-focus:ring-blue-300 rtl:group-checked:after:-translate-x-full"
				class:bg-gray-200={ruleset.uma.type !== 'floating'}
				class:bg-blue-600={ruleset.uma.type === 'floating'}
				class:after:translate-x-full={ruleset.uma.type === 'floating'}
				class:after:border-white={ruleset.uma.type === 'floating'}
				class:rtl:after:-translate-x-full={ruleset.uma.type === 'floating'}
			/>
		</button>
		{#if ruleset.uma.type === 'simple'}
			<div class="flex flex-row items-center space-x-2">
				<input
					type="number"
					bind:value={ruleset.uma.uma[0]}
					class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
				<span class="text-sm text-gray-900">-</span>
				<input
					type="number"
					bind:value={ruleset.uma.uma[1]}
					class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
				<span class="text-sm text-gray-900">-</span>
				<input
					type="number"
					bind:value={ruleset.uma.uma[2]}
					class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
				{#if ruleset.player !== 'THREE'}
					<span class="text-sm text-gray-900">-</span>
					<input
						type="number"
						bind:value={ruleset.uma.uma[3]}
						class="w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				{/if}
			</div>
		{:else}
			{#each Object.entries(ruleset.uma).filter(([k, v]) => Array.isArray(v) && (ruleset.player !== 'THREE' || k !== 'C')) as [key, value] (key)}
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
					{#if ruleset.player !== 'THREE'}
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
			bind:value={ruleset.honba}
			step="100"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		/>
	</div>
	<div>
		<label for="tenpai" class="mb-2 block text-sm font-medium text-gray-900">Tenpai fee</label>
		<input
			type="number"
			id="tenpai"
			bind:value={ruleset.tenpaiFee}
			step="1000"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		/>
	</div>
	<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
		<legend class="block text-sm font-medium text-gray-900">End game pot</legend>
		<div class="flex flex-row space-x-2">
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.endgamePot === 'TOP'}
				class:text-white={ruleset.endgamePot === 'TOP'}
				on:click={() => (ruleset.endgamePot = readonly ? ruleset.endgamePot : 'TOP')}
			>
				Top
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.endgamePot === 'DISAPPEARS'}
				class:text-white={ruleset.endgamePot === 'DISAPPEARS'}
				on:click={() => (ruleset.endgamePot = readonly ? ruleset.endgamePot : 'DISAPPEARS')}
			>
				Disappears
			</button>
		</div>
	</fieldset>
	<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
		<legend class="block text-sm font-medium text-gray-900">Tiebreaker</legend>
		<div class="flex flex-row space-x-2">
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.tiebreaker === 'WIND'}
				class:text-white={ruleset.tiebreaker === 'WIND'}
				on:click={() => (ruleset.tiebreaker = readonly ? ruleset.tiebreaker : 'WIND')}
			>
				Wind
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.tiebreaker === 'SPLIT'}
				class:text-white={ruleset.tiebreaker === 'SPLIT'}
				on:click={() => (ruleset.tiebreaker = readonly ? ruleset.tiebreaker : 'SPLIT')}
			>
				Split
			</button>
		</div>
	</fieldset>
	<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
		<legend class="block text-sm font-medium text-gray-900">Renchan</legend>
		<div class="flex flex-row space-x-2">
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.renchan === 'TENPAI'}
				class:text-white={ruleset.renchan === 'TENPAI'}
				on:click={() => (ruleset.renchan = readonly ? ruleset.renchan : 'TENPAI')}
			>
				Tenpai
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.renchan === 'AGARI'}
				class:text-white={ruleset.renchan === 'AGARI'}
				on:click={() => (ruleset.renchan = readonly ? ruleset.renchan : 'AGARI')}
			>
				Agari
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.renchan === 'NONE'}
				class:text-white={ruleset.renchan === 'NONE'}
				on:click={() => (ruleset.renchan = readonly ? ruleset.renchan : 'NONE')}
			>
				None
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.renchan === 'ALWAYS'}
				class:text-white={ruleset.renchan === 'ALWAYS'}
				on:click={() => (ruleset.renchan = readonly ? ruleset.renchan : 'ALWAYS')}
			>
				Always
			</button>
		</div>
	</fieldset>
	<fieldset class="space-y-2 rounded-lg border border-gray-300 px-2 pb-2">
		<legend class="block text-sm font-medium text-gray-900">All Last</legend>
		<div class="flex flex-row space-x-2">
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.allLast === 'AGARIYAME'}
				class:text-white={ruleset.allLast === 'AGARIYAME'}
				on:click={() => (ruleset.allLast = readonly ? ruleset.allLast : 'AGARIYAME')}
			>
				Agariyame
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.allLast === 'TENPAIYAME'}
				class:text-white={ruleset.allLast === 'TENPAIYAME'}
				on:click={() => (ruleset.allLast = readonly ? ruleset.allLast : 'TENPAIYAME')}
			>
				Tenpaiyame
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.allLast === 'NONE'}
				class:text-white={ruleset.allLast === 'NONE'}
				on:click={() => (ruleset.allLast = readonly ? ruleset.allLast : 'NONE')}
			>
				None
			</button>
		</div>
		<div class="flex flex-row space-x-2" class:hidden={ruleset.allLast === 'NONE'}>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.allLastPlacement === 1}
				class:text-white={ruleset.allLastPlacement === 1}
				on:click={() => (ruleset.allLastPlacement = readonly ? ruleset.allLastPlacement : 1)}
			>
				1st
			</button>
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.allLastPlacement === 2}
				class:text-white={ruleset.allLastPlacement === 2}
				on:click={() => (ruleset.allLastPlacement = readonly ? ruleset.allLastPlacement : 2)}
			>
				2st
			</button>
			{#if ruleset.player === 'FOUR'}
				<button
					class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
					class:bg-blue-500={ruleset.allLastPlacement === 3}
					class:text-white={ruleset.allLastPlacement === 3}
					on:click={() => (ruleset.allLastPlacement = readonly ? ruleset.allLastPlacement : 3)}
				>
					3st
				</button>
			{/if}
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.allLastPlacement == null}
				class:text-white={ruleset.allLastPlacement == null}
				on:click={() => (ruleset.allLastPlacement = readonly ? ruleset.allLastPlacement : null)}
			>
				Any
			</button>
		</div>
	</fieldset>
	<fieldset class="space-y-2 rounded-lg border border-solid border-gray-300 px-2 pb-2">
		<legend class="block text-sm font-medium text-gray-900">Multiple ron</legend>
		<div class="flex flex-row space-x-2">
			<button
				class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
				class:bg-blue-500={ruleset.doubleRon}
				class:text-white={ruleset.doubleRon}
				on:click={() => (ruleset.doubleRon = readonly ? ruleset.doubleRon : !ruleset.doubleRon)}
			>
				Double
			</button>
			{#if ruleset.player === 'FOUR'}
				<button
					class="flex flex-1 items-center justify-center rounded-lg border py-4 text-center text-sm"
					class:bg-blue-500={ruleset.tripleRon}
					class:text-white={ruleset.tripleRon}
					on:click={() => (ruleset.tripleRon = readonly ? ruleset.tripleRon : !ruleset.tripleRon)}
				>
					Triple
				</button>
			{/if}
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
		{#if ruleset.player === 'THREE'}
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
			{#each ruleset.scores.dealer.ron.filter(([han, item]) => !Array.isArray(item)) ?? [] as [name, _] (name)}
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
						ruleset.chonbo = { type: 'score', name: 'Mangan', affectsScore: true }
					}}
					class="flex-1 rounded-lg border py-4 text-sm"
					class:bg-blue-500={ruleset.chonbo.type === 'score'}
					class:text-white={ruleset.chonbo.type === 'score'}>Score</button
				>
				<button
					type="button"
					on:click={() => {
						ruleset.chonbo = { type: 'fixed', point: 12000, affectsScore: false }
					}}
					class="flex-1 rounded-lg border py-4 text-sm"
					class:bg-blue-500={ruleset.chonbo.type === 'fixed'}
					class:text-white={ruleset.chonbo.type === 'fixed'}>Fixed</button
				>
				<button
					type="button"
					on:click={() => {
						ruleset.chonbo = {
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
					class:bg-blue-500={ruleset.chonbo.type === 'custom'}
					class:text-white={ruleset.chonbo.type === 'custom'}>Custom</button
				>
			</div>
			{#if ruleset.chonbo.type === 'score'}
				<select
					id="chonbo"
					bind:value={ruleset.chonbo.name}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				>
					{#each ruleset.scores.dealer.ron.filter(([_, item]) => !Array.isArray(item)) ?? [] as [name, _] (name)}
						<option value={name}>{name}</option>
					{/each}
				</select>
			{:else if ruleset.chonbo.type === 'fixed'}
				<div class="flex flex-row items-center space-x-4 text-sm">
					<p class="flex-1">Score</p>
					<input
						type="number"
						id="chonbo"
						step="100"
						min="0"
						bind:value={ruleset.chonbo.point}
						class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
					{#if ruleset.chonbo.affectsScore}
						<p>ALL</p>
					{/if}
				</div>
			{:else if ruleset.chonbo.type === 'custom'}
				<div class="flex flex-row items-center space-x-4 text-sm">
					<p class="flex-1">Dealer</p>
					<input
						type="number"
						id="chonbo"
						step="100"
						min="0"
						bind:value={ruleset.chonbo.dealer.toNonDealer}
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
						bind:value={ruleset.chonbo.nonDealer.toNonDealer}
						class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
					<span class="mx-2">/</span>
					<input
						type="number"
						id="chonbo"
						step="100"
						min="0"
						bind:value={ruleset.chonbo.nonDealer.toDealer}
						class="w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
			{/if}
			<label class="inline-flex cursor-pointer items-center">
				<input type="checkbox" class="peer sr-only" bind:checked={ruleset.chonbo.affectsScore} />
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

	<label class="inline-flex cursor-pointer items-center" class:hidden={ruleset.tobi}>
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
			class:hidden={ruleset.suddenDeath == null}
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
			class:hidden={ruleset.calledGame == null}
		/>
	</div>
	<div>
		<label class="mb-2 block text-sm font-medium text-gray-900" for="note">Note</label>
		<textarea
			bind:value={ruleset.note}
			bind:this={textarea}
			on:input={onNoteInput}
			class="block w-full resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			rows="1"
			id="note"
			name="note"
		/>
	</div>
</div>
