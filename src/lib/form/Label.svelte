<script lang="ts">
	export let label: string
</script>

<label class="flex flex-row items-center justify-between text-sm font-medium text-gray-900">
	{label}
	<slot />
</label>
