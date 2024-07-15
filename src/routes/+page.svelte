<script lang="ts">
	import type { PageData } from './$types'
	import Navbar from '$lib/Navbar.svelte'

	export let data: PageData
</script>

<Navbar user={data.user} />

<main>
	<section class="mx-auto flex flex-row flex-wrap">
		<div class="mx-auto flex py-16">
			<div
				class="flex aspect-[3/4] h-36 items-center justify-center rounded-lg border-2 font-mj text-7xl text-red-700"
			>
				中
			</div>
			<div
				class="mx-4 flex aspect-[3/4] h-36 -rotate-90 flex-col items-center justify-center rounded-lg border-2 text-center font-mj text-6xl font-extralight"
			>
				<span>一</span><span class="text-red-700">萬</span>
			</div>
		</div>
		<div class="flex w-full flex-col items-center px-4">
			<p class="py-2 text-2xl font-extrabold tracking-tight">Mahjong Tracker</p>
			<p>Track your mahjong games with ease</p>
		</div>
	</section>
</main>
