# Bench v2 — Project Context

## What This Is
Multi-source best-execution oracle for autonomous agent trading. Queries 13 DEX aggregators in parallel, computes consensus best price, signs cryptographic certificates (BEC v2).

## Architecture
- `packages/shared` — BEC v2 types, canonical hashing, EIP-712 signing, constants
- `packages/db` — PostgreSQL schema (7 tables) + Redis cache layer
- `packages/attestor` — 13 source adapters (incl. OKX MCP), consensus engine, certificate builder, Hono API
- `packages/contracts` — BenchRegistry.sol on X Layer (Solidity 0.8.24)
- `packages/skill` — Onchain OS plugin (BenchSkill SDK)
- `packages/verifier-ts` — @usebench/verifier (independent verification, zero internal deps)
- `apps/explorer` — Next.js 15 dashboard (7 routes, dark theme)
- `apps/demo-agent` — Reference DCA bot on X Layer
- `apps/demo-video` — Remotion 30-second demo video (6 scenes, 1920x1080)

## Session Context (Last updated: 2026-04-14 16:00)

### Current State
- **BenchRegistry.sol DEPLOYED on X Layer Mainnet**: `0x6a400d858daA46C9f955601B672cc1a8899DcE3f` (chain 196)
- **Explorer LIVE on Vercel**: https://bench-explorer-five.vercel.app (domain connected, mainnet badge added)
- **Attestor API LIVE on Railway**: https://attestor-production-b1ad.up.railway.app/health (13 adapters)
- **BenchRegistry.sol ALSO on X Layer testnet**: `0x6a400d858daA46C9f955601B672cc1a8899DcE3f` (chain 1952)
- **Agentic Wallet**: `0x5a6Ad7E615E82B3d3eE2f70c4F4dF38f224ACcd1`
- **Demo video rendered**: `apps/demo-video/out/bench-demo.mp4` (2.8 MB, 30s, Remotion)
- **OKX MCP adapter added**: `okx-mcp.ts` calls `dex-okx-dex-quote` via Onchain OS MCP server (no API keys needed)
- **Explorer wired to API**: all pages fetch from `BENCH_API_URL` with demo data fallback
- **DB not initialized**: PostgreSQL on Railway crashed (image issue), explorer shows demo data
- **API keys**: OKX not giving dev APIs, 1inch needs KYC, Odos enterprise only. Public APIs work: KyberSwap, CoW Swap, OpenOcean, Jupiter, Uniswap AI, LI.FI
- **257 tests passing** across 6 packages
- **Hackathon deadline**: April 15, 2026 23:59 UTC

### Recent Changes (this session)
- `packages/attestor/src/adapters/okx-mcp.ts` — NEW: OKX DEX via Onchain OS MCP server (no HMAC keys needed)
- `packages/attestor/src/adapters/registry.ts` — Added okxMCPAdapter as 13th adapter (Tier 1 EVM)
- `packages/attestor/src/adapters/index.ts` — Export okxMCPAdapter
- `packages/attestor/src/routes/explorer.ts` — NEW: 6 read routes (GET /v1/stats, /v1/certs, /v1/certs/:hash, /v1/aggregators, /v1/agents, /v1/agents/:addr)
- `packages/attestor/src/server.ts` — Added explorer routes, startup migration runner, import createRequire
- `packages/attestor/tsup.config.ts` — NEW: entry=server.ts, noExternal workspace deps, createRequire banner for CJS compat
- `packages/attestor/package.json` — build=tsup (config file), start/main point to dist/server.js
- `packages/attestor/src/index.ts` — Re-exports server.ts (dual entry point for Railway compat)
- `packages/contracts/hardhat.config.ts` — X Layer testnet chain ID updated 195 → 1952
- `apps/explorer/src/lib/api.ts` — NEW: fetchApi helper with BENCH_API_URL + revalidate + fallback
- `apps/explorer/src/components/stats-bar.tsx` — Async server component, fetches from API
- `apps/explorer/src/components/cert-feed.tsx` — Async server component, fetches from API
- `apps/explorer/src/app/aggregators/page.tsx` — Fetches from API with demo fallback
- `apps/explorer/src/app/leaderboard/page.tsx` — Fetches from API with demo fallback
- `apps/explorer/src/app/agent/[addr]/page.tsx` — Fetches from API with demo fallback
- `apps/explorer/src/app/cert/[hash]/page.tsx` — Fetches from API with demo fallback
- `apps/explorer/vercel.json` — NEW: framework nextjs
- `apps/demo-agent/src/agent.ts` — Defaults to live API, testnet chain, attestor wallet as identity
- `apps/demo-video/` — NEW: Full Remotion project (6 animated scenes, 30s video)
- `vercel.json` — Monorepo build config for Explorer
- `railway.toml` — Attestor service config
- `docker-compose.yml` — Local PostgreSQL 16 + Redis 7
- `Dockerfile` — Multi-stage build for Railway deployment
- `nixpacks.toml` — Build phase override for Railway
- `mcp-config.json` — OKX Onchain OS MCP server reference
- `docs/HACKATHON_BRIEF.md` — Formatted hackathon requirements (local reference)
- `.env` — Generated with attestor keypair (not in git)
- `.env.example` — Added BENCH_API_URL
- `README.md` — Live deployments table, Onchain OS integration section, hackathon compliance table

