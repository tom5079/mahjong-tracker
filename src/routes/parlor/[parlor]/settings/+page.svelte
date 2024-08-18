<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	const menu = [
		{
			name: 'General',
			href: 'settings/general'
		},
		{
			name: 'Members',
			href: 'settings/member'
		},
		{
			name: 'Roles',
			href: 'settings/role'
		},
		{
			name: 'Rulesets',
			href: 'settings/ruleset'
		}
	]
</script>

<main class="mx-auto max-w-2xl p-4">
	<section class="mb-4 pl-2">
		<h1 class="text-2xl font-bold">{data.parlor.name} Settings</h1>
	</section>
	<section class="flex flex-col divide-y rounded-xl border text-xl font-medium">
		{#each menu as { name, href }, i}
			<a
				class="flex flex-row items-center justify-between p-6"
				class:bg-gray-50={i % 2 === 1}
				{href}>{name} <span class="material-symbols-rounded">chevron_right</span></a
			>
		{/each}
	</section>
</main>
