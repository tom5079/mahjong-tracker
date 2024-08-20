<script lang="ts">
	import { convertWind } from './wind'

	export let username: string
	export let score: number
	export let wind: number
	export let richi: boolean
</script>

<div
	class="flex flex-col items-center rounded p-2"
	class:bg-blue-500={richi}
	class:text-white={richi}
>
	<p class="flex max-w-[100%] flex-row items-center">
		<span class="pr-2 font-mj text-2xl">{convertWind(wind)}</span>
		<span class="flex-1 truncate">{username}</span>
	</p>
	<p class="text-4xl">{score / 100}</p>
</div>
