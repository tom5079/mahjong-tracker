/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat'],
				mj: ['"LXGW WenKai Mono TC"']
			},
			gridTemplateColumns: {
				leaderboard: 'auto minmax(0, 1fr) auto',
				gamescore: 'auto minmax(0, 1fr) auto'
			}
		}
	},
	plugins: []
}
