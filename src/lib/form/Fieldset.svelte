<script lang="ts">
	export let name: string
</script>

<fieldset class="space-y-2 rounded-lg border border-gray-300 px-2 pb-2">
	<legend class="block text-sm font-medium text-gray-900">{name}</legend>
	<slot />
</fieldset>
