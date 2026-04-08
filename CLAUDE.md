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
- [ ] Phase 10: Post-Trade Verifier
- [ ] Phase 15: Polish & Submission

## Test Coverage — 249 total
- @bench/shared: 58 (hashing, signing, consensus logic)
- @bench/attestor: 152 (adapters, consensus, certificates)
- @bench/contracts: 22 (BenchRegistry.sol)
- @bench/skill: 7 (SDK API calls)
- @usebench/verifier: 6 (cross-package verification)
- @bench/demo-agent: 4 (config)

## Key Decisions
1. Canonical hashing: sorted-key JSON (RFC 8785 subset)
2. Signing: EIP-712 typed data, domain {name:"Bench", version:"2", chainId:196}
3. Auth: API keys for writes, public reads
4. Database: PostgreSQL + Redis, quote cache TTL=12s
5. Single-source certs: WARNING with disclaimer
6. Solidity: internal _anchorCertificate helper (fixed spec bug)
7. Deferred: 0x, Bebop, Titan, Firebird, DODO, MetaMask, Socket, Matcha (DO_LATER.md)

## Next Steps
- Phase 10: Post-trade verifier worker
- Phase 15: Polish, README, demo video, submission
- Connect to GitHub remote and push
- Deploy: Explorer to Vercel, API to Railway, contract to X Layer testnet
