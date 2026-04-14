# Bench — The NBBO of Autonomous Agent Trading

**Multi-source best-execution oracle.** Bench queries 12+ DEX aggregators in parallel, computes the consensus best price, and produces cryptographically-signed certificates that any agent can use to prove optimal execution.

No single aggregator can tell you when sources disagree. Bench can.

---

## Live Deployments

| Component | URL / Address |
|-----------|---------------|
| **Explorer** | [bench-explorer-five.vercel.app](https://bench-explorer-five.vercel.app) |
| **Attestor API** | [attestor-production-b1ad.up.railway.app](https://attestor-production-b1ad.up.railway.app/health) |
| **BenchRegistry.sol** | [`0x6a400d858daA46C9f955601B672cc1a8899DcE3f`](https://www.okx.com/web3/explorer/xlayer/address/0x6a400d858daA46C9f955601B672cc1a8899DcE3f) on X Layer Mainnet (chain 196) |
| **Agentic Wallet** | `0x5a6Ad7E615E82B3d3eE2f70c4F4dF38f224ACcd1` (attestor + demo agent identity) |

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
| **Tier 1 (EVM)** | OKX (via Onchain OS MCP), 1inch, Velora, Odos, KyberSwap, CoW Swap, Uniswap AI, OpenOcean | Single-chain EVM swaps |
| **Tier 2 (Solana)** | Jupiter | Solana swaps |
| **Tier 3 (Cross-chain)** | LI.FI, Squid, Rango | Cross-chain swaps |

**13 independent sources.** No single aggregator controls the consensus.

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

**BenchRegistry.sol** deployed at `0x6a400d858daA46C9f955601B672cc1a8899DcE3f` on X Layer Mainnet (chain 196):
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

### OKX DEX MCP Server (Primary Integration)

Bench integrates the OKX DEX Aggregator via the **Onchain OS MCP server** (`packages/attestor/src/adapters/okx-mcp.ts`). The adapter calls the `dex-okx-dex-quote` MCP tool to query aggregated quotes across 500+ DEX liquidity sources, contributing to the multi-source consensus. MCP server config is in `mcp-config.json`.

OKX Onchain OS MCP tools used:
- `dex-okx-dex-quote` -- aggregated quotes across 500+ DEX sources
- `dex-okx-dex-supported-chains` -- blockchain network discovery
- `dex-okx-dex-liquidity` -- active DEX source identification

### Agentic Wallet

The demo agent operates with a persistent on-chain identity (Agentic Wallet) at `0x5a6Ad7E615E82B3d3eE2f70c4F4dF38f224ACcd1` on X Layer. This wallet:
- Signs every Best Execution Certificate via EIP-712
- Receives certification history linked to its address on-chain
- Builds a verifiable reputation via `BenchRegistry.getAgentStats()`
- Executes certified swaps autonomously (DCA strategy)

### Uniswap AI Smart Route

Uniswap AI is integrated as a first-class consensus source (`packages/attestor/src/adapters/uniswap-ai.ts`). It queries the Uniswap routing API for V2/V3/Mixed pool quotes across 9 chains, contributing to every Best Execution Certificate.

### X Layer

All certificates are anchored on **X Layer Mainnet** via BenchRegistry.sol (`0x6a400d858daA46C9f955601B672cc1a8899DcE3f`, chain 196) with zero gas fees. The contract stores cert hashes, certification levels, agreement scores, and agent statistics on-chain.

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

## OKX Build X Hackathon

**Arena:** X Layer Arena

| Requirement | How Bench Satisfies It |
|-------------|----------------------|
| **Built on X Layer** | BenchRegistry.sol deployed at `0x6a400d858daA46C9f955601B672cc1a8899DcE3f` on **X Layer Mainnet** (chain 196) |
| **Agentic Wallet** | `0x5a6Ad7E615E82B3d3eE2f70c4F4dF38f224ACcd1` -- signs certs, deploys contracts, builds on-chain reputation |
| **Onchain OS skill** | OKX DEX MCP adapter (`okx-mcp.ts`) queries `dex-okx-dex-quote` as consensus data source |
| **Uniswap skill** | Uniswap AI Smart Route adapter (`uniswap-ai.ts`) as first-class source |
| **Public repo** | [github.com/rajkaria/bench](https://github.com/rajkaria/bench) |

**Built for the OKX Build X Hackathon**

[usebench.xyz](https://usebench.xyz) | [@usebench](https://x.com/usebench)
