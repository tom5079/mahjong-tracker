type Scoring<T> = [string, [string, T][] | T][]

type TsumoScoring = {
    fromDealer: number,
    fromNonDealer: number
}

export type ScoringSheet = {
    dealer: {
        ron: Scoring<number>,
        tsumo: Scoring<TsumoScoring>
    },
    nonDealer: {
        ron: Scoring<number>,
        tsumo: Scoring<TsumoScoring>
    }
}
export function generateScoringSheet(kiriage: boolean, fixed30fu: boolean, tsumozon: boolean): ScoringSheet {
    const scoringSheet: ScoringSheet = {
        dealer: {
            ron: [
                ['Mangan', 12000],
                ['Haneman', 18000],
                ['Baiman', 24000],
                ['Sanbaiman', 36000],
                ['Yakuman', 48000],
                ['NibaiYakuman', 96000],
                ['SanbaiYakuman', 144000],
                ['YonbaiYakuman', 192000],
                ['GobaiYakuman', 240000],
                ['RokubaiYakuman', 288000]
            ],
            tsumo: tsumozon ? [
                ['Mangan', { fromDealer: 0, fromNonDealer: 4000 }],
                ['Haneman', { fromDealer: 0, fromNonDealer: 6000 }],
                ['Baiman', { fromDealer: 0, fromNonDealer: 8000 }],
                ['Sanbaiman', { fromDealer: 0, fromNonDealer: 12000 }],
                ['Yakuman', { fromDealer: 0, fromNonDealer: 16000 }],
                ['NibaiYakuman', { fromDealer: 0, fromNonDealer: 32000 }],
                ['SanbaiYakuman', { fromDealer: 0, fromNonDealer: 48000 }],
                ['YonbaiYakuman', { fromDealer: 0, fromNonDealer: 64000 }],
                ['GobaiYakuman', { fromDealer: 0, fromNonDealer: 80000 }],
                ['RokubaiYakuman', { fromDealer: 0, fromNonDealer: 96000 }]
            ] : [
                ['Mangan', { fromDealer: 0, fromNonDealer: 6000 }],
                ['Haneman', { fromDealer: 0, fromNonDealer: 9000 }],
                ['Baiman', { fromDealer: 0, fromNonDealer: 12000 }],
                ['Sanbaiman', { fromDealer: 0, fromNonDealer: 18000 }],
                ['Yakuman', { fromDealer: 0, fromNonDealer: 24000 }],
                ['NibaiYakuman', { fromDealer: 0, fromNonDealer: 48000 }],
                ['SanbaiYakuman', { fromDealer: 0, fromNonDealer: 72000 }],
                ['YonbaiYakuman', { fromDealer: 0, fromNonDealer: 96000 }],
                ['GobaiYakuman', { fromDealer: 0, fromNonDealer: 120000 }],
                ['RokubaiYakuman', { fromDealer: 0, fromNonDealer: 144000 }]
            ]
        },
        nonDealer: {
            ron: [
                ['Mangan', 8000],
                ['Haneman', 12000],
                ['Baiman', 16000],
                ['Sanbaiman', 24000],
                ['Yakuman', 32000],
                ['NibaiYakuman', 64000],
                ['SanbaiYakuman', 96000],
                ['YonbaiYakuman', 128000],
                ['GobaiYakuman', 160000],
                ['RokubaiYakuman', 192000]
            ],
            tsumo: tsumozon ? [
                ['Mangan', { fromDealer: 4000, fromNonDealer: 2000 }],
                ['Haneman', { fromDealer: 6000, fromNonDealer: 3000 }],
                ['Baiman', { fromDealer: 8000, fromNonDealer: 4000 }],
                ['Sanbaiman', { fromDealer: 12000, fromNonDealer: 6000 }],
                ['Yakuman', { fromDealer: 16000, fromNonDealer: 8000 }],
                ['NibaiYakuman', { fromDealer: 32000, fromNonDealer: 16000 }],
                ['SanbaiYakuman', { fromDealer: 48000, fromNonDealer: 24000 }],
                ['YonbaiYakuman', { fromDealer: 64000, fromNonDealer: 32000 }],
                ['GobaiYakuman', { fromDealer: 80000, fromNonDealer: 40000 }],
                ['RokubaiYakuman', { fromDealer: 96000, fromNonDealer: 48000 }]
            ] : [
                ['Mangan', { fromDealer: 5000, fromNonDealer: 3000 }],
                ['Haneman', { fromDealer: 7500, fromNonDealer: 4500 }],
                ['Baiman', { fromDealer: 10000, fromNonDealer: 6000 }],
                ['Sanbaiman', { fromDealer: 15000, fromNonDealer: 9000 }],
                ['Yakuman', { fromDealer: 20000, fromNonDealer: 12000 }],
                ['NibaiYakuman', { fromDealer: 40000, fromNonDealer: 24000 }],
                ['SanbaiYakuman', { fromDealer: 60000, fromNonDealer: 36000 }],
                ['YonbaiYakuman', { fromDealer: 80000, fromNonDealer: 48000 }],
                ['GobaiYakuman', { fromDealer: 100000, fromNonDealer: 60000 }],
                ['RokubaiYakuman', { fromDealer: 120000, fromNonDealer: 72000 }],
            ]
        }
    }

    for (let han = 4; han >= 1; han--) {
        if (fixed30fu && han === 4 && kiriage) {
            continue
        }

        const hanKey = `${han} Han`

        const fuSheet: {
            dealerRon: [string, number][],
            dealerTsumo: [string, TsumoScoring][],
            nonDealerRon: [string, number][],
            nonDealerTsumo: [string, TsumoScoring][]
        } = {
            dealerRon: [],
            dealerTsumo: [],
            nonDealerRon: [],
            nonDealerTsumo: []
        }

        for (const fu of [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]) {
            if ((han === 1 && fu < 30) || (han === 2 && fu === 25)) {
                continue
            }

            const fuKey = `${fu} Fu`

            if (
                han === 4 && fu >= (kiriage ? 30 : 40) ||
                han === 3 && fu >= (kiriage ? 60 : 70)
            ) {
                fuSheet.dealerRon.push([fuKey, scoringSheet.dealer.ron.find(x => x[0] === 'Mangan')![1] as number])
                fuSheet.dealerTsumo.push([fuKey, scoringSheet.dealer.tsumo.find(x => x[0] === 'Mangan')![1] as TsumoScoring])
                fuSheet.nonDealerRon.push([fuKey, scoringSheet.nonDealer.ron.find(x => x[0] === 'Mangan')![1] as number])
                fuSheet.nonDealerTsumo.push([fuKey, scoringSheet.nonDealer.tsumo.find(x => x[0] === 'Mangan')![1] as TsumoScoring])
                continue
            }

            if (fu > 20) {
                fuSheet.dealerRon.push([fuKey, Math.ceil(fu * Math.pow(2, han + 2) * 6 / 100) * 100])
                fuSheet.nonDealerRon.push([fuKey, Math.ceil(fu * Math.pow(2, han + 2) * 4 / 100) * 100])
            }
            fuSheet.dealerTsumo.push([fuKey, tsumozon ? {
                fromDealer: 0,
                fromNonDealer: Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100
            } : {
                fromDealer: 0,
                fromNonDealer: Math.ceil((
                    Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100 +
                    Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100 / 2
                ) / 100) * 100
            }])
            fuSheet.nonDealerTsumo.push([fuKey, tsumozon ? {
                fromDealer: Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100,
                fromNonDealer: Math.ceil(fu * Math.pow(2, han + 2) * 1 / 100) * 100
            } : {
                fromDealer: Math.ceil((
                    Math.ceil(fu * Math.pow(2, han + 2) * 2 / 100) * 100 +
                    Math.ceil(fu * Math.pow(2, han + 2) * 1 / 100) * 100 / 2
                ) / 100) * 100,
                fromNonDealer: Math.ceil((
                    Math.ceil(fu * Math.pow(2, han + 2) * 1 / 100) * 100 +
                    Math.ceil(fu * Math.pow(2, han + 2) * 1 / 100) * 100 / 2
                ) / 100) * 100
            }])
        }

        if (fixed30fu) {
            scoringSheet.dealer.ron.unshift([hanKey, fuSheet.dealerRon.find(x => x[0] === '30 Fu')![1]])
            scoringSheet.dealer.tsumo.unshift([hanKey, fuSheet.dealerTsumo.find(x => x[0] === '30 Fu')![1]])
            scoringSheet.nonDealer.ron.unshift([hanKey, fuSheet.nonDealerRon.find(x => x[0] === '30 Fu')![1]])
            scoringSheet.nonDealer.tsumo.unshift([hanKey, fuSheet.nonDealerTsumo.find(x => x[0] === '30 Fu')![1]])
        } else {
            scoringSheet.dealer.ron.unshift([hanKey, fuSheet.dealerRon])
            scoringSheet.dealer.tsumo.unshift([hanKey, fuSheet.dealerTsumo])
            scoringSheet.nonDealer.ron.unshift([hanKey, fuSheet.nonDealerRon])
            scoringSheet.nonDealer.tsumo.unshift([hanKey, fuSheet.nonDealerTsumo])
        }

    }

    return scoringSheet
}