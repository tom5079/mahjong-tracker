<script lang="ts">
    import { convertWind } from './wind'


    interface Props {
        username: string;
        score: number;
        wind: number;
        richi: boolean;
        compareTo?: number | null;
    }

    let {
        username,
        score,
        wind,
        richi,
        compareTo = null
    }: Props = $props();
</script>

<div
    class="flex flex-col items-center rounded p-2"
    class:bg-blue-500={richi}
    class:text-white={richi}
>
    <p class="flex max-w-[100%] flex-row items-center">
        <span class="pr-2 font-mj text-2xl">{convertWind(wind)}</span>
        <span class="flex-1 truncate">{username}</span>
    </p>
    <p
        class="text-4xl"
        class:text-red-500={!richi && compareTo != null && compareTo > score}
        class:text-blue-500={!richi && compareTo != null && compareTo < score}
    >
        {compareTo != null ? (compareTo <= score ? '+' : '-') : ''}
        {compareTo != null ? Math.abs(score - compareTo) / 100 : score / 100}
    </p>
</div>
