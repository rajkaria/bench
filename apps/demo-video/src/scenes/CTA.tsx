import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo springs in
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 150 } });

  // Elements fade in sequentially
  const taglineOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const urlOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const githubOpacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hackathonOpacity = interpolate(frame, [60, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow pulse
  const glowPulse = 1 + Math.sin(frame * 0.1) * 0.2;

  // Fade to black
  const fadeOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
          transform: `translate(-50%, -50%) scale(${glowPulse})`,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.brightGreen}08 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 0,
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            fontFamily: FONTS.mono,
            fontSize: 100,
            fontWeight: 900,
            letterSpacing: '-3px',
            background: `linear-gradient(135deg, ${COLORS.brightGreen}, ${COLORS.cyan})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 40px ${COLORS.brightGreen}30)`,
            marginBottom: 16,
          }}
        >
          BENCH
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 24,
            fontWeight: 500,
            color: COLORS.gray,
            opacity: taglineOpacity,
            marginBottom: 40,
            letterSpacing: '0.5px',
          }}
        >
          The <span style={{ color: COLORS.white, fontWeight: 700 }}>NBBO</span> of Autonomous Agent Trading
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 28px',
              borderRadius: 10,
              border: `2px solid ${COLORS.brightGreen}40`,
              backgroundColor: `${COLORS.brightGreen}08`,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}` }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700, color: COLORS.brightGreen }}>
              usebench.xyz
            </span>
          </div>
        </div>

        {/* GitHub */}
        <div
          style={{
            opacity: githubOpacity,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 20px',
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.bgLight,
            }}
          >
            <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.gray }}>
              github.com/rajkaria/bench
            </span>
          </div>
        </div>

        {/* Hackathon credit */}
        <div
          style={{
            opacity: hackathonOpacity,
          }}
        >
          <div style={{ fontFamily: FONTS.sans, fontSize: 16, color: COLORS.dim, textAlign: 'center' }}>
            Built for{' '}
            <span style={{ color: COLORS.orange, fontWeight: 700 }}>OKX Build X Hackathon</span>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim, textAlign: 'center', marginTop: 8 }}>
            13 DEX aggregators | X Layer Mainnet | Open Source
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
