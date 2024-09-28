<script lang="ts">
	import type { PageData } from './$types'
	import UserAvatar from '$lib/UserAvatar.svelte'
	import { Line } from 'svelte-chartjs';
	import { Chart as ChartJS, Tooltip, LineElement, LinearScale, PointElement } from 'chart.js';


	export let data: PageData
	// testing shit waht the sigma
	// const sampledata = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
	// ChartJS.register(Tooltip, LineElement, LinearScale, PointElement)
</script>

<main class="mx-auto max-w-2xl p-4">
	<section class="rounded-lg border p-4">
		<img
			src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.user.avatar}.webp"
			alt="avatar of {data.user.username}"
			class="h-16 w-16 rounded-full"
		/>
		{data.user.username}
	</section>
	<section>
	<div>Recorded matches: {data.stats.recordedMatches}</div>
	<div>Win rate: {data.stats.winRate}</div>
	<div>Riichi rate: {data.stats.riichiRate}</div>
	<div>Deal-in rate: {data.stats.dealInRate}</div>
	<div>Tsumo rate: {data.stats.tsumoRate}</div>
	<div>Exhaustive draw rate: {data.stats.recordedMatches}</div>
	<div>Draw tenpai rate: {data.stats.recordedMatches}</div>
	<div>Average win score: {data.stats.averageWinScore}</div>
	<div>Average deal-in score: {data.stats.averageDealInScore}</div>
	<div>Average rank: {data.stats.averageRank}</div>
	</section>
</main>
