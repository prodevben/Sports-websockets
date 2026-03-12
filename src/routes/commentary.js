import { Router } from "express";
import { createCommentarySchema, listCommentaryQuerySchema } from "../validation/commentary.js";
import { matchIdParamSchema } from "../validation/matches.js";
import { commentary } from "../db/schema.js";
import { db } from "../db/client.js";
import { desc, eq } from "drizzle-orm";
// ...existing code...
const MAX_LIMIT = 100;

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      error: "Invalid params",
      details: paramsParsed.error.issues,
    });
  }

  const queryParsed = listCommentaryQuerySchema.safeParse(req.query);
  if (!queryParsed.success) {
    return res.status(400).json({
      error: "Invalid query",
      details: queryParsed.error.issues,
    });
  }

  const limit = Math.min(queryParsed.data.limit ?? MAX_LIMIT, MAX_LIMIT);
  const { matchId } = paramsParsed.data;

  try {
    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.json({ data });
  } catch (error) {
    res.status(500).json({
      error: "Failed to list commentary",
      details: String(error),
    });
  }
});

commentaryRouter.post("/", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      error: "Invalid params",
      details: paramsParsed.error.issues,
    });
  }

  const bodyParsed = createCommentarySchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: bodyParsed.error.issues,
    });
  }

  const { matchId } = paramsParsed.data;
  const payload = bodyParsed.data;

  try {
    const [record] = await db
      .insert(commentary)
      .values({
        matchId,
        ...payload,
      })
      .returning();

      if(res.app.locals.broadcastCommentary){
        res.app.locals.broadcastCommentary(record.matchId,record);
      }

    res.status(201).json({ data: record });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create commentary",
      details: String(error),
    });
  }
});
// ...existing code...
