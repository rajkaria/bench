# Bench v2 — Project Context

## What This Is
Multi-source best-execution oracle for autonomous agent trading. Queries 12 DEX aggregators in parallel, computes consensus best price, signs cryptographic certificates (BEC v2).

## Architecture
- `packages/shared` — BEC v2 types, canonical hashing, EIP-712 signing, constants
- `packages/db` — PostgreSQL schema (7 tables) + Redis cache layer
- `packages/attestor` — 12 source adapters, consensus engine, certificate builder, Hono API
- `packages/contracts` — BenchRegistry.sol on X Layer (Solidity 0.8.24)
- `packages/skill` — Onchain OS plugin (BenchSkill SDK)
- `packages/verifier-ts` — @usebench/verifier (independent verification, zero internal deps)
- `apps/explorer` — Next.js 15 dashboard (7 routes, dark theme)
- `apps/demo-agent` — Reference DCA bot on X Layer

## Session Context (Last updated: 2026-04-08 18:30)

### Current State
- **All code complete**: Phases 1-10 + 15 built and committed (13 commits)
- **257 tests passing** across 6 packages (shared:58, attestor:160, contracts:22, skill:7, verifier:6, demo-agent:4)
- **Pushed to GitHub**: https://github.com/rajkaria/bench (public repo, main branch)
- **Explorer builds clean**: `pnpm --filter @bench/explorer build` — 7 routes (3 static, 4 dynamic)
- **NOT yet deployed**: Explorer not on Vercel, API not on Railway, contract not on X Layer
- **NOT yet live**: No API keys configured, demo agent not running
- **Demo data only**: Explorer pages use hardcoded demo data (no live API connection yet)

### Recent Changes (this session — built from scratch)
- `packages/shared/` — BEC v2 type system (6 type files), canonical JSON hashing, EIP-712 signing, chain constants
- `packages/db/` — PostgreSQL schema (api_keys, certificates, source_responses, source_failures, executions, agent_scores, aggregator_stats, anchors), Redis cache
- `packages/attestor/src/adapters/` — 12 adapters: OKX, 1inch, Velora, Odos, KyberSwap, CoW Swap, Uniswap AI, OpenOcean, Jupiter, LI.FI, Squid, Rango
- `packages/attestor/src/services/` — consensus.ts (BigInt math, outlier filtering), multi-source-aggregator.ts, certificate-builder.ts
- `packages/attestor/src/routes/` — certify.ts (POST /v1/certify), verify.ts (POST /v1/verify), health.ts (GET /health), execution.ts (POST /v1/execution)
- `packages/attestor/src/workers/` — post-trade.ts (tx receipt parsing, MEV detection), aggregator-reputation.ts (scoring formula)
- `packages/contracts/contracts/BenchRegistry.sol` — Fixed batchAnchor bug (internal helper), anchorCertificate, markExecutionVerified, setAttestor, getAgentCerts (paginated)
- `packages/contracts/scripts/deploy.ts` — Deploy script for X Layer mainnet/testnet
- `packages/skill/` — BenchSkill class, SKILL.md manifest
- `packages/verifier-ts/` — Independent verification (zero @bench/shared deps), reimplements canonical hashing + EIP-712
- `apps/explorer/` — Next.js 15 + Tailwind: homepage, /cert/[hash] (multi-source bar viz), /aggregators (leaderboard), /leaderboard, /agent/[addr], /api/badge/[addr] (SVG)
- `apps/demo-agent/` — DCA bot with 5-min interval, USDC/WOKB/WETH pairs on X Layer
- `README.md` — Full production README
- `docs/SUBMISSION.md` — Hackathon submission checklist + demo video script
- `DO_LATER.md` — Deferred features (0x, Bebop, Titan, framework adapters, audit, compliance, trust minimization v3/v4)
- `.env.example` — All env vars documented by tier
- `scripts/generate-keypair.ts`, `scripts/check-api-keys.ts`

### Next Steps (for next session)
1. **Acquire API keys** — OKX Developer (key+secret+passphrase+projectId), 1inch Portal, Odos dashboard
2. **Generate attestor keypair** — `npx tsx scripts/generate-keypair.ts`, put in .env
3. **Set up PostgreSQL + Redis** — local or Railway for dev
4. **Deploy BenchRegistry.sol** — `cd packages/contracts && npx hardhat run scripts/deploy.ts --network xlayerTestnet`
5. **Deploy Explorer to Vercel** — connect GitHub repo, point usebench.xyz
6. **Deploy Attestor API to Railway** — packages/attestor as service
7. **Wire Explorer to live API** — replace demo data with fetch calls to the attestor API
8. **Start demo agent** — configure .env, run `pnpm --filter @bench/demo-agent start`
9. **Record 3-minute demo video** — follow script in docs/SUBMISSION.md
10. **Submit** — Google Form before April 15 23:59 UTC

### Key Decisions
1. Canonical hashing: sorted-key JSON (RFC 8785 subset) — deterministic serialization for cert hashes
2. Signing: EIP-712 typed data, domain {name:"Bench", version:"2", chainId:196} — future-proofed for on-chain ecrecover
3. Auth: API keys for write endpoints, public reads — SIWE deferred to DO_LATER.md
4. Database: PostgreSQL + Redis from day 1, quote cache TTL=12s (one EVM block)
5. Single-source certs: WARNING with disclaimer (not FAILED) — better UX for Solana with few sources
6. Solidity: internal _anchorCertificate helper — fixes spec's external-call bug in batchAnchor
7. Deferred integrations: 0x (paid $50/mo), Bebop (partner key), Titan (unverified), Firebird, DODO, MetaMask Swap, Socket, Matcha — see DO_LATER.md
8. Node 25.9.0 + pnpm 10.33.0 (installed via Homebrew at /opt/homebrew/bin)
9. PATH needs `/opt/homebrew/bin:/opt/homebrew/sbin` prepended in every Bash command

## Phase Status
- [x] Phase 1: Foundations
- [x] Phase 2: 12 Source Adapters
- [x] Phase 3: Consensus Engine
- [x] Phase 4: Certificate Builder + Hono API
- [x] Phase 5: BenchRegistry.sol
- [x] Phase 6: Bench Skill
- [x] Phase 7: TypeScript Verifier
- [x] Phase 8: Demo Agent
- [x] Phase 9: Explorer Dashboard
- [x] Phase 10: Post-Trade Verifier + Aggregator Reputation
- [x] Phase 15: README + Submission Docs
- [ ] DEPLOY: Vercel + Railway + X Layer testnet
- [ ] LIVE: API keys + demo agent running + Explorer wired to API

## Test Coverage — 257 total
- @bench/shared: 58 (hashing, signing, consensus logic)
- @bench/attestor: 160 (adapters, consensus, certificates, reputation)
- @bench/contracts: 22 (BenchRegistry.sol)
- @bench/skill: 7 (SDK API calls)
- @usebench/verifier: 6 (cross-package verification)
- @bench/demo-agent: 4 (config)
