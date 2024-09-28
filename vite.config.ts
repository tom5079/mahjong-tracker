import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: '127.0.0.1',
		watch: {usePolling: true}
	},
	plugins: [sveltekit()]
});
