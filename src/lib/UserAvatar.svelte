<script lang="ts">
    import type { User } from '@prisma/client'

    interface Props {
        user: User | undefined
        size?: 'sm' | 'md' | 'lg'
    }

    let { user, size = 'md' }: Props = $props()

    const sizeToClassMap = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }
</script>

{#if user}
    <div class={`overflow-hidden rounded-full ${sizeToClassMap[size]}`}>
        <img
            src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp"
            alt="avatar of {user.username}"
            class="h-full w-full"
            onerror={(e) =>
                ((e.currentTarget as HTMLImageElement).src =
                    'https://cdn.discordapp.com/emojis/1235123039956500491.webp?size=96')}
        />
    </div>
{/if}
