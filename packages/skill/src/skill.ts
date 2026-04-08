import type { BestExecutionCertificateV2, CertChosen } from '@bench/shared';

export interface CertifySwapParams {
  chainId: number;
  inputToken: string;
  outputToken: string;
  amount: string;
  chosenSource: string;
  chosenOutput: string;
  walletAddress: string;
  agentId?: string;
  framework?: string;
  slippageBps?: number;
  blockNumber?: number;
  destinationChainId?: number;
}

export interface VerifyCertParams {
  certificate: BestExecutionCertificateV2;
}

export interface AgentScoreParams {
  walletAddress: string;
}

export interface AgentScoreResult {
  benchScore: number;
  certificationRate: number;
  honorRate: number;
  totalCerts: number;
  recentCerts: Array<{
    certHash: string;
    certificationLevel: string;
    sourceAgreementScore: number;
    timestamp: number;
  }>;
}

/**
 * Bench Skill — the primary interface for agents to interact with Bench.
 *
 * Wraps the Bench Attestor API for use as an Onchain OS skill or
 * standalone SDK.
 */
export class BenchSkill {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  constructor(config: { baseUrl?: string; apiKey?: string } = {}) {
    this.baseUrl = config.baseUrl ?? process.env['BENCH_API_URL'] ?? 'https://api.usebench.xyz';
    this.apiKey = config.apiKey ?? process.env['BENCH_API_KEY'];
  }

  /**
   * Certify a swap against the multi-source consensus best price.
   *
   * This is the primary entry point for agents. Call this BEFORE executing
   * a swap to get a Best Execution Certificate.
   */
  async certifySwap(params: CertifySwapParams): Promise<BestExecutionCertificateV2> {
    const chosen: CertChosen = {
      source: params.chosenSource,
      expectedOutput: params.chosenOutput,
      expectedOutputFormatted: '',
      route: { hops: [], summary: `via ${params.chosenSource}` },
    };

    const response = await fetch(`${this.baseUrl}/v1/certify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        agent: {
          walletAddress: params.walletAddress,
          agentId: params.agentId,
          framework: params.framework,
        },
        chainId: params.chainId,
        inputToken: params.inputToken,
        outputToken: params.outputToken,
        amount: params.amount,
        slippageBps: params.slippageBps ?? 50,
        chosen,
        blockNumber: params.blockNumber ?? 0,
        destinationChainId: params.destinationChainId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Bench certify failed (${response.status}): ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Verify a certificate's integrity and attestor signature.
   */
  async verifyCert(params: VerifyCertParams): Promise<{
    valid: boolean;
    checks: { hashValid: boolean; signatureValid: boolean };
  }> {
    const response = await fetch(`${this.baseUrl}/v1/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.certificate),
    });

    if (!response.ok) {
      throw new Error(`Bench verify failed (${response.status})`);
    }

    return response.json();
  }

  /**
   * Get an agent's Bench Score and certification history.
   */
  async getAgentScore(params: AgentScoreParams): Promise<AgentScoreResult> {
    const response = await fetch(
      `${this.baseUrl}/v1/agent/${params.walletAddress}/score`,
      { headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {} },
    );

    if (!response.ok) {
      throw new Error(`Bench agent score failed (${response.status})`);
    }

    return response.json();
  }

  /**
   * Report a swap execution for post-trade verification.
   */
  async reportExecution(certHash: string, txHash: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/execution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ certHash, txHash }),
    });

    if (!response.ok) {
      throw new Error(`Bench report execution failed (${response.status})`);
    }
  }
}
