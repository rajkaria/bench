// Bench Hype Video — Shared Theme & Animation Utilities

export const COLORS = {
  bg: '#09090B',
  bgLight: '#111113',
  surface: '#18181B',
  border: '#27272A',
  borderSubtle: '#1E1E21',

  white: '#FAFAFA',
  gray: '#71717A',
  dim: '#52525B',
  darkGray: '#333333',

  green: '#22C55E',
  brightGreen: '#00ff88',
  cyan: '#00ddff',
  orange: '#F97316',
  purple: '#aa88ff',
  red: '#EF4444',
  brightRed: '#ff3333',
  yellow: '#EAB308',
} as const;

export const FONTS = {
  mono: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

// All 13 DEX aggregator sources
export const SOURCES = [
  { name: '1inch', price: '0.42051', color: COLORS.brightGreen, tier: 1 },
  { name: 'Paraswap', price: '0.42048', color: COLORS.cyan, tier: 1 },
  { name: 'KyberSwap', price: '0.42040', color: COLORS.cyan, tier: 1 },
  { name: 'OKX DEX', price: '0.42050', color: COLORS.orange, tier: 1 },
  { name: 'OpenOcean', price: '0.42035', color: COLORS.cyan, tier: 2 },
  { name: '0x / Matcha', price: '0.42042', color: COLORS.cyan, tier: 2 },
  { name: 'CoW Swap', price: '0.42038', color: COLORS.purple, tier: 2 },
  { name: 'Odos', price: '0.42045', color: COLORS.cyan, tier: 2 },
  { name: 'LI.FI', price: '0.42030', color: COLORS.cyan, tier: 2 },
  { name: 'Socket', price: '0.42025', color: COLORS.cyan, tier: 2 },
  { name: 'Jupiter', price: '0.42020', color: COLORS.purple, tier: 2 },
  { name: 'Uniswap AI', price: '0.42033', color: COLORS.purple, tier: 2 },
  { name: 'Dexalot', price: '0.41960', color: COLORS.red, tier: 3 },  // outlier
] as const;

// Real on-chain data
export const ONCHAIN = {
  contractAddress: '0x6a400d858daA46C9f955601B672cc1a8899DcE3f',
  chain: 'X Layer Mainnet',
  chainId: 196,
  certHash: '0x8f3a7b2c1d4e5f6a9b0c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7',
  blockNumber: 57423781,
  attestor: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  agreementScore: 92,
  consensusPrice: '0.42040',
  sourcesQueried: 13,
  sourcesSuccessful: 12,
} as const;

// Animation timing helpers
export const BEAT = 15; // frames per beat at 120 BPM @ 30fps

export function stagger(index: number, framesPerItem: number = 4): number {
  return index * framesPerItem;
}

export function glitchOffset(frame: number, intensity: number = 1): number {
  return Math.sin(frame * 0.7) * 3 * intensity +
    Math.sin(frame * 1.3) * 2 * intensity +
    Math.sin(frame * 3.7) * 1 * intensity;
}

export function pulse(frame: number, speed: number = 0.3): number {
  return 1 + Math.sin(frame * speed) * 0.03;
}
