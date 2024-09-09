import { wrapCatching } from "$lib/result"
import type { Ruleset, User } from "@prisma/client"

export type State = {
    round: number
    match: {
        state: 'RUNNING'
    } | {
        state: 'ENDED'
        result: {
            player: string
            soten: number
            penalty: number
        }[]
    },
    richi: number
    repeat: number
    players: {
        user: User
        score: number
        penalty: number
        wind: number
        richi: boolean
    }[]
    history: {
        round: number
        repeat: number
        action: 'ron' | 'tsumo' | 'draw' | 'chonbo'
        result: {
            player: string
            wind: number
            score?: number
            richi?: boolean
            chonbo?: boolean
        }[]
    }[]
}

function rotate<T>(array: T[], shift: number): T[] {
    const copy = array.slice()

    for (let i = 0; i < array.length; i++) {
        copy[(i + shift) % array.length] = array[i]
    }

    return copy
}

export function canPassDealership(
    { ruleset, state, actions }: {
        ruleset: Ruleset,
        state: State,
        actions: PrismaJson.Actions
    }
): boolean {
    const dealer = state.players.find(it => it.wind === 0)

    if (dealer == null) {
        throw new Error('Dealer not found')
    }

    const isLastRound = state.round === (ruleset.length === 'TONPU' ? 3 : 7)
    const dealerPlacement = state.players.reduce((acc, player) => acc + (player.score > dealer.score ? 1 : 0), 1)

    if (!(ruleset.oyaNagashi || isLastRound && dealerPlacement <= (ruleset.allLastPlacement ?? 0))) {
        return false
    }

    const lastAction = actions.findLast(it =>
        it.type === 'ron'
        || it.type === 'tsumo'
        || (
            (ruleset.oyaNagashi || ruleset.allLast === 'TENPAIYAME')
            && it.type === 'draw'
        )
    )

    if (lastAction == null) {
        return false
    }

    switch (lastAction.type) {
        case 'ron':
            return !!lastAction.scores[dealer.user.id]
        case 'tsumo':
            return lastAction.winner === dealer.user.id
        case 'draw':
            return lastAction.tenpai.includes(dealer.user.id)
    }

    return false
}

export function calculateRonPayment(
    { ruleset, state, loser, scores }: {
        ruleset: Ruleset,
        state: State,
        loser: string,
        scores: Record<string, number>
    }
): Record<string, {
    payment: number,
    fromPot: number
}> {
    const loserIndex = state.players.findIndex(it => it.user.id === loser)

    if (loserIndex === -1) {
        throw new Error('Loser not found')
    }

    const sortedScores = Object.entries(scores).map<[string, number, number]>(([winner, score]) => {
        const winnerIndex = state.players.findIndex(x => x.user.id === winner)

        if (winnerIndex === -1) {
            throw new Error('Winner not found')
        }

        const distance = (winnerIndex - loserIndex + state.players.length) % state.players.length

        return [winner, score, distance]
    }).sort((a, b) => a[2] - b[2])

    const payments: Record<string, {
        payment: number,
        fromPot: number
    }> = {}

    let totalHonba = state.repeat * ruleset.honba
    let totalPot = state.richi * 1000

    for (const [index, [winner, score]] of sortedScores.entries()) {
        if (!score) {
            continue
        }

        const player = state.players.find(it => it.user.id === winner)

        if (player == null) {
            throw new Error('Player not found')
        }

        let payment = score
        let pot = 0

        switch (ruleset.multiRonHonbaPolicy) {
            case 'ALL':
                payment += state.repeat * ruleset.honba
                break
            case 'ATAMAHANE':
                payment += index === 0 ? totalHonba : 0
                break
            case 'SPLIT': {
                const pointsToTake = Math.ceil(totalHonba / (scores.length - index) / 100) * 100
                totalHonba -= pointsToTake
                payment += pointsToTake
                break
            }
        }

        switch (ruleset.multiRonPotPolicy) {
            case 'ATAMAHANE':
                pot += index === 0 ? totalPot : 0
                break
            case 'SPLIT': {
                const pointsToTake = Math.ceil(totalPot / (scores.length - index) / 100) * 100
                totalPot -= pointsToTake
                pot += pointsToTake
                break
            }
        }

        payments[winner] = {
            payment,
            fromPot: pot
        }
    }

    return payments
}

