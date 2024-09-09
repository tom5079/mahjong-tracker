<script lang="ts">
	import { convertWind } from './wind'

	export let username: string
	export let wind: number
	export let score: number | undefined = undefined
	export let richi: boolean | undefined = undefined
	export let chonbo: boolean | undefined = undefined
</script>

<p class="flex flex-row items-center space-x-2">
	<span
		class="space-x-2 truncate rounded p-1"
		class:bg-blue-500={richi}
		class:bg-yellow-500={chonbo}
		class:text-white={richi || chonbo}
	>
		<span class="font-mj">{convertWind(wind)}</span><span class="truncate">{username}</span></span
	>
	{#if score}
		<span class:text-red-700={score < 0} class:text-blue-700={score > 0}
			>{#if score > 0}+{/if}{score}</span
		>
	{/if}
</p>
