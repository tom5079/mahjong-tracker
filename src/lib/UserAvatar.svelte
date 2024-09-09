<script lang="ts">
	import type { User } from '@prisma/client'

	export let user: User | undefined
</script>

{#if user}
	<img
		src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp"
		alt="avatar of {user.username}"
		class="h-8 w-8 rounded-full"
	/>
{/if}
