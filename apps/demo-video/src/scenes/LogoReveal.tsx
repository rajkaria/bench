import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

const PARTICLE_COUNT = 40;

// Deterministic random for particles
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale: starts at 0, springs to 1
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 8, stiffness: 200 } });

  // Glow pulse
  const glowIntensity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [30, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flash on impact
  const flashOpacity = interpolate(frame, [8, 12, 18], [0, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const fadeOut = interpolate(frame, [78, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Flash overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.brightGreen,
          opacity: flashOpacity,
          zIndex: 10,
        }}
      />

      {/* Particles */}
      {frame > 8 &&
        Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const angle = seededRandom(i) * Math.PI * 2;
          const speed = 3 + seededRandom(i + 100) * 8;
          const size = 2 + seededRandom(i + 200) * 4;
          const particleFrame = frame - 8;
          const distance = particleFrame * speed;
          const x = 960 + Math.cos(angle) * distance;
          const y = 540 + Math.sin(angle) * distance;
          const particleOpacity = interpolate(particleFrame, [0, 15, 40], [1, 0.8, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const isGreen = seededRandom(i + 300) > 0.5;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: isGreen ? COLORS.brightGreen : COLORS.cyan,
                opacity: particleOpacity,
                boxShadow: `0 0 ${size * 2}px ${isGreen ? COLORS.brightGreen : COLORS.cyan}`,
              }}
            />
          );
        })}

      {/* Center content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          zIndex: 5,
          position: 'relative',
        }}
      >
        {/* Logo text */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            fontFamily: FONTS.mono,
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: '-4px',
            background: `linear-gradient(135deg, ${COLORS.brightGreen}, ${COLORS.cyan})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 ${30 * glowIntensity}px ${COLORS.brightGreen}40)`,
            position: 'relative',
          }}
        >
          BENCH
        </div>

        {/* Underline */}
        <div
          style={{
            width: interpolate(frame, [15, 30], [0, 300], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            height: 3,
            background: `linear-gradient(90deg, ${COLORS.brightGreen}, ${COLORS.cyan})`,
            borderRadius: 2,
            marginTop: 8,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 32,
            fontWeight: 600,
            color: COLORS.white,
            marginTop: 30,
            opacity: taglineOpacity,
            letterSpacing: '1px',
          }}
        >
          <span style={{ color: COLORS.brightGreen }}>13</span> Sources.{' '}
          <span style={{ color: COLORS.cyan }}>1</span> Truth.
        </div>
      </div>

      {/* Radial glow behind logo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.brightGreen}15 0%, transparent 70%)`,
          opacity: glowIntensity,
          zIndex: 1,
        }}
      />
    </AbsoluteFill>
  );
};
