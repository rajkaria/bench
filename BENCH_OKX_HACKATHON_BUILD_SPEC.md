# Bench v2 — The NBBO of Autonomous Agent Trading

## Build Spec for OKX Build X Hackathon

**Hackathon:** OKX Build X — Build with Onchain OS
**URL:** https://web3.okx.com/xlayer/build-x-hackathon
**Submission Deadline:** April 15, 2026 — 23:59 UTC
**Arena:** Skills Arena (primary submission)
**Total Prize Pool:** $14,000 USDT
**Target Prizes:** $2,000 (1st Skills Arena) + $500 (Most Active Agent) + $500 (Best Uniswap Integration) + $500 (Most Popular) = **up to $3,500**
**Stretch Goal:** Onchain OS Official Partnership + Featured spot on Plugin Store

---

## THE ONE THING THAT DEFINES BENCH

> **Bench is the only neutral, multi-source, cryptographically-verifiable execution-quality oracle for autonomous agents — the NBBO of agent trading.**

Not a router. Not a wrapper around any single aggregator. Bench is the **independent referee** that queries every major DEX aggregator simultaneously, finds the consensus best price, and proves the agent's execution against that consensus in a way anyone can verify without trusting Bench itself.

This is the single sentence that should appear on the homepage, in the README, in the demo video, and in the X post.

### Why "NBBO" is the Right Frame

In US equities trading, the **National Best Bid and Offer (NBBO)** is a regulated benchmark aggregated from multiple exchanges. Brokers are legally required to honor the NBBO when executing customer orders. It's the foundational trust primitive that makes equities markets work — a neutral, multi-source consensus that no single exchange controls.

Crypto agent trading has no such primitive today. Every agent trusts whichever aggregator they happen to integrate with. There's no neutral arbiter. There's no consensus benchmark. There's no proof of optimal execution.

**Bench is the NBBO for agent trading.** It queries every aggregator, finds the consensus best price, and signs an attestation that proves it. The attestation is verifiable by anyone, anywhere, without trusting Bench.

Once one agent shows a "Bench NBBO ✓" badge, every other agent has to integrate or look like a black box. That's the network effect lock-in.

---

## THE REFRAMING — WHAT CHANGED FROM V1

The original Bench spec had a hidden flaw: it trusted OKX's DEX aggregator as the definition of "optimal." This made Bench a thin wrapper around OKX rather than an independent verifier. A skeptical judge could ask: *"Why do I need Bench? I could just use OKX directly."*

**v2 fixes this fundamental gap.** Bench is no longer a wrapper around any single aggregator. It is a **multi-source consensus engine** that queries every major DEX aggregator simultaneously, computes the consensus best price, and certifies trades against that consensus.

### What's New in v2

1. **Multi-source query pipeline** — Bench queries 12+ aggregators per certification, not just OKX
2. **Source Agreement Score** — measures how much the aggregators agree, surfaces low-confidence cases
3. **Consensus Best Price** — the optimal output is determined by consensus, not a single source
4. **Source-by-source receipts** — every certificate shows exactly what each aggregator returned at the timestamp
5. **Independent verification** — anyone can replay the same queries against the same aggregators and confirm the certificate
6. **Aggregator Reputation** — track which aggregators consistently return the best prices (a meta-leaderboard)
7. **Honest failure modes** — when sources disagree or one source is down, the certificate reflects that transparently

### What Stayed the Same

- The Best Execution Certificate (BEC) concept — a signed attestation per swap
- The Bench Score for agents (reputation primitive)
- The Bench Registry on X Layer (on-chain anchoring)
- The Bench Explorer dashboard (public verification UI)
- The Reference Demo Agent (for the Most Active Agent prize)
- The Framework Adapters (for distribution and network effects)
- The Compliance Mode (for regulated entities)

---

## STRATEGIC CONTEXT

### The Hackathon

OKX launched Onchain OS in March 2026 as their AI agent infrastructure: 9 skills, 72 features, x402 protocol with **zero gas fees on X Layer**, and smart routing across **500+ DEXs and 60+ chains**. The Build X Hackathon exists to bootstrap the ecosystem of skills and apps built on top of this platform.

**Judging weights:**
- Onchain OS / Uniswap integration depth: 25%
- X Layer ecosystem integration: 25%
- AI interactive experience: 25%
- Product completeness: 25%

**Two judging panels:**
- AI judges automatically scan GitHub repos and on-chain transaction history
- Human judges evaluate creativity and practicality

### Why Bench v2 Wins Even Harder

**1. It uses OKX as a first-class source — but doesn't depend on it.**
The OKX DEX aggregator is one of the strongest aggregators in the universe. Bench uses it. But Bench also uses 11+ others. This proves Bench takes integration seriously without making OKX the only source of truth. Judges will see: *"This project uses our aggregator deeply, but it's also rigorous and independent — exactly what a real attestation service should be."*

**2. It hits maximum integration depth.**
The judging rubric weighs integration at 25%. By using OKX DEX, OKX Aggregator, OKX Onchain Gateway, OKX Wallet Portfolio, OKX DEX Token, OKX DEX Market, OKX DEX Signal, AND Uniswap AI skills together as the foundation of a multi-source consensus engine, Bench achieves the maximum possible integration depth.

**3. It can never be commoditized.**
Any single-source attestation service can be replaced by the source itself. Multi-source consensus is harder to replicate, requires more infrastructure, and creates real network effects. Bench has a defensible moat.

**4. It aligns with regulatory positioning.**
OKX has a Payment Institution license in Malta under MiCA. They care about regulatory readiness. Bench v2 is structurally analogous to MIFID II's best-execution disclosure requirements and the NBBO regime in US equities. This is exactly the narrative their PR team will want to amplify: *"Crypto's first regulated-grade execution oracle."*

---

## SOURCE UNIVERSE — ALL AGGREGATORS BENCH QUERIES

Bench queries the following aggregators on every certification request. The list is intentionally large — the more sources, the stronger the consensus.

### Tier 1: Universal EVM Aggregators (always queried for EVM swaps)

| # | Source | API | Coverage | Why It Matters |
|---|---|---|---|---|
| 1 | **OKX DEX Aggregator** | api.okx.com | 500+ DEXs, 60+ chains | Hackathon partner, world-class routing |
| 2 | **1inch Pathfinder** | api.1inch.dev | 400+ liquidity sources, 12 chains | 59% of EVM aggregator volume in 2025 |
| 3 | **0x Swap API** | api.0x.org | RFQ system + on-chain DEXs, 16 chains | RFQ from professional market makers |
| 4 | **Velora (formerly ParaSwap)** | api.paraswap.io | 9 chains, $100B+ historical volume | Strong gas optimization |
| 5 | **Odos** | api.odos.xyz | 16 chains, optimized for large trades | Best for large-trade routing |
| 6 | **KyberSwap** | aggregator-api.kyberswap.com | EVM chains, AMM specialist | Strong AMM coverage |
| 7 | **CoW Swap (CoW Protocol)** | api.cow.fi | Batch auctions, MEV protection | Different routing model (intent-based) |
| 8 | **Bebop** | api.bebop.xyz | 11 chains, RFQ-focused | Independent quote source |
| 9 | **Uniswap AI Smart Route** | uniswap-ai SDK | Direct Uniswap routing | **Hackathon prize: Best Uniswap Integration** |
| 10 | **OpenOcean** | open-api.openocean.finance | Multi-chain meta-aggregator | Aggregates other aggregators |

