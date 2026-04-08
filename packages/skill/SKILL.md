# Bench — Best Execution Verification

## Description
Bench is the NBBO of autonomous agent trading. Before any swap, Bench queries 12+ DEX aggregators in parallel, computes the consensus best price, and produces a cryptographically-signed Best Execution Certificate (BEC) that proves your trade was optimal.

## Commands

### certify-swap
Certify a swap against the multi-source consensus best price.

**Parameters:**
- `chainId` (required): Chain ID (e.g., 1 for Ethereum, 196 for X Layer)
- `inputToken` (required): Input token contract address
- `outputToken` (required): Output token contract address
- `amount` (required): Input amount in smallest unit (wei)
- `chosenSource` (required): The aggregator/DEX you plan to use
- `chosenOutput` (required): Expected output from your chosen source
- `walletAddress` (required): Your agent's wallet address
- `slippageBps` (optional): Max slippage in basis points (default: 50)

**Returns:** A signed Best Execution Certificate (BEC v2) with:
- Certification level: CERTIFIED / WARNING / FAILED
- Source Agreement Score (0-100)
- Full multi-source breakdown showing every aggregator's quote
- Attestor signature (EIP-712, verifiable on-chain)

**Example:**
```
certify-swap --chainId 196 --inputToken 0xA0b8...eB48 --outputToken 0xC02a...6Cc2 --amount 1000000000 --chosenSource uniswap-v3 --chosenOutput 420300000000000000 --walletAddress 0x742d...bD18
```

### verify-cert
Verify a previously issued certificate's integrity and signature.

**Parameters:**
- `certHash` (required): The certificate hash to verify

**Returns:** Verification result with hash validity and signature check.

### agent-score
Get an agent's Bench Score and certification history.

**Parameters:**
- `walletAddress` (required): Agent's wallet address

**Returns:** Bench Score (0-100), certification rate, honor rate, and recent certificates.

## Integration
One line to verify any swap:
```typescript
const cert = await bench.certifySwap({ chainId: 196, inputToken: "0x...", outputToken: "0x...", amount: "1000000000", chosen: { source: "uniswap-v3", expectedOutput: "420300000000000000" } });
if (cert.quality.certificationLevel === "CERTIFIED") { /* execute swap */ }
```

## Sources Queried
OKX DEX Aggregator, 1inch Pathfinder, Velora (ParaSwap), Odos, KyberSwap, CoW Swap, Uniswap AI, OpenOcean, Jupiter (Solana), LI.FI, Squid, Rango — 12 independent aggregators.

## Why Use Bench
- No single aggregator can tell you when sources disagree
- Multi-source consensus is structurally impossible to replicate by any single aggregator
- Cryptographic proof — every certificate is independently verifiable
- On-chain anchoring on X Layer with zero gas fees
