import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const TECH_BADGES = [
  { name: 'X Layer', color: '#00ddff', delay: 0 },
  { name: 'Onchain OS MCP', color: '#00ff88', delay: 8 },
  { name: 'Uniswap AI', color: '#aa88ff', delay: 16 },
  { name: 'KyberSwap', color: '#00ddff', delay: 24 },
  { name: 'CoW Swap', color: '#00ddff', delay: 28 },
  { name: 'OpenOcean', color: '#00ddff', delay: 32 },
  { name: 'LI.FI', color: '#00ddff', delay: 36 },
  { name: '+6 more', color: '#666', delay: 40 },
];

const FEATURES = [
  { icon: '13', label: 'DEX Sources', delay: 50 },
  { icon: '2.8s', label: 'Avg Query', delay: 58 },
  { icon: '257', label: 'Tests', delay: 66 },
  { icon: '0', label: 'Gas Fees', delay: 74 },
];

export const Stack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 36,
          color: '#888',
          marginBottom: 50,
          opacity: titleOpacity,
        }}
      >
        Powered by
      </div>

      {/* Tech badges */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
          maxWidth: 1200,
          marginBottom: 60,
        }}
      >
        {TECH_BADGES.map((badge) => {
          const badgeScale = spring({ frame: frame - badge.delay, fps, config: { damping: 10, stiffness: 180 } });
          const badgeOpacity = interpolate(frame, [badge.delay, badge.delay + 8], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <div
              key={badge.name}
              style={{
                opacity: badgeOpacity,
                transform: `scale(${badgeScale})`,
                fontSize: 22,
                padding: '12px 28px',
                border: `2px solid ${badge.color}`,
                borderRadius: 10,
                color: badge.color,
                backgroundColor: `${badge.color}10`,
                fontWeight: 'bold',
              }}
            >
              {badge.name}
            </div>
          );
        })}
      </div>

      {/* Feature numbers */}
      <div style={{ display: 'flex', gap: 80 }}>
        {FEATURES.map((feat) => {
          const featOpacity = interpolate(frame, [feat.delay, feat.delay + 10], [0, 1], { extrapolateRight: 'clamp' });
          const featY = interpolate(frame, [feat.delay, feat.delay + 10], [30, 0], { extrapolateRight: 'clamp' });

          return (
            <div
              key={feat.label}
              style={{
                textAlign: 'center',
                opacity: featOpacity,
                transform: `translateY(${featY}px)`,
              }}
            >
              <div style={{ fontSize: 56, fontWeight: 'bold', color: '#fff' }}>{feat.icon}</div>
              <div style={{ fontSize: 18, color: '#666', marginTop: 8 }}>{feat.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
