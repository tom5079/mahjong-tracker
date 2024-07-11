<script lang="ts">
	import { convertWind } from './wind'

	export let result: {
		player: string
		wind: string
		score?: string
		richi?: boolean
		chonbo?: boolean
	}
</script>

<p class="justify-center space-x-2">
	<span
		class="space-x-2 rounded p-1"
		class:bg-blue-500={result.richi}
		class:bg-yellow-500={result.chonbo}
		class:text-white={result.richi}
	>
		<span class="font-mj">{convertWind(result.wind)}</span><span>{result.player}</span></span
	>
	{#if result.score}
		<span
			class:text-red-700={result.score?.startsWith('-')}
			class:text-blue-700={result.score?.startsWith('+')}>{result.score}</span
		>
	{/if}
</p>
