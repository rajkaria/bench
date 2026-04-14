import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Agent box slides in
  const agentX = interpolate(frame, [0, 20], [-400, 0], { extrapolateRight: 'clamp' });
  const agentOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Arrow grows
  const arrowWidth = interpolate(frame, [20, 40], [0, 200], { extrapolateRight: 'clamp' });

  // Single DEX box slides in
  const dexX = interpolate(frame, [30, 50], [400, 0], { extrapolateRight: 'clamp' });
  const dexOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });

  // Price shown
  const priceOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' });

  // "But was it the best price?" text
  const questionOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: 'clamp' });

  // Red pulse on the single price
  const pulseScale = frame > 100 ? 1 + Math.sin(frame * 0.3) * 0.05 : 1;
  const priceColor = frame > 100 ? '#ff4444' : '#00ff88';

  // Cross-out animation
  const strikeWidth = interpolate(frame, [120, 140], [0, 100], { extrapolateRight: 'clamp' });

  // Stats counter
  const lossAmount = interpolate(frame, [130, 160], [0, 847], { extrapolateRight: 'clamp' });

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
      <div style={{ position: 'absolute', top: 80, fontSize: 28, color: '#666', opacity: agentOpacity }}>
        Single-source execution
      </div>

      {/* Flow diagram */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* Agent */}
        <div
          style={{
            opacity: agentOpacity,
            transform: `translateX(${agentX}px)`,
            padding: '30px 40px',
            border: '2px solid #333',
            borderRadius: 12,
            fontSize: 24,
            color: '#fff',
          }}
        >
          Agent
        </div>

        {/* Arrow */}
        <div style={{ width: arrowWidth, height: 2, backgroundColor: '#333', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -8, top: -6, color: '#333', fontSize: 16 }}>{'>'}</div>
        </div>

        {/* Single DEX */}
        <div
          style={{
            opacity: dexOpacity,
            transform: `translateX(${dexX}px)`,
            padding: '30px 40px',
            border: `2px solid ${frame > 100 ? '#ff4444' : '#444'}`,
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, color: '#fff', marginBottom: 10 }}>1 DEX</div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: priceColor,
              opacity: priceOpacity,
              transform: `scale(${pulseScale})`,
              position: 'relative',
            }}
          >
            0.4196 WETH
            {/* Strike-through */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                height: 3,
                width: `${strikeWidth}%`,
                backgroundColor: '#ff4444',
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          fontSize: 42,
          fontWeight: 'bold',
          color: '#ff4444',
          opacity: questionOpacity,
        }}
      >
        But was it the best price?
      </div>

      {/* Loss counter */}
      {frame > 130 && (
        <div
          style={{
            position: 'absolute',
            bottom: 130,
            fontSize: 24,
            color: '#ff6666',
            opacity: interpolate(frame, [130, 145], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Potential loss: ${Math.floor(lossAmount)} per trade
        </div>
      )}
    </AbsoluteFill>
  );
};