### Tier 2: Solana-Native Aggregators (queried for Solana swaps)

| # | Source | API | Why It Matters |
|---|---|---|---|
| 11 | **Jupiter** | quote-api.jup.ag | Dominant Solana aggregator |
| 12 | **Titan** | api.titandex.io | Independent Solana aggregator |
| 13 | **OpenOcean Solana** | open-api.openocean.finance | Solana meta-aggregator |

### Tier 3: Cross-Chain Aggregators (queried when cross-chain swaps are involved)

| # | Source | API | Why It Matters |
|---|---|---|---|
| 14 | **LI.FI** | li.quest | Cross-chain bridge + DEX |
| 15 | **Squid (Axelar)** | api.squidrouter.com | Cross-chain via Axelar |
| 16 | **Rango** | api.rango.exchange | 70+ chains, 360+ DEX/bridge connections |
| 17 | **Socket** | api.socket.tech | Cross-chain liquidity |

### Tier 4: Specialized Sources (optional, queried when relevant)

| # | Source | Specialty |
|---|---|---|
| 18 | **Matcha (0x-powered)** | UI-layer aggregator with public quotes |
| 19 | **Firebird** | Multi-chain with custom path optimization |
| 20 | **DODO Route** | PMM-based routing |
| 21 | **MetaMask Swap API** | Aggregates 1inch, 0x, Paraswap, Airswap |

### Total Source Count

- **Tier 1 (EVM):** 10 aggregators
- **Tier 2 (Solana):** 3 aggregators
- **Tier 3 (Cross-chain):** 4 aggregators
- **Tier 4 (Specialized):** 4 aggregators
- **Total:** **21 distinct sources**

Bench queries the relevant subset for each swap (typically 8–12 sources for a single-chain EVM swap, 3–5 for Solana, 4–7 for cross-chain). This is **far beyond what any single aggregator can offer**, because each individual aggregator only queries its own connected liquidity sources.

---

## CORE CONCEPTS

### 1. Best Execution Certificate v2 (BEC v2)

A signed JSON object that proves an agent's chosen swap route was within an acceptable slippage delta from the **consensus best price** discovered by querying multiple DEX aggregators in parallel at a specific block.

### 2. Consensus Best Price

The "optimal" output amount used as the benchmark for certification. Computed from the multi-source query as follows:

```
Step 1: Collect all successful source responses
Step 2: Filter outliers (responses > 2 standard deviations from median)
Step 3: Take the maximum output amount among non-outlier responses
Step 4: Record which source(s) provided that maximum
```

The consensus best price is **not** simply "the highest number any source returned." Outliers (e.g., a source returning a wildly optimistic price due to stale data) are filtered out. This protects against manipulation by a single buggy or malicious source.

### 3. Source Agreement Score

A metric (0–100) that measures how much the queried sources agree on the best price. High agreement = high confidence cert. Low agreement = transparency warning.

```
Source Agreement Score = 100 × (1 - (stddev / median))
```

| Score Range | Tier | Visual | Meaning |
|---|---|---|---|
| 90–100 | Strong | 🟢 | All sources agree within 1% |
| 70–89 | Moderate | 🟡 | Minor disagreement |
| 50–69 | Weak | 🟠 | Significant disagreement, manual review |
| 0–49 | None | 🔴 | Sources contradict each other |

When agreement is below 70, the certificate is flagged as LOW_CONFIDENCE.

### 4. Three-Tier Certification

Certification level is computed against the **consensus best**, not any single source:

- **CERTIFIED** — Within 10 bps of consensus best AND Source Agreement ≥ 70
- **WARNING** — 10–50 bps worse, OR Source Agreement is 50–69
- **FAILED** — 50+ bps worse, OR Source Agreement < 50

### 5. Pre-Trade + Post-Trade Verification

Bench operates in two phases:

**Pre-Trade Certificate:** Multi-source query → consensus → comparison → signed cert (before execution).

**Post-Trade Verification:** After the swap executes, Bench compares actual output to predicted output. Marks the cert HONORED or VIOLATED. Catches MEV sandwiches and slippage-time issues.

### 6. Bench Score (Agent Reputation)

A 0–100 reputation score per agent:
- 50% Certification Rate
- 30% Average Slippage Delta
- 15% Honor Rate
- 5% Volume Consistency

### 7. Aggregator Reputation Score (NEW in v2)

A meta-leaderboard tracking which aggregators consistently return the best prices. Scored by:
- 50% Best Rate (how often this aggregator returned the consensus best)
- 20% Consistency
- 20% Uptime
- 10% Latency

This becomes a public leaderboard at usebench.xyz/aggregators. Aggregators will compete to top this list — excellent organic distribution for Bench.

---

## ARCHITECTURE OVERVIEW

```
                    ┌─────────────────────────────────────────────┐
                    │        AGENT (any framework / SDK)           │
                    │  Eliza, LangChain, OpenClaw, Claude Code,    │
                    │  custom Python/TS agents, trading bots       │
                    └──────────────┬──────────────────────────────┘
                                   │
                                   │  1. Pre-trade: "Get cert for this swap"
                                   ▼
              ┌─────────────────────────────────────────────────────┐
              │            BENCH SKILL (Onchain OS Plugin)          │
              │  Wraps OKX skills + Uniswap AI                        │
              └──────────────┬──────────────────────────────────────┘
                             │
                             ▼
              ┌─────────────────────────────────────────────────────┐
              │      BENCH MULTI-SOURCE AGGREGATOR (Backend)        │
              │                                                       │
              │  Source Adapters fire in parallel:                    │
              │  ┌──────────────┐  ┌──────────────────────────────┐  │
              │  │ OKX Adapter  │  │  Source Responses (10+):     │  │
              │  │ 1inch        │  │  - OKX:    0.4205            │  │
              │  │ 0x           │  │  - 1inch:  0.4205            │  │
              │  │ Velora       │  │  - 0x:     0.4201            │  │
              │  │ Odos         │  │  - Velora: 0.4204            │  │
              │  │ Kyber        │  │  - Odos:   0.4204            │  │
              │  │ CoW Swap     │  │  - Kyber:  0.4202            │  │
              │  │ Bebop        │  │  - CoW:    timeout            │  │
              │  │ Uniswap AI   │  │  - Bebop:  0.4198            │  │
              │  │ OpenOcean    │  │  - UniAI:  0.4203            │  │
              │  │ + 12 more    │  │  - OpOcean:0.4196            │  │
              │  └──────────────┘  └──────────────────────────────┘  │
              │                                                       │
              │  Consensus Engine:                                    │
              │  - Filter outliers (>2σ from median)                  │
              │  - Compute consensus best: 0.4205 (1inch, OKX tied)   │
              │  - Source Agreement Score: 92/100 (STRONG)            │
              │  - Compare chosen route: CERTIFIED                    │
              │                                                       │
              │  Sign with secp256k1 → Store in Postgres → Anchor    │
              └──────────────┬──────────────────────────────────────┘
                             │
                             ▼
              ┌─────────────────────────────────────────────────────┐
              │       BENCH REGISTRY (X Layer Smart Contract)       │
              │   anchorCertificate(certHash, agent, level, score)    │
              └──────────────┬──────────────────────────────────────┘
                             │
                             ▼
              ┌─────────────────────────────────────────────────────┐
              │      POST-TRADE VERIFIER + EXPLORER DASHBOARD         │
              │   usebench.xyz — public verification + leaderboards  │
              └─────────────────────────────────────────────────────┘
```

