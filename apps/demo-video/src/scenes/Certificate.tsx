import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS, ONCHAIN } from '../theme';

export const Certificate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slides up
  const cardY = interpolate(frame, [0, 20], [200, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fields appear sequentially
  const fieldDelay = (i: number) => 15 + i * 8;
  const fieldOpacity = (i: number) =>
    interpolate(frame, [fieldDelay(i), fieldDelay(i) + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  // CERTIFIED stamp slams down
  const stampScale = spring({
    frame: frame - 75,
    fps,
    config: { damping: 5, stiffness: 300 },
  });

  // Stamp flash
  const stampFlash = interpolate(frame, [78, 82, 90], [0, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow around card
  const glowOpacity = interpolate(frame, [80, 100], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const fadeOut = interpolate(frame, [110, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const certFields = [
    { label: 'CERT HASH', value: ONCHAIN.certHash.slice(0, 18) + '...' + ONCHAIN.certHash.slice(-8), color: COLORS.white },
    { label: 'CONSENSUS PRICE', value: `${ONCHAIN.consensusPrice} WETH`, color: COLORS.brightGreen },
    { label: 'AGREEMENT', value: `${ONCHAIN.agreementScore}/100`, color: COLORS.brightGreen },
    { label: 'SOURCES', value: `${ONCHAIN.sourcesSuccessful}/${ONCHAIN.sourcesQueried}`, color: COLORS.cyan },
    { label: 'ATTESTOR', value: ONCHAIN.attestor.slice(0, 10) + '...' + ONCHAIN.attestor.slice(-6), color: COLORS.purple },
    { label: 'SIGNATURE', value: 'EIP-712 Typed Data v4', color: COLORS.orange },
    { label: 'FORMAT', value: 'BEC v2 (Bench Execution Certificate)', color: COLORS.dim },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Green glow behind card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 600,
          borderRadius: 30,
          background: `radial-gradient(ellipse, ${COLORS.brightGreen}12 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          width: '100%',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 700, color: COLORS.white }}>
          <span style={{ color: COLORS.brightGreen }}>Bench Execution Certificate</span> issued
        </div>
      </div>

      {/* Certificate card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translateY(${cardY}px)`,
          opacity: cardOpacity,
          width: 640,
          zIndex: 5,
        }}
      >
        <div
          style={{
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: 16,
            backgroundColor: COLORS.bgLight,
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: `1px solid ${COLORS.borderSubtle}`,
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 800, color: COLORS.brightGreen, letterSpacing: '3px' }}>
              BEC v2
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.dim }}>
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>

          {/* Fields */}
          {certFields.map((field, i) => (
            <div
              key={field.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                opacity: fieldOpacity(i),
                borderBottom: i < certFields.length - 1 ? `1px solid ${COLORS.borderSubtle}` : 'none',
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.dim, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {field.label}
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: field.color, textAlign: 'right', maxWidth: 350 }}>
                {field.value}
              </div>
            </div>
          ))}

          {/* CERTIFIED stamp overlay */}
          {frame > 75 && (
            <div
              style={{
                position: 'absolute',
                right: 30,
                top: '50%',
                transform: `translateY(-50%) scale(${stampScale}) rotate(-12deg)`,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  padding: '14px 30px',
                  border: `4px solid ${COLORS.green}`,
                  borderRadius: 10,
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  fontWeight: 900,
                  color: COLORS.green,
                  letterSpacing: '5px',
                  backgroundColor: `${COLORS.green}08`,
                }}
              >
                CERTIFIED
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flash on stamp */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.brightGreen,
          opacity: stampFlash,
          zIndex: 15,
        }}
      />
    </AbsoluteFill>
  );
};
