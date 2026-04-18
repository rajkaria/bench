import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

const CERT_ROWS = [
  { status: 'CERTIFIED', hash: '0x8f3a...e8f7', pair: 'USDC → WETH', chain: 'X Layer', agreement: 92, delta: '5 bps', time: '2m ago' },
  { status: 'CERTIFIED', hash: '0x4b2c...a1d3', pair: 'WETH → USDT', chain: 'Ethereum', agreement: 88, delta: '8 bps', time: '5m ago' },
  { status: 'WARNING', hash: '0x9e1f...b4c2', pair: 'WBTC → USDC', chain: 'Arbitrum', agreement: 65, delta: '12 bps', time: '8m ago' },
  { status: 'CERTIFIED', hash: '0x7d5a...c9e1', pair: 'ARB → USDC', chain: 'X Layer', agreement: 94, delta: '3 bps', time: '12m ago' },
  { status: 'CERTIFIED', hash: '0x2f8b...d7a5', pair: 'SOL → USDC', chain: 'Solana', agreement: 91, delta: '4 bps', time: '15m ago' },
];

const STATS = [
  { label: 'Certificates', value: '1,247' },
  { label: 'Certified Rate', value: '94.2%' },
  { label: 'Avg Agreement', value: '91/100' },
  { label: 'Source Queries', value: '14,892' },
];

export const ProductShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser window scales in
  const browserScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 100 } });

  // Scroll animation
  const scrollY = interpolate(frame, [60, 120], [0, -80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const fadeOut = interpolate(frame, [140, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Browser chrome */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${browserScale})`,
          width: 1400,
          borderRadius: 16,
          border: `1.5px solid ${COLORS.border}`,
          backgroundColor: COLORS.bgLight,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 40,
            backgroundColor: COLORS.surface,
            borderBottom: `1px solid ${COLORS.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              height: 26,
              borderRadius: 6,
              backgroundColor: COLORS.bg,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
            }}
          >
            <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim }}>
              https://usebench.xyz
            </span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 0, height: 620, overflow: 'hidden' }}>
          <div style={{ transform: `translateY(${scrollY}px)` }}>
            {/* Nav */}
            <div
              style={{
                height: 56,
                borderBottom: `1px solid ${COLORS.borderSubtle}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 32px',
                gap: 32,
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 900, color: COLORS.brightGreen }}>
                BENCH
              </div>
              {['Live Feed', 'Aggregators', 'Agents', 'Docs'].map((tab) => (
                <div key={tab} style={{ fontFamily: FONTS.sans, fontSize: 13, color: tab === 'Live Feed' ? COLORS.white : COLORS.dim, fontWeight: tab === 'Live Feed' ? 600 : 400 }}>
                  {tab}
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.green }} />
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.green }}>Live on X Layer</span>
              </div>
            </div>

            {/* Stats bar */}
            <div
              style={{
                display: 'flex',
                gap: 0,
                borderBottom: `1px solid ${COLORS.borderSubtle}`,
              }}
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    padding: '20px 32px',
                    borderRight: i < STATS.length - 1 ? `1px solid ${COLORS.borderSubtle}` : 'none',
                    opacity: interpolate(frame, [15 + i * 5, 25 + i * 5], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.dim, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 800, color: COLORS.white }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Certificate feed */}
            <div style={{ padding: '20px 32px' }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700, color: COLORS.white, marginBottom: 16 }}>
                Recent Certificates
              </div>

              {/* Table header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 140px 140px 100px 80px 70px 70px',
                  gap: 8,
                  padding: '8px 12px',
                  borderBottom: `1px solid ${COLORS.borderSubtle}`,
                  marginBottom: 4,
                }}
              >
                {['Status', 'Hash', 'Pair', 'Chain', 'Agreement', 'Delta', 'Time'].map((h) => (
                  <div key={h} style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.dim, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {CERT_ROWS.map((row, i) => {
                const rowOpacity = interpolate(frame, [25 + i * 8, 35 + i * 8], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                const isCertified = row.status === 'CERTIFIED';
                return (
                  <div
                    key={row.hash}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 140px 140px 100px 80px 70px 70px',
                      gap: 8,
                      padding: '10px 12px',
                      borderBottom: `1px solid ${COLORS.borderSubtle}`,
                      opacity: rowOpacity,
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: FONTS.mono,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          backgroundColor: isCertified ? `${COLORS.green}15` : `${COLORS.yellow}15`,
                          color: isCertified ? COLORS.green : COLORS.yellow,
                          border: `1px solid ${isCertified ? COLORS.green : COLORS.yellow}30`,
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.gray }}>{row.hash}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.white, fontWeight: 600 }}>{row.pair}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.dim }}>{row.chain}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: isCertified ? COLORS.green : COLORS.yellow, fontWeight: 700 }}>{row.agreement}%</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.dim }}>{row.delta}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.dim }}>{row.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          width: '100%',
          textAlign: 'center',
          opacity: interpolate(frame, [30, 40], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: COLORS.dim }}>
          Live at <span style={{ color: COLORS.brightGreen, fontWeight: 700 }}>usebench.xyz</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
