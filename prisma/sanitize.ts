import { PrismaClient } from "@prisma/client";
import { sanitizeAction } from '../src/lib/validator'
import { computeState } from '../src/lib/game/state'
import { computeState as oldComputeState } from './old-state'
import { Duration } from "luxon";

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
        const sanitizedActions = game.actions.map(action => sanitizeAction(action)).filter(it => it != null)

        const sanitizedState = computeState({
            user: null,
            players: game.players.map(it => it.user),
            ruleset: game.event.ruleset,
            actions: sanitizedActions
        })

        if (!sanitizedState.ok) {
            console.error(sanitizedState.error)
            continue
        }

        const originalState = oldComputeState({
            user: null,
            players: game.players.map(it => it.user),
            ruleset: game.event.ruleset,
            actions: game.actions
        })
            .onFailure((e) => {
                console.error(e)
            }).getOrNull()

        if (!originalState) {
            continue
        }

        let timerState: any = { state: 'waiting' }

        switch (originalState.match.state) {
            case 'WAITING':
                timerState = { state: 'waiting' }
                break
            case 'RUNNING':
                timerState = { state: 'running', startedAt: originalState.match.startedAt.toISO(), pausedBy: originalState.match.pausedBy.toISO() }
                break
            case 'PAUSED':
                timerState = { state: 'paused', startedAt: originalState.match.startedAt.toISO(), pausedAt: originalState.match.pausedAt.toISO(), pausedBy: originalState.match.pausedBy.toISO() }
                break
            case 'ENDED':
                timerState = { state: 'ended', startedAt: originalState.match.startedAt.toISO(), pausedBy: Duration.fromMillis(0).toISO(), endedAt: originalState.match.endedAt.toISO() }
                break
        }

        await prisma.game.update({
            where: {
                id: game.id
            },
            data: {
                actions: sanitizedActions,
                timer: timerState
            }
        })
    }
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect();
    process.exit(1);
})