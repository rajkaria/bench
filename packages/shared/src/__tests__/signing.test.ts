import { describe, it, expect } from 'vitest';
import {
  generateAttestorKeypair,
  loadAttestorKeypair,
  signCertificate,
  verifyCertificateSignature,
  computeTypedDataHash,
} from '../signing/index.js';

// Fixed test key (DO NOT use in production)
const TEST_PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as `0x${string}`;
// Known address for the above key (Hardhat account #0)
const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const MOCK_CERT_HASH =
  '0xa7c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0123' as `0x${string}`;

describe('keypair', () => {
  it('generates a valid keypair', () => {
    const kp = generateAttestorKeypair();
    expect(kp.privateKey).toMatch(/^0x[0-9a-f]{64}$/);
    expect(kp.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it('generates unique keypairs each time', () => {
    const kp1 = generateAttestorKeypair();
    const kp2 = generateAttestorKeypair();
    expect(kp1.privateKey).not.toBe(kp2.privateKey);
    expect(kp1.address).not.toBe(kp2.address);
  });

  it('loads a keypair from a known private key', () => {
    const kp = loadAttestorKeypair(TEST_PRIVATE_KEY);
    expect(kp.privateKey).toBe(TEST_PRIVATE_KEY);
    expect(kp.address).toBe(TEST_ADDRESS);
  });
});

describe('signCertificate', () => {
  it('returns a valid hex-encoded signature', async () => {
    const sig = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    expect(sig).toMatch(/^0x[0-9a-f]+$/);
    // EIP-712 signatures are 65 bytes (130 hex chars + 0x prefix)
    expect(sig.length).toBe(132);
  });

  it('produces deterministic signatures for same input', async () => {
    const sig1 = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    const sig2 = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    expect(sig1).toBe(sig2);
  });

  it('produces different signatures for different cert hashes', async () => {
    const hash2 =
      '0xb8d5e6f789012345678abcdef0123456789abcdef0123456789abcdef012345' as `0x${string}`;
    const sig1 = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    const sig2 = await signCertificate(TEST_PRIVATE_KEY, hash2, 'CERTIFIED', 92, 1712345678);
    expect(sig1).not.toBe(sig2);
  });

  it('produces different signatures for different certification levels', async () => {
    const sigCert = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    const sigWarn = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'WARNING', 92, 1712345678);
    const sigFail = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'FAILED', 92, 1712345678);
    expect(sigCert).not.toBe(sigWarn);
    expect(sigWarn).not.toBe(sigFail);
    expect(sigCert).not.toBe(sigFail);
  });
});

describe('verifyCertificateSignature', () => {
  it('recovers the correct signer address', async () => {
    const sig = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    const recovered = await verifyCertificateSignature(sig, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    expect(recovered).toBe(TEST_ADDRESS);
  });

  it('recovers a different address for a different key', async () => {
    const otherKey = generateAttestorKeypair();
    const sig = await signCertificate(otherKey.privateKey, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    const recovered = await verifyCertificateSignature(sig, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    expect(recovered).toBe(otherKey.address);
    expect(recovered).not.toBe(TEST_ADDRESS);
  });

  it('recovers wrong address when message is tampered', async () => {
    const sig = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    // Verify with different agreement score — should recover a different address
    const recovered = await verifyCertificateSignature(sig, MOCK_CERT_HASH, 'CERTIFIED', 50, 1712345678);
    expect(recovered).not.toBe(TEST_ADDRESS);
  });

  it('full roundtrip: sign -> verify for all certification levels', async () => {
    for (const level of ['CERTIFIED', 'WARNING', 'FAILED'] as const) {
      const sig = await signCertificate(TEST_PRIVATE_KEY, MOCK_CERT_HASH, level, 75, 1712345678);
      const recovered = await verifyCertificateSignature(sig, MOCK_CERT_HASH, level, 75, 1712345678);
      expect(recovered).toBe(TEST_ADDRESS);
    }
  });
});

describe('computeTypedDataHash', () => {
  it('returns a 0x-prefixed 32-byte hash', () => {
    const hash = computeTypedDataHash(MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it('is deterministic', () => {
    const h1 = computeTypedDataHash(MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    const h2 = computeTypedDataHash(MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    expect(h1).toBe(h2);
  });

  it('changes with different inputs', () => {
    const h1 = computeTypedDataHash(MOCK_CERT_HASH, 'CERTIFIED', 92, 1712345678);
    const h2 = computeTypedDataHash(MOCK_CERT_HASH, 'WARNING', 92, 1712345678);
    expect(h1).not.toBe(h2);
  });
});
