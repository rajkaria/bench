// Types
export * from './types/index.js';

// Hashing
export { canonicalize, computeCertHash, verifyCertHash } from './hash/index.js';

// Signing
export {
  generateAttestorKeypair,
  loadAttestorKeypair,
  signCertificate,
  verifyCertificateSignature,
  computeTypedDataHash,
  BENCH_EIP712_DOMAIN,
  BENCH_EIP712_TYPES,
  CERT_LEVEL_ENCODING,
} from './signing/index.js';
export type { AttestorKeypair, BenchAttestationMessage, CertLevelKey } from './signing/index.js';

// Constants
export * from './constants/index.js';