---

## MULTI-SOURCE QUERY PIPELINE — DETAILED FLOW

### Step 1: Request Validation
- Validate input/output token addresses
- Validate amount and chain ID
- Check agent address is properly formatted

### Step 2: Source Selection
Based on chain ID, select relevant aggregator tier:
- **EVM single-chain:** Tier 1 (10 EVM aggregators)
- **Solana single-chain:** Tier 2 (3 Solana aggregators)
- **Cross-chain:** Tier 3 (4 cross-chain aggregators)

For each source, check chain support before adding to query queue.

### Step 3: Parallel Query Execution
Fire all queries in parallel with `Promise.allSettled()`:
- 3-second timeout per source
- Exponential backoff (up to 2 retries)
- Consistent request signature for caching

```typescript
const results = await Promise.allSettled(
  selectedSources.map(source =>
    withTimeout(source.adapter.getQuote(req), 3000)
  )
);
```

### Step 4: Outlier Filtering
Compute median across all successful responses. Filter out responses more than 2 standard deviations from the median. This protects against:
- Buggy sources returning unrealistic prices
- Malicious sources attempting to game consensus
- Stale data from slow sources

### Step 5: Consensus Best Price
From filtered responses, find the highest output amount. Record which source provided it.

### Step 6: Source Agreement Score
```
score = 100 × (1 - (filteredStdDev / filteredMedian))
```

### Step 7: Certification Level
Compare chosen route to consensus best. Apply tier rules.

### Step 8: Build, Sign, Store, Anchor
Construct BEC v2, canonicalize, hash, sign with secp256k1, persist, optionally anchor on X Layer.

**Total time budget:** Under 5 seconds (3s parallel queries + 1-2s consensus + signing + DB).

---

## BEST EXECUTION CERTIFICATE V2 FORMAT

```typescript
interface BestExecutionCertificateV2 {
  version: "bench-v2";
  certId: string;                  // UUID v4
  certHash: string;                // SHA-256 of canonical body

  agent: {
    walletAddress: string;
    agentId?: string;
    framework?: string;
  };

  trade: {
    chainId: number;
    blockNumber: number;
    timestamp: number;
    inputToken: TokenInfo;
    outputToken: TokenInfo;
    swapType: "single-chain-evm" | "single-chain-solana" | "cross-chain";
  };

  // NEW in v2: full multi-source query results
  sources: {
    queried: SourceResponse[];     // All sources that were queried
    successful: SourceResponse[];  // Successful responses
    filtered: SourceResponse[];    // After outlier filtering
    failed: SourceFailure[];       // Sources that failed
    queryStartedAt: number;
    queryCompletedAt: number;
    totalQueryDurationMs: number;
  };

  // NEW in v2: consensus analysis
  consensus: {
    best: {
      source: string;              // e.g., "1inch"
      expectedOutput: string;
      expectedOutputFormatted: string;
      route: RouteData;
    };
    median: string;
    stddev: string;
    sourceAgreementScore: number;  // 0-100
    confidenceTier: "STRONG" | "MODERATE" | "WEAK" | "NONE";
    outliersExcluded: SourceResponse[];
  };

  chosen: {
    source: string;
    expectedOutput: string;
    expectedOutputFormatted: string;
    route: RouteData;
  };

  quality: {
    slippageDeltaBps: number;      // vs consensus best
    expectedOutputDelta: string;
    expectedOutputDeltaUsd: number;
    certificationLevel: "CERTIFIED" | "WARNING" | "FAILED";
    reason: string;
  };

  execution?: {
    txHash: string;
    actualOutput: string;
    predictedOutput: string;
    deviationBps: number;
    status: "PENDING" | "HONORED" | "VIOLATED";
    verifiedAt: number;
    mevDetected?: boolean;
  };

  attestor: {
    address: string;
    publicKey: string;
    signature: string;
    signedAt: number;
  };

  onChainAnchor?: {
    contractAddress: string;
    txHash: string;
    blockNumber: number;
    chainId: number;
  };
}

interface SourceResponse {
  source: string;
  expectedOutput: string;
  expectedOutputFormatted: string;
  route: RouteData;
  gasEstimate: string;
  priceImpactBps: number;
  latencyMs: number;
  fetchedAt: number;
}

interface SourceFailure {
  source: string;
  error: string;
  failedAt: number;
}
```

### Example: CERTIFIED with Strong Consensus

```json
{
  "version": "bench-v2",
  "certId": "550e8400-e29b-41d4-a716-446655440000",
  "certHash": "0xa7c4...",
  "agent": {
    "walletAddress": "0x742d35Cc...",
    "agentId": "bench-demo-agent"
  },
  "trade": {
    "chainId": 196,
    "blockNumber": 8472193,
    "swapType": "single-chain-evm",
    "inputToken": { "symbol": "USDC", "amount": "1000000000" },
    "outputToken": { "symbol": "WETH" }
  },
  "sources": {
    "successful": [
      { "source": "1inch", "expectedOutput": "420510000000000000", "latencyMs": 198 },
      { "source": "okx-aggregator", "expectedOutput": "420500000000000000", "latencyMs": 142 },
      { "source": "velora", "expectedOutput": "420400000000000000", "latencyMs": 187 },
      { "source": "odos", "expectedOutput": "420400000000000000", "latencyMs": 312 },
      { "source": "uniswap-ai", "expectedOutput": "420300000000000000", "latencyMs": 178 },
      { "source": "kyber", "expectedOutput": "420200000000000000", "latencyMs": 256 },
      { "source": "0x", "expectedOutput": "420100000000000000", "latencyMs": 234 },
      { "source": "bebop", "expectedOutput": "419800000000000000", "latencyMs": 423 },
      { "source": "openocean", "expectedOutput": "419600000000000000", "latencyMs": 367 }
    ],
    "failed": [
      { "source": "cow-swap", "error": "timeout" }
    ],
    "totalQueryDurationMs": 2843
  },
  "consensus": {
    "best": { "source": "1inch", "expectedOutputFormatted": "0.42051" },
    "sourceAgreementScore": 92,
    "confidenceTier": "STRONG"
  },
  "chosen": {
    "source": "uniswap-v3-direct",
    "expectedOutputFormatted": "0.4203"
  },
  "quality": {
    "slippageDeltaBps": 5,
    "certificationLevel": "CERTIFIED",
    "reason": "Within 10 bps of consensus best (5 bps actual). Source Agreement: 92/100 (STRONG)."
  }
}
```

