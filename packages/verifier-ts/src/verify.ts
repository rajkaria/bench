import { createHash } from 'node:crypto';
import { recoverTypedDataAddress, hashTypedData } from 'viem';

// ============================================================================
// Types — self-contained, no @bench/shared dependency
// ============================================================================

/** Minimal certificate shape needed for verification. */
export interface BenchCertificate {
  version: string;
  certId: string;
  certHash: string;
  agent: Record<string, unknown>;
  trade: Record<string, unknown>;
  sources: Record<string, unknown>;
  consensus: Record<string, unknown>;
  chosen: Record<string, unknown>;
  quality: {
    certificationLevel: string;
    slippageDeltaBps: number;
    [key: string]: unknown;
  };
  attestor: {
    address: string;
    signature: string;
    signedAt: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface VerificationResult {
  /** Whether the certificate is fully valid. */
  valid: boolean;
  /** Individual check results. */
  checks: {
    /** Whether the certHash matches the canonical hash of the body. */
    hashValid: boolean;
    /** Whether the attestor signature recovers to the claimed address. */
    signatureValid: boolean;
    /** The address recovered from the signature. */
    recoveredAddress: string | null;
    /** The claimed attestor address from the certificate. */
    claimedAddress: string;
  };
  /** Error message if verification failed. */
  error?: string;
}

// ============================================================================
// Canonical JSON (reimplemented — no dependency on @bench/shared)
// ============================================================================

function canonicalize(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  switch (typeof value) {
    case 'boolean': return value ? 'true' : 'false';
    case 'number': {
      if (!Number.isFinite(value)) throw new Error('Non-finite number');
      if (Object.is(value, -0)) return '0';
      return JSON.stringify(value);
    }
    case 'string': return JSON.stringify(value);
    case 'bigint': return JSON.stringify(value.toString());
    case 'object': {
      if (Array.isArray(value)) {
        return `[${value.map(canonicalize).join(',')}]`;
      }
      const obj = value as Record<string, unknown>;
      const keys = Object.keys(obj).sort();
      const pairs = keys
        .filter((k) => obj[k] !== undefined)
        .map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
      return `{${pairs.join(',')}}`;
    }
    default: throw new Error(`Cannot canonicalize: ${typeof value}`);
  }
}

// ============================================================================
// EIP-712 domain (must match @bench/shared exactly)
// ============================================================================

const BENCH_DOMAIN = { name: 'Bench', version: '2', chainId: 196 } as const;

const BENCH_TYPES = {
  BenchAttestation: [
    { name: 'certHash', type: 'bytes32' },
    { name: 'certificationLevel', type: 'uint8' },
    { name: 'sourceAgreementScore', type: 'uint8' },
    { name: 'timestamp', type: 'uint64' },
  ],
} as const;

const CERT_LEVEL_MAP: Record<string, number> = {
  FAILED: 0,
  WARNING: 1,
  CERTIFIED: 2,
};

// ============================================================================
// Verification Functions
// ============================================================================

/**
 * Verify the cert hash matches the canonical body hash.
 */
export function verifyHash(cert: BenchCertificate): boolean {
  const hashableBody = {
    version: cert.version,
    certId: cert.certId,
    agent: cert.agent,
    trade: cert.trade,
    sources: cert.sources,
    consensus: cert.consensus,
    chosen: cert.chosen,
    quality: cert.quality,
  };

  const canonical = canonicalize(hashableBody);
  const computed = `0x${createHash('sha256').update(canonical, 'utf8').digest('hex')}`;
  return computed === cert.certHash;
}

/**
 * Verify the attestor signature and recover the signer address.
 */
export async function verifySignature(cert: BenchCertificate): Promise<{
  valid: boolean;
  recoveredAddress: string | null;
}> {
  try {
    const certLevel = CERT_LEVEL_MAP[cert.quality.certificationLevel];
    if (certLevel === undefined) return { valid: false, recoveredAddress: null };

    const agreementScore = (cert.consensus as { sourceAgreementScore?: number }).sourceAgreementScore ?? 0;

    const recovered = await recoverTypedDataAddress({
      domain: BENCH_DOMAIN,
      types: BENCH_TYPES,
      primaryType: 'BenchAttestation',
      message: {
        certHash: cert.certHash as `0x${string}`,
        certificationLevel: certLevel,
        sourceAgreementScore: agreementScore,
        timestamp: BigInt(cert.attestor.signedAt),
      },
      signature: cert.attestor.signature as `0x${string}`,
    });

    return {
      valid: recovered.toLowerCase() === cert.attestor.address.toLowerCase(),
      recoveredAddress: recovered,
    };
  } catch {
    return { valid: false, recoveredAddress: null };
  }
}

/**
 * Full certificate verification: hash + signature.
 */
export async function verifyCertificate(cert: BenchCertificate): Promise<VerificationResult> {
  const hashValid = verifyHash(cert);
  const sigResult = await verifySignature(cert);

  return {
    valid: hashValid && sigResult.valid,
    checks: {
      hashValid,
      signatureValid: sigResult.valid,
      recoveredAddress: sigResult.recoveredAddress,
      claimedAddress: cert.attestor.address,
    },
  };
}
