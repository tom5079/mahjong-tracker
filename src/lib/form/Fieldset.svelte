<script lang="ts">
    interface Props {
        label: string;
        children?: import('svelte').Snippet;
    }

    let { label, children }: Props = $props();
</script>

<fieldset class="space-y-2 rounded-lg border border-gray-300 px-2 pb-2">
    <legend class="block text-sm font-medium text-gray-900">{label}</legend>
    {@render children?.()}
</fieldset>
