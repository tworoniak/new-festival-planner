import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/client.js';
import { userPlanItems, sets, artists, stages } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';

const plansRouter = new Hono();

// GET /api/me/plans/:festivalId
plansRouter.get('/:festivalId', requireAuth, async (c) => {
  const user = c.get('user' as never) as { id: string };
  const { festivalId } = c.req.param();

  const rows = await db
    .select({
      id: userPlanItems.id,
      setId: userPlanItems.setId,
      festivalId: userPlanItems.festivalId,
      set: {
        id: sets.id,
        festivalId: sets.festivalId,
        stageId: sets.stageId,
        startTime: sets.startTime,
        endTime: sets.endTime,
        day: sets.day,
      },
      artist: {
        id: artists.id,
        name: artists.name,
        imageUrl: artists.imageUrl,
        genre: artists.genre,
      },
      stage: {
        id: stages.id,
        name: stages.name,
      },
    })
    .from(userPlanItems)
    .innerJoin(sets, eq(userPlanItems.setId, sets.id))
    .innerJoin(artists, eq(sets.artistId, artists.id))
    .innerJoin(stages, eq(sets.stageId, stages.id))
    .where(
      and(
        eq(userPlanItems.userId, user.id),
        eq(userPlanItems.festivalId, festivalId),
      ),
    );

  return c.json(
    rows.map((r) => ({
      id: r.id,
      setId: r.setId,
      festivalId: r.festivalId,
      set: {
        ...r.set,
        artist: r.artist,
        stageName: r.stage.name,
      },
    })),
  );
});

// POST /api/me/plans
plansRouter.post('/', requireAuth, async (c) => {
  const user = c.get('user' as never) as { id: string };
  const { festivalId, setId } = await c.req.json();

  if (!festivalId || !setId) {
    return c.json({ error: 'festivalId and setId required' }, 400);
  }

  const [item] = await db
    .insert(userPlanItems)
    .values({ userId: user.id, festivalId, setId })
    .onConflictDoNothing()
    .returning();

  return c.json(item, 201);
});

// DELETE /api/me/plans/:setId
plansRouter.delete('/:setId', requireAuth, async (c) => {
  const user = c.get('user' as never) as { id: string };
  const { setId } = c.req.param();

  await db
    .delete(userPlanItems)
    .where(
      and(eq(userPlanItems.userId, user.id), eq(userPlanItems.setId, setId)),
    );

  return c.json({ success: true });
});

export default plansRouter;
