import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const line2Opacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const wrongScale = spring({ frame: frame - 60, fps, config: { damping: 8, stiffness: 200 } });
  const wrongOpacity = interpolate(frame, [60, 70], [0, 1], { extrapolateRight: 'clamp' });

  // Glitch effect on "wrong"
  const glitchX = frame > 60 && frame < 80 ? Math.sin(frame * 8) * 3 : 0;
  const glitchColor = frame > 65 && frame % 4 < 2 ? '#ff3333' : '#00ff88';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 52,
            color: '#888',
            opacity: line1Opacity,
            marginBottom: 20,
          }}
        >
          Your agent trusts <span style={{ color: '#fff', fontWeight: 'bold' }}>ONE</span> aggregator.
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: glitchColor,
            opacity: wrongOpacity,
            transform: `scale(${wrongScale}) translateX(${glitchX}px)`,
          }}
        >
          What if it's wrong?
        </div>
      </div>
    </AbsoluteFill>
  );
};
