import { describe, it, expect } from 'vitest';
import type { SourceResponse, ConsensusResult, CertAgent, CertChosen, QuoteRequest } from '@bench/shared';
import { verifyCertHash, verifyCertificateSignature, type CertLevelKey } from '@bench/shared';
import { buildCertificate, type AttestorConfig, type CertifyInput } from '../services/certificate-builder.js';

const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as `0x${string}`;
const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as `0x${string}`;

const attestorConfig: AttestorConfig = {
  privateKey: TEST_PRIVATE_KEY,
  address: TEST_ADDRESS,
  publicKey: TEST_ADDRESS,
};

function makeSource(source: string, output: string): SourceResponse {
  return {
    source,
    expectedOutput: output,
    expectedOutputFormatted: '0.42',
    route: { hops: [], summary: `via ${source}` },
    gasEstimate: '150000',
    priceImpactBps: 5,
    latencyMs: 200,
    fetchedAt: 1712345678,
  };
}

function makeCertifyInput(overrides?: Partial<CertifyInput>): CertifyInput {
  const successful = [
    makeSource('1inch', '420510000000000000'),
    makeSource('okx', '420500000000000000'),
    makeSource('velora', '420400000000000000'),
    makeSource('odos', '420400000000000000'),
    makeSource('kyber', '420200000000000000'),
  ];

  const consensus: ConsensusResult = {
    best: successful[0]!,
    median: '420400000000000000',
    stddev: '100000000000000',
    sourceAgreementScore: 92,
    confidenceTier: 'STRONG',
    filtered: successful,
    outliersExcluded: [],
  };

  return {
    request: {
      chainId: 196,
      inputToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      outputToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amount: '1000000000',
      slippageBps: 50,
    } as QuoteRequest,
    swapType: 'single-chain-evm',
    agent: { walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18' } as CertAgent,
    blockNumber: 8472193,
    chosen: {
      source: 'uniswap-v3-direct',
      expectedOutput: '420300000000000000',
      expectedOutputFormatted: '0.4203',
      route: { hops: [], summary: 'via Uniswap V3' },
    } as CertChosen,
    queriedSources: ['1inch', 'okx', 'velora', 'odos', 'kyber'],
    successful,
    failed: [{ source: 'cow-swap', error: 'timeout', failedAt: 1712345678 }],
    queryStartedAt: 1712345677,
    queryCompletedAt: 1712345678,
    totalQueryDurationMs: 1200,
    consensus,
    ...overrides,
  };
}

describe('buildCertificate', () => {
  it('builds a valid BEC v2 certificate', async () => {
    const cert = await buildCertificate(makeCertifyInput(), attestorConfig);

    expect(cert.version).toBe('bench-v2');
    expect(cert.certId).toMatch(/^[0-9a-f-]{36}$/);
    expect(cert.certHash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(cert.agent.walletAddress).toBe('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18');
    expect(cert.trade.chainId).toBe(196);
    expect(cert.trade.swapType).toBe('single-chain-evm');
  });

  it('computes correct certification level — CERTIFIED', async () => {
    const cert = await buildCertificate(makeCertifyInput(), attestorConfig);

    // Chosen: 420300..., Best: 420510...
    // Delta = (420510 - 420300) / 420510 * 10000 ≈ 5 bps
    expect(cert.quality.certificationLevel).toBe('CERTIFIED');
    expect(cert.quality.slippageDeltaBps).toBeLessThanOrEqual(10);
  });

  it('produces WARNING for higher slippage (10-50 bps)', async () => {
    // Consensus best = 420510000000000000 (0.42051)
    // 20 bps below = 420510 * (1 - 20/10000) = ~419669...
    const input = makeCertifyInput({
      chosen: {
        source: 'slightly-bad-route',
        expectedOutput: '419700000000000000', // ~19 bps from best
        expectedOutputFormatted: '0.4197',
        route: { hops: [], summary: '' },
      },
    });
    const cert = await buildCertificate(input, attestorConfig);

    expect(cert.quality.certificationLevel).toBe('WARNING');
    expect(cert.quality.slippageDeltaBps).toBeGreaterThan(10);
    expect(cert.quality.slippageDeltaBps).toBeLessThanOrEqual(50);
  });

  it('produces FAILED for large slippage', async () => {
    const input = makeCertifyInput({
      chosen: {
        source: 'terrible-route',
        expectedOutput: '380000000000000000', // ~96 bps
        expectedOutputFormatted: '0.38',
        route: { hops: [], summary: '' },
      },
    });
    const cert = await buildCertificate(input, attestorConfig);

    expect(cert.quality.certificationLevel).toBe('FAILED');
    expect(cert.quality.slippageDeltaBps).toBeGreaterThan(50);
  });

  it('produces WARNING for single source', async () => {
    const singleSource = [makeSource('1inch', '420510000000000000')];
    const consensus: ConsensusResult = {
      best: singleSource[0]!,
      median: '420510000000000000',
      stddev: '0',
      sourceAgreementScore: 0,
      confidenceTier: 'NONE',
      filtered: singleSource,
      outliersExcluded: [],
    };

    const input = makeCertifyInput({
      successful: singleSource,
      queriedSources: ['1inch'],
      consensus,
      chosen: {
        source: '1inch',
        expectedOutput: '420510000000000000',
        expectedOutputFormatted: '0.42051',
        route: { hops: [], summary: '' },
      },
    });
    const cert = await buildCertificate(input, attestorConfig);

    expect(cert.quality.certificationLevel).toBe('WARNING');
    expect(cert.quality.reason).toContain('Single source');
  });

  it('cert hash is verifiable', async () => {
    const cert = await buildCertificate(makeCertifyInput(), attestorConfig);

    const hashableBody = {
      version: cert.version,
      certId: cert.certId,
      agent: cert.agent,
      trade: cert.trade,
      sources: cert.sources,
      consensus: cert.consensus,
      chosen: cert.chosen,
      quality: cert.quality,
    };

    expect(verifyCertHash(hashableBody, cert.certHash)).toBe(true);
  });

  it('attestor signature is verifiable', async () => {
    const cert = await buildCertificate(makeCertifyInput(), attestorConfig);

    const recovered = await verifyCertificateSignature(
      cert.attestor.signature as `0x${string}`,
      cert.certHash as `0x${string}`,
      cert.quality.certificationLevel as CertLevelKey,
      cert.consensus.sourceAgreementScore,
      cert.attestor.signedAt,
    );

    expect(recovered).toBe(TEST_ADDRESS);
  });

  it('includes correct source data', async () => {
    const cert = await buildCertificate(makeCertifyInput(), attestorConfig);

    expect(cert.sources.queried).toEqual(['1inch', 'okx', 'velora', 'odos', 'kyber']);
    expect(cert.sources.successful.length).toBe(5);
    expect(cert.sources.failed.length).toBe(1);
    expect(cert.sources.failed[0]!.source).toBe('cow-swap');
  });

  it('includes consensus data', async () => {
    const cert = await buildCertificate(makeCertifyInput(), attestorConfig);

    expect(cert.consensus.best.source).toBe('1inch');
    expect(cert.consensus.sourceAgreementScore).toBe(92);
    expect(cert.consensus.confidenceTier).toBe('STRONG');
  });

  it('builds unique certificates each time', async () => {
    const input = makeCertifyInput();
    const cert1 = await buildCertificate(input, attestorConfig);
    const cert2 = await buildCertificate(input, attestorConfig);

    expect(cert1.certId).not.toBe(cert2.certId);
    expect(cert1.certHash).not.toBe(cert2.certHash);
  });
});
