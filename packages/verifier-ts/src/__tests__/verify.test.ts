import { describe, it, expect } from 'vitest';
import { verifyCertificate, verifyHash, verifySignature } from '../verify.js';

// Build a real certificate using @bench/shared to test cross-package compatibility
import { computeCertHash, signCertificate } from '../../../shared/src/index.js';
import type { CertHashableBody } from '../../../shared/src/index.js';

const TEST_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as `0x${string}`;
const TEST_ADDR = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

async function buildTestCert() {
  const body: CertHashableBody = {
    version: 'bench-v2',
    certId: '550e8400-e29b-41d4-a716-446655440000',
    agent: { walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18' },
    trade: {
      chainId: 196,
      blockNumber: 8472193,
      timestamp: 1712345678,
      inputToken: { address: '0xUSDC', symbol: 'USDC', name: 'USD Coin', decimals: 6, amount: '1000000000', amountFormatted: '1000' },
      outputToken: { address: '0xWETH', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, amount: '0', amountFormatted: '0' },
      swapType: 'single-chain-evm',
    },
    sources: {
      queried: ['1inch', 'okx'],
      successful: [{ source: '1inch', expectedOutput: '420510000000000000', expectedOutputFormatted: '0.42051', route: { hops: [], summary: '' }, gasEstimate: '0', priceImpactBps: 0, latencyMs: 200, fetchedAt: 1712345678 }],
      filtered: [],
      failed: [],
      queryStartedAt: 1712345677,
      queryCompletedAt: 1712345678,
      totalQueryDurationMs: 1200,
    },
    consensus: {
      best: { source: '1inch', expectedOutput: '420510000000000000', expectedOutputFormatted: '0.42051', route: { hops: [], summary: '' } },
      median: '420510000000000000',
      stddev: '0',
      sourceAgreementScore: 92,
      confidenceTier: 'STRONG',
      outliersExcluded: [],
    },
    chosen: { source: 'uniswap-v3', expectedOutput: '420300000000000000', expectedOutputFormatted: '0.4203', route: { hops: [], summary: '' } },
    quality: { slippageDeltaBps: 5, expectedOutputDelta: '210000000000000', expectedOutputDeltaUsd: 0.63, certificationLevel: 'CERTIFIED', reason: 'test' },
  };

  const certHash = computeCertHash(body) as `0x${string}`;
  const signedAt = 1712345680;
  const signature = await signCertificate(TEST_KEY, certHash, 'CERTIFIED', 92, signedAt);

  return {
    ...body,
    certHash,
    attestor: {
      address: TEST_ADDR,
      publicKey: TEST_ADDR,
      signature,
      signedAt,
    },
  };
}

describe('verifier-ts', () => {
  describe('verifyHash', () => {
    it('returns true for valid cert hash', async () => {
      const cert = await buildTestCert();
      expect(verifyHash(cert as never)).toBe(true);
    });

    it('returns false for tampered cert', async () => {
      const cert = await buildTestCert();
      (cert as Record<string, unknown>).certId = 'tampered';
      expect(verifyHash(cert as never)).toBe(false);
    });
  });

  describe('verifySignature', () => {
    it('returns true for valid signature', async () => {
      const cert = await buildTestCert();
      const result = await verifySignature(cert as never);
      expect(result.valid).toBe(true);
      expect(result.recoveredAddress).toBe(TEST_ADDR);
    });

    it('returns false for wrong address', async () => {
      const cert = await buildTestCert();
      cert.attestor.address = '0x0000000000000000000000000000000000000001';
      const result = await verifySignature(cert as never);
      expect(result.valid).toBe(false);
    });
  });

  describe('verifyCertificate (full)', () => {
    it('returns valid=true for a correctly built cert', async () => {
      const cert = await buildTestCert();
      const result = await verifyCertificate(cert as never);
      expect(result.valid).toBe(true);
      expect(result.checks.hashValid).toBe(true);
      expect(result.checks.signatureValid).toBe(true);
    });

    it('returns valid=false when hash is tampered', async () => {
      const cert = await buildTestCert();
      (cert.quality as Record<string, unknown>).slippageDeltaBps = 99;
      const result = await verifyCertificate(cert as never);
      expect(result.valid).toBe(false);
      expect(result.checks.hashValid).toBe(false);
    });
  });
});
