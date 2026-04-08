import { createPublicClient, http, parseAbiItem, type PublicClient, type Log } from 'viem';
import { CHAINS } from '@bench/shared';

/**
 * Post-Trade Verifier Worker
 *
 * Monitors swap execution on X Layer and verifies actual output
 * against the predicted output in the certificate.
 *
 * Two modes:
 * 1. Event monitoring (X Layer): subscribe to Transfer events, match to pending certs
 * 2. Manual reporting: agent calls POST /v1/execution with txHash, we verify via RPC
 */

export interface PendingVerification {
  certId: string;
  certHash: string;
  agentAddress: string;
  outputToken: string;
  predictedOutput: string;
  chainId: number;
  timestamp: number;
}

export interface VerificationResult {
  certId: string;
  txHash: string;
  actualOutput: string;
  predictedOutput: string;
  deviationBps: number;
  status: 'HONORED' | 'VIOLATED';
  mevDetected: boolean;
  verifiedAt: number;
}

/** Deviation threshold: > 100 bps between predicted and actual = VIOLATED */
const VIOLATION_THRESHOLD_BPS = 100;

/** MEV detection: if actual output is significantly worse than predicted AND the tx was sandwiched */
const MEV_THRESHOLD_BPS = 50;

/**
 * Verify a swap execution by fetching the transaction receipt and
 * computing the actual output from Transfer events.
 */
export async function verifyExecution(
  txHash: `0x${string}`,
  pending: PendingVerification,
  rpcUrl: string,
): Promise<VerificationResult> {
  const client = createPublicClient({ transport: http(rpcUrl) });
  const now = Math.floor(Date.now() / 1000);

  // Fetch transaction receipt
  const receipt = await client.getTransactionReceipt({ hash: txHash });
  if (!receipt) throw new Error(`Transaction not found: ${txHash}`);
  if (receipt.status === 'reverted') {
    return {
      certId: pending.certId,
      txHash,
      actualOutput: '0',
      predictedOutput: pending.predictedOutput,
      deviationBps: 10000,
      status: 'VIOLATED',
      mevDetected: false,
      verifiedAt: now,
    };
  }

  // Parse Transfer events to find the output token transfer to the agent
  const transferEventAbi = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');
  const actualOutput = extractOutputFromLogs(
    receipt.logs,
    pending.outputToken,
    pending.agentAddress,
  );

  // Compute deviation
  const predicted = BigInt(pending.predictedOutput);
  const actual = BigInt(actualOutput);
  const deviationBps = predicted > 0n
    ? Number(((predicted - actual) * 10000n) / predicted)
    : 0;

  // Determine status
  const status = Math.abs(deviationBps) > VIOLATION_THRESHOLD_BPS ? 'VIOLATED' : 'HONORED';

  // Simple MEV detection: actual significantly worse than predicted
  const mevDetected = deviationBps > MEV_THRESHOLD_BPS;

  return {
    certId: pending.certId,
    txHash,
    actualOutput,
    predictedOutput: pending.predictedOutput,
    deviationBps: Math.abs(deviationBps),
    status,
    mevDetected,
    verifiedAt: now,
  };
}

/**
 * Extract the output token amount received by the agent from tx logs.
 * Looks for ERC20 Transfer events where `to` matches the agent address.
 */
function extractOutputFromLogs(
  logs: Log[],
  outputToken: string,
  agentAddress: string,
): string {
  const outputTokenLower = outputToken.toLowerCase();
  const agentLower = agentAddress.toLowerCase();

  for (const log of logs) {
    // ERC20 Transfer topic: keccak256("Transfer(address,address,uint256)")
    const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

    if (
      log.address.toLowerCase() === outputTokenLower &&
      log.topics[0] === TRANSFER_TOPIC &&
      log.topics[2] && // `to` parameter
      log.topics[2].toLowerCase().includes(agentLower.slice(2))
    ) {
      // Value is in the data field for standard ERC20 Transfer
      if (log.data && log.data !== '0x') {
        return BigInt(log.data).toString();
      }
    }
  }

  return '0';
}

/**
 * Start the post-trade verifier polling loop.
 * In production, this would:
 * 1. Query the DB for pending verifications
 * 2. For each, check if the txHash has been mined
 * 3. If mined, verify and update the DB
 */
export async function startPostTradeWorker(config: {
  rpcUrl: string;
  pollIntervalMs: number;
  getPendingVerifications: () => Promise<PendingVerification[]>;
  saveResult: (result: VerificationResult) => Promise<void>;
}): Promise<void> {
  console.log('[PostTradeWorker] Starting...');

  const poll = async () => {
    try {
      const pending = await config.getPendingVerifications();
      if (pending.length === 0) return;

      console.log(`[PostTradeWorker] ${pending.length} pending verifications`);

      for (const p of pending) {
        // In production, txHash comes from the agent's execution report
        // For now, this is called when the agent reports via POST /v1/execution
        console.log(`[PostTradeWorker] Verifying cert ${p.certId}`);
      }
    } catch (error) {
      console.error('[PostTradeWorker] Poll error:', error);
    }
  };

  // Initial poll
  await poll();

  // Recurring poll
  setInterval(poll, config.pollIntervalMs);
}
