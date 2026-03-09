import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { pgEnum, integer, timestamp, jsonb, text, smallint } from 'drizzle-orm/pg-core';
export const matchStatus = pgEnum('match_status', ['scheduled', 'live', 'finished']);

export const matches = pgTable('matches', {
    id: serial('id').primaryKey(),
    sport: varchar('sport', { length: 50 }).notNull(),
    homeTeam: varchar('home_team', { length: 100 }).notNull(),
    awayTeam: varchar('away_team', { length: 100 }).notNull(),
    status: matchStatus('status').notNull().default('scheduled'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    homeScore: integer('home_score').notNull().default(0),
    awayScore: integer('away_score').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const commentary = pgTable('commentary', {
    id: serial('id').primaryKey(),
    matchId: integer('match_id').notNull().references(() => matches.id),
    minute: smallint('minute'),
    sequence: integer('sequence').notNull(),
    period: varchar('period', { length: 50 }),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    actor: varchar('actor', { length: 100 }),
    team: varchar('team', { length: 50 }),
    message: text('message').notNull(),
    metadata: jsonb('metadata'),
    tags: jsonb('tags'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});