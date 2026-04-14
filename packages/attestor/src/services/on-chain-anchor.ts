import {
  createWalletClient,
  createPublicClient,
  http,
  defineChain,
  keccak256,
  type Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const xlayer = defineChain({
  id: 196,
  name: 'X Layer',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.xlayer.tech'] } },
  blockExplorers: {
    default: { name: 'OKX Explorer', url: 'https://www.okx.com/web3/explorer/xlayer' },
  },
});

const REGISTRY_ADDRESS = '0x6a400d858daA46C9f955601B672cc1a8899DcE3f' as const;

const ANCHOR_ABI = [
  {
    inputs: [
      { name: 'certHash', type: 'bytes32' },
      { name: 'agent', type: 'address' },
      { name: 'certificationLevel', type: 'uint8' },
      { name: 'sourceAgreementScore', type: 'uint8' },
      { name: 'sourcesQueried', type: 'uint8' },
      { name: 'sourcesSuccessful', type: 'uint8' },
      { name: 'attestorSignatureHash', type: 'bytes32' },
    ],
    name: 'anchorCertificate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const CERT_LEVEL_MAP: Record<string, number> = {
  CERTIFIED: 0,
  WARNING: 1,
  FAILED: 2,
};

interface AnchorParams {
  certHash: Hex;
  agentAddress: Hex;
  certificationLevel: string;
  sourceAgreementScore: number;
  sourcesQueried: number;
  sourcesSuccessful: number;
  attestorSignature: Hex;
}

export function anchorOnChain(
  params: AnchorParams,
  privateKey: `0x${string}`,
): void {
  const account = privateKeyToAccount(privateKey);

  const walletClient = createWalletClient({
    account,
    chain: xlayer,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: xlayer,
    transport: http(),
  });

  const level = CERT_LEVEL_MAP[params.certificationLevel] ?? 2;
  const sigHash = keccak256(params.attestorSignature);

  walletClient
    .writeContract({
      address: REGISTRY_ADDRESS,
      abi: ANCHOR_ABI,
      functionName: 'anchorCertificate',
      args: [
        params.certHash as Hex,
        params.agentAddress as Hex,
        level,
        params.sourceAgreementScore,
        params.sourcesQueried,
        params.sourcesSuccessful,
        sigHash,
      ],
    })
    .then(async (txHash) => {
      console.log(`[anchor] tx submitted: ${txHash}`);
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      console.log(`[anchor] confirmed in block ${receipt.blockNumber}, status=${receipt.status}`);
    })
    .catch((err) => {
      console.error('[anchor] on-chain anchoring failed:', err instanceof Error ? err.message : err);
    });
}
