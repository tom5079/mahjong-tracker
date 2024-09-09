<script lang="ts">
	export let name: string
	export let label: string
</script>

<label class="flex cursor-pointer items-center">
	<input type="checkbox" {name} class="peer sr-only" checked />
	<span class="text-sm font-medium text-gray-900">{label}</span>
	<div
		class="peer relative ml-auto h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"
	/>
</label>
