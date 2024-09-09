import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sanitizeAction, sanitizeTimerAction } from "$lib/validator";
import prisma from "$lib/server/prisma";
import { computeState } from "$lib/game/state";
import { validateCaptcha } from "$lib/server/captcha";
import { DateTime, Duration } from "luxon";

export const GET = (async ({ params }) => {
    const gameId = +(params.game ?? NaN);

    if (isNaN(gameId)) {
        error(404, 'Game not found')
    }

    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        },
        include: {
            event: {
                include: {
                    ruleset: true
                }
            },
            players: {
                include: {
                    user: true
                },
                orderBy: {
                    index: 'asc'
                }
            }
        }
    })

    if (game == null) {
        error(404, 'Game not found')
    }

    return json(game)
}) satisfies RequestHandler;

export const POST = (async ({ params, request }) => {
    const gameId = +(params.game ?? NaN);

    if (isNaN(gameId)) {
        error(404, 'Game not found')
    }

    const action = await request.json()

    if (!validateCaptcha(action.token)) {
        error(400, 'Invalid action')
    }

    const sanitizedAction = sanitizeTimerAction(action) || sanitizeAction(action)

    if (!sanitizedAction) {
        error(400, 'Invalid action')
    }

    await prisma.$transaction(async (tx) => {
        const game = await tx.game.findUnique({
            where: {
                id: gameId
            },
            select: {
                timer: true,
                actions: true,
                players: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        index: 'asc'
                    }
                },
                event: {
                    include: {
                        ruleset: true
                    }
                }
            }
        })

        const actions = game?.actions
        let timer = game?.timer

        if (game == null || actions == null || timer == null) {
            error(404, 'Game not found')
        }


        switch (sanitizedAction.type) {
            case 'riichi': {
                if (game.players.find(it => it.user.id === sanitizedAction.player) == null) {
                    error(400, 'Player not found')
                }

                const riichiIndex = actions.findLastIndex(it =>
                    it.type !== 'riichi' || it.player === sanitizedAction.player)

                if (riichiIndex !== -1 && actions[riichiIndex].type === 'riichi') {
                    actions.splice(riichiIndex, 1)
                    break
                }

                actions.push({
                    type: 'riichi',
                    player: sanitizedAction.player
                })
                break
            }
            case 'start': {
                if (timer.state !== 'waiting') {
                    error(400, 'Invalid action')
                }

                timer = {
                    state: 'running',
                    startedAt: DateTime.now().toISO(),
                    pausedBy: Duration.fromMillis(0).toISO()
                }
                break
            }
            case 'pause': {
                if (timer.state !== 'running') {
                    error(400, 'Invalid action')
                }

                timer = {
                    state: 'paused',
                    startedAt: timer.startedAt,
                    pausedAt: DateTime.now().toISO(),
                    pausedBy: timer.pausedBy
                }
                break
            }
            case 'resume': {
                if (timer.state !== 'paused') {
                    error(400, 'Invalid action')
                }

                timer = {
                    state: 'running',
                    startedAt: timer.startedAt,
                    pausedBy: Duration.fromISO(timer.pausedBy).plus(
                        DateTime.now().diff(DateTime.fromISO(timer.pausedAt))
                    ).toISO()!
                }
                break
            }
            default:
                if (game.timer.state !== 'running') {
                    error(400, 'Game is not running')
                }

                actions.push(sanitizedAction)
                break
        }

        const state = computeState({
            user: null,
            players: game.players.map(it => it.user),
            ruleset: game.event.ruleset,
            actions: game.actions
        })

        if (!state.ok) {
            if (typeof state.error === 'string') {
                error(400, state.error)
            } else if (state.error instanceof Error) {
                error(400, state.error.message)
            } else {
                error(400, 'Invalid state')
            }
        }

        if (state.value.match.state === 'ENDED') {
            if (timer.state === 'waiting') {
                error(400, 'Invalid state')
            }

            timer = {
                state: 'ended',
                startedAt: timer.startedAt,
                pausedBy: timer.pausedBy,
                endedAt: DateTime.now().toISO()
            }
        }

        await tx.game.update({
            where: {
                id: gameId
            },
            data: {
                actions,
                timer
            }
        })
    })

    return new Response(null)
})

export const DELETE = (async ({ params, request }) => {
    const captchaToken = await request.text()

    if (!validateCaptcha(captchaToken)) {
        error(400, 'Invalid Captcha')
    }

    const gameId = +(params.game ?? NaN);

    if (isNaN(gameId)) {
        error(404, 'Game not found')
    }

    await prisma.$transaction(async (tx) => {
        const game = await tx.game.findUnique({
            where: {
                id: gameId
            },
            include: {
                players: {
                    include: {
                        user: true
                    }
                },
                event: {
                    include: {
                        ruleset: true
                    }
                }
            }
        })

        const actions = game?.actions
        let timer = game?.timer

        if (game == null || actions == null || timer == null) {
            error(404, 'Game not found')
        }

        const actionsType = [
            'ron',
            'tsumo',
            'draw',
            'chonbo',
            'oyaNagashi',
            'end'
        ]
        const lastAction = actions.findLastIndex(it => actionsType.includes(it.type))

        if (lastAction === -1) {
            error(400, 'No action to undo')
        }

        if (actions[lastAction].type === 'end') {
            if (timer.state !== 'ended') {
                error(400, 'Invalid state')
            }

            timer = {
                state: 'running',
                startedAt: timer.startedAt,
                pausedBy: Duration.fromISO(timer.pausedBy).plus(
                    DateTime.now().diff(DateTime.fromISO(timer.endedAt))
                ).toISO()!
            }
        }

        await tx.game.update({
            where: {
                id: gameId
            },
            data: {
                actions: actions.slice(0, lastAction),
                timer
            }
        })
    })

    return new Response(null)
})