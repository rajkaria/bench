import { Hono } from 'hono';
import type { QuoteRequest, CertAgent, CertChosen, SwapType } from '@bench/shared';
import { isEvmChain, CHAINS } from '@bench/shared';
import { queryAllSources } from '../services/multi-source-aggregator.js';
import { computeConsensus } from '../services/consensus.js';
import { buildCertificate, type AttestorConfig } from '../services/certificate-builder.js';
import { anchorOnChain } from '../services/on-chain-anchor.js';
import { statsTracker } from '../services/stats-tracker.js';

export interface CertifyRequestBody {
  agent: CertAgent;
  chainId: number;
  inputToken: string;
  outputToken: string;
  amount: string;
  slippageBps?: number;
  chosen: CertChosen;
  blockNumber: number;
  destinationChainId?: number;
}

export function createCertifyRoute(attestorConfig: AttestorConfig) {
  const app = new Hono();

  app.post('/v1/certify', async (c) => {
    const body = await c.req.json<CertifyRequestBody>();

    // Validate required fields
    if (!body.agent?.walletAddress) return c.json({ error: 'agent.walletAddress required' }, 400);
    if (!body.chainId) return c.json({ error: 'chainId required' }, 400);
    if (!body.inputToken) return c.json({ error: 'inputToken required' }, 400);
    if (!body.outputToken) return c.json({ error: 'outputToken required' }, 400);
    if (!body.amount) return c.json({ error: 'amount required' }, 400);
    if (!body.chosen?.expectedOutput) return c.json({ error: 'chosen.expectedOutput required' }, 400);
    if (!body.blockNumber) return c.json({ error: 'blockNumber required' }, 400);

    // Determine swap type
    const swapType = determineSwapType(body.chainId, body.destinationChainId);

    const quoteReq: QuoteRequest = {
      chainId: body.chainId,
      inputToken: body.inputToken,
      outputToken: body.outputToken,
      amount: body.amount,
      slippageBps: body.slippageBps,
      destinationChainId: body.destinationChainId,
    };

    // Query all sources in parallel
    const queryResult = await queryAllSources(quoteReq, swapType);

    if (queryResult.successful.length === 0) {
      return c.json({
        error: 'No sources returned valid quotes',
        failed: queryResult.failed,
        totalQueryDurationMs: queryResult.totalQueryDurationMs,
      }, 503);
    }

    // Compute consensus
    const consensus = computeConsensus(queryResult.successful);

    // Build and sign certificate
    const cert = await buildCertificate(
      {
        request: quoteReq,
        swapType,
        agent: body.agent,
        blockNumber: body.blockNumber,
        chosen: body.chosen,
        queriedSources: queryResult.queriedSources,
        successful: queryResult.successful,
        failed: queryResult.failed,
        queryStartedAt: queryResult.queryStartedAt,
        queryCompletedAt: queryResult.queryCompletedAt,
        totalQueryDurationMs: queryResult.totalQueryDurationMs,
        consensus,
      },
      attestorConfig,
    );

    // Record in-memory stats (available even when DB is down)
    statsTracker.recordCert(
      cert.quality.certificationLevel,
      queryResult.successful.length,
      cert.consensus.sourceAgreementScore,
      queryResult.totalQueryDurationMs,
    );

    // Fire-and-forget on-chain anchoring
    anchorOnChain(
      {
        certHash: cert.certHash as `0x${string}`,
        agentAddress: cert.agent.walletAddress as `0x${string}`,
        certificationLevel: cert.quality.certificationLevel,
        sourceAgreementScore: cert.consensus.sourceAgreementScore,
        sourcesQueried: cert.sources.queried.length,
        sourcesSuccessful: cert.sources.successful.length,
        attestorSignature: cert.attestor.signature as `0x${string}`,
      },
      attestorConfig.privateKey,
    );

    return c.json(cert, 201);
  });

  return app;
}

function determineSwapType(chainId: number, destinationChainId?: number): SwapType {
  if (destinationChainId && destinationChainId !== chainId) return 'cross-chain';
  if (chainId === CHAINS.SOLANA) return 'single-chain-solana';
  if (isEvmChain(chainId)) return 'single-chain-evm';
  return 'single-chain-evm'; // Default fallback
}
