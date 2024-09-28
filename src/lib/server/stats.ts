import type { Game, Ruleset, User } from '@prisma/client'
import { computeState } from '../game/state'
import { error } from "@sveltejs/kit";

export type Stats = {
    recordedMatches: number
    winRate: number
    tsumoRate: number
    dealInRate: number
    riichiRate: number
    bustingRate: number
    drawTenpaiRate: number
    exhaustiveDrawRate: number
    averageWinScore: number
    averageRank: number
    averageDealInScore: number
}

export function computeStats(
    player: string,
    games: (Game & { event: { ruleset: Ruleset }, players: User[] })[]
): Stats {
    const gameStates = Object.fromEntries(
        games.map(game => {
            const result = computeState({ players: game.players, ruleset: game.event.ruleset, actions: game.actions });
            if (!result.ok) {
                error(400, "Malformed state")
            }
            return [game.id, result.value]
        }).filter(([state]) => state !== null)
    )

    const recordedMatches = games.length

    const totalGames = games.reduce((acc, game) => acc + game.actions.filter(action => ['ron', 'tsumo', 'draw'].includes(action.type)).length, 0)

    const winRate = games.reduce((acc, game) => {
        return acc + game.actions.reduce((acc, action) => {
            if (action.type === 'ron' && player in action.scores) {
                return acc + 1
            } else if (action.type === 'tsumo' && action.winner === player) {
                return acc + 1
            }
            return acc
        }, 0)
    }, 0) / totalGames

    const tsumoRate = games.reduce((acc, game) => {
        return acc + game.actions.reduce((acc, action) => {
            if (action.type === 'tsumo' && action.winner === player) {
                return acc + 1
            }
            return acc
        }, 0)
    }, 0) / totalGames

    const dealInRate = games.reduce((acc, game) => {
        return acc + game.actions.reduce((acc, action) => {
            if (action.type === 'ron' && action.loser === player) {
                return acc + 1
            }
            return acc
        }, 0)
    }, 0) / totalGames

    // [riichi A, ron A->B, //  riichi B, riichi C, tsumo C]

    const riichiRate = games.reduce((acc, game) => {
        let riichiCount = 0
        let isRiichi = false
        for (const action of game.actions) {
            switch (action.type) {
                case 'riichi': {
                    isRiichi ||= player === action.player
                    break
                }
                case 'ron':
                case 'tsumo':
                case 'draw':
                    riichiCount += 1
                    isRiichi = false
            }
        }
        return acc + riichiCount
    }, 0) / totalGames

    const bustingRate = games.reduce((acc, game) => {
        const state = gameStates[game.id]

        if (state.match.state === 'ENDED') {
            for (const result of state.players) {
                if (result.user === player && result.score < 0) {
                    return acc + 1
                }
            }
        }
        return acc
    }, 0) / games.length
    // } | {
    // 	type: 'draw'
    // 	tenpai: string[]
    // } | {

    const drawTenpaiRate = games.reduce((acc, game) => {
        return acc + game.actions.reduce((acc, action) => {
            if (action.type === 'draw') {
                if (action.tenpai.includes(player)) {
                    return acc + 1
                }
            }
            return acc
        }, 0)
    }, 0) / games.reduce((acc, game) => {
        return acc + game.actions.reduce((acc, action) => {
            if (action.type === 'draw') {
                return acc + 1
            }
            return acc
        }, 0)
    }, 0)

    const exhaustiveDrawRate = games.reduce((acc, game) => {
        return acc + game.actions.reduce((acc, action) => {
            if (action.type === 'draw') {
                return acc + 1
            }
            return acc
        }, 0)
    }, 0) / totalGames

    const [totalWinScore, totalWins] = games.reduce((acc, game) => {
        const [totalWinScore, totalWins] = game.actions.reduce(([accWinScore, accWins], action) => {
            if (action.type === 'ron' && player in action.scores) {
                return [accWinScore + action.scores[player], accWins + 1]
            } else if (action.type === 'tsumo' && action.winner === player) {
                return [accWinScore + action.scores[player], accWins + 1]
            }
            return [accWinScore, accWins]
        }, [0,0])
        return [acc[0] + totalWinScore, acc[1] + totalWins]
    }, [0, 0])

    const averageWinScore = totalWinScore / totalWins

    const averageRank = games.reduce((acc, game) => {
        const state = gameStates[game.id]
        if (state.match.state !== 'ENDED') {
            return acc
        }
        const playerScore = state.players.find((other: any) => other.user.id === player).score
        const rank = state.players.reduce((acc: number, other: any) => {
            if (other.score > playerScore) {
                return acc + 1
            }
            return acc
        }, 1)

        return acc + rank
    }, 0) / games.length

    const [totalDealInScore, totalRonned] = games.reduce((acc, game) => {
        const state = gameStates[game.id]
        const [dealInScorePerGame, ronnedPerGame] = state.history.reduce(([accDealInScore, accRonned]: any, round: { round: number, repeat: number, action: string; result: any[]; }) => {
            if (round.action !== 'ron') {
                return [accDealInScore, accRonned]
            }
            console.log("round.result")
            console.log(round.result)
            const playerScore = round.result.find((result) => result.player === player).score
            if (playerScore < 0) {
                return [accDealInScore - playerScore, accRonned + 1]
            }
            return [accDealInScore, accRonned]
        }, [0, 0])
        return [acc[0] + dealInScorePerGame, acc[1] + ronnedPerGame]
    }, [0, 0])

    const averageDealInScore = totalDealInScore / totalRonned

    return {
        recordedMatches,
        winRate,
        tsumoRate,
        dealInRate,
        riichiRate,
        bustingRate,
        drawTenpaiRate,
        exhaustiveDrawRate,
        averageWinScore,
        averageRank,
        averageDealInScore
    }
}