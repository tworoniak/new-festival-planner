import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/client.js';
import { festivals, stages, sets, artists } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminOnly.js';
import { z } from 'zod';
// import {
//   CreateFestivalSchema,
//   UpdateFestivalSchema,
// } from '@festival-planner/shared';

const CreateFestivalSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  startDate: z.string().date(),
  endDate: z.string().date(),
  location: z.string().min(1),
  imageUrl: z.string().url().optional(),
  heroImageUrl: z.string().url().optional(),
});

const UpdateFestivalSchema = CreateFestivalSchema.partial();

const festivalsRouter = new Hono();

// GET /api/festivals — public list, filterable by year
festivalsRouter.get('/', requireAuth, async (c) => {
  const year = c.req.query('year');

  const rows = await db
    .select()
    .from(festivals)
    .orderBy(desc(festivals.startDate));

  const filtered = year
    ? rows.filter((f) => new Date(f.startDate).getFullYear() === parseInt(year))
    : rows;

  return c.json(filtered);
});

// GET /api/festivals/:slug — full festival with stages + sets + artists
festivalsRouter.get('/:slug', requireAuth, async (c) => {
  const { slug } = c.req.param();

  const [festival] = await db
    .select()
    .from(festivals)
    .where(eq(festivals.slug, slug))
    .limit(1);

  if (!festival) return c.json({ error: 'Not found' }, 404);

  const festivalStages = await db
    .select()
    .from(stages)
    .where(eq(stages.festivalId, festival.id))
    .orderBy(stages.order);

  const festivalSets = await db
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
        imageUrl: artists.imageUrl,
        genre: artists.genre,
      },
    })
    .from(sets)
    .innerJoin(artists, eq(sets.artistId, artists.id))
    .where(eq(sets.festivalId, festival.id))
    .orderBy(sets.day, sets.startTime);

  return c.json({
    ...festival,
    stages: festivalStages.map((stage) => ({
      ...stage,
      sets: festivalSets.filter((s) => s.stageId === stage.id),
    })),
  });
});

// POST /api/festivals — admin only
festivalsRouter.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = CreateFestivalSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [festival] = await db.insert(festivals).values(parsed.data).returning();

  return c.json(festival, 201);
});

// PUT /api/festivals/:id — admin only
festivalsRouter.put('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const parsed = UpdateFestivalSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const [festival] = await db
    .update(festivals)
    .set(parsed.data)
    .where(eq(festivals.id, id))
    .returning();

  if (!festival) return c.json({ error: 'Not found' }, 404);
  return c.json(festival);
});

// DELETE /api/festivals/:id — admin only
festivalsRouter.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  await db.delete(festivals).where(eq(festivals.id, id));
  return c.json({ success: true });
});

export default festivalsRouter;
