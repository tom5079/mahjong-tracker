<script lang="ts">
	export let count: number
</script>

<span class="flex justify-center space-x-2">
	<svg class="inline w-10" viewBox="0 0 600 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="600" height="100" fill="#F5F5F5" />
		<rect x="0.5" y="0.5" width="599" height="99" rx="49.5" fill="white" stroke="black" />
		<circle cx="240" cy="30" r="10" fill="#111827" />
		<circle cx="240" cy="70" r="10" fill="#111827" />
		<circle cx="280" cy="30" r="10" fill="#111827" />
		<circle cx="280" cy="70" r="10" fill="#111827" />
		<circle cx="320" cy="30" r="10" fill="#111827" />
		<circle cx="320" cy="70" r="10" fill="#111827" />
		<circle cx="360" cy="30" r="10" fill="#111827" />
		<circle cx="360" cy="70" r="10" fill="#111827" />
	</svg>
	<p>{count}</p>
</span>
