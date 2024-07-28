<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main class="mx-auto max-w-2xl">
	<section class="p-4">
		<h1 class="text-2xl font-bold">{data.event.name} @ {data.event.parlor.name} Settings</h1>
	</section>
	<section class="m-4 divide-y rounded-xl border">
		<a href="settings/member" class="flex flex-row items-center justify-between p-4">
			<h2 class="text-xl font-semibold">Member</h2>
			<span class="material-symbols-rounded my-auto">chevron_right</span>
		</a>
	</section>
</main>
