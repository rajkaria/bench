import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { QuoteRequest } from '@bench/shared';
import {
  allAdapters, evmAdapters, solanaAdapters, crossChainAdapters,
  selectAdapters, adapterMap,
} from '../adapters/index.js';
import { withTimeout, withRetry, formatUnits } from '../adapters/utils.js';

// ============================================================================
// Registry & Selection Tests
// ============================================================================

describe('adapter registry', () => {
  it('has 12 adapters registered', () => {
    expect(allAdapters.length).toBe(12);
  });

  it('has 8 EVM adapters', () => {
    expect(evmAdapters.length).toBe(8);
  });

  it('has 1 Solana adapter', () => {
    expect(solanaAdapters.length).toBe(1);
    expect(solanaAdapters[0]!.name).toBe('jupiter');
  });

  it('has 3 cross-chain adapters', () => {
    expect(crossChainAdapters.length).toBe(3);
  });

  it('all adapters have unique names', () => {
    const names = allAdapters.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all adapters have display names', () => {
    for (const adapter of allAdapters) {
      expect(adapter.displayName).toBeTruthy();
    }
  });

  it('adapterMap keys match adapter names', () => {
    for (const [key, adapter] of Object.entries(adapterMap)) {
      expect(key).toBe(adapter.name);
    }
  });
});

describe('selectAdapters', () => {
  it('selects EVM adapters for Ethereum (chain 1)', () => {
    const selected = selectAdapters('single-chain-evm', 1);
    expect(selected.length).toBeGreaterThan(0);
    // All selected should support chain 1
    for (const a of selected) {
      expect(a.supportsChain(1)).toBe(true);
    }
  });

  it('selects EVM adapters for X Layer (chain 196)', () => {
    const selected = selectAdapters('single-chain-evm', 196);
    // Only OKX supports X Layer in our registry
    expect(selected.length).toBeGreaterThanOrEqual(1);
    expect(selected.some((a) => a.name === 'okx-aggregator')).toBe(true);
  });

  it('selects Solana adapters for Solana swaps', () => {
    const selected = selectAdapters('single-chain-solana', 501);
    expect(selected.length).toBe(1);
    expect(selected[0]!.name).toBe('jupiter');
  });

  it('selects cross-chain adapters', () => {
    const selected = selectAdapters('cross-chain', 1);
    expect(selected.length).toBeGreaterThan(0);
  });

  it('throws for unsupported swap type', () => {
    expect(() => selectAdapters('unknown' as never, 1)).toThrow('Unsupported swap type');
  });
});

// ============================================================================
// Adapter Interface Compliance Tests
// ============================================================================

describe('adapter interface compliance', () => {
  for (const adapter of allAdapters) {
    describe(adapter.name, () => {
      it('has a non-empty name', () => {
        expect(adapter.name).toBeTruthy();
        expect(typeof adapter.name).toBe('string');
      });

      it('has a non-empty displayName', () => {
        expect(adapter.displayName).toBeTruthy();
      });

      it('has at least one supported chain', () => {
        expect(adapter.supportedChains.length).toBeGreaterThan(0);
      });

      it('has valid rate limits', () => {
        expect(adapter.rateLimit.requestsPerSecond).toBeGreaterThan(0);
        expect(adapter.rateLimit.burstCapacity).toBeGreaterThan(0);
      });

      it('supportsChain returns boolean', () => {
        expect(typeof adapter.supportsChain(1)).toBe('boolean');
      });

      it('supportsChain returns false for chain 999999', () => {
        expect(adapter.supportsChain(999999)).toBe(false);
      });

      it('has a getQuote function', () => {
        expect(typeof adapter.getQuote).toBe('function');
      });
    });
  }
});

// ============================================================================
// Utility Tests
// ============================================================================

