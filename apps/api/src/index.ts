import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import festivalsRoute from './routes/festivals.js';
import artistsRoute from './routes/artists.js';
import setsRoute from './routes/sets.js';
import favoritesRoute from './routes/favorites.js';
import plansRoute from './routes/plans.js';
import authRoute from './routes/auth.js';
import stagesRoute from './routes/stages.js';

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.WEB_URL ?? 'http://localhost:3000',
    credentials: true,
  }),
);

app.route('/api/auth', authRoute);
app.route('/api/festivals', festivalsRoute);
app.route('/api/artists', artistsRoute);
app.route('/api/sets', setsRoute);
app.route('/api/me/favorites', favoritesRoute);
app.route('/api/me/plans', plansRoute);
app.route('/api/stages', stagesRoute);

app.get('/health', (c) => c.json({ ok: true }));

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('API running on http://localhost:3001');
});