### Example: FAILED with Low Confidence

```json
{
  "consensus": {
    "best": { "source": "odos", "expectedOutput": "1200000000000" },
    "median": "1000000000000",
    "stddev": "150000000000",
    "sourceAgreementScore": 47,
    "confidenceTier": "NONE"
  },
  "quality": {
    "certificationLevel": "FAILED",
    "reason": "Source agreement too low (47/100). Sources disagree by up to 50% on expected output. This token may have fragmented liquidity or stale data. Manual review strongly recommended."
  }
}
```

This level of transparency is impossible for any single-source aggregator. **It's the entire point of Bench v2.**

---

## SMART CONTRACT (BenchRegistry.sol v2)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BenchRegistry {

    struct AnchorRecord {
        bytes32 certHash;
        address agent;
        uint64 blockNumber;
        uint64 timestamp;
        uint8 certificationLevel;     // 0=FAILED, 1=WARNING, 2=CERTIFIED
        uint8 sourceAgreementScore;   // 0-100 (NEW in v2)
        uint8 sourcesQueried;         // (NEW in v2)
        uint8 sourcesSuccessful;      // (NEW in v2)
        bytes32 attestorSignatureHash;
    }

    address public attestor;
    address public owner;

    mapping(bytes32 => AnchorRecord) public anchors;
    mapping(address => bytes32[]) public agentCerts;
    mapping(address => uint256) public certifiedCount;
    mapping(address => uint256) public warningCount;
    mapping(address => uint256) public failedCount;

    uint256 public totalAnchors;

    event CertificateAnchored(
        bytes32 indexed certHash,
        address indexed agent,
        uint8 certificationLevel,
        uint8 sourceAgreementScore,
        uint8 sourcesQueried,
        uint64 blockNumber
    );

    event ExecutionVerified(
        bytes32 indexed certHash,
        address indexed agent,
        bool honored,
        bytes32 txHash
    );

    modifier onlyAttestor() {
        require(msg.sender == attestor, "Bench: not attestor");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Bench: not owner");
        _;
    }

    constructor(address _attestor) {
        owner = msg.sender;
        attestor = _attestor;
    }

    function anchorCertificate(
        bytes32 certHash,
        address agent,
        uint8 certificationLevel,
        uint8 sourceAgreementScore,
        uint8 sourcesQueried,
        uint8 sourcesSuccessful,
        bytes32 attestorSignatureHash
    ) external onlyAttestor {
        require(anchors[certHash].agent == address(0), "Bench: already anchored");
        require(certificationLevel <= 2, "Bench: invalid level");
        require(sourceAgreementScore <= 100, "Bench: invalid score");

        anchors[certHash] = AnchorRecord({
            certHash: certHash,
            agent: agent,
            blockNumber: uint64(block.number),
            timestamp: uint64(block.timestamp),
            certificationLevel: certificationLevel,
            sourceAgreementScore: sourceAgreementScore,
            sourcesQueried: sourcesQueried,
            sourcesSuccessful: sourcesSuccessful,
            attestorSignatureHash: attestorSignatureHash
        });

        agentCerts[agent].push(certHash);
        totalAnchors++;

        if (certificationLevel == 2) certifiedCount[agent]++;
        else if (certificationLevel == 1) warningCount[agent]++;
        else failedCount[agent]++;

        emit CertificateAnchored(
            certHash,
            agent,
            certificationLevel,
            sourceAgreementScore,
            sourcesQueried,
            uint64(block.number)
        );
    }

    function batchAnchor(
        bytes32[] calldata certHashes,
        address[] calldata agents,
        uint8[] calldata levels,
        uint8[] calldata agreementScores,
        uint8[] calldata sourcesQueried,
        uint8[] calldata sourcesSuccessful,
        bytes32[] calldata sigHashes
    ) external onlyAttestor {
        require(certHashes.length == agents.length, "Bench: length mismatch");
        for (uint256 i = 0; i < certHashes.length; i++) {
            anchorCertificate(
                certHashes[i],
                agents[i],
                levels[i],
                agreementScores[i],
                sourcesQueried[i],
                sourcesSuccessful[i],
                sigHashes[i]
            );
        }
    }

    function markExecutionVerified(
        bytes32 certHash,
        bool honored,
        bytes32 txHash
    ) external onlyAttestor {
        require(anchors[certHash].agent != address(0), "Bench: not found");
        emit ExecutionVerified(certHash, anchors[certHash].agent, honored, txHash);
    }

    function getAgentCerts(
        address agent,
        uint256 offset,
        uint256 limit
    ) external view returns (bytes32[] memory) {
        bytes32[] storage all = agentCerts[agent];
        if (offset >= all.length) return new bytes32[](0);

        uint256 end = offset + limit;
        if (end > all.length) end = all.length;

        bytes32[] memory result = new bytes32[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = all[i];
        }
        return result;
    }

    function getAgentStats(address agent) external view returns (
        uint256 certified,
        uint256 warning,
        uint256 failed,
        uint256 total
    ) {
        certified = certifiedCount[agent];
        warning = warningCount[agent];
        failed = failedCount[agent];
        total = certified + warning + failed;
    }
}
```

The on-chain footprint is minimal — just the cert hash, level, score, and counts. Full multi-source data lives off-chain in PostgreSQL, retrievable by hash.

---

## SOURCE ADAPTERS — COMMON INTERFACE

Each aggregator has its own adapter implementing a common interface. Adding a new aggregator = creating one new file.

### Base Interface

```typescript
// adapters/base-adapter.ts

export interface BaseAdapter {
  name: string;
  displayName: string;
  supportedChains: number[];
  rateLimit: { requestsPerSecond: number; burstCapacity: number };

  supportsChain(chainId: number): boolean;
  getQuote(req: QuoteRequest): Promise<QuoteResponse>;
}