describe('withTimeout', () => {
  it('resolves if promise completes before timeout', async () => {
    const result = await withTimeout(Promise.resolve('ok'), 1000, 'test');
    expect(result).toBe('ok');
  });

  it('rejects if promise exceeds timeout', async () => {
    const slow = new Promise((resolve) => setTimeout(resolve, 5000));
    await expect(withTimeout(slow, 50, 'test')).rejects.toThrow('test: timeout after 50ms');
  });

  it('propagates original error if promise rejects before timeout', async () => {
    const failing = Promise.reject(new Error('original'));
    await expect(withTimeout(failing, 1000, 'test')).rejects.toThrow('original');
  });
});

describe('withRetry', () => {
  it('returns on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(fn, 2, 10);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValue('ok');
    const result = await withRetry(fn, 2, 10);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after max retries exhausted', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'));
    await expect(withRetry(fn, 2, 10)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });
});

describe('formatUnits', () => {
  it('formats 18-decimal token amounts', () => {
    expect(formatUnits('1000000000000000000', 18)).toBe('1');
    expect(formatUnits('420510000000000000', 18)).toBe('0.42051');
    expect(formatUnits('100000000000000', 18)).toBe('0.0001');
  });

  it('formats 6-decimal token amounts (USDC)', () => {
    expect(formatUnits('1000000', 6)).toBe('1');
    expect(formatUnits('1000000000', 6)).toBe('1000');
    expect(formatUnits('500000', 6)).toBe('0.5');
  });

  it('formats zero', () => {
    expect(formatUnits('0', 18)).toBe('0');
    expect(formatUnits('0', 6)).toBe('0');
  });

  it('handles amounts smaller than one unit', () => {
    expect(formatUnits('1', 18)).toBe('0.000000000000000001');
    expect(formatUnits('1', 6)).toBe('0.000001');
  });
});

// ============================================================================
// Mocked Fetch Adapter Tests
// ============================================================================

const mockQuoteReq: QuoteRequest = {
  chainId: 1,
  inputToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  outputToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  amount: '1000000000',
  slippageBps: 50,
};

describe('adapter fetch parsing (mocked)', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('oneinch adapter parses response correctly', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        dstAmount: '420510000000000000',
        dstToken: { decimals: '18' },
        protocols: [['pool1']],
        gas: 150000,
      }),
    } as Response);

    process.env['ONEINCH_API_KEY'] = 'test-key';
    const { oneinchAdapter } = await import('../adapters/oneinch.js');
    const result = await oneinchAdapter.getQuote(mockQuoteReq);

    expect(result.expectedOutput).toBe('420510000000000000');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.gasEstimate).toBe('150000');
    delete process.env['ONEINCH_API_KEY'];
  });

  it('kyber adapter parses response correctly', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          routeSummary: {
            amountOut: '420400000000000000',
            tokenOutDecimals: '18',
            route: ['r1'],
            gas: '200000',
            amountInUsd: '1000',
            amountOutUsd: '999',
          },
        },
      }),
    } as Response);

    const { kyberAdapter } = await import('../adapters/kyber.js');
    const result = await kyberAdapter.getQuote(mockQuoteReq);

    expect(result.expectedOutput).toBe('420400000000000000');
  });

  it('openocean adapter parses response correctly', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        code: 200,
        data: {
          outAmount: '419800000000000000',
          outToken: { decimals: '18' },
          estimatedGas: '180000',
        },
      }),
    } as Response);

    const { openoceanAdapter } = await import('../adapters/openocean.js');
    const result = await openoceanAdapter.getQuote(mockQuoteReq);

    expect(result.expectedOutput).toBe('419800000000000000');
  });

  it('jupiter adapter parses Solana response correctly', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        outAmount: '42000000',
        routePlan: [{ step: 1 }],
        priceImpactPct: '0.12',
      }),
    } as Response);

    const { jupiterAdapter } = await import('../adapters/jupiter.js');
    const solanaReq = { ...mockQuoteReq, chainId: 501 };
    const result = await jupiterAdapter.getQuote(solanaReq);

    expect(result.expectedOutput).toBe('42000000');
    expect(result.priceImpactBps).toBe(12);
  });

  it('adapter throws on HTTP error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    const { kyberAdapter } = await import('../adapters/kyber.js');
    await expect(kyberAdapter.getQuote(mockQuoteReq)).rejects.toThrow('429');
  });
});
