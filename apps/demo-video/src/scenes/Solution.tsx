import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const SOURCES = [
  { name: '1inch', output: '0.42051', value: 100, color: '#00ff88' },
  { name: 'OKX MCP', output: '0.42050', value: 99.7, color: '#00ff88' },
  { name: 'Velora', output: '0.42040', value: 97.4, color: '#00ddff' },
  { name: 'Odos', output: '0.42040', value: 97.4, color: '#00ddff' },
  { name: 'Uniswap AI', output: '0.42030', value: 95.1, color: '#aa88ff' },
  { name: 'KyberSwap', output: '0.42020', value: 92.8, color: '#00ddff' },
  { name: 'OpenOcean', output: '0.41960', value: 78.9, color: '#00ddff' },
  { name: 'CoW Swap', output: 'TIMEOUT', value: 0, color: '#ff4444' },
];

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 15], [-30, 0], { extrapolateRight: 'clamp' });

  // "BENCH" label
  const benchScale = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 150 } });

  // Consensus line
  const consensusOpacity = interpolate(frame, [160, 180], [0, 1], { extrapolateRight: 'clamp' });

  // Result badge
  const badgeScale = spring({ frame: frame - 190, fps, config: { damping: 8, stiffness: 200 } });
  const badgeOpacity = interpolate(frame, [190, 200], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        fontFamily: 'monospace',
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 40,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff88, #00ddff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: `scale(${benchScale})`,
            display: 'inline-block',
          }}
        >
          BENCH
        </span>
        <span style={{ fontSize: 32, color: '#666' }}>queries 13 sources in parallel</span>
      </div>

      {/* Animated bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SOURCES.map((source, i) => {
          const delay = 20 + i * 15;
          const barWidth = interpolate(frame, [delay, delay + 30], [0, source.value], {
            extrapolateRight: 'clamp',
          });
          const rowOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const isBest = i === 0;

          return (
            <div
              key={source.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: rowOpacity,
              }}
            >
              <span
                style={{
                  width: 160,
                  textAlign: 'right',
                  fontSize: 20,
                  color: '#888',
                }}
              >
                {source.name}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 36,
                  backgroundColor: '#1a1a2e',
                  borderRadius: 6,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    backgroundColor: source.color,
                    borderRadius: 6,
                    opacity: source.value === 0 ? 0.3 : 0.8,
                    transition: 'width 0.3s',
                  }}
                />
                {barWidth > 10 && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 18,
                      color: '#fff',
                      fontWeight: isBest ? 'bold' : 'normal',
                    }}
                  >
                    {source.output}
                  </span>
                )}
              </div>
              {isBest && barWidth > 50 && (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#00ff88',
                    padding: '4px 10px',
                    border: '1px solid #00ff88',
                    borderRadius: 4,
                  }}
                >
                  BEST
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Consensus line */}
      <div
        style={{
          marginTop: 30,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: consensusOpacity,
          padding: '16px 180px 16px 0',
        }}
      >
        <div style={{ display: 'flex', gap: 40, fontSize: 20, color: '#888' }}>
          <span>Median: <span style={{ color: '#fff' }}>0.4203</span></span>
          <span>Agreement: <span style={{ color: '#00ff88' }}>92/100</span></span>
          <span>Query: <span style={{ color: '#fff' }}>2.8s</span></span>
        </div>
      </div>

      {/* CERTIFIED badge */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          bottom: 120,
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 'bold',
            color: '#00ff88',
            padding: '20px 40px',
            border: '3px solid #00ff88',
            borderRadius: 16,
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
          }}
        >
          CERTIFIED
        </div>
        <div style={{ fontSize: 18, color: '#666', marginTop: 10 }}>
          Delta: 5 bps
        </div>
      </div>
    </AbsoluteFill>
  );
};
