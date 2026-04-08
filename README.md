# Bench — The NBBO of Autonomous Agent Trading

**Multi-source best-execution oracle.** Bench queries 12+ DEX aggregators in parallel, computes the consensus best price, and produces cryptographically-signed certificates that any agent can use to prove optimal execution.

No single aggregator can tell you when sources disagree. Bench can.

---

## How It Works

```
Agent wants to swap 1000 USDC -> WETH on X Layer

        |
        v

   Bench queries 12 aggregators in parallel (3s timeout)
   ├── 1inch:        0.42051 WETH   (198ms)
   ├── OKX:          0.42050 WETH   (142ms)
   ├── Velora:       0.42040 WETH   (187ms)
   ├── Odos:         0.42040 WETH   (312ms)
   ├── Uniswap AI:   0.42030 WETH   (178ms)  <- agent's chosen route
   ├── KyberSwap:    0.42020 WETH   (256ms)
   ├── OpenOcean:    0.41960 WETH   (367ms)
   ├── CoW Swap:     TIMEOUT
   └── ...

        |
        v

   Consensus: best = 0.42051 (1inch), agreement = 92/100 (STRONG)
   Agent's route: 0.42030 (5 bps from best)
   Result: CERTIFIED ✅

        |
        v

   Signed certificate anchored on X Layer (zero gas fees)
   Verifiable by anyone using @usebench/verifier
```

## Quick Start

```bash
# Install
pnpm install

# Run tests (257 total)
pnpm --filter @bench/shared test        # 58 tests  — hashing, signing, consensus logic
pnpm --filter @bench/attestor test      # 160 tests — adapters, consensus engine, certs
pnpm --filter @bench/skill test         # 7 tests   — SDK
pnpm --filter @usebench/verifier test   # 6 tests   — independent verification
pnpm --filter @bench/demo-agent test    # 4 tests   — agent config
cd packages/contracts && npx hardhat test  # 22 tests  — smart contract

# Generate attestor keypair
npx tsx scripts/generate-keypair.ts

# Start the attestor API
cp .env.example .env  # Fill in your API keys
pnpm --filter @bench/attestor dev

# Start the explorer
pnpm --filter @bench/explorer dev

# Start the demo agent
pnpm --filter @bench/demo-agent start
```

## Architecture

```
bench/
├── packages/
│   ├── shared/          # BEC v2 types, canonical hashing, EIP-712 signing
│   ├── db/              # PostgreSQL schema + Redis cache
│   ├── attestor/        # Multi-source aggregator + consensus engine + Hono API
│   │   ├── adapters/    # 12 source adapters (OKX, 1inch, Velora, Odos, ...)
│   │   ├── services/    # Consensus engine, certificate builder
│   │   ├── routes/      # /v1/certify, /v1/verify, /v1/execution
│   │   └── workers/     # Post-trade verifier, aggregator reputation
│   ├── contracts/       # BenchRegistry.sol (X Layer)
│   ├── skill/           # Onchain OS plugin + BenchSkill SDK
│   └── verifier-ts/     # @usebench/verifier (independent, zero internal deps)
├── apps/
│   ├── explorer/        # Next.js 15 dashboard (usebench.xyz)
│   └── demo-agent/      # Reference DCA bot on X Layer
└── docs/
```

## Source Aggregators

Bench queries the relevant subset for each swap:

| Tier | Aggregators | When Queried |
|------|-------------|-------------|
| **Tier 1 (EVM)** | OKX, 1inch, Velora, Odos, KyberSwap, CoW Swap, Uniswap AI, OpenOcean | Single-chain EVM swaps |
| **Tier 2 (Solana)** | Jupiter | Solana swaps |
| **Tier 3 (Cross-chain)** | LI.FI, Squid, Rango | Cross-chain swaps |

**12 independent sources.** No single aggregator controls the consensus.

## Best Execution Certificate (BEC v2)

Every certification produces a signed JSON certificate containing:

- **Multi-source breakdown**: what every aggregator returned at that block
- **Consensus analysis**: median, stddev, agreement score (0-100)
- **Certification level**: CERTIFIED (< 10 bps), WARNING (10-50 bps), FAILED (> 50 bps)
- **EIP-712 signature**: verifiable on-chain via ecrecover
- **On-chain anchor**: cert hash stored in BenchRegistry.sol on X Layer

## Integration (One Line)

```typescript
import { BenchSkill } from '@bench/skill';

const bench = new BenchSkill();
const cert = await bench.certifySwap({
  chainId: 196,
  inputToken: '0xUSDC...',
  outputToken: '0xWETH...',
  amount: '1000000000',
  chosenSource: 'uniswap-v3',
  chosenOutput: '420300000000000000',
  walletAddress: '0xYourAgent...',
});

if (cert.quality.certificationLevel === 'CERTIFIED') {
  // Execute with confidence
}
```

## Independent Verification

```typescript
import { verifyCertificate } from '@usebench/verifier';

const result = await verifyCertificate(cert);
// result.valid === true
// result.checks.hashValid === true
// result.checks.signatureValid === true
```

The verifier has **zero dependencies** on Bench internals. It re-implements canonical hashing and EIP-712 verification from scratch.

## Smart Contract

**BenchRegistry.sol** on X Layer (chain 196):
- `anchorCertificate()`: store cert hash, level, agreement score on-chain
- `batchAnchor()`: gas-efficient multi-cert anchoring
- `markExecutionVerified()`: post-trade HONORED/VIOLATED events
- `getAgentStats()`: on-chain certification history
- Zero gas fees on X Layer

## Explorer (usebench.xyz)

- **Live Feed**: real-time certificate stream
- **Certificate Detail**: multi-source visualization showing every aggregator's quote
- **Aggregator Leaderboard**: which aggregators consistently return the best prices
- **Agent Profiles**: Bench Score, certification history, honor rate
- **Badge API**: embeddable SVG badges (`/api/badge/0xYourAgent`)

## Onchain OS Integration

Bench uses these OKX Onchain OS skills as core data sources:
- OKX DEX Aggregator (smart routing across 500+ DEXs)
- OKX DEX Token (token metadata)
- OKX DEX Market (market data)

Plus Uniswap AI Smart Route as a first-class source.

All certificates are anchored on **X Layer** with zero gas fees.

## Test Coverage

**257 tests** across 6 packages:

| Package | Tests | What's Covered |
|---------|-------|----------------|
| @bench/shared | 58 | Canonical hashing, EIP-712 signing, consensus logic |
| @bench/attestor | 160 | 12 adapters, consensus engine, certificate builder, reputation |
| @bench/contracts | 22 | Access control, events, batch ops, pagination |
| @bench/skill | 7 | SDK API calls, auth headers |
| @usebench/verifier | 6 | Cross-package hash + signature verification |
| @bench/demo-agent | 4 | Config validation |

## Why Bench Exists

Every autonomous agent today trusts whichever single aggregator it happens to integrate with. There's no neutral arbiter. No consensus benchmark. No proof of optimal execution.

**Bench is the NBBO for agent trading.** It queries every aggregator, finds the consensus best price, and signs an attestation that proves it. The attestation is verifiable by anyone, anywhere, without trusting Bench.

Once one agent shows a "Bench NBBO" badge, every other agent has to integrate or look like a black box.

---

**Built for the OKX Build X Hackathon (Skills Arena)**

[usebench.xyz](https://usebench.xyz) | [@usebench](https://x.com/usebench)
