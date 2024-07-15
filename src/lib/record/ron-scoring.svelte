<script lang="ts">
	import type { Scoring } from './scoring'
	export let scores: Scoring
	export let onScore: (score: number) => void
	let han: number | null = null
</script>

<div class="grid grid-cols-2 gap-4 p-4">
	{#if han == null}
		{#each { length: 4 } as _, i}
			<button on:click={() => (han = i + 1)} class="rounded border p-8 text-xl font-bold"
				>{i + 1} Han</button
			>
		{/each}
		{#each Object.entries(scores.specialRon) as [name, score]}
			<button on:click={() => onScore(score)} class="rounded border p-8 text-xl font-bold"
				>{name}</button
			>
		{/each}
	{:else}
		{#each [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110] as fu}
			<button
				on:click={() => han && onScore(scores.ron(han, fu))}
				class="rounded border p-8 text-xl font-bold">{fu} Fu</button
			>
		{/each}
	{/if}
</div>
