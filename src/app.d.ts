// See https://kit.svelte.dev/docs/types#app

import type { ScoringSheet } from "$lib/scoring";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace PrismaJson {
		type Uma = {
			uma: number[],
			shizumi: number,
			binta: number
		}

		type Scores = ScoringSheet
	}
}

export { };
