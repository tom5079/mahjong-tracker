<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main class="p-4">
	<section class="mb-4 flex flex-row items-center justify-between pl-2">
		<h1 class="text-2xl font-bold">{data.parlor.name} Settings - Rulesets</h1>
		<a href="ruleset/create" class="flex flex-row rounded-md bg-blue-500 p-4 text-white">
			<span class="material-symbols-rounded mr-2">add</span> New</a
		>
	</section>
	<section class="flex flex-col divide-y rounded-lg border p-2">
		{#each data.rulesets as ruleset}
			<a href="ruleset/{ruleset.id}" class="flex flex-row items-center justify-between p-4 text-lg"
				>{ruleset.name}
				<span class="material-symbols-rounded">chevron_right</span>
			</a>
		{/each}
	</section>
</main>
