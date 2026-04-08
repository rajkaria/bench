# Bench v2 — DO LATER

Features and integrations deferred from initial build. Revisit after hackathon submission (April 15, 2026).

---

## Deferred Aggregator Integrations

### Paid APIs
- [ ] **0x Swap API** — ~$50/mo. Strong RFQ system + on-chain DEXs, 16 chains. Also powers Matcha.
- [ ] **Matcha** — 0x-powered UI-layer aggregator. Redundant if 0x is added.

### Partner/Approval Required
- [ ] **Bebop** — RFQ-focused, 11 chains. Requires partner key via Discord (unpredictable approval time).

### Unverified / Research Needed
- [ ] **Titan DEX (Solana)** — `api.titandex.io` may not exist or may have changed. Verify API availability.
- [ ] **Firebird** — Multi-chain with custom path optimization. Not detailed in spec, needs API research.
- [ ] **DODO Route** — PMM-based routing. Not detailed in spec, needs API research.
- [ ] **MetaMask Swap API** — Aggregates 1inch, 0x, Paraswap, Airswap. Adds redundancy, not unique signal.
- [ ] **Socket** — Cross-chain liquidity. Listed in Tier 3 but not in adapter registry. Research API.

---

## Deferred Features

### Phase 12: Framework Adapters (partial)
- [ ] **Eliza plugin** — Agent framework adapter
- [ ] **LangChain wrapper** — Python/TS agent framework adapter
- [ ] **MCP server adapter** — Model Context Protocol integration
- [ ] **Python SDK** — `bench-sdk` on PyPI

*Note: TypeScript SDK ships with initial build. Others deferred.*

### Phase 13: Bench Audit
- [ ] Endpoint scanning agent's historical tx history
- [ ] Retroactive multi-source consensus (replay past swaps against current sources)
- [ ] Audit page in Explorer (`/audit`)
- [ ] PDF audit reports with source-by-source breakdown

### Phase 14: Compliance Mode
- [ ] PDF generation service for regulatory reports
- [ ] MIFID II-style best-execution disclosure template
- [ ] Compliance report endpoint (`/v1/compliance/report`)
- [ ] Regulatory-grade timestamp attestation

### Trust Minimization (v3+)
- [ ] **Multi-attestor**: N-of-M signature scheme (multiple attestors sign each cert)
- [ ] **Stake-based attestor selection**: Attestors stake tokens, slashed for bad behavior
- [ ] **Public attestor registry**: On-chain registry of approved attestors
- [ ] **Threshold signatures**: No single attestor can sign alone
- [ ] **Bench DAO governance**: Decentralized governance over attestor set and parameters

### Advanced Features
- [ ] **SIWE (Sign-In with Ethereum)** agent authentication — crypto-native auth replacing API keys
- [ ] **Multi-chain post-trade verification** — Currently X Layer only; expand to Ethereum, Polygon, Arbitrum, etc.
- [ ] **Historical aggregator accuracy tracking** — Compare predicted vs actual post-trade across aggregators over time
- [ ] **Webhook notifications** — Notify agents when post-trade verification completes
- [ ] **Certificate PDF export** — Downloadable PDF with full source breakdown + charts
- [ ] **Embeddable badge iframe** — `<iframe src="usebench.xyz/badge/0x...">` for agent dashboards
- [ ] **GraphQL API** — In addition to REST, for flexible querying by Explorer and third parties
- [ ] **Rate limit tiers** — Free / Pro / Enterprise with different rate limits and source counts
- [ ] **Custom source sets** — Let agents choose which aggregators to include in their consensus
- [ ] **Cross-chain bridge verification** — Verify bridge quotes (LI.FI, Squid, Rango) against actual bridge execution
- [ ] **MEV protection scoring** — Score how well each aggregator protects against MEV
- [ ] **Gas optimization tracking** — Track which aggregators estimate gas most accurately

---

## Infrastructure Upgrades
- [ ] **Horizontal scaling** — Multiple attestor service instances behind load balancer
- [ ] **Database read replicas** — Separate read/write for Explorer queries vs cert writes
- [ ] **CDN for Explorer** — Edge caching for public cert pages
- [ ] **Monitoring + alerting** — Datadog/Grafana for adapter health, latency, error rates
- [ ] **Automated adapter health checks** — Cron job that tests each adapter every 5 min, disables unhealthy ones

---

*Last updated: 2026-04-08*
