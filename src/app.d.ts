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
			type: 'simple'
			uma: [number, number, number, number]
		} | {
			type: 'floating'
			A: [number, number, number, number]
			B: [number, number, number, number]
			C: [number, number, number, number]
		}

		type Scores = ScoringSheet

		type Chonbo = ({
			type: 'score',
			name: string
		} | {
			type: 'fixed',
			point: number
		} | {
			type: 'custom',
			dealer: {
				toNonDealer: number
			},
			nonDealer: {
				toDealer: number,
				toNonDealer: number
			}
		}) & {
			affectsScore: boolean
		}
	}
}

export { };
