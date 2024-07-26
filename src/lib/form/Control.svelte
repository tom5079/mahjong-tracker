<script lang="ts">
	export let error: string
</script>

<div class="flex flex-row items-center space-x-4">
	<p class="flex-1 text-end font-bold text-red-500">{error}</p>
	<button on:click={() => window.history.back()} type="button"> Cancel </button>
	<button
		type="submit"
		class="rounded-lg border border-gray-300 bg-blue-500 p-4 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
	>
		Create
	</button>
</div>
