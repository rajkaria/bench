/**
 * @usebench/verifier — Independent certificate verification
 *
 * This package has ZERO dependencies on any Bench internal code.
 * It re-implements the canonical hashing and signature verification
 * from scratch so that anyone can verify a BEC v2 certificate
 * without trusting Bench.
 *
 * Usage:
 *   import { verifyCertificate } from '@usebench/verifier';
 *   const result = await verifyCertificate(cert);
 *   if (result.valid) { ... }
 */

export { verifyCertificate, verifyHash, verifySignature } from './verify.js';
export type { VerificationResult, BenchCertificate } from './verify.js';
