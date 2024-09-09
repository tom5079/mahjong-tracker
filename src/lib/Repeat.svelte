<script lang="ts">
	export let count: number
</script>

<span class="flex justify-center space-x-2">
	<svg class="mr-1 inline w-4" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="10" cy="10" r="10" fill="#111827" />
		<circle cx="10" cy="50" r="10" fill="#111827" />
		<circle cx="50" cy="10" r="10" fill="#111827" />
		<circle cx="50" cy="50" r="10" fill="#111827" />
		<circle cx="90" cy="10" r="10" fill="#111827" />
		<circle cx="90" cy="50" r="10" fill="#111827" />
		<circle cx="130" cy="10" r="10" fill="#111827" />
		<circle cx="130" cy="50" r="10" fill="#111827" />
	</svg>

	<p>{count}</p>
</span>
