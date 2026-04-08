import { describe, it, expect, vi, afterEach } from 'vitest';
import { BenchSkill } from '../skill.js';

describe('BenchSkill', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('constructs with default config', () => {
    const skill = new BenchSkill();
    expect(skill).toBeDefined();
  });

  it('constructs with custom config', () => {
    const skill = new BenchSkill({ baseUrl: 'http://localhost:3001', apiKey: 'test-key' });
    expect(skill).toBeDefined();
  });

  describe('certifySwap', () => {
    it('calls /v1/certify with correct body', async () => {
      const mockCert = {
        version: 'bench-v2',
        certId: 'test-id',
        certHash: '0xabc',
        quality: { certificationLevel: 'CERTIFIED' },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCert),
      } as Response);

      const skill = new BenchSkill({ baseUrl: 'http://localhost:3001' });
      const result = await skill.certifySwap({
        chainId: 196,
        inputToken: '0xUSDC',
        outputToken: '0xWETH',
        amount: '1000000000',
        chosenSource: 'uniswap-v3',
        chosenOutput: '420300000000000000',
        walletAddress: '0xAgent',
      });

      expect(result.version).toBe('bench-v2');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/v1/certify',
        expect.objectContaining({ method: 'POST' }),
      );

      // Verify body contains required fields
      const callArgs = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
      const body = JSON.parse(callArgs[1].body);
      expect(body.agent.walletAddress).toBe('0xAgent');
      expect(body.chainId).toBe(196);
      expect(body.chosen.source).toBe('uniswap-v3');
    });

    it('includes API key in Authorization header when provided', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);

      const skill = new BenchSkill({ baseUrl: 'http://localhost:3001', apiKey: 'my-key' });
      await skill.certifySwap({
        chainId: 1,
        inputToken: '0x1',
        outputToken: '0x2',
        amount: '1000',
        chosenSource: 'test',
        chosenOutput: '900',
        walletAddress: '0x3',
      });

      const callArgs = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
      expect(callArgs[1].headers['Authorization']).toBe('Bearer my-key');
    });

    it('throws on API error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ error: 'No sources' }),
      } as Response);

      const skill = new BenchSkill({ baseUrl: 'http://localhost:3001' });
      await expect(
        skill.certifySwap({
          chainId: 1,
          inputToken: '0x1',
          outputToken: '0x2',
          amount: '1000',
          chosenSource: 'test',
          chosenOutput: '900',
          walletAddress: '0x3',
        }),
      ).rejects.toThrow('503');
    });
  });

  describe('verifyCert', () => {
    it('calls /v1/verify with certificate', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ valid: true, checks: { hashValid: true, signatureValid: true } }),
      } as Response);

      const skill = new BenchSkill({ baseUrl: 'http://localhost:3001' });
      const result = await skill.verifyCert({ certificate: {} as never });

      expect(result.valid).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/v1/verify',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('reportExecution', () => {
    it('calls /v1/execution with certHash and txHash', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);

      const skill = new BenchSkill({ baseUrl: 'http://localhost:3001' });
      await skill.reportExecution('0xcertHash', '0xtxHash');

      const callArgs = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
      const body = JSON.parse(callArgs[1].body);
      expect(body.certHash).toBe('0xcertHash');
      expect(body.txHash).toBe('0xtxHash');
    });
  });
});
