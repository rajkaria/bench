import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Agent box slides in
  const agentX = interpolate(frame, [0, 20], [-300, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Arrow grows
  const arrowWidth = interpolate(frame, [15, 35], [0, 280], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // DEX box appears
  const dexScale = spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 150 } });

  // Price appears
  const priceOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Price turns red and pulses
  const priceIsRed = frame > 55;
  const pricePulse = priceIsRed ? 1 + Math.sin(frame * 0.4) * 0.05 : 1;

  // Strike through
  const strikeWidth = interpolate(frame, [60, 70], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Question text
  const questionOpacity = interpolate(frame, [70, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Loss counter
  const lossAmount = frame > 85
    ? Math.floor(interpolate(frame, [85, 110], [0, 847], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }))
    : 0;

  // Fade out
  const fadeOut = interpolate(frame, [110, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.borderSubtle} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.borderSubtle} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 0,
          position: 'relative',
        }}
      >
        {/* Agent Box */}
        <div
          style={{
            transform: `translateX(${agentX}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 20,
              border: `2px solid ${COLORS.cyan}`,
              backgroundColor: COLORS.bgLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 48 }}>🤖</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.cyan, fontWeight: 700 }}>AGENT</div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ width: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: arrowWidth,
              height: 3,
              background: `linear-gradient(90deg, ${COLORS.cyan}, ${priceIsRed ? COLORS.red : COLORS.cyan})`,
              borderRadius: 2,
              position: 'relative',
            }}
          >
            {arrowWidth > 250 && (
              <div
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -6,
                  width: 0,
                  height: 0,
                  borderTop: '7px solid transparent',
                  borderBottom: '7px solid transparent',
                  borderLeft: `10px solid ${priceIsRed ? COLORS.red : COLORS.cyan}`,
                }}
              />
            )}
          </div>
        </div>

        {/* Single DEX Box */}
        <div
          style={{
            transform: `scale(${dexScale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              border: `2px solid ${priceIsRed ? COLORS.red : COLORS.orange}`,
              backgroundColor: COLORS.bgLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
              position: 'relative',
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.dim, fontWeight: 600 }}>1 DEX</div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 32,
                fontWeight: 800,
                color: priceIsRed ? COLORS.red : COLORS.white,
                opacity: priceOpacity,
                transform: `scale(${pricePulse})`,
                position: 'relative',
              }}
            >
              0.4196
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  height: 3,
                  width: `${strikeWidth}%`,
                  backgroundColor: COLORS.red,
                  borderRadius: 2,
                }}
              />
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim }}>WETH</div>
          </div>
        </div>
      </div>

      {/* Question text */}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          width: '100%',
          textAlign: 'center',
          opacity: questionOpacity,
        }}
      >
        <div style={{ fontFamily: FONTS.sans, fontSize: 36, fontWeight: 700, color: COLORS.white }}>
          But was it the <span style={{ color: COLORS.red }}>best</span> price?
        </div>
      </div>

      {/* Loss counter */}
      {lossAmount > 0 && (
        <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center' }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.red, fontWeight: 600 }}>
            Potential loss: ${lossAmount} per trade
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
