<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main class="space-y-8 p-4">
	<section>
		<div class="flex flex-row items-center justify-between">
			<h1 class="text-2xl font-bold">{data.parlor.name}</h1>
			<a href="{data.slug}/settings" class="material-symbols-rounded filled px-5 py-2.5 text-2xl"
				>settings</a
			>
		</div>
		<div class="flex flex-row items-center space-x-4 py-4">
			{#if data.parlor.ownerInfo}<img
					src="https://cdn.discordapp.com/avatars/{data.parlor.ownerInfo.id}/{data.parlor.ownerInfo
						.avatar}.webp"
					alt="avatar of {data.parlor.ownerInfo.username}"
					class="h-8 w-8 rounded-full"
				/>{/if}
			<p>
				{#if data.parlor.ownerInfo}{data.parlor.ownerInfo.username}{:else}unknown user {data.parlor
						.owner}{/if}
			</p>
		</div>
	</section>
	<section>
		<div class="flex flex-row items-center justify-between">
			<h2 class="text-xl font-bold">Events</h2>
			<a
				href="{data.slug}/event/create"
				class="flex flex-row space-x-2 rounded-lg bg-blue-500 p-4 text-white"
			>
				<span class="material-symbols-rounded">add</span> New Event
			</a>
		</div>
		{#each data.events as event}
			<a href="{data.slug}/event/{event.id}" class="flex flex-row space-x-4 py-4">
				<div class="flex flex-grow flex-col space-y-2">
					<h2 class="text-xl font-semibold">{event.name}</h2>
					<p class="text-sm">{event.location}</p>
					<p class="text-sm">{event.description}</p>
				</div>
				<span class="material-symbols-rounded my-auto">chevron_right</span>
			</a>
		{/each}
	</section>
	<section>
		<div class="flex flex-row items-center justify-between">
			<h2 class="text-xl font-bold">Leaderboard</h2>
		</div>
	</section>
</main>
