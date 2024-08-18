import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateAction } from "$lib/validator";
import prisma from "$lib/server/prisma";
import { computeState } from "$lib/game/state";

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

    if (!validateAction(action)) {
        error(400, 'Invalid action')
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

        if (game == null || actions == null) {
            error(404, 'Game not found')
        }


        switch (action.type) {
            case 'riichi': {
                if (game.players.find(it => it.user.id === action.player) == null) {
                    error(400, 'Player not found')
                }

                const riichiIndex = actions.findLastIndex(it =>
                    it.type !== 'riichi' || it.player === action.player)

                if (riichiIndex !== -1 && actions[riichiIndex].type === 'riichi') {
                    actions.splice(riichiIndex, 1)
                    break
                }

                actions.push({
                    type: 'riichi',
                    player: action.player
                })
                break
            }
            default:
                actions.push(action)
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

        await tx.game.update({
            where: {
                id: gameId
            },
            data: {
                actions
            }
        })
    })

    return new Response(null)
}) satisfies RequestHandler;