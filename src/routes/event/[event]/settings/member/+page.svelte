<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'

	export let data: PageData

	console.log(data)

	async function decision(user: string, action: 'accept' | 'reject') {
		await fetch('member', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user,
				action
			})
		})
		invalidateAll()
	}
</script>

<main class="mx-auto max-w-2xl">
	<section class="p-4">
		<h1 class="text-2xl font-bold">{data.event.name} @ {data.event.parlor.name} Settings</h1>
	</section>
	<section>
		<h2 class="p-4 text-xl font-semibold">Attendees</h2>
		{#each data.attendee.filter(({ status }) => status === 'ACCEPTED') as attendee}
			<div class="flex flex-row items-center justify-between p-4">
				<div class="flex flex-row items-center space-x-4">
					<img
						src="https://cdn.discordapp.com/avatars/{attendee.user.id}/{attendee.user.avatar}.webp"
						alt="avatar of {attendee.user.username}"
						class="h-8 w-8 rounded-full"
					/>
					<p>{attendee.user.username}</p>
				</div>
			</div>
		{/each}
	</section>
	<section>
		<h2 class="p-4 text-xl font-semibold">Peding Join Requests</h2>
		{#each data.attendee.filter(({ status }) => status === 'PENDING') as joinRequest}
			<div class="flex flex-row items-center justify-between p-4">
				<div class="flex flex-row items-center space-x-4">
					<img
						src="https://cdn.discordapp.com/avatars/{joinRequest.user.id}/{joinRequest.user
							.avatar}.webp"
						alt="avatar of {joinRequest.user.username}"
						class="h-8 w-8 rounded-full"
					/>
					<p>{joinRequest.user.username}</p>
				</div>
				<div class="flex flex-row items-center space-x-4">
					<button
						on:click={async () => await decision(joinRequest.user.id, 'accept')}
						class="rounded-lg bg-green-500 p-4 text-white">Accept</button
					>
					<button
						on:click={async () => await decision(joinRequest.user.id, 'reject')}
						class="rounded-lg bg-red-500 p-4 text-white">Reject</button
					>
				</div>
			</div>
		{/each}
	</section>
</main>
