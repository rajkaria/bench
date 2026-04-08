import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

/** Attestor keypair: private key + derived Ethereum address + public key. */
export interface AttestorKeypair {
  /** Hex-encoded private key with 0x prefix. */
  privateKey: `0x${string}`;
  /** Checksummed Ethereum address. */
  address: `0x${string}`;
}

/**
 * Generate a new random secp256k1 keypair for the attestor.
 * Uses viem's cryptographically secure random generation.
 */
export function generateAttestorKeypair(): AttestorKeypair {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return {
    privateKey,
    address: account.address,
  };
}

/**
 * Load an attestor keypair from a hex-encoded private key.
 * Validates the key and derives the address.
 */
export function loadAttestorKeypair(privateKey: `0x${string}`): AttestorKeypair {
  const account = privateKeyToAccount(privateKey);
  return {
    privateKey,
    address: account.address,
  };
}
