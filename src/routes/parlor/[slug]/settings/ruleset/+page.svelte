<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main class="p-4">
	<section class="mb-4 flex flex-row items-center justify-between pl-2">
		<h1 class="text-2xl font-bold">{data.parlor.name} Settings - Rulesets</h1>
		<a
			href="ruleset/create"
			class="flex flex-row rounded-md bg-blue-500 py-2.5 pl-1 pr-2 text-white"
		>
			<span class="material-symbols-rounded mr-2">add</span> New</a
		>
	</section>
	<section class="flex flex-col">
		{#each data.rulesets as ruleset}
			<p>{ruleset.name}</p>
		{/each}
	</section>
</main>
