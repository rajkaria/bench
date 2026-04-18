import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SOURCES, stagger } from '../theme';

export const FanOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Center node pulse
  const centerPulse = 1 + Math.sin(frame * 0.15) * 0.03;

  // Fade out
  const fadeOut = interpolate(frame, [165, 180], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Connection lines growing
  const lineProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          width: '100%',
          textAlign: 'center',
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 700, color: COLORS.white }}>
          Querying <span style={{ color: COLORS.brightGreen }}>13 sources</span> in parallel
        </div>
      </div>

      {/* Radial layout */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Center BENCH node */}
        <div
          style={{
            position: 'absolute',
            left: 960 - 50,
            top: 540 - 50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `3px solid ${COLORS.brightGreen}`,
            backgroundColor: COLORS.bgLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${centerPulse})`,
            boxShadow: `0 0 30px ${COLORS.brightGreen}30`,
            zIndex: 5,
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 900, color: COLORS.brightGreen }}>
            BENCH
          </div>
        </div>

        {/* Source nodes arranged in circle */}
        {SOURCES.map((source, i) => {
          const angle = (i / 13) * Math.PI * 2 - Math.PI / 2;
          const radius = 350;
          const cx = 960 + Math.cos(angle) * radius;
          const cy = 540 + Math.sin(angle) * radius;

          const delay = stagger(i, 5);
          const nodeScale = spring({
            frame: frame - 15 - delay,
            fps,
            config: { damping: 10, stiffness: 120 },
          });

          // Price typewriter
          const priceDelay = 40 + delay;
          const priceChars = Math.max(0, Math.min(7, Math.floor((frame - priceDelay) / 2)));

          // Connection line
          const thisLineProgress = interpolate(frame, [20 + delay, 35 + delay], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          // Pulse when price arrives
          const pricePulse = frame > priceDelay + 14 && frame < priceDelay + 24
            ? 1 + (1 - (frame - priceDelay - 14) / 10) * 0.15
            : 1;

          return (
            <div key={source.name}>
              {/* Connection line */}
              <svg
                style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zIndex: 1 }}
              >
                <line
                  x1={960}
                  y1={540}
                  x2={960 + (cx - 960) * thisLineProgress * lineProgress}
                  y2={540 + (cy - 540) * thisLineProgress * lineProgress}
                  stroke={source.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.3}
                />
                {/* Data packet dot traveling along line */}
                {frame > priceDelay && frame < priceDelay + 15 && (
                  <circle
                    cx={cx - (cx - 960) * ((frame - priceDelay) / 15)}
                    cy={cy - (cy - 540) * ((frame - priceDelay) / 15)}
                    r={3}
                    fill={source.color}
                    opacity={0.8}
                  />
                )}
              </svg>

              {/* Source node */}
              <div
                style={{
                  position: 'absolute',
                  left: cx - 65,
                  top: cy - 35,
                  width: 130,
                  transform: `scale(${nodeScale * pricePulse})`,
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: `1.5px solid ${source.color}40`,
                    backgroundColor: `${COLORS.bgLight}ee`,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 11,
                      fontWeight: 700,
                      color: source.color,
                      marginBottom: 4,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {source.name}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 14,
                      fontWeight: 800,
                      color: source.name === 'Dexalot' ? COLORS.red : COLORS.white,
                    }}
                  >
                    {priceChars > 0 ? source.price.slice(0, priceChars) : '...'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          zIndex: 10,
        }}
      >
        {[
          { label: 'Sources', value: Math.min(13, Math.floor(frame / 8)), suffix: '/13' },
          { label: 'Latency', value: frame > 60 ? '2.8s' : '...', suffix: '' },
          { label: 'Status', value: frame > 100 ? 'READY' : 'QUERYING', suffix: '' },
        ].map((stat, i) => {
          const statOpacity = interpolate(frame, [10 + i * 10, 20 + i * 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div key={stat.label} style={{ textAlign: 'center', opacity: statOpacity }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim, letterSpacing: '2px', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 800, color: stat.label === 'Status' && stat.value === 'READY' ? COLORS.brightGreen : COLORS.white, marginTop: 4 }}>
                {typeof stat.value === 'number' ? stat.value : stat.value}{stat.suffix}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
