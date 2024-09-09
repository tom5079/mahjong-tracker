import { error } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { Game } from "@prisma/client";
import { validateCaptcha } from "$lib/server/captcha";

export const POST = (async ({ params, request }) => {
    const body = await request.formData();

    if (!validateCaptcha(body.get("captcha")?.toString())) {
        error(400, 'Invalid captcha')
    }

    const durationSeconds = +(body.get("durationSeconds") ?? 0);

    const roster = body.getAll('roster').map(x => x.toString())

    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    const ruleset = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    }).ruleset()

    if (!ruleset) {
        error(500, 'Event has no ruleset')
    }

    const player = ruleset.player === 'FOUR' ? 4 : 3

    if (roster.length < player) {
        error(400, 'Not enough players')
    }

    const startTime = body.get("startTime")?.toString() || undefined

    const games: Game[] = []

    for (let i = 0; i < Math.floor(roster.length / player); i++) {
        const players = roster.slice(i * player, (i + 1) * player)

        games.push(await prisma.game.create({
            data: {
                name: body.get("name")?.toString() ?? '',
                table: i + 1,
                startTime,
                durationSeconds,
                event: {
                    connect: {
                        id: eventId
                    }
                },
                players: {
                    create: players.map((x, index) => ({
                        user: {
                            connect: {
                                id: x
                            }
                        },
                        index
                    }))
                },
                timer: {
                    state: 'waiting'
                },
                actions: []
            }
        }))
    }

    return new Response(JSON.stringify(games.map(x => x.id)))
})