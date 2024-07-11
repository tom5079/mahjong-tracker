<script lang="ts">
	import { convertWind } from './wind'

	export let player: {
		id: string
		score: number
		wind: string
		richi: boolean
	}
</script>

<div
	class="flex w-fit flex-col items-center rounded border-slate-400 p-2"
	class:bg-blue-500={player.richi}
	class:text-white={player.richi}
>
	<div class="flex items-center space-x-4">
		<span class="font-mj text-2xl">{convertWind(player.wind)}</span>
		<span>{player.id}</span>
	</div>
	<p class="text-4xl">{player.score}</p>
</div>
