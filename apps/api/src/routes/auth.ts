import { Hono } from 'hono';
import { auth } from '../lib/auth.js';

const authRouter = new Hono();

// Delegates ALL /api/auth/** to Better Auth
authRouter.on(['GET', 'POST'], '/**', (c) => auth.handler(c.req.raw));

export default authRouter;
