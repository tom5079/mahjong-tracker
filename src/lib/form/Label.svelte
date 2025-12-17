<script lang="ts">
    interface Props {
        label: string;
        children?: import('svelte').Snippet;
    }

    let { label, children }: Props = $props();
</script>

<label class="flex flex-row items-center justify-between text-sm font-medium text-gray-900">
    {label}
    {@render children?.()}
</label>
