import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAttestorKeypair } from '@bench/shared';
import { getPool } from '@bench/db';
import { createCertifyRoute } from './routes/certify.js';
import { createVerifyRoute } from './routes/verify.js';
import { createHealthRoute } from './routes/health.js';
import { createExplorerRoutes } from './routes/explorer.js';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Load attestor config
const privateKey = process.env['ATTESTOR_PRIVATE_KEY'];
if (!privateKey) {
  console.error('ATTESTOR_PRIVATE_KEY environment variable is required');
  process.exit(1);
}

const keypair = loadAttestorKeypair(`0x${privateKey.replace('0x', '')}` as `0x${string}`);
const attestorConfig = {
  privateKey: keypair.privateKey,
  address: keypair.address,
  publicKey: keypair.address, // Simplified; full pubkey derivation if needed
};

// Routes
app.route('/', createHealthRoute());
app.route('/', createCertifyRoute(attestorConfig));
app.route('/', createVerifyRoute());
app.route('/', createExplorerRoutes());

// Run DB migrations on startup
async function runMigrations() {
  if (!process.env['DATABASE_URL']) {
    console.warn('DATABASE_URL not set — skipping migrations');
    return;
  }
  try {
    const pool = getPool();
    // Find migration file relative to project root
    const migrationPaths = [
      join(process.cwd(), 'packages/db/migrations/001_initial.sql'),
      join(dirname(fileURLToPath(import.meta.url)), '../../db/migrations/001_initial.sql'),
    ];
    let sql = '';
    for (const p of migrationPaths) {
      try { sql = readFileSync(p, 'utf-8'); break; } catch { /* try next */ }
    }
    if (sql) {
      await pool.query(sql);
      console.log('Database migrations applied successfully');
    } else {
      console.warn('Migration file not found — tables may need manual creation');
    }
  } catch (err) {
    console.error('Migration error (non-fatal):', err instanceof Error ? err.message : err);
  }
}

// Start server
const port = parseInt(process.env['PORT'] ?? '3001', 10);
console.log(`Bench Attestor Service starting on port ${port}`);
console.log(`Attestor address: ${keypair.address}`);

await runMigrations();
serve({ fetch: app.fetch, port });

export default app;
export { app };
