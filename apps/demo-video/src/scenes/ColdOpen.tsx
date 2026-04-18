import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { COLORS, FONTS, glitchOffset } from '../theme';

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text appears character by character
  const text = 'Your agent is trading blind.';
  const charsVisible = Math.min(Math.floor(frame / 2), text.length);
  const displayText = text.slice(0, charsVisible);
  const showCursor = frame % 10 < 6 && charsVisible < text.length;

  // Glitch intensity ramps up
  const glitchIntensity = interpolate(frame, [50, 80], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Red flash
  const redFlash = frame > 60 && frame % 4 < 2 ? 0.15 : 0;

  // Screen shake
  const shakeX = frame > 55 ? glitchOffset(frame, glitchIntensity * 0.5) : 0;
  const shakeY = frame > 55 ? glitchOffset(frame + 100, glitchIntensity * 0.3) : 0;

  // Scanlines
  const scanlineOffset = (frame * 3) % 1080;

  // RGB split
  const rgbSplit = interpolate(frame, [60, 85], [0, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        opacity: fadeOut,
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.15) 2px,
            rgba(0,0,0,0.15) 4px
          )`,
          transform: `translateY(${scanlineOffset % 4}px)`,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Red flash overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.red,
          opacity: redFlash,
          zIndex: 5,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          zIndex: 3,
        }}
      />

      {/* Main text with RGB split */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          position: 'relative',
          zIndex: 4,
        }}
      >
        {/* Red channel */}
        {rgbSplit > 0 && (
          <div
            style={{
              position: 'absolute',
              fontFamily: FONTS.mono,
              fontSize: 64,
              fontWeight: 800,
              color: 'rgba(255, 0, 0, 0.5)',
              transform: `translate(${rgbSplit}px, ${-rgbSplit * 0.5}px)`,
              letterSpacing: '-1px',
            }}
          >
            {displayText}
          </div>
        )}

        {/* Cyan channel */}
        {rgbSplit > 0 && (
          <div
            style={{
              position: 'absolute',
              fontFamily: FONTS.mono,
              fontSize: 64,
              fontWeight: 800,
              color: 'rgba(0, 255, 255, 0.5)',
              transform: `translate(${-rgbSplit}px, ${rgbSplit * 0.5}px)`,
              letterSpacing: '-1px',
            }}
          >
            {displayText}
          </div>
        )}

        {/* Main text */}
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: '-1px',
            position: 'relative',
          }}
        >
          {displayText}
          {showCursor && (
            <span style={{ color: COLORS.brightGreen }}>_</span>
          )}
        </div>

        {/* Subtitle */}
        {frame > 40 && (
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              color: COLORS.dim,
              marginTop: 20,
              opacity: interpolate(frame, [40, 50], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            No verification. No proof. No accountability.
          </div>
        )}
      </div>

      {/* Horizontal glitch bars */}
      {frame > 55 &&
        [0, 1, 2, 3, 4].map((i) => {
          const y = ((frame * 7 + i * 200) % 1080);
          const w = 100 + Math.sin(frame * 0.5 + i) * 80;
          const show = Math.sin(frame * 0.8 + i * 2) > 0.3;
          if (!show) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.sin(frame * 0.3 + i) * 100 + 900,
                top: y,
                width: w,
                height: 2 + Math.random() * 2,
                backgroundColor: i % 2 === 0 ? COLORS.cyan : COLORS.brightGreen,
                opacity: 0.4,
                zIndex: 8,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
