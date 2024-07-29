import { wrapCatching } from "$lib/result"
import type { Ruleset, User } from "@prisma/client"

export type State = {
    round: number
    richi: number
    repeat: number
    players: {
        user: User
        score: number
        wind: number
        richi: boolean
    }[]
    history: {
        round: number
        repeat: number
        result: {
            player: string
            wind: number
            score?: number
            richi?: boolean
            chonbo?: boolean
        }[]
    }[]
}

export const computeState = wrapCatching(({ players, ruleset, actions }: { players: User[], ruleset: Ruleset, actions: PrismaJson.Actions }): State => {
    switch (ruleset.player) {
        case 'FOUR':
            if (players.length !== 4) {
                throw new Error('Invalid number of players')
            }
            break
        case 'THREE':
            if (players.length !== 3) {
                throw new Error('Invalid number of players')
            }
            break
        default:
            throw new Error('Invalid gamemode')
    }

    const state: State = {
        round: 0,
        richi: 0,
        repeat: 0,
        players: players.map((user, i) => ({
            user,
            score: ruleset.startScore,
            wind: i,
            richi: false
        })),
        history: []
    }

    for (const action of actions) {
        switch (action.type) {
            case 'riichi': {
                const player = state.players.find(x => x.user.id === action.player)

                if (player == null) {
                    throw new Error('Player not found')
                }

                player.richi = true
                player.score -= 1000
                state.richi++

                break
            }
        }
    }

    return state
})