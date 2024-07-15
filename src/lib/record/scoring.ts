export type Scoring = {
    ron: (han: number, fu: number) => number,
    tsumo: (han: number, fu: number) => {
        fromDealer: number,
        fromNonDealer: number
    },
    draw: number,
    nagashi: () => {
        fromDealer: number,
        fromNonDealer: number
    },
    specialRon: Record<string, number>
    specialTsumo: Record<string, {
        fromDealer: number,
        fromNonDealer: number
    }>
}

export const StandardNonDealer: Scoring = {
    ron: (han, fu) => {
        if (han >= 13) { return StandardNonDealer.specialRon.Yakuman }
        if (han >= 11) { return StandardNonDealer.specialRon.Sanbaiman }
        if (han >= 8) { return StandardNonDealer.specialRon.Baiman }
        if (han >= 6) { return StandardNonDealer.specialRon.Haneman }
        if (han >= 5) { return StandardNonDealer.specialRon.Mangan }
        if (han === 4 && fu >= 40) { return StandardNonDealer.specialRon.Mangan }
        if (han === 3 && fu >= 70) { return StandardNonDealer.specialRon.Mangan }

        return Math.ceil(fu * Math.pow(2, han + 2) * 4 / 100) * 100
    },
    tsumo: (han, fu) => {
        if (han >= 13) { return StandardNonDealer.specialTsumo.Yakuman }
        if (han >= 11) { return StandardNonDealer.specialTsumo.Sanbaiman }
        if (han >= 8) { return StandardNonDealer.specialTsumo.Baiman }
        if (han >= 6) { return StandardNonDealer.specialTsumo.Haneman }
        if (han >= 5) { return StandardNonDealer.specialTsumo.Mangan }
        if (han === 4 && fu >= 40) { return StandardNonDealer.specialTsumo.Mangan }
        if (han === 3 && fu >= 70) { return StandardNonDealer.specialTsumo.Mangan }

        return {
            fromDealer: Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100,
            fromNonDealer: Math.ceil(fu * Math.pow(2, han + 2) * 1 / 100) * 100
        }
    },
    draw: 3000,
    nagashi: () => StandardNonDealer.specialTsumo.Mangan,
    specialRon: {
        Mangan: 8000,
        Haneman: 12000,
        Baiman: 16000,
        Sanbaiman: 24000,
        Yakuman: 36000
    },
    specialTsumo: {
        Mangan: { fromDealer: 4000, fromNonDealer: 2000 },
        Haneman: { fromDealer: 6000, fromNonDealer: 3000 },
        Baiman: { fromDealer: 8000, fromNonDealer: 4000 },
        Sanbaiman: { fromDealer: 12000, fromNonDealer: 6000 },
        Yakuman: { fromDealer: 18000, fromNonDealer: 9000 }
    }
}

export const StandardDealer: Scoring = {
    ron: (han, fu) => {
        if (han >= 13) { return StandardDealer.specialRon.Yakuman }
        if (han >= 11) { return StandardDealer.specialRon.Sanbaiman }
        if (han >= 8) { return StandardDealer.specialRon.Baiman }
        if (han >= 6) { return StandardDealer.specialRon.Haneman }
        if (han >= 5) { return StandardDealer.specialRon.Mangan }
        if (han === 4 && fu >= 40) { return StandardDealer.specialRon.Mangan }
        if (han === 3 && fu >= 70) { return StandardDealer.specialRon.Mangan }

        return Math.ceil(fu * Math.pow(2, han + 2) * 6 / 100) * 100
    },
    tsumo: (han, fu) => {
        if (han >= 13) { return StandardDealer.specialTsumo.Yakuman }
        if (han >= 11) { return StandardDealer.specialTsumo.Sanbaiman }
        if (han >= 8) { return StandardDealer.specialTsumo.Baiman }
        if (han >= 6) { return StandardDealer.specialTsumo.Haneman }
        if (han >= 5) { return StandardDealer.specialTsumo.Mangan }
        if (han === 4 && fu >= 40) { return StandardDealer.specialTsumo.Mangan }
        if (han === 3 && fu >= 70) { return StandardDealer.specialTsumo.Mangan }

        return {
            fromDealer: 0,
            fromNonDealer: Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100
        }
    },
    draw: 3000,
    nagashi: () => StandardDealer.specialTsumo.Mangan,
    specialRon: {
        Mangan: 12000,
        Haneman: 18000,
        Baiman: 24000,
        Sanbaiman: 36000,
        Yakuman: 48000
    },
    specialTsumo: {
        Mangan: { fromDealer: 0, fromNonDealer: 4000 },
        Haneman: { fromDealer: 0, fromNonDealer: 6000 },
        Baiman: { fromDealer: 0, fromNonDealer: 8000 },
        Sanbaiman: { fromDealer: 0, fromNonDealer: 12000 },
        Yakuman: { fromDealer: 0, fromNonDealer: 16000 }
    }
}

