<script lang="ts">
    import type { EventAttendee, User } from '@prisma/client'
    import UserAvatar from './UserAvatar.svelte'

    export let usersList: User[]
    export let attendees: EventAttendee[]
    export let join: (user: string) => Promise<void>

    let query: string = ''

    function search(query: string): User[] {
        return usersList.filter((user) => {
            const attendee = attendees.find(
                (attendee: EventAttendee) => attendee.userId === user.id
            )
            return (
                user.username.toLowerCase().includes(query.toLowerCase()) &&
                (!attendee || attendee.status === 'REJECTED')
            )
        })
    }

    $: searchResult = search(query)

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
            on:focus={() => {
                searchResult = search(query)
            }}
        />
        <div
            class="absolute -left-1 top-10 hidden w-[calc(100%-0.5rem)] flex-col divide-y rounded-lg border border-gray-300 bg-gray-50 p-2 shadow-lg peer-focus:flex"
        >
            {#if searchResult.length > 0}
                {#each searchResult as user}
                    <button
                        on:mousedown={() => join(user.id)}
                        class="flex flex-row items-center space-x-2 py-4"
                    >
                        <UserAvatar {user} />
                        <p>{user.username}</p>
                    </button>
                {/each}
            {/if}
            {#if query.length > 0 && !usersList.some((user) => user.username === query)}
                <button
                    on:mousedown={handleGuest}
                    class="flex flex-row items-center space-x-2 py-4"
                >
                    <p>Add guest {query}</p>
                </button>
            {:else}
                <p>No result</p>
            {/if}
        </div>
    </div>
</div>
