import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { artists } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminOnly.js';
import { z } from 'zod';

const CreateArtistSchema = z.object({
  name: z.string().min(1),
  genre: z.string().optional(),
  imageUrl: z.string().url().optional(),
  bio: z.string().optional(),
});

const UpdateArtistSchema = CreateArtistSchema.partial();

const artistsRouter = new Hono();

// GET /api/artists
artistsRouter.get('/', requireAuth, async (c) => {
  const rows = await db.select().from(artists).orderBy(artists.name);
  return c.json(rows);
});

// GET /api/artists/:id
artistsRouter.get('/:id', requireAuth, async (c) => {
  const { id } = c.req.param();
  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.id, id))
    .limit(1);
  if (!artist) return c.json({ error: 'Not found' }, 404);
  return c.json(artist);
});

// POST /api/artists
artistsRouter.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = CreateArtistSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const [artist] = await db.insert(artists).values(parsed.data).returning();
  return c.json(artist, 201);
});

// PUT /api/artists/:id
artistsRouter.put('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const parsed = UpdateArtistSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const [artist] = await db
    .update(artists)
    .set(parsed.data)
    .where(eq(artists.id, id))
    .returning();
  if (!artist) return c.json({ error: 'Not found' }, 404);
  return c.json(artist);
});

// DELETE /api/artists/:id
artistsRouter.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();
  await db.delete(artists).where(eq(artists.id, id));
  return c.json({ success: true });
});

export default artistsRouter;
