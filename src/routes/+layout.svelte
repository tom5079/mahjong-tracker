<script lang="ts">
	import '../app.css'

	import Navbar from '$lib/Navbar.svelte'
	import type { PageData } from './$types'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'

	export let data: PageData
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js?render={PUBLIC_CAPTCHA_CLIENT_KEY}"></script>
</svelte:head>

<Navbar user={data.user} />
<slot />
