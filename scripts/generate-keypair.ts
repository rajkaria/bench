#!/usr/bin/env npx tsx
/**
 * Generate a new secp256k1 attestor keypair for the Bench attestor service.
 *
 * Usage:
 *   pnpm run generate-keypair
 *
 * Output:
 *   Prints the private key and address. Copy them into your .env file.
 *   NEVER commit the private key to git.
 */

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log('=== Bench Attestor Keypair ===\n');
console.log(`ATTESTOR_PRIVATE_KEY=${privateKey.slice(2)}`);
console.log(`ATTESTOR_ADDRESS=${account.address}`);
console.log('\nCopy the above into your .env file.');
console.log('NEVER commit the private key to version control.\n');
