<script lang="ts">
    import type { User } from '@prisma/client'
    import UserAvatar from '$lib/UserAvatar.svelte'

    interface Props {
        join: (user: string) => Promise<void>
        searchUsers: (searchTerm: string) => Promise<User[]>
    }

    let { join, searchUsers }: Props = $props()

    let query: string = $state('')

    const searchResults = $derived(await searchUsers(query))

    async function addGuest(username: string) {
        const response = await fetch('/api/register_guest', {
            method: 'POST',
            body: username,
        })
        const user: User = await response.json()
        return user
    }

    async function handleGuest() {
        const guest = await addGuest(query)
        join(guest.id)
        query = ''
    }
</script>

<div class="py-4">
    <div class="relative flex flex-row space-x-2 px-2">
        <input
            type="text"
            bind:value={query}
            placeholder="Search or add by Discord username"
            class="peer w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />
        <div
            class="absolute -left-1 top-10 hidden w-[calc(100%-0.5rem)] flex-col divide-y rounded-lg border border-gray-300 bg-gray-50 p-2 shadow-lg peer-focus:flex"
        >
            {#each searchResults as user}
                <button
                    onmousedown={() => join(user.id)}
                    class="flex flex-row items-center space-x-2 py-4"
                >
                    <UserAvatar {user} />
                    <p>{user.username}</p>
                </button>
            {/each}
            {#if query.length > 0 && !searchResults.some((user) => user.username === query)}
                <button onmousedown={handleGuest} class="flex flex-row items-center space-x-2 py-4">
                    <p>Add guest {query}</p>
                </button>
            {/if}
        </div>
    </div>
</div>
