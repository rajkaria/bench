# Bench v2 — OKX Build X Hackathon Submission Checklist

## Submission Details
- **Hackathon:** OKX Build X — Build with Onchain OS
- **Arena:** Skills Arena
- **Deadline:** April 15, 2026 — 23:59 UTC
- **URL:** https://web3.okx.com/xlayer/build-x-hackathon

## Pre-Submission Checklist

### Code & Repo
- [ ] GitHub repo is public at https://github.com/rajkaria/bench
- [ ] README.md is complete with architecture, quick start, integration examples
- [ ] All 257 tests passing
- [ ] .env.example documents all required API keys
- [ ] No secrets committed (check: `git log -p | grep -i "secret\|api_key\|private_key"`)

### Deployments
- [ ] Explorer deployed to Vercel (usebench.xyz)
- [ ] Attestor API deployed to Railway
- [ ] BenchRegistry.sol deployed to X Layer testnet (chain 195)
- [ ] Demo agent running continuously

### API Keys Configured
- [ ] OKX Developer API (key + secret + passphrase + project ID)
- [ ] 1inch Portal API key
- [ ] Odos API key (if available)
- [ ] Attestor keypair generated and configured

### Demo Video (3 minutes)
- [ ] Record 3-minute demo video per script below
- [ ] Upload to YouTube or Loom
- [ ] Include link in submission

### Social
- [ ] Post on X with #onchainos and tag @XLayerOfficial
- [ ] Include usebench.xyz link
- [ ] Include demo video link

### Submission Form
- [ ] Fill out Google Form with:
  - GitHub repo URL
  - Demo video URL
  - X post URL
  - usebench.xyz URL
  - Team info

## Demo Video Script (2:45-3:00)

### [0:00-0:15] HOOK
"AI agents manage real money across hundreds of DEXs. But which aggregator should they trust for the best price? The answer: don't trust any single one. Trust the consensus."

### [0:15-0:35] INTRODUCING BENCH
"Meet Bench — the NBBO of agent trading. Before any swap, Bench queries 12 DEX aggregators in parallel. 1inch. OKX. Velora. Odos. Kyber. CoW Swap. Uniswap AI. And more. We compute the consensus best price and prove your route matches it cryptographically."

### [0:35-1:30] LIVE DEMO
- Show terminal: demo agent on X Layer
- Agent prepares swap: 1000 USDC -> WETH
- Agent calls `bench certify-swap`
- Show 10+ aggregator responses streaming in under 3 seconds
- "Source Agreement Score: 92 out of 100. Strong consensus."
- "CERTIFIED. Within 5 bps of consensus best."

### [1:30-2:00] EXPLORER
- Open usebench.xyz
- Click into the certificate
- Show the multi-source bar chart visualization
- "You see exactly what every aggregator returned at that block."
- Click aggregator leaderboard
- "1inch is winning. OKX is right behind."

### [2:00-2:30] WHY THIS MATTERS
"Without Bench, agents pick one aggregator and trust it blindly. With Bench, every agent gets multi-source verification. It's TLS for agent trading. Once one agent shows a Bench badge, every other agent has to integrate or look like a black box."

### [2:30-2:50] INTEGRATION
"Bench uses 7 Onchain OS skills plus Uniswap AI as core sources. All certificates anchored on X Layer with zero gas fees. Integration is one line of code."

### [2:50-3:00] CLOSING
"Bench — the NBBO of agent trading. Multi-source consensus. Cryptographically verified. usebench.xyz. Live now."

## Target Prizes
- $2,000 — 1st Place Skills Arena
- $500 — Most Active Agent (demo agent: ~4,000 swaps over 14 days)
- $500 — Best Uniswap Integration (Uniswap AI is a core source)
- $500 — Most Popular (NBBO narrative + badge mechanic + aggregator leaderboard)
