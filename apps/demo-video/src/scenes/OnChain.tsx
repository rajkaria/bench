import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS, ONCHAIN, glitchOffset } from '../theme';

export const OnChain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cert hash floats up from bottom
  const hashY = interpolate(frame, [0, 25], [300, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hashOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Arrow shooting right
  const arrowProgress = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Chain block appears
  const blockScale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // Contract address types out
  const contractChars = Math.min(
    ONCHAIN.contractAddress.length,
    Math.max(0, Math.floor((frame - 55) / 1.5))
  );

  // TX confirmed flash
  const txConfirmed = frame > 80;
  const confirmFlash = interpolate(frame, [80, 84, 92], [0, 0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Block number counter
  const blockNum = txConfirmed
    ? Math.floor(interpolate(frame, [82, 95], [57423700, ONCHAIN.blockNumber], {
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
      {/* Title */}
      <div style={{ position: 'absolute', top: 50, width: '100%', textAlign: 'center', zIndex: 10 }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 700, color: COLORS.white }}>
          Anchoring to <span style={{ color: COLORS.orange }}>X Layer</span> Mainnet
        </div>
      </div>

      {/* Main flow: Hash → Arrow → Block */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 40,
          padding: '0 120px',
        }}
      >
        {/* Cert Hash */}
        <div
          style={{
            transform: `translateY(${hashY}px)`,
            opacity: hashOpacity,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 320,
              padding: '24px',
              borderRadius: 16,
              border: `1.5px solid ${COLORS.brightGreen}40`,
              backgroundColor: COLORS.bgLight,
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.dim, letterSpacing: '2px', marginBottom: 8 }}>
              CERT HASH
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: COLORS.brightGreen, wordBreak: 'break-all', lineHeight: 1.5 }}>
              {ONCHAIN.certHash.slice(0, 22)}...
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.dim, marginTop: 8 }}>
              BEC v2 | EIP-712 signed
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ width: 200, position: 'relative', height: 4 }}>
          <div
            style={{
              width: `${arrowProgress * 100}%`,
              height: 3,
              background: `linear-gradient(90deg, ${COLORS.brightGreen}, ${COLORS.orange})`,
              borderRadius: 2,
            }}
          />
          {/* Traveling dot */}
          {arrowProgress > 0 && arrowProgress < 1 && (
            <div
              style={{
                position: 'absolute',
                left: `${arrowProgress * 100}%`,
                top: -4,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: COLORS.orange,
                boxShadow: `0 0 12px ${COLORS.orange}`,
              }}
            />
          )}
          {arrowProgress >= 1 && (
            <div
              style={{
                position: 'absolute',
                right: -6,
                top: -5,
                width: 0,
                height: 0,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderLeft: `10px solid ${COLORS.orange}`,
              }}
            />
          )}
        </div>

        {/* X Layer Block */}
        <div
          style={{
            transform: `scale(${blockScale})`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 380,
              padding: '28px',
              borderRadius: 16,
              border: `2px solid ${COLORS.orange}50`,
              backgroundColor: COLORS.bgLight,
              boxShadow: txConfirmed ? `0 0 40px ${COLORS.orange}20` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: `${COLORS.orange}20`,
                  border: `1px solid ${COLORS.orange}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  fontWeight: 900,
                  color: COLORS.orange,
                }}
              >
                XL
              </div>
              <div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 800, color: COLORS.white }}>
                  BenchRegistry
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.dim }}>
                  Chain 196 | X Layer Mainnet
                </div>
              </div>
            </div>

            {/* Contract address */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.dim, letterSpacing: '1px', marginBottom: 4 }}>
                CONTRACT
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.orange, fontWeight: 600 }}>
                {ONCHAIN.contractAddress.slice(0, contractChars)}
                {contractChars < ONCHAIN.contractAddress.length && (
                  <span style={{ color: COLORS.dim }}>|</span>
                )}
              </div>
            </div>

            {/* Block number */}
            {txConfirmed && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.dim, letterSpacing: '1px', marginBottom: 4 }}>
                  BLOCK
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 800, color: COLORS.white }}>
                  #{blockNum}
                </div>
              </div>
            )}

            {/* Status */}
            {txConfirmed && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 6,
                  backgroundColor: `${COLORS.green}15`,
                  border: `1px solid ${COLORS.green}40`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: COLORS.green,
                    boxShadow: `0 0 8px ${COLORS.green}`,
                  }}
                />
                <div style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: COLORS.green }}>
                  TX CONFIRMED
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          width: '100%',
          textAlign: 'center',
          opacity: interpolate(frame, [90, 100], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: COLORS.dim }}>
          Immutable. Verifiable. <span style={{ color: COLORS.brightGreen }}>No trust required.</span>
        </div>
      </div>

      {/* Confirm flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.orange,
          opacity: confirmFlash,
          zIndex: 20,
        }}
      />
    </AbsoluteFill>
  );
};
