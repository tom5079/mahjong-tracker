<script lang="ts">
    import { DateTime } from 'luxon'


    interface Props {
        name: string;
        min?: string | undefined;
        required?: boolean | undefined;
    }

    let { name, min = undefined, required = undefined }: Props = $props();

    const timezone = DateTime.local().zone.offsetName(0, { format: 'short' })
</script>

<div class="flex flex-col items-start">
    <p class="text-xs font-normal">{timezone}</p>
    <input type="datetime-local" {name} {min} {required} />
</div>
