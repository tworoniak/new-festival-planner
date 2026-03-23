import { Hono } from 'hono';

const festivalsRouter = new Hono();

festivalsRouter.get('/', async (c) => {
  return c.json([]);
});

export default festivalsRouter;
