import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/client.js';
import { userFavorites, artists } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';

const favoritesRouter = new Hono();

// GET /api/me/favorites
favoritesRouter.get('/', requireAuth, async (c) => {
  const user = c.get('user' as never) as { id: string };

  const rows = await db
    .select({ artist: artists })
    .from(userFavorites)
    .innerJoin(artists, eq(userFavorites.artistId, artists.id))
    .where(eq(userFavorites.userId, user.id));

  return c.json(rows.map((r) => r.artist));
});

// POST /api/me/favorites
favoritesRouter.post('/', requireAuth, async (c) => {
  const user = c.get('user' as never) as { id: string };
  const { artistId } = await c.req.json();

  if (!artistId) return c.json({ error: 'artistId required' }, 400);

  await db
    .insert(userFavorites)
    .values({ userId: user.id, artistId })
    .onConflictDoNothing();

  return c.json({ success: true }, 201);
});

// DELETE /api/me/favorites/:artistId
favoritesRouter.delete('/:artistId', requireAuth, async (c) => {
  const user = c.get('user' as never) as { id: string };
  const { artistId } = c.req.param();

  await db
    .delete(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, user.id),
        eq(userFavorites.artistId, artistId),
      ),
    );

  return c.json({ success: true });
});

export default favoritesRouter;
