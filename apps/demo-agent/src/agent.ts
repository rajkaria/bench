import { createPublicClient, http, formatEther, type PublicClient } from 'viem';
import { BenchSkill } from '@bench/skill';
import { CHAINS } from '@bench/shared';

// ============================================================================
// Configuration
// ============================================================================

const AGENT_CONFIG = {
  walletAddress: process.env['DEMO_AGENT_WALLET'] ?? '0x5a6Ad7E615E82B3d3eE2f70c4F4dF38f224ACcd1',
  agentId: 'bench-demo-agent',
  framework: 'custom-ts',
  benchApiUrl: process.env['BENCH_API_URL'] ?? 'https://attestor-production-b1ad.up.railway.app',
  benchApiKey: process.env['BENCH_API_KEY'],

  /** Swap interval in milliseconds. Default: 5 minutes. */
  intervalMs: parseInt(process.env['DEMO_INTERVAL_MS'] ?? '300000', 10),

  /** Chain to operate on. Default: X Layer Mainnet (196). */
  chainId: parseInt(process.env['DEMO_CHAIN_ID'] ?? '196', 10),

  /** RPC URL for the chain. */
  rpcUrl: process.env['XLAYER_RPC_URL'] ?? 'https://rpc.xlayer.tech',
};

// Common token addresses on X Layer
const XLAYER_TOKENS = {
  USDC: '0x74b7F16337b8972027F6196A17a631aC6dE26d22',
  WOKB: '0xe538905cf8410324e03A5A23C1c177a474D59b2b',
  WETH: '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
};

// Predefined swap pairs for the DCA strategy
const SWAP_PAIRS = [
  { inputToken: XLAYER_TOKENS.USDC, outputToken: XLAYER_TOKENS.WOKB, amount: '10000000', label: '10 USDC -> WOKB' },
  { inputToken: XLAYER_TOKENS.USDC, outputToken: XLAYER_TOKENS.WETH, amount: '5000000', label: '5 USDC -> WETH' },
  { inputToken: XLAYER_TOKENS.WOKB, outputToken: XLAYER_TOKENS.USDC, amount: '1000000000000000000', label: '1 WOKB -> USDC' },
];

// ============================================================================
// Agent Loop
// ============================================================================

const bench = new BenchSkill({
  baseUrl: AGENT_CONFIG.benchApiUrl,
  apiKey: AGENT_CONFIG.benchApiKey,
});

let client: PublicClient;
let swapIndex = 0;
let totalSwaps = 0;
let certifiedCount = 0;
let warningCount = 0;
let failedCount = 0;

async function runSwapCycle(): Promise<void> {
  const pair = SWAP_PAIRS[swapIndex % SWAP_PAIRS.length]!;
  swapIndex++;
  totalSwaps++;

  const cycleStart = Date.now();
  console.log(`\n=== Swap Cycle #${totalSwaps} | ${pair.label} ===`);

  try {
    // Get current block
    const blockNumber = await client.getBlockNumber();
    console.log(`Block: ${blockNumber}`);

    // For demo purposes, the "chosen" output is a simulated quote.
    // In production, the agent would query its preferred aggregator first.
    const simulatedChosenOutput = simulateChosenOutput(pair.amount);

    // Certify with Bench (queries 8-12 aggregators in parallel)
    console.log('Requesting Bench certification...');
    const cert = await bench.certifySwap({
      chainId: AGENT_CONFIG.chainId,
      inputToken: pair.inputToken,
      outputToken: pair.outputToken,
      amount: pair.amount,
      chosenSource: 'okx-aggregator',
      chosenOutput: simulatedChosenOutput,
      walletAddress: AGENT_CONFIG.walletAddress,
      agentId: AGENT_CONFIG.agentId,
      framework: AGENT_CONFIG.framework,
      blockNumber: Number(blockNumber),
    });

    // Log results
    const level = cert.quality.certificationLevel;
    const agreement = cert.consensus.sourceAgreementScore;
    const delta = cert.quality.slippageDeltaBps;
    const sources = cert.sources.successful.length;
    const failed = cert.sources.failed.length;
    const duration = cert.sources.totalQueryDurationMs;

    if (level === 'CERTIFIED') certifiedCount++;
    else if (level === 'WARNING') warningCount++;
    else failedCount++;

    console.log(`Result: ${level} | Agreement: ${agreement}/100 | Delta: ${delta} bps`);
    console.log(`Sources: ${sources} successful, ${failed} failed | Query: ${duration}ms`);
    console.log(`Best: ${cert.consensus.best.source} (${cert.consensus.best.expectedOutputFormatted})`);
    console.log(`Cert: ${cert.certHash.slice(0, 18)}...`);

    // If CERTIFIED, the agent would execute the swap here
    if (level === 'CERTIFIED') {
      console.log('-> Would execute swap (dry run)');
      // In production: execute swap via OKX Onchain Gateway, then report execution
    } else {
      console.log(`-> Skipping swap (${level})`);
    }

    const elapsed = Date.now() - cycleStart;
    console.log(`Cycle completed in ${elapsed}ms`);
    logStats();

  } catch (error) {
    console.error('Swap cycle failed:', error instanceof Error ? error.message : error);
  }
}

function simulateChosenOutput(inputAmount: string): string {
  // Simulate a reasonable output for demo purposes
  // In production, this comes from the agent's preferred aggregator
  const input = BigInt(inputAmount);
  const simulated = (input * 98n) / 100n; // Assume ~2% slippage for simulation
  return simulated.toString();
}

function logStats(): void {
  const rate = totalSwaps > 0 ? ((certifiedCount / totalSwaps) * 100).toFixed(1) : '0';
  console.log(`Stats: ${totalSwaps} total | ${certifiedCount} certified (${rate}%) | ${warningCount} warning | ${failedCount} failed`);
}

async function main(): Promise<void> {
  console.log('=== Bench Demo Agent ===');
  console.log('');
  console.log('--- Agentic Wallet (Onchain OS Identity) ---');
  console.log(`Address:  ${AGENT_CONFIG.walletAddress}`);
  console.log(`Chain:    X Layer Mainnet (${AGENT_CONFIG.chainId})`);
  console.log(`Role:     Autonomous DCA agent with Bench-certified execution`);
  console.log(`Registry: 0x6a400d858daA46C9f955601B672cc1a8899DcE3f (X Layer Mainnet)`);
  console.log('');
  console.log(`API:      ${AGENT_CONFIG.benchApiUrl}`);
  console.log(`Interval: ${AGENT_CONFIG.intervalMs / 1000}s`);
  console.log('');

  client = createPublicClient({
    transport: http(AGENT_CONFIG.rpcUrl),
  });

  // Run first cycle immediately
  await runSwapCycle();

  // Then run on interval
  setInterval(runSwapCycle, AGENT_CONFIG.intervalMs);
  console.log(`\nAgent running. Next cycle in ${AGENT_CONFIG.intervalMs / 1000}s...`);
}

main().catch((error) => {
  console.error('Agent failed to start:', error);
  process.exit(1);
});

export { runSwapCycle, AGENT_CONFIG };
