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

		type EventJoinPolicy = {
			type: 'manual'
		} | {
			type: 'auto',
			until?: string
		}

		type Action = {
			type: 'ron'
			loser: string
			scores: Record<string, number>
		} | {
			type: 'tsumo'
			winner: string
			scores: Record<string, number>
		} | {
			type: 'draw'
			tenpai: string[]
		} | {
			type: 'nagashi'
			players: string[]
		} | {
			type: 'oyaNagashi'
		} | {
			type: 'chonbo'
			player: string
		} | {
			type: 'riichi',
			player: string
		} | {
			type: 'start',
			at: string
		} | {
			type: 'pause',
			at: string
		} | {
			type: 'resume',
			at: string
		} | {
			type: 'end',
			at: string
		}
		type Actions = Action[]
	}
}
