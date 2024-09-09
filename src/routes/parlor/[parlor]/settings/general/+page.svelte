<script lang="ts">
	import type { PageData } from '../$types'

	export let data: PageData
</script>

<main class="p-4">
	<section class="mb-4 pl-2">
		<h1 class="text-2xl font-bold">{data.parlor.name} Settings - General</h1>
	</section>
	<section class="flex flex-col text-xl font-medium">
		<h2 class="text-red mb-4 text-sm font-bold text-red-500">Danger Zone</h2>
		<div class="flex flex-col divide-y rounded-xl border font-medium">
			<button class="flex w-full p-6">Transfer Ownership</button>
			<button class="flex w-full p-6 text-red-500">Delete Parlor</button>
		</div>
	</section>
</main>
