import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const CERT_FEED = [
  { hash: '0xa7c4d5e6...', level: 'CERTIFIED', pair: 'USDC/WETH', chain: 'X Layer', agreement: 92, delta: 5, time: '2m ago' },
  { hash: '0xb8d5e6f7...', level: 'CERTIFIED', pair: 'ETH/USDC', chain: 'Ethereum', agreement: 88, delta: 8, time: '5m ago' },
  { hash: '0xc9e6f789...', level: 'WARNING', pair: 'ARB/USDC', chain: 'Arbitrum', agreement: 62, delta: 23, time: '8m ago' },
  { hash: '0xdaf70890...', level: 'CERTIFIED', pair: 'WOKB/USDC', chain: 'X Layer', agreement: 95, delta: 2, time: '12m ago' },
];

const LEVEL_COLORS: Record<string, string> = {
  CERTIFIED: '#00ff88',
  WARNING: '#ffaa00',
  FAILED: '#ff4444',
};

const STATS = [
  { label: 'Total Certificates', value: '1,247' },
  { label: 'Certified Rate', value: '94.2%', color: '#00ff88' },
  { label: 'Avg Agreement', value: '91/100' },
  { label: 'Source Queries', value: '14,892' },
  { label: 'Avg Query Time', value: '2.3s' },
];

export const LiveProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser frame scales in
  const browserScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const browserOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // URL bar types in
  const urlText = 'usebench.xyz';
  const urlChars = Math.min(Math.floor(interpolate(frame, [15, 45], [0, urlText.length], { extrapolateRight: 'clamp' })), urlText.length);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          width: 1600,
          opacity: browserOpacity,
          transform: `scale(${browserScale * 0.95 + 0.05})`,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #333',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Title bar */}
        <div style={{ backgroundColor: '#1a1a2e', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
          </div>
          <div style={{ flex: 1, backgroundColor: '#0d0d1a', borderRadius: 6, padding: '6px 16px', fontSize: 14, color: '#888' }}>
            {urlText.slice(0, urlChars)}
            {urlChars < urlText.length && <span style={{ color: '#00ff88' }}>|</span>}
          </div>
        </div>

        {/* Page content */}
        <div style={{ backgroundColor: '#0a0a0f', padding: '30px 40px' }}>
          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, paddingBottom: 16, borderBottom: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 'bold', background: 'linear-gradient(135deg, #00ff88, #00ddff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BENCH</span>
              <span style={{ fontSize: 14, color: '#666' }}>v2</span>
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#888' }}>
              <span>Live Feed</span>
              <span>Aggregators</span>
              <span>Agents</span>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
            {STATS.map((stat, i) => {
              const statOpacity = interpolate(frame, [40 + i * 8, 50 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
              return (
                <div key={stat.label} style={{ flex: 1, backgroundColor: '#111', border: '1px solid #222', borderRadius: 8, padding: '12px 16px', opacity: statOpacity }}>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 'bold', color: stat.color ?? '#fff' }}>{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* Cert feed */}
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>Recent Certificates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CERT_FEED.map((cert, i) => {
              const rowDelay = 70 + i * 15;
              const rowOpacity = interpolate(frame, [rowDelay, rowDelay + 12], [0, 1], { extrapolateRight: 'clamp' });
              const rowY = interpolate(frame, [rowDelay, rowDelay + 12], [20, 0], { extrapolateRight: 'clamp' });

              return (
                <div
                  key={cert.hash}
                  style={{
                    backgroundColor: '#111',
                    border: '1px solid #222',
                    borderRadius: 8,
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: rowOpacity,
                    transform: `translateY(${rowY}px)`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: LEVEL_COLORS[cert.level],
                        padding: '3px 8px',
                        border: `1px solid ${LEVEL_COLORS[cert.level]}33`,
                        borderRadius: 4,
                        backgroundColor: `${LEVEL_COLORS[cert.level]}15`,
                      }}
                    >
                      {cert.level}
                    </span>
                    <span style={{ fontSize: 13, color: '#666' }}>{cert.hash}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#888' }}>
                    <span>{cert.pair}</span>
                    <span>{cert.chain}</span>
                    <span>Agreement: {cert.agreement}/100</span>
                    <span>{cert.delta} bps</span>
                    <span>{cert.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