export interface QuoteRequest {
  chainId: number;
  inputToken: string;
  outputToken: string;
  amount: string;
  slippageBps?: number;
  recipientAddress?: string;
}

export interface QuoteResponse {
  expectedOutput: string;
  expectedOutputFormatted: string;
  route: RouteData;
  gasEstimate: string;
  priceImpactBps: number;
  latencyMs: number;
}
```

### Example: OKX Adapter

```typescript
import type { BaseAdapter, QuoteRequest, QuoteResponse } from './base-adapter';
import { signOKXRequest } from '../utils/okx-signing';

export const okxAdapter: BaseAdapter = {
  name: 'okx-aggregator',
  displayName: 'OKX DEX Aggregator',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 196],
  rateLimit: { requestsPerSecond: 10, burstCapacity: 20 },

  supportsChain(chainId: number): boolean {
    return this.supportedChains.includes(chainId);
  },

  async getQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const path = `/api/v5/dex/aggregator/quote`;
    const params = new URLSearchParams({
      chainId: req.chainId.toString(),
      fromTokenAddress: req.inputToken,
      toTokenAddress: req.outputToken,
      amount: req.amount,
      slippage: ((req.slippageBps ?? 50) / 100).toString(),
    });

    const headers = signOKXRequest('GET', `${path}?${params}`, '');
    const response = await fetch(`https://www.okx.com${path}?${params}`, { headers });

    if (!response.ok) throw new Error(`OKX API error: ${response.status}`);

    const data = await response.json();
    const quote = data.data[0];

    return {
      expectedOutput: quote.toTokenAmount,
      expectedOutputFormatted: formatUnits(quote.toTokenAmount, quote.toToken.decimal),
      route: parseOKXRoute(quote),
      gasEstimate: quote.estimateGasFee,
      priceImpactBps: parseFloat(quote.priceImpactPercentage) * 100,
      latencyMs: Date.now() - startTime,
    };
  },
};
```

### Example: 1inch Adapter

```typescript
export const oneinchAdapter: BaseAdapter = {
  name: '1inch',
  displayName: '1inch Pathfinder',
  supportedChains: [1, 56, 137, 43114, 250, 42161, 10, 8453, 100, 324, 1313161554, 8217],
  rateLimit: { requestsPerSecond: 1, burstCapacity: 5 },

  supportsChain(chainId: number): boolean {
    return this.supportedChains.includes(chainId);
  },

  async getQuote(req: QuoteRequest): Promise<QuoteResponse> {
    const startTime = Date.now();
    const url = `https://api.1inch.dev/swap/v6.0/${req.chainId}/quote`;
    const params = new URLSearchParams({
      src: req.inputToken,
      dst: req.outputToken,
      amount: req.amount,
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`1inch API error: ${response.status}`);

    const data = await response.json();
    return {
      expectedOutput: data.dstAmount,
      expectedOutputFormatted: formatUnits(data.dstAmount, data.dstToken.decimals),
      route: parse1inchRoute(data),
      gasEstimate: data.gas?.toString() ?? '0',
      priceImpactBps: 0,
      latencyMs: Date.now() - startTime,
    };
  },
};
```

### Adapter Registry

```typescript
// adapters/index.ts
import { okxAdapter } from './okx-adapter';
import { oneinchAdapter } from './oneinch-adapter';
import { zeroxAdapter } from './zerox-adapter';
import { veloraAdapter } from './velora-adapter';
import { odosAdapter } from './odos-adapter';
import { kyberAdapter } from './kyber-adapter';
import { cowswapAdapter } from './cowswap-adapter';
import { bebopAdapter } from './bebop-adapter';
import { uniswapAIAdapter } from './uniswap-ai-adapter';
import { openoceanAdapter } from './openocean-adapter';
import { jupiterAdapter } from './jupiter-adapter';
import { titanAdapter } from './titan-adapter';
import { lifiAdapter } from './lifi-adapter';
import { squidAdapter } from './squid-adapter';
import { rangoAdapter } from './rango-adapter';

export const adapters = {
  okx: okxAdapter,
  oneinch: oneinchAdapter,
  zerox: zeroxAdapter,
  velora: veloraAdapter,
  odos: odosAdapter,
  kyber: kyberAdapter,
  cowswap: cowswapAdapter,
  bebop: bebopAdapter,
  uniswapAI: uniswapAIAdapter,
  openocean: openoceanAdapter,
  jupiter: jupiterAdapter,
  titan: titanAdapter,
  lifi: lifiAdapter,
  squid: squidAdapter,
  rango: rangoAdapter,
};
```

---

## ATTESTOR SERVICE — CORE LOGIC

### Multi-Source Aggregator Service

```typescript
// services/multi-source-aggregator.ts

import { adapters } from '../adapters';

export const multiSourceAggregator = {
  async query(req: QueryRequest) {
    const startTime = Date.now();
    const selectedAdapters = selectAdaptersForSwapType(req.swapType, req.chainId);

    const results = await Promise.allSettled(
      selectedAdapters.map(adapter =>
        withTimeout(adapter.getQuote(req), 3000)
          .then(response => ({ status: 'success', source: adapter.name, response }))
          .catch(error => ({ status: 'failed', source: adapter.name, error: error.message }))
      )
    );

    const successful: SourceResponse[] = [];
    const failed: SourceFailure[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const inner = result.value;
        if (inner.status === 'success') {
          successful.push({
            source: inner.source,
            ...inner.response,
            fetchedAt: Math.floor(Date.now() / 1000),
          });
        } else {
          failed.push({
            source: inner.source,
            error: inner.error,
            failedAt: Math.floor(Date.now() / 1000),
          });
        }
      }
    }

    return { successful, failed, durationMs: Date.now() - startTime };
  },
};

function selectAdaptersForSwapType(swapType: string, chainId: number) {
  switch (swapType) {
    case 'single-chain-evm':
      return [
        adapters.okx, adapters.oneinch, adapters.zerox,
        adapters.velora, adapters.odos, adapters.kyber,
        adapters.cowswap, adapters.bebop, adapters.uniswapAI,
        adapters.openocean,
      ].filter(a => a.supportsChain(chainId));

    case 'single-chain-solana':
      return [adapters.jupiter, adapters.titan, adapters.openocean];

    case 'cross-chain':
      return [adapters.lifi, adapters.squid, adapters.rango];

    default:
      throw new Error(`Unsupported swap type: ${swapType}`);
  }
}
```

### Consensus Engine

```typescript
// services/consensus.ts

