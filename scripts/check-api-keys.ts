#!/usr/bin/env npx tsx
/**
 * Validate that all required environment variables are set.
 * Run this before starting the attestor service.
 *
 * Usage:
 *   pnpm run check-env
 */

import { config } from 'dotenv';
config();

interface EnvCheck {
  name: string;
  required: boolean;
  tier: string;
  note: string;
}

const checks: EnvCheck[] = [
  // Core
  { name: 'ATTESTOR_PRIVATE_KEY', required: true, tier: 'Core', note: 'Run `pnpm run generate-keypair` to create' },
  { name: 'ATTESTOR_ADDRESS', required: true, tier: 'Core', note: 'Derived from ATTESTOR_PRIVATE_KEY' },
  { name: 'DATABASE_URL', required: true, tier: 'Core', note: 'PostgreSQL connection string' },
  { name: 'REDIS_URL', required: true, tier: 'Core', note: 'Redis connection string' },

  // Tier 1 EVM Aggregators
  { name: 'OKX_API_KEY', required: true, tier: 'Tier 1', note: 'https://www.okx.com/web3/build/docs/devportal/introduction' },
  { name: 'OKX_SECRET_KEY', required: true, tier: 'Tier 1', note: 'OKX API secret' },
  { name: 'OKX_PASSPHRASE', required: true, tier: 'Tier 1', note: 'OKX API passphrase' },
  { name: 'OKX_PROJECT_ID', required: true, tier: 'Tier 1', note: 'OKX project ID' },
  { name: 'ONEINCH_API_KEY', required: true, tier: 'Tier 1', note: 'https://portal.1inch.dev' },
  { name: 'ODOS_API_KEY', required: false, tier: 'Tier 1', note: 'https://dashboard.odos.xyz' },
  { name: 'UNISWAP_AI_API_KEY', required: false, tier: 'Tier 1', note: 'Hackathon partner access' },

  // Tier 2 (no keys needed for Jupiter, Kyber, CoW, OpenOcean)

  // Tier 3 Cross-Chain
  { name: 'LIFI_API_KEY', required: false, tier: 'Tier 3', note: 'https://li.fi — optional for higher rate limits' },
  { name: 'SQUID_INTEGRATOR_ID', required: false, tier: 'Tier 3', note: 'https://docs.squidrouter.com' },
  { name: 'RANGO_API_KEY', required: false, tier: 'Tier 3', note: 'https://rango.exchange' },

  // Infrastructure
  { name: 'XLAYER_RPC_URL', required: false, tier: 'Infra', note: 'X Layer mainnet RPC' },
  { name: 'BENCH_REGISTRY_ADDRESS', required: false, tier: 'Infra', note: 'Deployed contract address' },
];

let hasErrors = false;

console.log('=== Bench Environment Check ===\n');

const grouped = new Map<string, EnvCheck[]>();
for (const check of checks) {
  const existing = grouped.get(check.tier) ?? [];
  existing.push(check);
  grouped.set(check.tier, existing);
}

for (const [tier, tierChecks] of grouped) {
  console.log(`--- ${tier} ---`);
  for (const check of tierChecks) {
    const value = process.env[check.name];
    const status = value ? 'OK' : check.required ? 'MISSING' : 'optional';
    const icon = value ? '\u2705' : check.required ? '\u274C' : '\u26A0\uFE0F';
    console.log(`  ${icon} ${check.name}: ${status}`);
    if (!value && check.required) {
      console.log(`     -> ${check.note}`);
      hasErrors = true;
    }
  }
  console.log('');
}

if (hasErrors) {
  console.log('Some required environment variables are missing. See notes above.');
  process.exit(1);
} else {
  console.log('All required environment variables are set.');
}
