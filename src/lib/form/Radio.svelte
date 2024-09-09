<script lang="ts">
	export let name: string
	export let values: {
		value: string
		label: string
	}[]
	export let selected: string | undefined
</script>

<div class="flex flex-row space-x-2">
	{#each values as { value, label }, i}
		<label class="flex-1 cursor-pointer space-x-2">
			<input class="hidden" type="radio" {name} {value} checked={i == 0} />
			<p
				class="rounded-lg border p-4 text-center text-sm"
				class:bg-blue-500={selected === value}
				class:text-white={selected === value}
			>
				{label}
			</p>
		</label>
	{/each}
</div>
