import { Hono } from 'hono';
import { allAdapters } from '../adapters/index.js';

export function createHealthRoute() {
  const app = new Hono();

  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      version: 'bench-v2',
      adapters: {
        total: allAdapters.length,
        names: allAdapters.map((a) => a.name),
      },
      timestamp: Math.floor(Date.now() / 1000),
    });
  });

  return app;
}
