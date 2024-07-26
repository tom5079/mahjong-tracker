<script lang="ts">
	import moment from 'moment-timezone'
	export let name: string

	export let min: string | undefined = undefined

	const timezone = moment.tz(moment.tz.guess()).format('z')
</script>

<div class="flex flex-col items-start">
	<p class="text-xs font-normal">{timezone}</p>
	<input type="datetime-local" {name} {min} />
</div>
