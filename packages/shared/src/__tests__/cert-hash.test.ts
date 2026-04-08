import { describe, it, expect } from 'vitest';
import { computeCertHash, verifyCertHash } from '../hash/cert-hash.js';
import type { CertHashableBody } from '../types/bec.js';

const makeBody = (overrides: Partial<CertHashableBody> = {}): CertHashableBody => ({
  version: 'bench-v2',
  certId: '550e8400-e29b-41d4-a716-446655440000',
  agent: {
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  },
  trade: {
    chainId: 196,
    blockNumber: 8472193,
    timestamp: 1712345678,
    inputToken: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      amount: '1000000000',
      amountFormatted: '1000.0',
    },
    outputToken: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      amount: '0',
      amountFormatted: '0',
    },
    swapType: 'single-chain-evm',
  },
  sources: {
    queried: ['1inch', 'okx-aggregator'],
    successful: [
      {
        source: '1inch',
        expectedOutput: '420510000000000000',
        expectedOutputFormatted: '0.42051',
        route: { hops: [], summary: 'USDC -> WETH via 1inch' },
        gasEstimate: '150000',
        priceImpactBps: 5,
        latencyMs: 198,
        fetchedAt: 1712345678,
      },
    ],
    filtered: [],
    failed: [],
    queryStartedAt: 1712345677,
    queryCompletedAt: 1712345678,
    totalQueryDurationMs: 1200,
  },
  consensus: {
    best: {
      source: '1inch',
      expectedOutput: '420510000000000000',
      expectedOutputFormatted: '0.42051',
      route: { hops: [], summary: 'USDC -> WETH via 1inch' },
    },
    median: '420400000000000000',
    stddev: '100000000000000',
    sourceAgreementScore: 92,
    confidenceTier: 'STRONG',
    outliersExcluded: [],
  },
  chosen: {
    source: 'uniswap-v3-direct',
    expectedOutput: '420300000000000000',
    expectedOutputFormatted: '0.4203',
    route: { hops: [], summary: 'USDC -> WETH via Uniswap V3' },
  },
  quality: {
    slippageDeltaBps: 5,
    expectedOutputDelta: '210000000000000',
    expectedOutputDeltaUsd: 0.63,
    certificationLevel: 'CERTIFIED',
    reason: 'Within 10 bps of consensus best.',
  },
  ...overrides,
});

describe('computeCertHash', () => {
  it('returns a 0x-prefixed hex string', () => {
    const hash = computeCertHash(makeBody());
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it('is deterministic — same input produces same hash', () => {
    const body = makeBody();
    const hash1 = computeCertHash(body);
    const hash2 = computeCertHash(body);
    const hash3 = computeCertHash(body);
    expect(hash1).toBe(hash2);
    expect(hash2).toBe(hash3);
  });

  it('changes when any field changes', () => {
    const base = computeCertHash(makeBody());

    // Different certId
    const diffCertId = computeCertHash(makeBody({ certId: 'different-uuid' }));
    expect(diffCertId).not.toBe(base);

    // Different agent
    const diffAgent = computeCertHash(
      makeBody({ agent: { walletAddress: '0xDifferentAddress' } }),
    );
    expect(diffAgent).not.toBe(base);

    // Different quality
    const diffQuality = computeCertHash(
      makeBody({
        quality: {
          ...makeBody().quality,
          slippageDeltaBps: 50,
          certificationLevel: 'WARNING',
        },
      }),
    );
    expect(diffQuality).not.toBe(base);
  });

  it('is not affected by key insertion order', () => {
    const body1 = makeBody();
    // Construct same body with keys in different order
    const body2 = {
      quality: body1.quality,
      version: body1.version,
      trade: body1.trade,
      agent: body1.agent,
      certId: body1.certId,
      consensus: body1.consensus,
      chosen: body1.chosen,
      sources: body1.sources,
    } as CertHashableBody;

    expect(computeCertHash(body1)).toBe(computeCertHash(body2));
  });
});

describe('verifyCertHash', () => {
  it('returns true for matching hash', () => {
    const body = makeBody();
    const hash = computeCertHash(body);
    expect(verifyCertHash(body, hash)).toBe(true);
  });

  it('returns false for non-matching hash', () => {
    const body = makeBody();
    expect(verifyCertHash(body, '0x0000000000000000000000000000000000000000000000000000000000000000')).toBe(false);
  });

  it('returns false when body is tampered', () => {
    const body = makeBody();
    const hash = computeCertHash(body);
    const tampered = makeBody({ certId: 'tampered-id' });
    expect(verifyCertHash(tampered, hash)).toBe(false);
  });
});
