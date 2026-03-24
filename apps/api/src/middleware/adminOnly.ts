import { createMiddleware } from 'hono/factory';
import { auth } from '../lib/auth.js';

export const requireAdmin = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'Unauthorized' }, 401);
  if (session.user.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
  c.set('user', session.user);
  c.set('session', session.session);
  await next();
});
