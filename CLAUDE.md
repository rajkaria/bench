# Bench v2 — Project Context

## What This Is
Multi-source best-execution oracle for autonomous agent trading. Queries 15+ DEX aggregators in parallel, computes consensus best price, signs cryptographic certificates (BEC v2).

## Architecture
- **Turborepo monorepo** with pnpm workspaces
- `packages/shared` — Types (BEC v2, QuoteRequest, BaseAdapter), canonical hashing (RFC 8785 subset), EIP-712 signing
- `packages/db` — PostgreSQL schema + Redis cache layer
- `packages/attestor` — Hono API server (Phase 2+)
- `packages/contracts` — BenchRegistry.sol on X Layer (Phase 5)
- `apps/explorer` — Next.js 15 dashboard (Phase 9)
- `apps/demo-agent` — Reference DCA agent (Phase 8)

## Key Decisions Made
1. **Canonical hashing**: Sorted-key JSON serialization (RFC 8785 subset). No whitespace, undefined fields omitted, BigInts as quoted decimal strings.
2. **Signing**: EIP-712 typed data signing with domain `{name: "Bench", version: "2", chainId: 196}`. Future-proofed for on-chain ecrecover verification.
3. **Auth**: API keys for write endpoints, public reads. SIWE deferred to DO_LATER.md.
4. **Database**: PostgreSQL + Redis from day 1. Quote cache TTL = 12s (one EVM block).
5. **Single-source certs**: Issue WARNING (not FAILED) with explicit disclaimer.
6. **Solidity fix**: `batchAnchor` uses internal `_anchorCertificate` helper (spec's `external` call was a bug).
7. **Deferred integrations**: 0x (paid), Bebop (partner key), Titan (unverified), Firebird, DODO, MetaMask Swap, Socket, Matcha. See DO_LATER.md.

## Phase Status
- [x] Phase 1: Foundations (monorepo, shared types, hashing, signing, DB schema)
- [ ] Phase 2: Source Adapters
- [ ] Phase 3: Multi-Source Aggregator Service
- [ ] Phase 4: Certificate Generation
- [ ] Phase 5: Smart Contract
- [ ] Phase 6-15: See BENCH_OKX_HACKATHON_BUILD_SPEC.md

## Test Coverage
- 58 tests passing in packages/shared (canonical hashing, cert hashing, EIP-712 signing, consensus logic)

## Adapters in Registry (15 confirmed)
OKX, 1inch, Velora, Odos, KyberSwap, CoW Swap, Uniswap AI, OpenOcean, Jupiter, LI.FI, Squid, Rango (12 free/no-key sources + 3 requiring API keys)

Missing from spec's 21: 0x (paid), Bebop (partner), Titan (unverified), Firebird, DODO, MetaMask Swap, Socket, Matcha — all deferred.

## Running
```bash
pnpm install
pnpm --filter @bench/shared test     # 58 tests
pnpm --filter @bench/shared build    # Builds to dist/
pnpm run generate-keypair            # Attestor keypair
```
