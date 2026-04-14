import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const subOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });

  // Fade out at the very end
  const fadeOut = interpolate(frame, [50, 60], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
        opacity: fadeOut,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #00ff88, #00ddff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: `scale(${logoScale})`,
          marginBottom: 20,
        }}
      >
        BENCH
      </div>

      {/* Tagline */}
      <div style={{ fontSize: 28, color: '#888', opacity: textOpacity, marginBottom: 40 }}>
        The NBBO of Autonomous Agent Trading
      </div>

      {/* GitHub URL */}
      <div
        style={{
          fontSize: 24,
          color: '#00ff88',
          opacity: subOpacity,
          padding: '12px 32px',
          border: '1px solid #00ff8833',
          borderRadius: 8,
          backgroundColor: '#00ff8810',
        }}
      >
        github.com/rajkaria/bench
      </div>

      {/* Hackathon badge */}
      <div style={{ position: 'absolute', bottom: 80, fontSize: 18, color: '#666', opacity: subOpacity }}>
        Built for OKX Build X Hackathon
      </div>
    </AbsoluteFill>
  );
};
