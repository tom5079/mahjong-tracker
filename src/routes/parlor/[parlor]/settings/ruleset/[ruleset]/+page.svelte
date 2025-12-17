<script lang="ts">
    import type { PageData } from './$types'
    import Ruleset from '$lib/Ruleset.svelte'

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<main class="mx-auto max-w-2xl p-4">
    <section class="mb-4 flex flex-row items-center justify-between pl-2">
        <h1 class="text-2xl font-bold">
            {data.parlor.name} Settings - Ruleset {data.ruleset.name}
        </h1>
        <a href="ruleset/create" class="flex flex-row rounded-md bg-blue-500 p-4 text-white">
            <span class="material-symbols-rounded mr-2">add</span> New</a
        >
    </section>
    <Ruleset ruleset={data.ruleset} />
</main>