### Next Steps (for next session)
1. **Submit hackathon** — Google Form before April 15 23:59 UTC
2. **Upload demo video** — `apps/demo-video/out/bench-demo.mp4` to YouTube or Google Drive
3. **Post on X** — #XLayerHackathon tagging @XLayerOfficial (bonus points)
4. **Fix Railway PostgreSQL** — use Railway's built-in Postgres add-on instead of custom Docker image
5. **Wire Explorer to live DB data** — once Postgres works, explorer switches from demo to real data
6. **Record longer demo** (optional) — if judges want 1-3 min, the 30s Remotion video may be too short

### Key Decisions
1. Canonical hashing: sorted-key JSON (RFC 8785 subset) — deterministic serialization for cert hashes
2. Signing: EIP-712 typed data, domain {name:"Bench", version:"2", chainId:196}
3. Auth: API keys for write endpoints, public reads — SIWE deferred
4. Database: PostgreSQL + Redis, quote cache TTL=12s
5. Single-source certs: WARNING with disclaimer (not FAILED)
6. Solidity: internal _anchorCertificate helper — fixes spec's external-call bug in batchAnchor
7. Node 25.9.0 + pnpm 10.33.0 (installed via Homebrew at /opt/homebrew/bin)
8. PATH needs `/opt/homebrew/bin:/opt/homebrew/sbin` prepended in every Bash command
9. tsup bundles workspace deps (noExternal @bench/shared, @bench/db) + createRequire banner for pg/ioredis CJS compat
10. Dual entry points (index.ts re-exports server.ts) to handle Railway's cached start command
11. X Layer testnet chain ID is 1952 (changed from 195)
12. OKX MCP adapter uses public MCP key (no HMAC developer credentials needed)
13. Vercel rootDirectory set to `apps/explorer` via API, installCommand: `cd ../.. && pnpm install`
14. Railway project: `f8efdc87-3cd6-4ee1-84e5-e41c166b00c2`, service: `5d0fa3a8-d267-4753-8a68-69dffd4a067c`

## Phase Status
- [x] Phase 1: Foundations
- [x] Phase 2: 12 Source Adapters (+1 OKX MCP = 13 total)
- [x] Phase 3: Consensus Engine
- [x] Phase 4: Certificate Builder + Hono API
- [x] Phase 5: BenchRegistry.sol
- [x] Phase 6: Bench Skill
- [x] Phase 7: TypeScript Verifier
- [x] Phase 8: Demo Agent
- [x] Phase 9: Explorer Dashboard
- [x] Phase 10: Post-Trade Verifier + Aggregator Reputation
- [x] Phase 15: README + Submission Docs
- [x] DEPLOY: Vercel + Railway + X Layer testnet
- [ ] LIVE: DB initialization + demo agent running continuously

## Test Coverage — 257 total
- @bench/shared: 58 (hashing, signing, consensus logic)
- @bench/attestor: 160 (adapters, consensus, certificates, reputation)
- @bench/contracts: 22 (BenchRegistry.sol)
- @bench/skill: 7 (SDK API calls)
- @usebench/verifier: 6 (cross-package verification)
- @bench/demo-agent: 4 (config)
