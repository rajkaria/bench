# Bench v2 — Project Context

## What This Is
Multi-source best-execution oracle for autonomous agent trading. Queries 12 DEX aggregators in parallel, computes consensus best price, signs cryptographic certificates (BEC v2).

## Architecture
- **Turborepo monorepo** with pnpm workspaces
- `packages/shared` — Types (BEC v2, QuoteRequest, BaseAdapter), canonical hashing, EIP-712 signing
- `packages/db` — PostgreSQL schema + Redis cache layer
- `packages/attestor` — 12 source adapters, consensus engine, certificate builder, Hono API
- `packages/contracts` — BenchRegistry.sol on X Layer (Solidity 0.8.24)
- `apps/explorer` — Next.js 15 dashboard (Phase 9)
- `apps/demo-agent` — Reference DCA agent (Phase 8)

## Key Decisions
1. **Canonical hashing**: Sorted-key JSON serialization (RFC 8785 subset)
2. **Signing**: EIP-712 typed data signing, domain `{name: "Bench", version: "2", chainId: 196}`
3. **Auth**: API keys for writes, public reads. SIWE deferred (DO_LATER.md)
4. **Database**: PostgreSQL + Redis. Quote cache TTL = 12s
5. **Single-source certs**: WARNING with disclaimer (not FAILED)
6. **Solidity**: `_anchorCertificate` internal helper fixes spec's external-call bug
7. **Deferred**: 0x, Bebop, Titan, Firebird, DODO, MetaMask Swap, Socket, Matcha (DO_LATER.md)

## Phase Status
- [x] Phase 1: Foundations (monorepo, shared types, hashing, signing, DB schema)
- [x] Phase 2: Source Adapters (12 adapters: OKX, 1inch, Velora, Odos, Kyber, CoW, Uniswap AI, OpenOcean, Jupiter, LI.FI, Squid, Rango)
- [x] Phase 3: Multi-Source Aggregator + Consensus Engine
- [x] Phase 4: Certificate Builder + Hono API (/v1/certify, /v1/verify, /health)
- [x] Phase 5: BenchRegistry.sol + Hardhat tests + deploy script
- [ ] Phase 6: Bench Skill (Onchain OS)
- [ ] Phase 7: Verifier Libraries
- [ ] Phase 8: Reference Demo Agent
- [ ] Phase 9: Bench Explorer (Next.js dashboard)
- [ ] Phase 10: Post-Trade Verifier
- [ ] Phase 15: Polish & Submission

## Test Coverage — 232 total
- `@bench/shared`: 58 tests (hashing, signing, consensus logic)
- `@bench/attestor`: 152 tests (adapters, consensus engine, certificate builder)
- `@bench/contracts`: 22 tests (BenchRegistry.sol — access control, events, batch, pagination)

## Running
```bash
pnpm install
pnpm --filter @bench/shared test        # 58 tests
pnpm --filter @bench/attestor test      # 152 tests
cd packages/contracts && npx hardhat test  # 22 tests
```

## Next Steps
Phase 6 (Bench Skill) or Phase 9 (Explorer) — user decides priority.
Need API keys configured in .env before running live adapter queries.
