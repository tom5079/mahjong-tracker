import { DateTime } from "luxon"
import type { ScoringSheet } from "./scoring"

export function validateUma(uma: any): uma is PrismaJson.Uma {
    if (uma == null || typeof uma !== 'object') {
        return false
    }

    return (uma.type === 'simple' && Array.isArray(uma.uma) && uma.uma.length === 4 && uma.uma.every((x: any) => typeof x === 'number')) ||
        (uma.type === 'floating' &&
            Array.isArray(uma.A) && Array.isArray(uma.B) && Array.isArray(uma.C) &&
            uma.A.length === 4 && uma.B.length === 4 && uma.C.length === 4 &&
            [...uma.A, ...uma.B, ...uma.C].every((x) => typeof x === 'number'))
}

export function validateScoring(scoring: any): scoring is {
    kiriage: boolean,
    fixed30fu: boolean,
    tsumozon: boolean
} {
    return scoring != null &&
        typeof scoring === 'object' &&
        typeof scoring.kiriage === 'boolean' &&
        typeof scoring.fixed30fu === 'boolean' &&
        typeof scoring.tsumozon === 'boolean'
}

export function validateChonbo(chonbo: any, scoring: ScoringSheet): chonbo is PrismaJson.Chonbo {
    return chonbo != null &&
        typeof chonbo === 'object' &&
        (chonbo.type === 'score' && typeof chonbo.name === 'string' && scoring.dealer.tsumo.some(([name]) => name === chonbo.name)) ||
        (chonbo.type === 'fixed' && typeof chonbo.point === 'number' && chonbo.point >= 0 && chonbo.point % 100 === 0) ||
        (chonbo.type === 'custom' && typeof chonbo.dealer === 'object' && typeof chonbo.nonDealer === 'object' &&
            typeof chonbo.dealer.toDealer === 'number' &&
            typeof chonbo.dealer.toNonDealer === 'number' &&
            typeof chonbo.nonDealer.toDealer === 'number' &&
            typeof chonbo.nonDealer.toNonDealer === 'number' &&
            (chonbo.dealer.toDealer === 0 && chonbo.dealer.toNonDealer >= 0 && chonbo.nonDealer.toDealer >= 0 && chonbo.nonDealer.toNonDealer >= 0) &&
            (chonbo.dealer.toNonDealer % 100 === 0 && chonbo.nonDealer.toDealer % 100 === 0 && chonbo.nonDealer.toNonDealer % 100 === 0)
        )
}

export function validateJoinPolicy(joinPolicy: any): joinPolicy is PrismaJson.EventJoinPolicy {
    return joinPolicy != null &&
        typeof joinPolicy === 'object' &&
        (joinPolicy.type === 'manual' ||
            (joinPolicy.type === 'auto' &&
                (joinPolicy.until == null ||
                    (DateTime.fromISO(joinPolicy.until).isValid &&
                        DateTime.fromISO(joinPolicy.until).toUnixInteger() === 0 &&
                        DateTime.fromISO(joinPolicy.until) > DateTime.now()))))
}

function checkObjectSN(object: any, max: number | undefined = undefined): object is { [key: string]: number } {
    return object != null && typeof object === 'object' && Object.entries(object).every(([k, v]) => typeof k === 'string' && v != 'number')
        && (max == null || Object.entries(object).length <= max)
}

function checkArrayS(array: any, max: number | undefined): array is string[] {
    return array != null && Array.isArray(array) && array.every((x) => typeof x === 'string')
        && (max == null || array.length <= max)
}

export function sanitizeTimerAction(action: any): PrismaJson.TimerAction | null {
    if (action == null || typeof action !== 'object' || typeof action.type !== 'string') {
        return null
    }

    if (['start', 'pause', 'resume', 'end'].includes(action.type)) {
        return { type: action.type }
    }

    return null
}

export function sanitizeAction(action: any): PrismaJson.Action | null {
    if (action == null || typeof action !== 'object' || typeof action.type !== 'string') {
        return null
    }

    switch (action.type) {
        case 'end':
            if (typeof action.at !== 'string') {
                return null
            }
            return { type: 'end' }
        case 'riichi':
            if (typeof action.player !== 'string') {
                return null
            }

            return { type: 'riichi', player: action.player }
        case 'ron':
            if (typeof action.loser !== 'string') {
                return null
            }

            if (!checkObjectSN(action.scores, 4)) {
                return null
            }

            return { type: 'ron', loser: action.loser, scores: action.scores }
        case 'tsumo':
            if (typeof action.winner !== 'string') {
                return null
            }

            if (!checkObjectSN(action.scores, 4)) {
                return null
            }

            return { type: 'tsumo', winner: action.winner, scores: action.scores }
        case 'draw':
            console.log(action.tenpai)
            if (!checkArrayS(action.tenpai, 4)) {
                return null
            }

            return { type: 'draw', tenpai: action.tenpai }
        case 'chonbo':
            if (typeof action.player !== 'string') {
                return null
            }

            return { type: 'chonbo', player: action.player }
        case 'nagashi':
            if (!checkArrayS(action.players, 4)) {
                return null
            }

            return { type: 'nagashi', players: action.players }
        case 'oyaNagashi':
            return { type: 'oyaNagashi' }
        default:
            return null
    }
}

export function validateAction(action: any): action is PrismaJson.Action {
    return action != null &&
        typeof action === 'object' &&
        typeof action.type === 'string' &&
        ((action.type === 'riichi' && typeof action.player === 'string') ||
            (action.type === 'chonbo' && typeof action.player === 'string') ||
            (action.type === 'draw' && Array.isArray(action.tenpai) && action.tenpai.every((x: any) => typeof x === 'string')) ||
            (action.type === 'nagashi' && Array.isArray(action.players) && action.players.every((x: any) => typeof x === 'string')) ||
            (action.type === 'oyaNagashi') ||
            (action.type === 'ron' && typeof action.loser === 'string' && typeof action.scores === 'object' && Object.entries(action.scores).every(([k, v]) => typeof k === 'string' && typeof v === 'number')) ||
            (action.type === 'tsumo' && typeof action.winner === 'string' && typeof action.scores === 'object' && Object.entries(action.scores).every(([k, v]) => typeof k === 'string' && typeof v === 'number')) ||
            (action.type === 'start' && typeof action.at === 'string' && DateTime.fromISO(action.at).isValid) ||
            (action.type === 'resume' && typeof action.at === 'string' && DateTime.fromISO(action.at).isValid) ||
            (action.type === 'pause' && typeof action.at === 'string' && DateTime.fromISO(action.at).isValid)) ||
        (action.type === 'end' && typeof action.at === 'string' && DateTime.fromISO(action.at).isValid)
}