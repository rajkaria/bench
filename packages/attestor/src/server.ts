import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { loadAttestorKeypair } from '@bench/shared';
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

// Start server
const port = parseInt(process.env['PORT'] ?? '3001', 10);
console.log(`Bench Attestor Service starting on port ${port}`);
console.log(`Attestor address: ${keypair.address}`);

serve({ fetch: app.fetch, port });

export default app;
export { app };