export const calculateTsumoPayment = (
    { ruleset, state, scores }: {
        ruleset: Ruleset,
        state: State,
        scores: Record<string, number>
    }
): {
    payments: Record<string, number>,
    fromPot: number
} => {
    const player = ruleset.player === 'FOUR' ? 3 : 2
    const honba = state.repeat * ruleset.honba / player
    const pot = state.richi * 1000

    return {
        payments: Object.fromEntries(
            Object.entries(scores).map(([loser, score]) => {
                const payment = score + honba
                return [loser, payment]
            })
        ),
        fromPot: pot
    }
}

export const computeState = wrapCatching(({ user, players, ruleset, actions }: { user?: User | null, players: User[], ruleset: Ruleset, actions: PrismaJson.Actions }): State => {
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

    const playerShiftIndex = players.findIndex(x => x.id === user?.id)

    const state: State = {
        round: 0,
        match: {
            state: 'RUNNING'
        },
        richi: 0,
        repeat: 0,
        players: rotate(players.map((user, i) => ({
            user,
            score: ruleset.startScore,
            penalty: 0,
            wind: i,
            richi: false
        })), players.length - playerShiftIndex),
        history: []
    }

    for (const action of actions) {
        if (state.match.state === 'ENDED') {
            throw new Error('Game has already ended')
        }

        switch (action.type) {
            case 'riichi': {
                const player = state.players.find(x => x.user.id === action.player)

                if (player == null) {
                    throw new Error('Player not found')
                }

                if (!ruleset.riichiBelow1000 && player.score < 1000) {
                    throw new Error('Player has insufficient score')
                }

                player.richi = true
                player.score -= 1000
                state.richi++

                break
            }
            case 'ron': {
                const loser = state.players.find(x => x.user.id === action.loser)

                if (loser == null) {
                    throw new Error('Player not found')
                }

                const scoreLength = Object.keys(action.scores).length

                if (scoreLength === 0) {
                    throw new Error('Invalid scores')
                }

                if (!ruleset.doubleRon && scoreLength === 2) {
                    throw new Error('Double Ron not allowed')
                }

                if (!ruleset.tripleRon && scoreLength === 3) {
                    throw new Error('Triple Ron not allowed')
                }

                if (
                    (ruleset.player === 'FOUR' && scoreLength > 3) ||
                    (ruleset.player === 'THREE' && scoreLength > 2)
                ) {
                    throw new Error('Invalid number of scores')
                }

                const payments = calculateRonPayment({
                    ruleset,
                    state,
                    loser: action.loser,
                    scores: action.scores
                })

                state.history.push({
                    round: state.round,
                    repeat: state.repeat,
                    action: 'ron',
                    result: state.players.map(player => ({
                        player: player.user.id,
                        score: (player.user.id === action.loser
                            ? -Object.entries(payments).reduce((acc, [, { payment }]) => acc + payment, 0)
                            : (payments[player.user.id]?.payment ?? 0) + (payments[player.user.id]?.fromPot ?? 0))
                            - (player.richi ? 1000 : 0),
                        wind: player.wind,
                        richi: player.richi,
                        chonbo: false
                    }))
                })

                let repeat = false

                for (const [winner, { payment, fromPot }] of Object.entries(payments)) {
                    const player = state.players.find(x => x.user.id === winner)

                    if (player == null) {
                        throw new Error('Player not found')
                    }

                    if (player.wind === 0) {
                        repeat = true
                    }

                    player.score += payment + fromPot
                    loser.score -= payment
                }
                state.richi = 0
                state.repeat = repeat ? state.repeat + 1 : 0
                state.round = repeat ? state.round : state.round + 1

                for (const player of state.players) {
                    if (!repeat) {
                        player.wind = (player.wind - 1 + state.players.length) % state.players.length
                    }
                    player.richi = false
                }

                break
            }
            case 'tsumo': {
                const winner = state.players.find(x => x.user.id === action.winner)

                if (winner == null) {
                    throw new Error('Player not found')
                }

                if (
                    action.scores.length === 0 ||
                    (ruleset.player === 'FOUR' && Object.keys(action.scores).length !== 3) ||
                    (ruleset.player === 'THREE' && Object.keys(action.scores).length !== 2)) {
                    throw new Error('Invalid scores')
                }

                const payments = calculateTsumoPayment({
                    ruleset,
                    state,
                    scores: action.scores
                })

                state.history.push({
                    round: state.round,
                    repeat: state.repeat,
                    action: 'tsumo',
                    result: state.players.map(player => ({
                        player: player.user.id,
                        score: (player.user.id === action.winner
                            ? Object.entries(payments.payments).reduce((acc, [, payment]) => acc + payment, 0) + payments.fromPot
                            : -payments.payments[player.user.id])
                            - (player.richi ? 1000 : 0),
                        wind: player.wind,
                        richi: player.richi,
                        chonbo: false
                    }))
                })

                for (const [loser, payment] of Object.entries(payments.payments)) {
                    const player = state.players.find(x => x.user.id === loser)

                    if (player == null) {
                        throw new Error('Player not found')
                    }

                    player.score -= payment
                    winner.score += payment
                }
                winner.score += payments.fromPot

                const repeat = winner.wind === 0

                state.richi = 0
                state.repeat = repeat ? state.repeat + 1 : 0
                state.round = repeat ? state.round : state.round + 1

                for (const player of state.players) {
                    if (!repeat) {
                        player.wind = (player.wind - 1 + state.players.length) % state.players.length
                    }
                    player.richi = false
                }

                break
            }
            case 'draw': {
                const player = ruleset.player === 'FOUR' ? 4 : 3
                const tenpaiFeeReceived =
                    action.tenpai.length === 0 || action.tenpai.length === player
                        ? 0
                        : ruleset.tenpaiFee / action.tenpai.length

                const tenpaiFeePaid =
                    action.tenpai.length === 0 || action.tenpai.length === player
                        ? 0
                        : ruleset.tenpaiFee / (player - action.tenpai.length)

                state.history.push({
                    round: state.round,
                    repeat: state.repeat,
                    action: 'draw',
                    result: state.players.map(player => ({
                        player: player.user.id,
                        score: (action.tenpai.includes(player.user.id)
                            ? tenpaiFeeReceived
                            : -tenpaiFeePaid)
                            - (player.richi ? 1000 : 0),
                        wind: player.wind,
                        richi: player.richi,
                        chonbo: false
                    }))
                })

                for (const player of state.players) {
                    if (action.tenpai.includes(player.user.id)) {
                        player.score += tenpaiFeeReceived
                    } else {
                        player.score -= tenpaiFeePaid
                    }

                    player.richi = false
                }

                const eastPlayer = state.players.find(x => x.wind === 0)

                if (eastPlayer == null) {
                    throw new Error('East player not found')
                }

                const repeat = action.tenpai.includes(eastPlayer.user.id)

                state.round = repeat ? state.round : state.round + 1
                state.repeat += 1

                for (const player of state.players) {
                    if (!repeat) {
                        player.wind = (player.wind - 1 + state.players.length) % state.players.length
                    }
                    player.richi = false
                }

                break
            }
            case 'chonbo': {
                const affectsScore = ruleset.chonbo.affectsScore
                const chonbo = ruleset.chonbo

                const player = state.players.find(x => x.user.id === action.player)

                if (player == null) {
                    throw new Error('Player not found')
                }

                const points: Record<string, number> = Object.fromEntries(
                    state.players.map(player => [player.user.id, 0])
                )

                switch (chonbo.type) {
                    case 'score': {
                        const score = player.wind === 0 ?
                            ruleset.scores.dealer.tsumo.find(([name]) => name === chonbo.name)?.[1] :
                            ruleset.scores.nonDealer.tsumo.find(([name]) => name === chonbo.name)?.[1]

                        if (score == null || Array.isArray(score)) {
                            throw new Error('Chonbo score not found')
                        }

                        if (affectsScore) {
                            for (const other of state.players) {
                                if (other.user.id === player.user.id) {
                                    continue
                                } else if (other.wind === 0) {
                                    points[player.user.id] -= score.fromDealer
                                    points[other.user.id] += score.fromDealer
                                } else {
                                    points[player.user.id] -= score.fromNonDealer
                                    points[other.user.id] += score.fromNonDealer
                                }
                            }
                        } else {
                            for (const other of state.players) {
                                if (other.user.id === player.user.id) {
                                    continue
                                } else if (other.wind === 0) {
                                    player.penalty += score.fromDealer
                                } else {
                                    player.penalty += score.fromNonDealer
                                }
                            }
                        }

                        break
                    }
                    case 'fixed': {
                        if (affectsScore) {
                            for (const other of state.players) {
                                if (other.user.id === player.user.id) {
                                    continue
                                } else {
                                    points[other.user.id] += chonbo.point
                                    points[player.user.id] -= chonbo.point
                                }
                            }
                        } else {
                            for (const other of state.players) {
                                if (other.user.id === player.user.id) {
                                    continue
                                } else {
                                    player.penalty += chonbo.point
                                }
                            }
                        }

                        break
                    }
                    case 'custom': {
                        if (affectsScore) {
                            const score = player.wind === 0 ? chonbo.dealer : chonbo.nonDealer

                            for (const other of state.players) {
                                if (other.user.id === player.user.id) {
                                    continue
                                } else if (other.wind === 0) {
                                    points[other.user.id] += score.toDealer
                                    points[player.user.id] -= score.toDealer
                                } else {
                                    points[other.user.id] += score.toNonDealer
                                    points[player.user.id] -= score.toNonDealer
                                }
                            }
                        } else {
                            const score = player.wind === 0 ? chonbo.dealer : chonbo.nonDealer

                            for (const other of state.players) {
                                if (other.user.id === player.user.id) {
                                    continue
                                } else if (other.wind === 0) {
                                    player.score += score.toNonDealer
                                }
                            }
                        }

                        break
                    }
                }

                state.history.push({
                    round: state.round,
                    repeat: state.repeat,
                    action: 'chonbo',
                    result: state.players.map(player => ({
                        player: player.user.id,
                        score: points[player.user.id],
                        wind: player.wind,
                        richi: false,
                        chonbo: player.user.id === action.player
                    }))
                })

                for (const player of state.players) {
                    player.score += points[player.user.id]

                    if (player.richi) {
                        player.score += 1000
                        state.richi--
                        player.richi = false
                    }
                }

                break
            }
            case 'oyaNagashi': {
                if (!canPassDealership({ ruleset, state, actions })) {
                    throw new Error('Cannot pass dealership')
                }

                state.round = state.round + 1
                state.repeat = 0

                for (const player of state.players) {
                    player.wind = (player.wind - 1 + state.players.length) % state.players.length

                    if (player.richi) {
                        player.score += 1000
                        state.richi--
                    }

                    player.richi = false
                }

                break
            }
        }

        let done = action.type === 'end'

        const endRound = ruleset.length === 'TONPU' ? 4 : 8
        if (state.round >= endRound) {
            done = state.players.some(player => player.score >= (ruleset.suddenDeath || 0))
        }

        done ||= !!ruleset.calledGame && state.players.some(player => player.score >= ruleset.calledGame!)

        done ||= ruleset.tobi && state.players.some(player => player.score < 0 || (ruleset.tobiAtZero && player.score === 0))

        if (done) {
            if (ruleset.endgamePot === 'TOP') {
                let topPlayer = state.players[0]
                for (const player of state.players) {
                    if (player.score > topPlayer.score) {
                        topPlayer = player
                    }
                }

                topPlayer.score += state.richi * 1000
                state.richi = 0
            }

            let uma: [number, number, number, number]
            if (ruleset.uma.type === 'simple') {
                uma = ruleset.uma.uma
            } else {
                const floating = state.players.reduce((acc, player) => acc + (player.score > ruleset.startScore ? 1 : 0), 0)

                switch (floating) {
                    case 1:
                        uma = ruleset.uma.A
                        break
                    case 2:
                        uma = ruleset.uma.B
                        break
                    default:
                        uma = ruleset.uma.C
                        break
                }
            }
            state.match = {
                state: 'ENDED',
                result: state.players.toSorted((a, b) => b.score - a.score).map((player, i) => ({
                    player: player.user.id,
                    soten: Math.round((player.score
                        - ruleset.returnScore
                        + (i === 0 ? (ruleset.player === 'FOUR' ? 4 : 3) * (ruleset.returnScore - ruleset.startScore) : 0)
                    ) / 100 + uma[i] * 10),
                    penalty: player.penalty
                }))
            }
        }
    }

    return state
})