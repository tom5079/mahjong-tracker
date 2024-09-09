<script lang="ts">
	import { DateTime } from 'luxon'

	export let name: string

	export let min: string | undefined = undefined
	export let required: boolean | undefined = undefined

	const timezone = DateTime.local().zone.offsetName(0, { format: 'short' })
</script>

<div class="flex flex-col items-start">
	<p class="text-xs font-normal">{timezone}</p>
	<input type="datetime-local" {name} {min} {required} />
</div>
