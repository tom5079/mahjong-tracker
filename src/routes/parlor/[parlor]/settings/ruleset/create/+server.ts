import { generateScoringSheet } from "$lib/scoring"
import { validateCaptcha } from "$lib/server/captcha"
import prisma from "$lib/server/prisma"
import { validateChonbo, validateScoring, validateUma } from "$lib/validator"
import { AllLastPolicy, EndgamePolicy, GameLength, MultiRonHonbaPolicy, MultiRonPotPolicy, Players, Record, RenchanPolicy, TiebreakerPolicy } from "@prisma/client"
import { error } from "@sveltejs/kit"

export const POST = (async ({ params, request }) => {
    const data = await request.formData()

    if (!validateCaptcha(data.get('token')?.toString())) {
        error(400, 'Invalid captcha token')
    }

    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    const name = data.get('name')?.toString()

    if (!name || name.length < 3) {
        error(400, 'Name must be at least 3 characters long')
    }

    let player: Players
    let length: GameLength

    switch (data.get('player')?.toString()) {
        case 'four':
            player = Players.FOUR
            break
        case 'three':
            player = Players.THREE
            break
        default:
            error(400, 'Invalid player count')
    }

    switch (data.get('length')?.toString()) {
        case 'hanchan':
            length = GameLength.HANCHAN
            break
        case 'tonpu':
            length = GameLength.TONPU
            break
        default:
            error(400, 'Invalid game length')
    }

    const startScore = +(data.get('start')?.toString() ?? -1)

    if (startScore < 0) {
        error(400, 'Invalid staring score')
    }

    if (startScore % 100 !== 0) {
        error(400, 'Starting score must be a multiple of 100')
    }

    const returnScore = +(data.get('return')?.toString() ?? -1)

    if (returnScore < 0) {
        error(400, 'Invalid return score')
    }

    if (returnScore % 100 !== 0) {
        error(400, 'Return score must be a multiple of 100')
    }

    if (returnScore < startScore) {
        error(400, 'Return score must be greater than or equal to starting score')
    }

    const uma = JSON.parse(data.get('uma')?.toString() ?? '{}')

    if (!uma) {
        error(400, 'Uma must be specified')
    }

    if (!validateUma(uma)) {
        error(400, 'Invalid uma')
    }

    const scoring = JSON.parse(data.get('scoring')?.toString() ?? '{}')

    if (!validateScoring(scoring)) {
        error(400, 'Invalid scoring')
    }

    const honba = +(data.get('honba')?.toString() ?? -1)

    if (honba < 0) {
        error(400, 'Honba cannot be negative')
    }

    if (
        player === Players.FOUR && honba % 300 !== 0 ||
        player === Players.THREE && scoring.tsumozon && honba % 300 !== 0
    ) {
        error(400, 'Honba must be a multiple of 300')
    }

    if (player === Players.THREE && !scoring.tsumozon && honba % 200 !== 0) {
        error(400, 'Honba must be a multiple of 200')
    }

    const tenpaiFee = +(data.get('tenpai')?.toString() ?? -1)

    if (tenpaiFee < 0) {
        error(400, 'Tenpai fee cannot be negative')
    }

    if (player === Players.FOUR && tenpaiFee % 300 !== 0) {
        error(400, 'Tenpai fee must be a multiple of 300')
    }

    if (player === Players.THREE && tenpaiFee % 200 !== 0) {
        error(400, 'Tenpai fee must be a multiple of 200')
    }

    let endgamePot: EndgamePolicy

    switch (data.get('endgame')?.toString()) {
        case 'top':
            endgamePot = EndgamePolicy.TOP
            break
        case 'disappears':
            endgamePot = EndgamePolicy.DISAPPEARS
            break
        default:
            error(400, 'Invalid endgame policy')
    }

    let tiebreaker: TiebreakerPolicy

    switch (data.get('tiebreaker')?.toString()) {
        case 'wind':
            tiebreaker = TiebreakerPolicy.WIND
            break
        case 'split':
            tiebreaker = TiebreakerPolicy.SPLIT
            break
        default:
            error(400, 'Invalid tiebreaker policy')
    }

    let renchan: RenchanPolicy

    switch (data.get('renchan')?.toString()) {
        case 'tenpai':
            renchan = RenchanPolicy.TENPAI
            break
        case 'agari':
            renchan = RenchanPolicy.AGARI
            break
        case 'none':
            renchan = RenchanPolicy.NONE
            break
        case 'always':
            renchan = RenchanPolicy.ALWAYS
            break
        default:
            error(400, 'Invalid renchan policy')
    }

    let allLast: AllLastPolicy
    let allLastPlacement: number | null = null

    switch (data.get('alllast')?.toString()) {
        case 'agariyame':
            allLast = AllLastPolicy.AGARIYAME
            allLastPlacement = +(data.get('alllastPlacement')?.toString() ?? -1)
            break
        case 'tenpaiyame':
            allLast = AllLastPolicy.TENPAIYAME
            allLastPlacement = +(data.get('alllastPlacement')?.toString() ?? -1)
            break
        case 'none':
            allLast = AllLastPolicy.NONE
            break
        default:
            error(400, 'Invalid all last policy')
    }

    if (allLastPlacement !== null && allLastPlacement < 0) {
        error(400, 'Invalid all last placement')
    }

    const doubleRon = data.get('doubleRon')?.toString() === 'on'
    const tripleRon = data.get('tripleRon')?.toString() === 'on'
    let multiRonPotPolicy: MultiRonPotPolicy
    let multiRonHonbaPolicy: MultiRonHonbaPolicy

    switch (data.get('multiRonPot')?.toString()) {
        case 'atamahane':
            multiRonPotPolicy = MultiRonPotPolicy.ATAMAHANE
            break
        case 'split':
            multiRonPotPolicy = MultiRonPotPolicy.SPLIT
            break
        default:
            error(400, 'Invalid multi-ron pot policy')
    }

    switch (data.get('multiRonHonba')?.toString()) {
        case 'atamahane':
            multiRonHonbaPolicy = MultiRonHonbaPolicy.ATAMAHANE
            break
        case 'split':
            multiRonHonbaPolicy = MultiRonHonbaPolicy.SPLIT
            break
        case 'all':
            multiRonHonbaPolicy = MultiRonHonbaPolicy.ALL
            break
        default:
            error(400, 'Invalid multi-ron honba policy')
    }

    let record: Record

    switch (data.get('record')?.toString()) {
        case 'game':
            record = Record.GAME
            break
        case 'hand':
            record = Record.HAND
            break
        default:
            error(400, 'Invalid record policy')
    }

    const scoringSheet = generateScoringSheet(scoring)

    const nagashi = data.get('nagashi')?.toString()

    const nagashiScore = scoringSheet.dealer.tsumo.find(([name]) => name === nagashi)?.[1]

    if (nagashi == null || nagashi !== 'none' && nagashiScore == null) {
        error(400, 'Invalid nagashi')
    }

    const nagashiIsTsumo = data.get('nagashiIsTsumo')?.toString() === 'on'

    const chonbo = JSON.parse(data.get('chonbo')?.toString() ?? '{}')

    if (!validateChonbo(chonbo, scoringSheet)) {
        error(400, 'Invalid chonbo')
    }

    const suddenDeath = data.get('suddenDeath')?.toString() === 'on' ? +(data.get('suddenDeathPoint')?.toString() ?? -1) : null
    const calledGame = data.get('calledGame')?.toString() === 'on' ? +(data.get('calledGamePoint')?.toString() ?? -1) : null

    if (suddenDeath != null && suddenDeath < 0) {
        error(400, 'Invalid sudden death point')
    }

    if (calledGame != null && calledGame < 0) {
        error(400, 'Invalid called game point')
    }

    const ruleset = await prisma.ruleset.create({
        data: {
            name,
            player,
            length,
            startScore,
            returnScore,
            uma,
            honba,
            tenpaiFee,
            endgamePot,
            tiebreaker,
            renchan,
            allLast,
            allLastPlacement,
            doubleRon,
            tripleRon,
            multiRonPotPolicy,
            multiRonHonbaPolicy,
            record,
            scores: scoringSheet,
            nagashi,
            nagashiIsTsumo,
            chonbo,
            oyaNagashi: data.get('oyaNagashi')?.toString() === 'on',
            tobi: data.get('tobi')?.toString() === 'on',
            tobiAtZero: data.get('tobiAtZero')?.toString() === 'on',
            riichiBelow1000: data.get('riichiBelow1000')?.toString() === 'on',
            suddenDeath,
            calledGame,
            note: data.get('note')?.toString() ?? '',
            parlorId
        }
    })

    return new Response(JSON.stringify({ id: ruleset.id }))
})