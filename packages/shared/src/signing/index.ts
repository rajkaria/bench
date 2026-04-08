export { generateAttestorKeypair, loadAttestorKeypair } from './keypair.js';
export type { AttestorKeypair } from './keypair.js';

export {
  signCertificate,
  verifyCertificateSignature,
  computeTypedDataHash,
  BENCH_EIP712_DOMAIN,
  BENCH_EIP712_TYPES,
  CERT_LEVEL_ENCODING,
} from './sign.js';
export type { BenchAttestationMessage, CertLevelKey } from './sign.js';
