import { createHash } from 'node:crypto';
import { canonicalize } from './canonical.js';
import type { CertHashableBody } from '../types/bec.js';

/**
 * Compute the SHA-256 hash of a certificate's hashable body.
 *
 * This is the canonical hash that:
 * 1. Gets signed by the attestor
 * 2. Gets anchored on-chain in BenchRegistry
 * 3. Gets used as the certificate's unique identifier
 *
 * The hash is computed over the canonical JSON serialization of the
 * hashable body (excludes certHash, attestor, onChainAnchor, execution).
 *
 * @returns Hex-encoded SHA-256 hash with 0x prefix
 */
export function computeCertHash(body: CertHashableBody): string {
  const canonical = canonicalize(body);
  const hash = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return `0x${hash}`;
}

/**
 * Verify that a given hash matches the canonical hash of a certificate body.
 */
export function verifyCertHash(body: CertHashableBody, expectedHash: string): boolean {
  const computed = computeCertHash(body);
  return computed === expectedHash;
}
