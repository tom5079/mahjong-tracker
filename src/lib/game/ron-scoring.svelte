<script lang="ts">
    interface Props {
        scores: PrismaJson.Scores['dealer'];
        onScore: (score: number) => void;
    }

    let { scores, onScore }: Props = $props();

    let category = $state([scores.ron])
</script>

<div class="grid grid-cols-2 gap-4 p-4">
    {#each category[0] as [name, score]}
        {#if typeof score === 'number'}
            <button onclick={() => onScore(score)} class="rounded border p-8 text-xl font-bold"
                >{name}</button
            >
        {:else if Array.isArray(score)}
            <button
                onclick={() => {
                    category = [score, ...category]
                }}
                class="rounded border p-8 text-xl font-bold">{name}</button
            >
        {/if}
    {/each}
</div>
