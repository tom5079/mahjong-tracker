import {
    pgTable,
    timestamp,
    text,
    integer,
    serial,
    foreignKey,
    jsonb,
    boolean,
    primaryKey,
    pgEnum,
} from 'drizzle-orm/pg-core'
import { type UserId } from '$lib/types/user'

export const allLastPolicy = pgEnum('AllLastPolicy', ['AGARIYAME', 'TENPAIYAME', 'NONE'])
export const endgamePolicy = pgEnum('EndgamePolicy', ['DISAPPEARS', 'TOP'])
export const eventJoinRequestStatus = pgEnum('EventJoinRequestStatus', [
    'PENDING',
    'ACCEPTED',
    'REJECTED',
])
export const gameLength = pgEnum('GameLength', ['HANCHAN', 'TONPU'])
export const multiRonHonbaPolicy = pgEnum('MultiRonHonbaPolicy', ['ATAMAHANE', 'SPLIT', 'ALL'])
export const multiRonPotPolicy = pgEnum('MultiRonPotPolicy', ['ATAMAHANE', 'SPLIT'])
export const players = pgEnum('Players', ['FOUR', 'THREE'])
export const record = pgEnum('Record', ['GAME', 'HAND'])
export const renchanPolicy = pgEnum('RenchanPolicy', ['NONE', 'TENPAI', 'AGARI', 'ALWAYS'])
export const tiebreakerPolicy = pgEnum('TiebreakerPolicy', ['SPLIT', 'WIND'])

export const parlor = pgTable('Parlor', {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    location: text().notNull(),
    owner: text().notNull(),
    website: text(),
    note: text().notNull(),
})

export const parlorMember = pgTable(
    'ParlorMember',
    {
        id: serial().primaryKey().notNull(),
        parlorId: integer().notNull(),
        userId: text().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.parlorId],
            foreignColumns: [parlor.id],
            name: 'ParlorMember_parlorId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('restrict'),
    ]
)

export const event = pgTable(
    'Event',
    {
        id: serial().primaryKey().notNull(),
        name: text().notNull(),
        location: text().notNull(),
        description: text().notNull(),
        parlorId: integer().notNull(),
        rulesetId: integer().notNull(),
        joinPolicy: jsonb().notNull().$type<PrismaJson.EventJoinPolicy>(),
    },
    (table) => [
        foreignKey({
            columns: [table.parlorId],
            foreignColumns: [parlor.id],
            name: 'Event_parlorId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('restrict'),
        foreignKey({
            columns: [table.rulesetId],
            foreignColumns: [ruleset.id],
            name: 'Event_rulesetId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('restrict'),
    ]
)

export const user = pgTable('User', {
    id: text().$type<UserId>().primaryKey().notNull(),
    avatar: text(),
    username: text().notNull(),
})

export const userToken = pgTable(
    'UserToken',
    {
        sessionId: text().primaryKey().notNull(),
        accessToken: text().notNull(),
        refreshToken: text().notNull(),
        expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
        userId: text().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: 'UserToken_userId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('restrict'),
    ]
)

export const ruleset = pgTable(
    'Ruleset',
    {
        id: serial().primaryKey().notNull(),
        name: text().notNull(),
        startScore: integer().notNull(),
        returnScore: integer().notNull(),
        uma: jsonb().notNull().$type<PrismaJson.Uma>(),
        honba: integer().notNull(),
        tenpaiFee: integer().notNull(),
        endgamePot: endgamePolicy().notNull(),
        tiebreaker: tiebreakerPolicy().notNull(),
        renchan: renchanPolicy().notNull(),
        allLast: allLastPolicy().notNull(),
        doubleRon: boolean().notNull(),
        tripleRon: boolean().notNull(),
        nagashi: text().notNull(),
        nagashiIsTsumo: boolean().notNull(),
        oyaNagashi: boolean().notNull(),
        suddenDeath: integer(),
        tobi: boolean().notNull(),
        tobiAtZero: boolean().notNull(),
        calledGame: integer(),
        riichiBelow1000: boolean().notNull(),
        scores: jsonb().notNull().$type<PrismaJson.Score>(),
        note: text().notNull(),
        parlorId: integer().notNull(),
        allLastPlacement: integer(),
        multiRonHonbaPolicy: multiRonHonbaPolicy().notNull(),
        multiRonPotPolicy: multiRonPotPolicy().notNull(),
        length: gameLength().notNull(),
        player: players().notNull(),
        record: record().notNull(),
        chonbo: jsonb().notNull().$type<PrismaJson.Chonbo>(),
    },
    (table) => [
        foreignKey({
            columns: [table.parlorId],
            foreignColumns: [parlor.id],
            name: 'Ruleset_parlorId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('restrict'),
    ]
)

export const game = pgTable(
    'Game',
    {
        id: serial().primaryKey().notNull(),
        eventId: integer().notNull(),
        startTime: timestamp({ precision: 3, mode: 'string' }),
        durationSeconds: integer().notNull(),
        actions: jsonb().notNull().$type<PrismaJson.Actions>(),
        name: text().notNull(),
        table: integer().notNull(),
        timer: jsonb().notNull().$type<PrismaJson.Timer>(),
    },
    (table) => [
        foreignKey({
            columns: [table.eventId],
            foreignColumns: [event.id],
            name: 'Game_eventId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
    ]
)

export const eventAttendee = pgTable(
    'EventAttendee',
    {
        userId: text().notNull(),
        eventId: integer().notNull(),
        status: eventJoinRequestStatus().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: 'EventAttendee_userId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.eventId],
            foreignColumns: [event.id],
            name: 'EventAttendee_eventId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        primaryKey({
            columns: [table.userId, table.eventId],
            name: 'EventAttendee_pkey',
        }),
    ]
)

export const gamePlayer = pgTable(
    'GamePlayer',
    {
        gameId: integer().notNull(),
        userId: text().notNull(),
        index: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: 'GamePlayer_userId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.gameId],
            foreignColumns: [game.id],
            name: 'GamePlayer_gameId_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        primaryKey({
            columns: [table.gameId, table.userId],
            name: 'GamePlayer_pkey',
        }),
    ]
)
