import { error } from '@sveltejs/kit'
import { eq, SQL, sql } from 'drizzle-orm'
import { db, oneOrNull, schema } from '$lib/server/drizzle'
import { validateCaptcha } from '$lib/server/captcha'

export const POST = async ({ params, request }) => {
    const body = await request.formData()

    if (!validateCaptcha(body.get('captcha')?.toString())) {
        error(400, 'Invalid captcha')
    }

    const durationSeconds = +(body.get('durationSeconds') ?? 0)

    const roster = body.getAll('roster').map((x) => x.toString())

    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(404, 'Event not found')
    }

    const ruleset = await db
        .select({
            player: schema.ruleset.player,
        })
        .from(schema.event)
        .innerJoin(schema.ruleset, eq(schema.event.rulesetId, schema.ruleset.id))
        .where(eq(schema.event.id, eventId))
        .then(oneOrNull)

    if (!ruleset) {
        error(500, 'Event has no ruleset')
    }

    const player = ruleset.player === 'FOUR' ? 4 : 3

    if (roster.length < player) {
        error(400, 'Not enough players')
    }

    if (roster.length % player !== 0) {
        error(400, `Roster size must be a multiple of ${player}`)
    }

    const startTime = body.get('startTime')?.toString() || undefined

    const rosterChunk: SQL[] = []

    roster.forEach((userId, index) => {
        rosterChunk.push(
            sql`(${Math.floor(index / player) + 1}::integer, ${index % player}::integer, ${userId})`
        )
    })

    const rosterValues = sql.join(
        [
            sql`(VALUES`,
            sql.join(rosterChunk, sql.raw(',')),
            sql`) AS roster (table_index, player_index, user_id)`,
        ],
        sql.raw(' ')
    )

    const rosterClause = db.$with('roster').as(
        db
            .select({
                tableIndex: sql`roster.table_index`,
                playerIndex: sql`roster.player_index`,
                userId: sql`roster.user_id`,
            })
            .from(rosterValues)
    )

    const insertGame = db.$with('game').as(
        db
            .insert(schema.game)
            .select(
                db
                    .selectDistinctOn([sql`roster.table_index`], {
                        id: sql`nextval('"Game_id_seq"'::regclass)`.as('id'),
                        eventId: sql`${eventId}`.as('eventId'),
                        startTime:
                            startTime != null
                                ? sql`${startTime}`.as('startTime')
                                : sql`NULL`.as('startTime'),
                        durationSeconds: sql`${durationSeconds}`.as('durationSeconds'),
                        actions: sql`'[]'::jsonb`.as('actions'),
                        name: sql`${body.get('name')?.toString() ?? ''}`.as('name'),
                        table: sql`roster.table_index`.as('table'),
                        timer: sql`jsonb_build_object('state', 'waiting')`.as('timer'),
                    })
                    .from(rosterClause)
            )
            .returning({ id: schema.game.id, table: schema.game.table })
    )

    const newGames = await db
        .with(rosterClause, insertGame)
        .insert(schema.gamePlayer)
        .select(
            db
                .select({
                    gameId: insertGame.id,
                    userId: sql`roster.user_id`.as('userId'),
                    index: sql`roster.player_index`.as('index'),
                })
                .from(rosterClause)
                .innerJoin(insertGame, eq(insertGame.table, sql`roster.table_index`))
        )
        .returning({ id: schema.gamePlayer.gameId })

    return new Response(JSON.stringify(newGames.map((x) => x.id)))
}
