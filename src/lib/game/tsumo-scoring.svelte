<script lang="ts">
    interface Props {
        scores: PrismaJson.Score['dealer'];
        onScore: (score: { fromDealer: number; fromNonDealer: number }) => void;
    }

    let { scores, onScore }: Props = $props();

    let category = $state([scores.tsumo])
</script>

<div class="grid grid-cols-2 gap-4 p-4">
    {#each category[0] as [name, score]}
        {#if Array.isArray(score)}
            <button
                onclick={() => {
                    category = [score, ...category]
                }}
                class="rounded border p-8 text-xl font-bold">{name}</button
            >
        {:else}
            <button onclick={() => onScore(score)} class="rounded border p-8 text-xl font-bold"
                >{name}</button
            >
        {/if}
    {/each}
</div>
