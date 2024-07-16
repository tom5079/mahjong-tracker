<script lang="ts">
	import '../app.css'

	import Navbar from '$lib/Navbar.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Navbar user={data.user} />
<slot />
