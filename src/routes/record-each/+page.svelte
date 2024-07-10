<script lang="ts">
	import Richi from '$lib/Richi.svelte'
	import Repeat from '$lib/Repeat.svelte'
</script>

<header class="p-4">
	<p class="text-2xl font-bold">Berkeley Mahjong League</p>
	<p>Semi-final #2</p>
</header>
<section class="relative aspect-square w-full rounded-xl bg-slate-200">
	<p class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
		<span class="font-mj text-4xl">東1</span>
		<Richi count="0" />
		<Repeat count="0" />
	</p>
	<div class="absolute bottom-2 left-1/2 flex w-fit -translate-x-1/2 flex-col items-center">
		<div class="flex items-center space-x-4">
			<span class="font-mj text-2xl">東</span> <span>akadora3</span>
		</div>
		<p class="text-4xl">250</p>
	</div>
	<div class="absolute left-2 top-1/2 flex w-fit -translate-y-1/2 flex-col items-center">
		<div class="flex items-center space-x-4">
			<span class="font-mj text-2xl">北</span> <span>Ichigo</span>
		</div>
		<p class="text-4xl">250</p>
	</div>
	<div class="absolute right-2 top-1/2 flex w-fit -translate-y-1/2 flex-col items-center">
		<div class="flex items-center space-x-4">
			<span class="font-mj text-2xl">南</span> <span>Tookoo</span>
		</div>
		<p class="text-4xl">250</p>
	</div>
	<div class="absolute left-1/2 top-2 flex w-fit -translate-x-1/2 flex-col items-center">
		<div class="flex items-center space-x-4">
			<span class="font-mj text-2xl">西</span> <span>eviltaxi</span>
		</div>
		<p class="text-4xl">250</p>
	</div>
</section>
<section class="p-4">
	<p class="font-bold">Action</p>
	<div class="my-4 grid w-full grid-cols-2 gap-2">
		<button class="h-12 rounded border bg-red-500 text-xl font-bold text-white">Ron</button>
		<button class="h-12 rounded border bg-blue-500 text-xl font-bold text-white">Tsumo</button>
		<button class="h-12 rounded border bg-gray-500 text-xl font-bold text-white">Draw</button>
		<button class="h-12 rounded border bg-gray-500 text-xl font-bold text-white">Chonbo</button>
	</div>
	<p class="font-bold">History</p>
</section>
