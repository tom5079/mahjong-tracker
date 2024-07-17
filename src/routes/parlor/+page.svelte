<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main>
	<section class="p-8">
		<div class="flex flex-row items-center">
			<h1 class="text-2xl font-medium">Parlors</h1>
			<a
				href="/parlor/create"
				class="ml-auto flex flex-row items-center rounded border bg-blue-500 p-2 text-white"
				><span class="material-symbols-rounded">add</span> New Parlor</a
			>
		</div>
		<div class="flex flex-col divide-y">
			{#each data.parlors as parlor}
				<a href="/parlor/{parlor.id}" class="flex flex-row space-x-4 py-4">
					<div class="flex flex-grow flex-col space-y-2">
						<h2 class="text-xl font-semibold">{parlor.name}</h2>
						<p class="text-sm">{parlor.location}</p>
						<p class="flex flex-row items-center text-sm">
							<span>Owner: </span>
							{#if parlor.ownerInfo}<img
									class="ml-2 mr-1 inline h-4 w-4 rounded-full"
									src="https://cdn.discordapp.com/avatars/{parlor.ownerInfo.id}/{parlor.ownerInfo
										.avatar}.webp"
									alt="avatar of {parlor.ownerInfo.username}"
								/>{/if}
							<span
								>{#if parlor.ownerInfo}{parlor.ownerInfo.username}{:else}unknown user {parlor.owner}{/if}</span
							>
						</p>
						{#if parlor.note}<p class="text-sm">{parlor.note}</p>{/if}
					</div>
					<span class="material-symbols-rounded my-auto">chevron_right</span>
				</a>
			{/each}
		</div>
	</section>
</main>
