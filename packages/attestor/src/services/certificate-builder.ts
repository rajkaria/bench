import { v4 as uuidv4 } from 'uuid';
import type {
  BestExecutionCertificateV2, CertHashableBody, CertSources, CertConsensus,
  CertChosen, CertQuality, CertAgent, CertTrade, CertAttestor,
  QuoteRequest, SourceResponse, ConsensusResult, SwapType,
} from '@bench/shared';
import { computeCertHash, computeCertificationLevel, BEC_VERSION } from '@bench/shared';
import { signCertificate, type CertLevelKey } from '@bench/shared';

export interface CertifyInput {
  /** The original swap request. */
  request: QuoteRequest;
  /** Swap type classification. */
  swapType: SwapType;
  /** Agent identity. */
  agent: CertAgent;
  /** Block number at the time of the quote. */
  blockNumber: number;
  /** The agent's chosen route for comparison. */
  chosen: CertChosen;
  /** Multi-source query results. */
  queriedSources: string[];
  successful: SourceResponse[];
  failed: { source: string; error: string; failedAt: number }[];
  queryStartedAt: number;
  queryCompletedAt: number;
  totalQueryDurationMs: number;
  /** Consensus result from the consensus engine. */
  consensus: ConsensusResult;
}

export interface AttestorConfig {
  privateKey: `0x${string}`;
  address: `0x${string}`;
  publicKey: string;
}

/**
 * Build a complete BEC v2 certificate from the multi-source query result,
 * consensus, and chosen route. Signs with the attestor key.
 */
export async function buildCertificate(
  input: CertifyInput,
  attestorConfig: AttestorConfig,
): Promise<BestExecutionCertificateV2> {
  const certId = uuidv4();
  const now = Math.floor(Date.now() / 1000);

  // Compute slippage delta in basis points
  const chosenOutput = BigInt(input.chosen.expectedOutput);
  const consensusBest = BigInt(input.consensus.best.expectedOutput);
  const slippageDeltaBps = consensusBest > 0n
    ? Number(((consensusBest - chosenOutput) * 10000n) / consensusBest)
    : 0;

  const outputDelta = consensusBest - chosenOutput;
  const certificationLevel = computeCertificationLevel(
    Math.abs(slippageDeltaBps),
    input.consensus.sourceAgreementScore,
    input.successful.length,
  );

  const reason = buildReason(Math.abs(slippageDeltaBps), input.consensus.sourceAgreementScore, certificationLevel, input.successful.length);

  // Build the hashable body
  const trade: CertTrade = {
    chainId: input.request.chainId,
    blockNumber: input.blockNumber,
    timestamp: now,
    inputToken: {
      address: input.request.inputToken,
      symbol: '',
      name: '',
      decimals: 18,
      amount: input.request.amount,
      amountFormatted: '',
    },
    outputToken: {
      address: input.request.outputToken,
      symbol: '',
      name: '',
      decimals: 18,
      amount: '0',
      amountFormatted: '',
    },
    swapType: input.swapType,
  };

  const sources: CertSources = {
    queried: input.queriedSources,
    successful: input.successful,
    filtered: input.consensus.filtered,
    failed: input.failed,
    queryStartedAt: input.queryStartedAt,
    queryCompletedAt: input.queryCompletedAt,
    totalQueryDurationMs: input.totalQueryDurationMs,
  };

  const consensus: CertConsensus = {
    best: {
      source: input.consensus.best.source,
      expectedOutput: input.consensus.best.expectedOutput,
      expectedOutputFormatted: input.consensus.best.expectedOutputFormatted,
      route: input.consensus.best.route,
    },
    median: input.consensus.median,
    stddev: input.consensus.stddev,
    sourceAgreementScore: input.consensus.sourceAgreementScore,
    confidenceTier: input.consensus.confidenceTier,
    outliersExcluded: input.consensus.outliersExcluded,
  };

  const quality: CertQuality = {
    slippageDeltaBps: Math.abs(slippageDeltaBps),
    expectedOutputDelta: outputDelta.toString(),
    expectedOutputDeltaUsd: 0, // Would need price oracle to compute
    certificationLevel,
    reason,
  };

  const hashableBody: CertHashableBody = {
    version: BEC_VERSION,
    certId,
    agent: input.agent,
    trade,
    sources,
    consensus,
    chosen: input.chosen,
    quality,
  };

  const certHash = computeCertHash(hashableBody) as `0x${string}`;

  // Sign the certificate
  const signature = await signCertificate(
    attestorConfig.privateKey,
    certHash,
    certificationLevel as CertLevelKey,
    input.consensus.sourceAgreementScore,
    now,
  );

  const attestor: CertAttestor = {
    address: attestorConfig.address,
    publicKey: attestorConfig.publicKey,
    signature,
    signedAt: now,
  };

  return {
    ...hashableBody,
    certHash,
    attestor,
  };
}

function buildReason(
  deltaBps: number,
  agreementScore: number,
  level: string,
  sourceCount: number,
): string {
  if (sourceCount === 1) {
    return `Single source — insufficient consensus for full certification. Agreement: N/A.`;
  }

  const agreementStr = `Source Agreement: ${agreementScore}/100 (${
    agreementScore >= 90 ? 'STRONG' : agreementScore >= 70 ? 'MODERATE' : agreementScore >= 50 ? 'WEAK' : 'NONE'
  }).`;

  switch (level) {
    case 'CERTIFIED':
      return `Within 10 bps of consensus best (${deltaBps} bps actual). ${agreementStr}`;
    case 'WARNING':
      if (deltaBps > 10) return `${deltaBps} bps from consensus best (threshold: 10 bps). ${agreementStr}`;
      return `Agreement score below threshold. ${agreementStr}`;
    case 'FAILED':
      if (deltaBps > 50) return `${deltaBps} bps from consensus best — exceeds 50 bps threshold. ${agreementStr}`;
      return `Source agreement too low (${agreementScore}/100). Sources significantly disagree. Manual review recommended.`;
    default:
      return `Certification level: ${level}. ${agreementStr}`;
  }
}