export function computeConsensus(sourceResults: { successful: SourceResponse[]; failed: SourceFailure[] }): ConsensusResult {
  const successful = sourceResults.successful;

  if (successful.length === 0) throw new Error('No sources returned valid quotes');

  if (successful.length === 1) {
    return {
      best: successful[0],
      median: successful[0].expectedOutput,
      stddev: '0',
      sourceAgreementScore: 0,
      confidenceTier: 'NONE',
      filtered: successful,
      outliersExcluded: [],
    };
  }

  const outputs = successful.map(r => BigInt(r.expectedOutput));
  const median = computeMedian(outputs);
  const stddev = computeStdDev(outputs, median);

  // Filter outliers (>2 std dev from median)
  const filtered = successful.filter(r => {
    const diff = abs(BigInt(r.expectedOutput) - median);
    return diff <= 2n * stddev;
  });

  const outliersExcluded = successful.filter(r => !filtered.includes(r));

  const filteredOutputs = filtered.map(r => BigInt(r.expectedOutput));
  const filteredMedian = computeMedian(filteredOutputs);
  const filteredStdDev = computeStdDev(filteredOutputs, filteredMedian);

  const best = filtered.reduce((max, current) =>
    BigInt(current.expectedOutput) > BigInt(max.expectedOutput) ? current : max
  );

  const agreementScore = computeAgreementScore(filteredMedian, filteredStdDev);
  const confidenceTier = scoreToTier(agreementScore);

  return {
    best,
    median: filteredMedian.toString(),
    stddev: filteredStdDev.toString(),
    sourceAgreementScore: agreementScore,
    confidenceTier,
    filtered,
    outliersExcluded,
  };
}

function computeAgreementScore(median: bigint, stddev: bigint): number {
  if (median === 0n) return 0;
  const ratio = Number(stddev * 10000n / median) / 10000;
  const score = Math.round(100 * (1 - ratio));
  return Math.max(0, Math.min(100, score));
}

function scoreToTier(score: number): 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE' {
  if (score >= 90) return 'STRONG';
  if (score >= 70) return 'MODERATE';
  if (score >= 50) return 'WEAK';
  return 'NONE';
}
```

---

## BENCH EXPLORER — KEY UI

### Certificate Detail Page (the killer screenshot)

```
┌──────────────────────────────────────────────────────────────┐
│  CERTIFICATE 0xa7c4...e3f1                       [Verify]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Status: CERTIFIED ✅                                         │
│  Slippage Delta: 5 bps                                       │
│  Confidence: STRONG (Agreement Score: 92/100)                │
│                                                               │
│  ── SWAP ──                                                   │
│  Agent:    0x742d35... (bench-demo-agent)                  │
│  Chain:    X Layer (196)                                      │
│  Block:    8472193                                            │
│  Trade:    1000.0 USDC → WETH                                 │
│  Chosen:   0.4203 WETH (Uniswap V3)                          │
│                                                               │
│  ── MULTI-SOURCE QUERY (10 sources) ──                       │
│                                                               │
│   1inch              ████████████████████ 0.42051 ⭐ BEST    │
│   OKX Aggregator     ████████████████████ 0.42050            │
│   Velora             ████████████████████ 0.42040            │
│   Odos               ████████████████████ 0.42040            │
│   Uniswap AI         ████████████████████ 0.42030  ← chosen │
│   Kyber              ████████████████████ 0.42020            │
│   0x                 ████████████████████ 0.42010            │
│   Bebop              ████████████████████ 0.41980            │
│   OpenOcean          ████████████████████ 0.41960            │
│   CoW Swap           ░░░░░░░░░░░░░░░░░░░░ TIMEOUT            │
│                                                               │
│   Median:    0.4203 WETH                                     │
│   Std Dev:   0.0003 WETH (0.07%)                             │
│   Agreement: 92/100 (STRONG)                                 │
│                                                               │
│  ── EXECUTION ──                                              │
│  TX Hash: 0x...                                               │
│  Actual:  0.4203 WETH                                         │
│  Status:  HONORED ✅                                          │
│                                                               │
│  ── ATTESTOR ──                                               │
│  Address:    0xBenchAttestor...                             │
│  Signature:  Valid ✓                                          │
│  Anchor:     X Layer block 8472194 ✓                          │
│                                                               │
│  [Verify Independently] [Download PDF Report] [Embed Badge]   │
└──────────────────────────────────────────────────────────────┘
```

This is the page that wins the demo. **No other project will have anything close to this level of transparency.**

### Aggregator Leaderboard (NEW in v2)

```
┌──────────────────────────────────────────────────────────────┐
│  AGGREGATOR LEADERBOARD                  [7d] [30d] [All]    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Rank │ Aggregator         │ Best Rate │ Uptime │ Avg Latency│
│  ─────┼────────────────────┼───────────┼────────┼────────────│
│  🥇  1│ 1inch Pathfinder  │   34.2%   │ 99.8%  │   180ms    │
│  🥈  2│ OKX DEX Aggregator│   31.7%   │ 99.5%  │   142ms    │
│  🥉  3│ Velora            │   18.4%   │ 98.9%  │   215ms    │
│   4   │ Odos              │   12.1%   │ 99.2%  │   312ms    │
│   5   │ Kyber             │    8.3%   │ 99.0%  │   256ms    │
│   6   │ 0x                │    7.9%   │ 99.6%  │   234ms    │
│   7   │ Uniswap AI        │    6.1%   │ 100%   │   178ms    │
│   8   │ CoW Swap          │    4.8%   │ 95.2%  │   847ms    │
│   9   │ OpenOcean         │    3.2%   │ 97.8%  │   367ms    │
│  10   │ Bebop             │    2.1%   │ 98.4%  │   423ms    │
│                                                               │
│  Best Rate = % of queries where this aggregator returned     │
│  the consensus best price (or within 1 bp of it)             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

This page is **organic distribution gold.** Aggregators will compete to top this leaderboard. They'll tweet about ranking changes. They'll link to usebench.xyz.

---

## REFERENCE DEMO AGENT

A continuously-running agent on X Layer that uses Bench for every swap.

### What It Does

1. Runs every 5 minutes
2. Picks a small swap (e.g., 10 USDC → OKB)
3. Fetches OKX's quote via Onchain OS
4. Calls Bench to certify (Bench queries 10+ sources in parallel)
5. Logs the multi-source breakdown to console
6. Executes the swap if CERTIFIED
7. Reports execution back to Bench for post-trade verification

### Volume Math

Over the 14-day hackathon period:
- ~4,000 swaps × 5 Bench calls each (1 cert + 4 verifications) × 10+ source queries per cert
- = **~200,000 aggregator API calls + ~20,000 OKX-specific Onchain OS calls**

This wins "Most Active Agent" with massive margin.

---

## API KEYS REQUIRED

You'll need accounts/keys for:

