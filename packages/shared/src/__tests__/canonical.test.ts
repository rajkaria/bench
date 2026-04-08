import { describe, it, expect } from 'vitest';
import { canonicalize } from '../hash/canonical.js';

describe('canonicalize', () => {
  describe('primitives', () => {
    it('serializes null', () => {
      expect(canonicalize(null)).toBe('null');
    });

    it('serializes undefined as null', () => {
      expect(canonicalize(undefined)).toBe('null');
    });

    it('serializes booleans', () => {
      expect(canonicalize(true)).toBe('true');
      expect(canonicalize(false)).toBe('false');
    });

    it('serializes integers', () => {
      expect(canonicalize(0)).toBe('0');
      expect(canonicalize(42)).toBe('42');
      expect(canonicalize(-1)).toBe('-1');
    });

    it('serializes negative zero as zero', () => {
      expect(canonicalize(-0)).toBe('0');
    });

    it('serializes decimals', () => {
      expect(canonicalize(3.14)).toBe('3.14');
      expect(canonicalize(0.5)).toBe('0.5');
    });

    it('throws on NaN', () => {
      expect(() => canonicalize(NaN)).toThrow('non-finite');
    });

    it('throws on Infinity', () => {
      expect(() => canonicalize(Infinity)).toThrow('non-finite');
      expect(() => canonicalize(-Infinity)).toThrow('non-finite');
    });

    it('serializes strings with proper escaping', () => {
      expect(canonicalize('hello')).toBe('"hello"');
      expect(canonicalize('')).toBe('""');
      expect(canonicalize('quote"inside')).toBe('"quote\\"inside"');
      expect(canonicalize('back\\slash')).toBe('"back\\\\slash"');
      expect(canonicalize('new\nline')).toBe('"new\\nline"');
    });

    it('serializes bigints as quoted strings', () => {
      expect(canonicalize(BigInt('420510000000000000'))).toBe('"420510000000000000"');
      expect(canonicalize(0n)).toBe('"0"');
    });
  });

  describe('arrays', () => {
    it('serializes empty array', () => {
      expect(canonicalize([])).toBe('[]');
    });

    it('serializes array preserving order', () => {
      expect(canonicalize([3, 1, 2])).toBe('[3,1,2]');
    });

    it('serializes nested arrays', () => {
      expect(canonicalize([[1], [2, 3]])).toBe('[[1],[2,3]]');
    });

    it('serializes mixed-type arrays', () => {
      expect(canonicalize([1, 'two', true, null])).toBe('[1,"two",true,null]');
    });
  });

  describe('objects', () => {
    it('serializes empty object', () => {
      expect(canonicalize({})).toBe('{}');
    });

    it('sorts keys lexicographically', () => {
      const input = { z: 1, a: 2, m: 3 };
      expect(canonicalize(input)).toBe('{"a":2,"m":3,"z":1}');
    });

    it('omits undefined values from objects', () => {
      const input = { a: 1, b: undefined, c: 3 };
      expect(canonicalize(input)).toBe('{"a":1,"c":3}');
    });

    it('does NOT omit null values', () => {
      const input = { a: 1, b: null, c: 3 };
      expect(canonicalize(input)).toBe('{"a":1,"b":null,"c":3}');
    });

    it('handles nested objects with sorted keys at every level', () => {
      const input = { z: { b: 2, a: 1 }, a: { d: 4, c: 3 } };
      expect(canonicalize(input)).toBe('{"a":{"c":3,"d":4},"z":{"a":1,"b":2}}');
    });
  });

  describe('determinism', () => {
    it('produces identical output regardless of key insertion order', () => {
      const obj1: Record<string, unknown> = {};
      obj1['z'] = 1;
      obj1['a'] = 2;

      const obj2: Record<string, unknown> = {};
      obj2['a'] = 2;
      obj2['z'] = 1;

      expect(canonicalize(obj1)).toBe(canonicalize(obj2));
    });

    it('is deterministic across multiple calls', () => {
      const complex = {
        version: 'bench-v2',
        certId: '550e8400-e29b-41d4-a716-446655440000',
        agent: { walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18' },
        trade: { chainId: 196, blockNumber: 8472193 },
      };
      const result1 = canonicalize(complex);
      const result2 = canonicalize(complex);
      const result3 = canonicalize(complex);
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it('produces no whitespace', () => {
      const result = canonicalize({ a: [1, { b: 2 }] });
      expect(result).not.toMatch(/\s/);
    });
  });

  describe('BEC v2 body shape', () => {
    it('canonicalizes a realistic cert body deterministically', () => {
      const body = {
        version: 'bench-v2',
        certId: '550e8400-e29b-41d4-a716-446655440000',
        agent: {
          walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
          agentId: 'bench-demo-agent',
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
          queried: ['1inch', 'okx-aggregator', 'velora'],
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
          confidenceTier: 'STRONG' as const,
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
          certificationLevel: 'CERTIFIED' as const,
          reason: 'Within 10 bps of consensus best (5 bps actual). Source Agreement: 92/100 (STRONG).',
        },
      };

      const result1 = canonicalize(body);
      const result2 = canonicalize(body);
      expect(result1).toBe(result2);

      // Verify structure: should start with {"agent": and contain all top-level keys sorted
      expect(result1).toMatch(/^\{"agent":/);
      expect(result1).toContain('"version":"bench-v2"');
      expect(result1).toContain('"certId":"550e8400-e29b-41d4-a716-446655440000"');

      // No structural whitespace (spaces/newlines between JSON tokens).
      // String values may contain spaces (e.g., "USDC -> WETH via 1inch").
      // Verify by parsing back and re-serializing — should round-trip.
      const parsed = JSON.parse(result1);
      const reserialized = canonicalize(parsed);
      expect(reserialized).toBe(result1);
    });
  });
});
