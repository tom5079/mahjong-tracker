import prisma from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { computeStats } from "$lib/server/stats";
import type { Game, Ruleset, User } from "@prisma/client";

export const load = (async ({ params }) => {
    const user = await prisma.user.findUnique({
        where: { id: params.user },
        include: {
            games: {
                include: {
                    game: {
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
                    }
                }
            }
        }
    })
    
    const games : (Game & { event: { ruleset: Ruleset }, players: User[] })[] = user?.games.map(games => {
        const game = games.game;
        return {
            ...game,
            event: {
                ruleset: game.event.ruleset
            },
            players: game.players.map(player => player.user)
        };
    }) || []; 

    if (!user) {
        error(400, "User not found")
    }

    let stats = {
        recordedMatches: 0,
        winRate: 0,
        tsumoRate: 0,
        dealInRate: 0,
        riichiRate: 0,
        bustingRate: 0,
        drawTenpaiRate: 0,
        exhaustiveDrawRate: 0,
        averageWinScore: 0,
        averageRank: 0,
        averageDealInScore: 0
    }

    stats = computeStats(user.id, games)

    return { user: { id: user.id, username: user.username, avatar: user.avatar },  stats}
}) satisfies PageServerLoad