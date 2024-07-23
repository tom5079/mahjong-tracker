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
            typeof chonbo.dealer.toNonDealer === 'number' &&
            typeof chonbo.nonDealer.toDealer === 'number' &&
            typeof chonbo.nonDealer.toNonDealer === 'number' &&
            (chonbo.dealer.toNonDealer >= 0 && chonbo.nonDealer.toDealer >= 0 && chonbo.nonDealer.toNonDealer >= 0) &&
            (chonbo.dealer.toNonDealer % 100 === 0 && chonbo.nonDealer.toDealer % 100 === 0 && chonbo.nonDealer.toNonDealer % 100 === 0)
        )
}