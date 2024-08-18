import { PrismaClient } from "@prisma/client";
import { computeState } from "../src/lib/game/state"

const prisma = new PrismaClient();

async function main() {
    const games = await prisma.game.findMany({
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

    for (const game of games) {
        const state = computeState({
            players: game.players.map(p => p.user),
            ruleset: game.event.ruleset,
            actions: game.actions
        })

        if (!state.ok) {
            console.log(state.error)
        } else {
            console.log('Game is OK')
        }
    }
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect();
    process.exit(1);
})