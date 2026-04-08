export * from './adapters/index.js';
export { computeConsensus, computeMedian, computeStdDev, bigIntSqrt } from './services/consensus.js';
export { queryAllSources } from './services/multi-source-aggregator.js';
export { buildCertificate } from './services/certificate-builder.js';
export type { CertifyInput, AttestorConfig } from './services/certificate-builder.js';
