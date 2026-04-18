import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SOURCES, ONCHAIN } from '../theme';

export const Consensus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Prices converge to center
  const convergeProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outlier flash and vanish (Dexalot)
  const outlierFlash = frame > 25 && frame < 35 ? Math.sin(frame * 2) * 0.5 + 0.5 : 0;
  const outlierGone = frame > 35;

  // Agreement score counter
  const agreementScore = Math.floor(
    interpolate(frame, [45, 85], [0, ONCHAIN.agreementScore], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Consensus price reveal
  const priceOpacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Certification badge
  const badgeScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 6, stiffness: 250 },
  });

  // Fade out
  const fadeOut = interpolate(frame, [110, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Bar chart data (sorted by price descending)
  const sortedSources = [...SOURCES].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  const medianPrice = parseFloat(ONCHAIN.consensusPrice);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: 50, width: '100%', textAlign: 'center', zIndex: 10 }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 700, color: COLORS.white }}>
          Computing <span style={{ color: COLORS.cyan }}>weighted median</span> consensus
        </div>
      </div>

      {/* Price bars converging */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 120,
          right: 160,
          bottom: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        {sortedSources.map((source, i) => {
          const price = parseFloat(source.price);
          const isOutlier = source.name === 'Dexalot';
          const deviation = Math.abs(price - medianPrice);
          const maxDeviation = 0.001;
          const barWidth = Math.min(100, (1 - deviation / maxDeviation) * 100);

          // Converge animation: bar moves toward consensus line
          const barOffset = (price - medianPrice) * 100000; // exaggerated for visual
          const currentOffset = barOffset * (1 - convergeProgress);

          if (isOutlier && outlierGone) return null;

          return (
            <div
              key={source.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                height: 36,
                opacity: isOutlier ? (outlierFlash > 0 ? 0.3 + outlierFlash * 0.7 : frame > 25 ? 0.2 : 1) : 1,
              }}
            >
              {/* Source name */}
              <div
                style={{
                  width: 110,
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  fontWeight: 600,
                  color: isOutlier ? COLORS.red : source.color,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {source.name}
              </div>

              {/* Bar */}
              <div style={{ flex: 1, position: 'relative', height: 28 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: `${50 + currentOffset * 2}%`,
                    top: 0,
                    height: '100%',
                    width: Math.max(60, barWidth * 5),
                    transform: 'translateX(-50%)',
                    borderRadius: 6,
                    background: isOutlier
                      ? `${COLORS.red}40`
                      : `linear-gradient(90deg, ${source.color}20, ${source.color}60)`,
                    border: `1px solid ${isOutlier ? COLORS.red : source.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: isOutlier ? 'none' : undefined,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 13,
                      fontWeight: 700,
                      color: isOutlier ? COLORS.red : COLORS.white,
                      textDecoration: isOutlier && frame > 30 ? 'line-through' : 'none',
                    }}
                  >
                    {source.price}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Consensus line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: COLORS.brightGreen,
            opacity: interpolate(frame, [30, 45], [0, 0.6], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            zIndex: 5,
          }}
        />
      </div>

      {/* Bottom stats */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 60,
          zIndex: 10,
        }}
      >
        {/* Consensus Price */}
        <div style={{ textAlign: 'center', opacity: priceOpacity }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim, letterSpacing: '2px', textTransform: 'uppercase' }}>
            CONSENSUS
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 36, fontWeight: 900, color: COLORS.brightGreen, marginTop: 4 }}>
            {ONCHAIN.consensusPrice}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim, marginTop: 2 }}>WETH per USDC</div>
        </div>

        {/* Agreement Score */}
        <div style={{ textAlign: 'center', opacity: priceOpacity }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim, letterSpacing: '2px', textTransform: 'uppercase' }}>
            AGREEMENT
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 36, fontWeight: 900, color: agreementScore >= 70 ? COLORS.brightGreen : COLORS.yellow, marginTop: 4 }}>
            {agreementScore}<span style={{ fontSize: 18, color: COLORS.dim }}>/100</span>
          </div>
        </div>

        {/* Sources */}
        <div style={{ textAlign: 'center', opacity: priceOpacity }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dim, letterSpacing: '2px', textTransform: 'uppercase' }}>
            SOURCES
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 36, fontWeight: 900, color: COLORS.white, marginTop: 4 }}>
            12<span style={{ fontSize: 18, color: COLORS.dim }}>/13</span>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.red, marginTop: 2 }}>1 outlier removed</div>
        </div>
      </div>

      {/* CERTIFIED badge */}
      {frame > 80 && (
        <div
          style={{
            position: 'absolute',
            right: 80,
            top: 50,
            transform: `scale(${badgeScale}) rotate(-3deg)`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: `2px solid ${COLORS.green}`,
              backgroundColor: `${COLORS.green}15`,
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 900,
              color: COLORS.green,
              letterSpacing: '3px',
            }}
          >
            CERTIFIED
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
