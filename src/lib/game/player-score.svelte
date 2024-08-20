<script lang="ts">
	import { convertWind } from './wind'

	export let username: string
	export let score: number
	export let wind: number
	export let richi: boolean
</script>

<div
	class="flex w-fit flex-col items-center rounded border-slate-400 p-2"
	class:bg-blue-500={richi}
	class:text-white={richi}
>
	<div class="flex items-center space-x-4">
		<span class="font-mj text-2xl">{convertWind(wind)}</span>
		<span class="trucate">{username}</span>
	</div>
	<p class="text-4xl">{score / 100}</p>
</div>