export const KiriageNonDealer: Scoring = {
    ron: (han, fu) => {
        if (han >= 13) { return KiriageNonDealer.specialRon.Yakuman }
        if (han >= 11) { return KiriageNonDealer.specialRon.Sanbaiman }
        if (han >= 8) { return KiriageNonDealer.specialRon.Baiman }
        if (han >= 6) { return KiriageNonDealer.specialRon.Haneman }
        if (han >= 5) { return KiriageNonDealer.specialRon.Mangan }
        if (han === 4 && fu >= 30) { return KiriageNonDealer.specialRon.Mangan }
        if (han === 3 && fu >= 60) { return KiriageNonDealer.specialRon.Mangan }

        return Math.ceil(fu * Math.pow(2, han + 2) * 4 / 100) * 100
    },
    tsumo: (han, fu) => {
        if (han >= 13) { return KiriageNonDealer.specialTsumo.Yakuman }
        if (han >= 11) { return KiriageNonDealer.specialTsumo.Sanbaiman }
        if (han >= 8) { return KiriageNonDealer.specialTsumo.Baiman }
        if (han >= 6) { return KiriageNonDealer.specialTsumo.Haneman }
        if (han >= 5) { return KiriageNonDealer.specialTsumo.Mangan }
        if (han === 4 && fu >= 30) { return KiriageNonDealer.specialTsumo.Mangan }
        if (han === 3 && fu >= 60) { return KiriageNonDealer.specialTsumo.Mangan }

        return {
            fromDealer: Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100,
            fromNonDealer: Math.ceil(fu * Math.pow(2, han + 2) * 1 / 100) * 100
        }
    },
    draw: 3000,
    nagashi: () => KiriageNonDealer.specialTsumo.Mangan,
    specialRon: {
        Mangan: 8000,
        Haneman: 12000,
        Baiman: 16000,
        Sanbaiman: 24000,
        Yakuman: 36000
    },
    specialTsumo: {
        Mangan: { fromDealer: 4000, fromNonDealer: 2000 },
        Haneman: { fromDealer: 6000, fromNonDealer: 3000 },
        Baiman: { fromDealer: 8000, fromNonDealer: 4000 },
        Sanbaiman: { fromDealer: 12000, fromNonDealer: 6000 },
        Yakuman: { fromDealer: 18000, fromNonDealer: 9000 }
    }
}

export const KiriageDealer: Scoring = {
    ron: (han, fu) => {
        if (han >= 13) { return KiriageDealer.specialRon.Yakuman }
        if (han >= 11) { return KiriageDealer.specialRon.Sanbaiman }
        if (han >= 8) { return KiriageDealer.specialRon.Baiman }
        if (han >= 6) { return KiriageDealer.specialRon.Haneman }
        if (han >= 5) { return KiriageDealer.specialRon.Mangan }
        if (han === 4 && fu >= 30) { return KiriageDealer.specialRon.Mangan }
        if (han === 3 && fu >= 60) { return KiriageDealer.specialRon.Mangan }

        return Math.ceil(fu * Math.pow(2, han + 2) * 6 / 100) * 100
    },
    tsumo: (han, fu) => {
        if (han >= 13) { return KiriageDealer.specialTsumo.Yakuman }
        if (han >= 11) { return KiriageDealer.specialTsumo.Sanbaiman }
        if (han >= 8) { return KiriageDealer.specialTsumo.Baiman }
        if (han >= 6) { return KiriageDealer.specialTsumo.Haneman }
        if (han >= 5) { return KiriageDealer.specialTsumo.Mangan }
        if (han === 4 && fu >= 30) { return KiriageDealer.specialTsumo.Mangan }
        if (han === 3 && fu >= 60) { return KiriageDealer.specialTsumo.Mangan }

        return {
            fromDealer: 0,
            fromNonDealer: Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100
        }
    },
    draw: 3000,
    nagashi: () => KiriageDealer.specialTsumo.Mangan,
    specialRon: {
        Mangan: 12000,
        Haneman: 18000,
        Baiman: 24000,
        Sanbaiman: 36000,
        Yakuman: 48000
    },
    specialTsumo: {
        Mangan: { fromDealer: 0, fromNonDealer: 4000 },
        Haneman: { fromDealer: 0, fromNonDealer: 6000 },
        Baiman: { fromDealer: 0, fromNonDealer: 8000 },
        Sanbaiman: { fromDealer: 0, fromNonDealer: 12000 },
        Yakuman: { fromDealer: 0, fromNonDealer: 16000 }
    }
}