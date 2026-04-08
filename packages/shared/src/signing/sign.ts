import { privateKeyToAccount } from 'viem/accounts';
import { hashTypedData, recoverTypedDataAddress } from 'viem';
import { BENCH_CHAIN_ID } from '../constants/chains.js';

/**
 * EIP-712 domain for Bench certificate signing.
 *
 * Using EIP-712 typed data signing because:
 * 1. Structured — the cert is human-readable in wallets
 * 2. ecrecover-compatible — can verify on-chain in the future (v3)
 * 3. Standard — widely supported by wallets and libraries
 */
export const BENCH_EIP712_DOMAIN = {
  name: 'Bench',
  version: '2',
  chainId: BENCH_CHAIN_ID,
} as const;

/**
 * EIP-712 type definition for the certificate hash attestation.
 *
 * We sign the certHash (SHA-256 of the canonical body), not the body itself.
 * This keeps the signed payload small and gas-efficient for on-chain verification.
 */
export const BENCH_EIP712_TYPES = {
  BenchAttestation: [
    { name: 'certHash', type: 'bytes32' },
    { name: 'certificationLevel', type: 'uint8' },
    { name: 'sourceAgreementScore', type: 'uint8' },
    { name: 'timestamp', type: 'uint64' },
  ],
} as const;

/** Numeric encoding of certification levels for EIP-712. */
export const CERT_LEVEL_ENCODING = {
  FAILED: 0,
  WARNING: 1,
  CERTIFIED: 2,
} as const;

export type CertLevelKey = keyof typeof CERT_LEVEL_ENCODING;

/** The message structure signed by the attestor. */
export interface BenchAttestationMessage {
  certHash: `0x${string}`;
  certificationLevel: number;
  sourceAgreementScore: number;
  timestamp: bigint;
}

/**
 * Sign a certificate hash using EIP-712 typed data signing.
 *
 * @returns Hex-encoded signature
 */
export async function signCertificate(
  privateKey: `0x${string}`,
  certHash: `0x${string}`,
  certificationLevel: CertLevelKey,
  sourceAgreementScore: number,
  timestamp: number,
): Promise<`0x${string}`> {
  const account = privateKeyToAccount(privateKey);
  const message: BenchAttestationMessage = {
    certHash,
    certificationLevel: CERT_LEVEL_ENCODING[certificationLevel],
    sourceAgreementScore,
    timestamp: BigInt(timestamp),
  };

  const signature = await account.signTypedData({
    domain: BENCH_EIP712_DOMAIN,
    types: BENCH_EIP712_TYPES,
    primaryType: 'BenchAttestation',
    message,
  });

  return signature;
}

/**
 * Verify an EIP-712 signature and recover the signer address.
 *
 * @returns The recovered signer address (checksummed)
 */
export async function verifyCertificateSignature(
  signature: `0x${string}`,
  certHash: `0x${string}`,
  certificationLevel: CertLevelKey,
  sourceAgreementScore: number,
  timestamp: number,
): Promise<`0x${string}`> {
  const message: BenchAttestationMessage = {
    certHash,
    certificationLevel: CERT_LEVEL_ENCODING[certificationLevel],
    sourceAgreementScore,
    timestamp: BigInt(timestamp),
  };

  const recoveredAddress = await recoverTypedDataAddress({
    domain: BENCH_EIP712_DOMAIN,
    types: BENCH_EIP712_TYPES,
    primaryType: 'BenchAttestation',
    message,
    signature,
  });

  return recoveredAddress;
}

/**
 * Compute the EIP-712 typed data hash (for on-chain verification).
 */
export function computeTypedDataHash(
  certHash: `0x${string}`,
  certificationLevel: CertLevelKey,
  sourceAgreementScore: number,
  timestamp: number,
): `0x${string}` {
  const message: BenchAttestationMessage = {
    certHash,
    certificationLevel: CERT_LEVEL_ENCODING[certificationLevel],
    sourceAgreementScore,
    timestamp: BigInt(timestamp),
  };

  return hashTypedData({
    domain: BENCH_EIP712_DOMAIN,
    types: BENCH_EIP712_TYPES,
    primaryType: 'BenchAttestation',
    message,
  });
}
