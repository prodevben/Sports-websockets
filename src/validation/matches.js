import { z } from 'zod';

// MATCH_STATUS constant with lowercase values
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Query schema: optional limit coerced to a positive integer, max 100
export const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

// Path params schema: id required and coerced to a positive integer
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Helper ISO 8601 regexp (UTC 'Z' format, allows fractional seconds)
const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

// Create match schema
export const createMatchSchema = z
  .object({
    sport: z.string().min(1, { message: 'sport is required' }),
    homeTeam: z.string().min(1, { message: 'homeTeam is required' }),
    awayTeam: z.string().min(1, { message: 'awayTeam is required' }),
    startTime: z
      .string()
      .refine((v) => iso8601Regex.test(v) && !Number.isNaN(Date.parse(v)), {
        message: 'startTime must be a valid ISO 8601 string (UTC, e.g. 2023-01-01T00:00:00Z)',
      }),
    endTime: z
      .string()
      .refine((v) => iso8601Regex.test(v) && !Number.isNaN(Date.parse(v)), {
        message: 'endTime must be a valid ISO 8601 string (UTC, e.g. 2023-01-01T01:00:00Z)',
      }),
    homeScore: z
      .coerce.number()
      .int()
      .min(0)
      .optional(),
    awayScore: z
      .coerce.number()
      .int()
      .min(0)
      .optional(),
    status: z
      .enum([MATCH_STATUS.SCHEDULED, MATCH_STATUS.LIVE, MATCH_STATUS.FINISHED])
      .optional(),
  })
  .superRefine((data, ctx) => {
    const start = Date.parse(data.startTime);
    const end = Date.parse(data.endTime);
    if (Number.isNaN(start) || Number.isNaN(end)) {
      // Individual refinements will surface parsing errors; skip here
      return;
    }
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endTime must be after startTime',
        path: ['endTime'],
      });
    }
  });

// Update score schema: requires homeScore and awayScore as coerced non-negative integers
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});