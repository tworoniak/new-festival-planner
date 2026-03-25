import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { stages } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminOnly.js';
import { z } from 'zod';

const CreateStageSchema = z.object({
  festivalId: z.string(),
  name: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

const UpdateStageSchema = CreateStageSchema.omit({
  festivalId: true,
}).partial();

const stagesRouter = new Hono();

// GET /api/stages?festivalId=xxx
stagesRouter.get('/', requireAuth, async (c) => {
  const festivalId = c.req.query('festivalId');
  if (!festivalId) return c.json({ error: 'festivalId required' }, 400);
  const rows = await db
    .select()
    .from(stages)
    .where(eq(stages.festivalId, festivalId))
    .orderBy(stages.order);
  return c.json(rows);
});

// POST /api/stages
stagesRouter.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = CreateStageSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const [stage] = await db.insert(stages).values(parsed.data).returning();
  return c.json(stage, 201);
});

// PUT /api/stages/:id
stagesRouter.put('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const parsed = UpdateStageSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const [stage] = await db
    .update(stages)
    .set(parsed.data)
    .where(eq(stages.id, id))
    .returning();
  if (!stage) return c.json({ error: 'Not found' }, 404);
  return c.json(stage);
});

// DELETE /api/stages/:id
stagesRouter.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();
  await db.delete(stages).where(eq(stages.id, id));
  return c.json({ success: true });
});

export default stagesRouter;
