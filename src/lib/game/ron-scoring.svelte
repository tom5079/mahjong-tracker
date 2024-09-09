<script lang="ts">
	export let scores: PrismaJson.Scores['dealer']
	export let onScore: (score: number) => void

	let category = [scores.ron]
</script>

<div class="grid grid-cols-2 gap-4 p-4">
	{#each category[0] as [name, score]}
		{#if typeof score === 'number'}
			<button on:click={() => onScore(score)} class="rounded border p-8 text-xl font-bold"
				>{name}</button
			>
		{:else if Array.isArray(score)}
			<button
				on:click={() => {
					category = [score, ...category]
				}}
				class="rounded border p-8 text-xl font-bold">{name}</button
			>
		{/if}
	{/each}
</div>