| Source | Free Tier | Notes |
|---|---|---|
| **OKX** | Required (hackathon) | Apply at OKX Developer Portal |
| **1inch** | Free tier OK | portal.1inch.dev |
| **0x** | Paid only (~$50/mo) | Optional, Bench works without it |
| **Velora** | Free | api.paraswap.io |
| **Odos** | Free | api.odos.xyz |
| **Kyber** | Free, no key | aggregator-api.kyberswap.com |
| **CoW Swap** | Free, no key | api.cow.fi |
| **Bebop** | Partner key | Request via Discord |
| **Uniswap AI** | Hackathon partner | Provided by hackathon |
| **OpenOcean** | Free | open-api.openocean.finance |
| **Jupiter** | Free, no key | quote-api.jup.ag |
| **Titan** | Free tier | api.titandex.io |
| **LI.FI** | Free | li.quest |
| **Squid** | Free | api.squidrouter.com |
| **Rango** | Free | api.rango.exchange |

**Most aggregators have free tiers sufficient for hackathon use.**

---

## TECH STACK

| Component | Technology |
|---|---|
| Bench Skill | TypeScript + Node.js CLI |
| Attestor Service | Node.js + Hono + PostgreSQL |
| Source Adapters | TypeScript modules (one per source) |
| Smart Contract | Solidity 0.8.24 + Hardhat |
| Post-Trade Verifier | Node.js worker + viem |
| Verifier Library (TS) | TypeScript + tsup |
| Verifier Library (Python) | Python 3.11 + poetry |
| Explorer Dashboard | Next.js 15 + Tailwind + shadcn/ui |
| Charts | Recharts (radar charts, source bars) |
| WebSocket | ws + Socket.io |
| Database | PostgreSQL 16 |
| Cache | Redis (source response cache, agent scores) |
| Hosting (API) | Railway / Fly.io |
| Hosting (Frontend) | Vercel |
| Domain | usebench.xyz |

---

## FILE STRUCTURE

```
bench/
├── packages/
│   ├── skill/                          # Bench Onchain OS Skill
│   │   ├── SKILL.md
│   │   └── src/
│   │       └── commands/
│   │
│   ├── attestor/                       # Backend service
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── routes/
│   │   │   │   ├── certify.ts
│   │   │   │   ├── verify.ts
│   │   │   │   ├── agent.ts
│   │   │   │   ├── aggregator.ts       # NEW in v2
│   │   │   │   └── leaderboard.ts
│   │   │   ├── services/
│   │   │   │   ├── multi-source-aggregator.ts  # NEW in v2
│   │   │   │   ├── consensus.ts                 # NEW in v2
│   │   │   │   ├── outlier-filter.ts            # NEW in v2
│   │   │   │   ├── certificate-builder.ts
│   │   │   │   ├── signing.ts
│   │   │   │   ├── anchor.ts
│   │   │   │   ├── score.ts
│   │   │   │   └── aggregator-reputation.ts     # NEW in v2
│   │   │   ├── adapters/                        # NEW directory in v2
│   │   │   │   ├── base-adapter.ts
│   │   │   │   ├── okx-adapter.ts
│   │   │   │   ├── oneinch-adapter.ts
│   │   │   │   ├── zerox-adapter.ts
│   │   │   │   ├── velora-adapter.ts
│   │   │   │   ├── odos-adapter.ts
│   │   │   │   ├── kyber-adapter.ts
│   │   │   │   ├── cowswap-adapter.ts
│   │   │   │   ├── bebop-adapter.ts
│   │   │   │   ├── uniswap-ai-adapter.ts
│   │   │   │   ├── openocean-adapter.ts
│   │   │   │   ├── jupiter-adapter.ts
│   │   │   │   ├── titan-adapter.ts
│   │   │   │   ├── lifi-adapter.ts
│   │   │   │   ├── squid-adapter.ts
│   │   │   │   └── rango-adapter.ts
│   │   │   ├── db/
│   │   │   │   ├── schema.sql
│   │   │   │   └── client.ts
│   │   │   └── workers/
│   │   │       ├── post-trade.ts
│   │   │       └── aggregator-reputation-updater.ts  # NEW
│   │   └── package.json
│   │
│   ├── contracts/                      # BenchRegistry.sol v2
│   ├── verifier-ts/                    # @usebench/verifier
│   ├── verifier-py/                    # bench-verifier
│   ├── adapters/                       # Framework adapters (Eliza, LangChain, MCP, SDK)
│   └── shared/                         # Shared types
│
├── apps/
│   ├── explorer/                       # Next.js dashboard
│   │   └── src/app/
│   │       ├── page.tsx                # Homepage with live feed
│   │       ├── cert/[hash]/page.tsx    # Cert detail with multi-source viz
│   │       ├── agent/[addr]/page.tsx   # Agent profile
│   │       ├── aggregators/page.tsx    # NEW: aggregator leaderboard
│   │       ├── leaderboard/page.tsx    # Agent leaderboard
│   │       ├── audit/page.tsx          # Bench Audit
│   │       └── api/badge/[addr]/route.ts  # Badge SVG
│   │
│   └── demo-agent/                     # Reference Demo Agent
│
├── docs/
└── README.md
```

---

## BUILD SEQUENCE (No Hard Timelines)

### Phase 1: Foundations
1. Initialize Turborepo monorepo
2. Set up shared types package with BEC v2 interface
3. Implement canonical hashing function
4. Generate secp256k1 attestor keypair
5. Set up PostgreSQL schema
6. Get API keys for all aggregators

### Phase 2: Source Adapters (the new core)
1. Implement `BaseAdapter` interface
2. Implement OKX adapter first (hackathon partner)
3. Implement 1inch, 0x, Velora, Odos, Kyber, CoW Swap, Bebop, Uniswap AI, OpenOcean
4. Implement Jupiter, Titan (Solana)
5. Implement LI.FI, Squid, Rango (cross-chain)
6. Test each adapter individually with real swap requests
7. Build the adapter registry

### Phase 3: Multi-Source Aggregator Service
1. Implement `multiSourceAggregator.query()` with parallel execution
2. Implement `computeConsensus()` with outlier filtering
3. Implement source agreement score calculation
4. Test end-to-end with real requests
5. Verify outlier filtering with edge cases

### Phase 4: Certificate Generation
1. Build certificate builder
2. Implement secp256k1 signing
3. Implement canonical serialization
4. Build POST /v1/certify endpoint
5. Test full flow

### Phase 5: Smart Contract
1. Write BenchRegistry.sol v2
2. Hardhat tests
3. Deploy to X Layer testnet
4. Verify on explorer
5. Wire anchor logic into attestor

### Phase 6: Bench Skill
1. Write SKILL.md
2. Implement `certify-swap` command
3. Test with Claude Code
4. Submit to OKX plugin store

### Phase 7: Verifier Libraries
1. TypeScript verifier (with `reverify` option to re-query sources)
2. Python verifier
3. Publish to npm and PyPI

### Phase 8: Reference Demo Agent
1. Create OKX Agentic Wallet
2. Build DCA agent script
3. Wire to Bench API
4. Deploy as long-running worker
5. Verify it generates real txns

