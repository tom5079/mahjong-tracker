<script lang="ts">
    interface Props {
        name: string;
        label: string;
        required?: boolean | undefined;
    }

    let { name, label, required = undefined }: Props = $props();
</script>

<label class="flex flex-col space-y-2">
    <span class="text-sm font-medium">
        {label}
    </span>
    <input
        type="text"
        {name}
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        {required}
    />
</label>
