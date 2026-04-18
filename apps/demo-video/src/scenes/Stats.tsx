import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

const STAT_ITEMS = [
  { value: 13, suffix: '', label: 'DEX Sources', sublabel: 'Queried in parallel', color: COLORS.cyan },
  { value: 2.8, suffix: 's', label: 'Avg Query Time', sublabel: 'Fan-out to certificate', color: COLORS.brightGreen },
  { value: 257, suffix: '', label: 'Tests Passing', sublabel: 'Across 6 packages', color: COLORS.purple },
  { value: 0, suffix: '', label: 'Gas for Agents', sublabel: 'Bench pays anchoring', color: COLORS.orange, prefix: '$' },
];

export const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const fadeOut = interpolate(frame, [110, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Background grid dots */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${COLORS.borderSubtle} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.4,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          width: '100%',
          textAlign: 'center',
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.dim, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 12 }}>
          BY THE NUMBERS
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 42, fontWeight: 800, color: COLORS.white }}>
          Built for <span style={{ color: COLORS.brightGreen }}>production</span>
        </div>
      </div>

      {/* Stat cards in 2x2 grid */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -40%)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          width: 800,
          marginTop: 40,
        }}
      >
        {STAT_ITEMS.map((stat, i) => {
          const delay = 15 + i * 12;
          const cardScale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 10, stiffness: 120 },
          });

          // Number counter
          const counterProgress = interpolate(frame, [delay + 10, delay + 40], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const displayValue = stat.value === 0
            ? '$0'
            : stat.value < 10
              ? (stat.value * counterProgress).toFixed(1)
              : Math.floor(stat.value * counterProgress);

          return (
            <div
              key={stat.label}
              style={{
                transform: `scale(${cardScale})`,
                padding: '36px 32px',
                borderRadius: 20,
                border: `1.5px solid ${stat.color}25`,
                backgroundColor: COLORS.bgLight,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow accent */}
              <div
                style={{
                  position: 'absolute',
                  top: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 200,
                  height: 100,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                }}
              />

              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 64,
                  fontWeight: 900,
                  color: stat.color,
                  lineHeight: 1,
                  position: 'relative',
                }}
              >
                {stat.prefix || ''}{displayValue}{stat.suffix}
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.white,
                  marginTop: 12,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  color: COLORS.dim,
                  marginTop: 6,
                }}
              >
                {stat.sublabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          width: '100%',
          textAlign: 'center',
          opacity: interpolate(frame, [80, 90], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 8, backgroundColor: `${COLORS.green}10`, border: `1px solid ${COLORS.green}30` }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}` }} />
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: COLORS.green }}>
            LIVE ON X LAYER MAINNET
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