### Phase 9: Bench Explorer
1. Scaffold Next.js app
2. Build homepage with live feed
3. Build certificate detail page (with multi-source visualization)
4. Build agent profile page
5. **Build aggregator leaderboard page (new in v2)**
6. Build badge generator
7. Deploy to Vercel

### Phase 10: Post-Trade Verifier Worker
1. Subscribe to X Layer swap events
2. Match to pending certs
3. Mark HONORED / VIOLATED
4. Update Bench Score
5. **Update aggregator reputation (new in v2)**
6. MEV detection

### Phase 11: Aggregator Reputation Tracker
1. Background worker computing daily/weekly aggregator scores
2. Powers the leaderboard page

### Phase 12: Framework Adapters
1. Eliza plugin
2. LangChain wrapper
3. MCP server adapter
4. TypeScript SDK
5. Python SDK
6. Publish all

### Phase 13: Bench Audit
1. Endpoint scanning agent's tx history
2. Retroactive multi-source consensus
3. Audit page in Explorer
4. PDF reports

### Phase 14: Compliance Mode
1. PDF generation service
2. MIFID II-style template
3. Compliance report endpoint

### Phase 15: Polish & Submission
1. Comprehensive README
2. 3-minute demo video
3. X post with #onchainos and tag @XLayerOfficial
4. Submit Google Form

---

## DEMO VIDEO SCRIPT (2:45–3:00 minutes)

```
[0:00-0:15] HOOK
"AI agents are starting to manage real money. They make swaps for you across
hundreds of DEXs. But there's one question nobody can answer:
'Which aggregator should I trust to find the best price?'
The answer is: don't trust any single one. Trust the consensus."

[0:15-0:35] INTRODUCING BENCH V2
"Meet Bench — the NBBO of agent trading.
Before any swap, Bench queries 12+ DEX aggregators in parallel.
1inch. 0x. Velora. Odos. Kyber. CoW Swap. Bebop. Uniswap AI. OKX.
And more. We compute the consensus best price across all of them,
and prove your route matches it cryptographically."

[0:35-1:30] LIVE DEMO — Multi-Source Cert
[Terminal: reference agent on X Layer]
"Watch a real swap on X Layer."
[Agent prepares swap: 1000 USDC → WETH]
[Agent calls bench certify-swap]
[Terminal output streams in real time as 10 aggregators respond]
"Bench queries all 10 aggregators in parallel..."
[All responses appear within 3 seconds]
"1inch returns 0.42051. OKX returns 0.42050. Velora 0.42040. Odos 0.42040.
 Uniswap AI 0.42030. Kyber 0.42020. 0x 0.42010.
 CoW Swap timed out — that's logged, not faked.
 Source Agreement Score: 92 out of 100. Strong consensus."
[Bench output: CERTIFIED]
"Your chosen route is within 5 bps of consensus best.
 Certificate signed and anchored to X Layer."

[1:30-2:00] BENCH EXPLORER
[Open usebench.xyz in browser]
"Every certificate is publicly verifiable."
[Click into the cert]
[Show multi-source visualization with bars]
"You see exactly what every aggregator returned at that block.
This level of transparency doesn't exist anywhere else in DeFi."
[Click on aggregator leaderboard]
"And we track which aggregators consistently return the best prices.
1inch is winning right now. OKX is right behind."

[2:00-2:30] WHY THIS MATTERS
"Without Bench, every agent has to pick one aggregator and trust it.
With Bench, every agent gets multi-source verification automatically.
It's TLS for agent trading. It's the NBBO for crypto.
Once one consumer agent shows a Bench badge, every other agent has to
integrate or look like a black box. The integration is one line of code.
The non-integration is reputational suicide."

[2:30-2:50] SKILLS USED
"Bench uses 7 Onchain OS skills plus Uniswap AI as core sources,
and queries 12+ aggregators total. All certificates are anchored on X Layer
with zero gas fees."

[2:50-3:00] CLOSING
"Bench — the NBBO of agent trading.
Multi-source consensus. Cryptographically verified.
usebench.xyz. Live now."
```

---

## TRUST-MINIMIZATION ROADMAP

### v2 (Hackathon)
- Single Bench attestor wallet signs certs
- Trust minimized via: independent verifier library, on-chain anchoring, public source data, open source code

### v3 (Post-Hackathon, 1–3 months)
- Multi-attestor: N-of-M signature scheme
- Stake-based attestor selection
- Public attestor registry

### v4 (Long-term, 6–12 months)
- Decentralized aggregator network
- Threshold signatures
- Bench DAO governance

---

## WHY THIS WINS

### Against the Judging Rubric

| Criterion | Score | Why |
|---|---|---|
| **Onchain OS / Uniswap integration (25%)** | 10/10 | Uses 7+ OKX skills + Uniswap AI as core sources of a multi-source consensus engine |
| **X Layer ecosystem integration (25%)** | 10/10 | Registry on X Layer, demo agent generates real txns, certs anchored on X Layer |
| **AI interactive experience (25%)** | 10/10 | Multi-source visualization + agent self-certification + framework adapters |
| **Product completeness (25%)** | 10/10 | 11 components shipped, source adapters, aggregator reputation, verifier libs, dashboard, demo agent |

**Weighted total: 10/10**

### Special Prizes

- **Most Active Agent ($500):** Demo agent runs every 5 min × 14 days × 10+ source queries per cert = ~200,000 API calls
- **Best Uniswap Integration ($500):** Uniswap AI is a core source in every certificate
- **Most Popular ($500):** "NBBO of agent trading" + badge mechanic + aggregator leaderboard = viral

### The Killer Question — Answered

When a judge asks: *"Why do I need Bench? Can't I just use the OKX aggregator directly?"*

**v2 answer:** "Because no single aggregator can tell you when sources disagree. OKX returns one price. Bench returns 10. When all 10 agree, you know the price is reliable. When they disagree, Bench tells you so before you lose money. No single aggregator can ever give you that — it's structurally impossible. Bench is the only neutral verifier that no single party controls."

This is unanswerable. There's no follow-up critique.

### The Long Game

Bench v2 is positioned to become **the consensus layer of the agent economy**. The aggregator leaderboard creates competition between aggregators (organic distribution). The certificate format becomes a standard. The multi-source consensus becomes the analog to TradFi's NBBO.

OKX wins because they're the hackathon sponsor and one of the top sources.
1inch wins because they're often the top source on the leaderboard.
Bench wins because it's the only place all of this is consolidated.

---

## END OF SPEC v2

This is the canonical Bench v2 build spec. The reframing from single-source to multi-source consensus is the most important change. Everything else flows from that.

**Bench — the NBBO of agent trading. Trust no single aggregator. Trust the consensus.**
