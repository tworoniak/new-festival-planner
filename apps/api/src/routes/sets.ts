import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/client.js';
import { sets, artists, stages } from '../db/schema.js';
import { requireAdmin } from '../middleware/adminOnly.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';

const CreateSetSchema = z.object({
  stageId: z.string(),
  artistId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  day: z.number().int().min(1),
});

const UpdateSetSchema = CreateSetSchema.partial();

const setsRouter = new Hono();

// GET /api/sets?festivalId=xxx
setsRouter.get('/', requireAuth, async (c) => {
  const festivalId = c.req.query('festivalId');
  if (!festivalId) return c.json({ error: 'festivalId required' }, 400);

  const rows = await db
    .select({
      id: sets.id,
      festivalId: sets.festivalId,
      stageId: sets.stageId,
      startTime: sets.startTime,
      endTime: sets.endTime,
      day: sets.day,
      artist: {
        id: artists.id,
        name: artists.name,
        genre: artists.genre,
        imageUrl: artists.imageUrl,
      },
      stage: {
        id: stages.id,
        name: stages.name,
      },
    })
    .from(sets)
    .innerJoin(artists, eq(sets.artistId, artists.id))
    .innerJoin(stages, eq(sets.stageId, stages.id))
    .where(eq(sets.festivalId, festivalId))
    .orderBy(sets.day, sets.startTime);

  return c.json(rows);
});

// POST /api/sets
setsRouter.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const { festivalId, ...rest } = body;
  if (!festivalId) return c.json({ error: 'festivalId required' }, 400);

  const parsed = CreateSetSchema.safeParse(rest);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [set] = await db
    .insert(sets)
    .values({
      festivalId,
      stageId: parsed.data.stageId,
      artistId: parsed.data.artistId,
      startTime: new Date(parsed.data.startTime),
      endTime: new Date(parsed.data.endTime),
      day: parsed.data.day,
    })
    .returning();

  return c.json(set, 201);
});

// PUT /api/sets/:id
setsRouter.put('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const parsed = UpdateSetSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.startTime)
    updateData.startTime = new Date(parsed.data.startTime);
  if (parsed.data.endTime) updateData.endTime = new Date(parsed.data.endTime);

  const [set] = await db
    .update(sets)
    .set(updateData)
    .where(eq(sets.id, id))
    .returning();

  if (!set) return c.json({ error: 'Not found' }, 404);
  return c.json(set);
});

// DELETE /api/sets/:id
setsRouter.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();
  await db.delete(sets).where(eq(sets.id, id));
  return c.json({ success: true });
});

export default setsRouter;
