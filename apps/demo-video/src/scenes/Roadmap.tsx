import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

const ROADMAP_ITEMS = [
  {
    title: 'x402 Payments',
    desc: 'Machine-to-machine micropayments for certification',
    tag: 'Protocol',
    tagColor: COLORS.orange,
    icon: '💸',
  },
  {
    title: 'DAO Governance Gates',
    desc: 'Smart contracts requiring valid certs before swaps',
    tag: 'DeFi',
    tagColor: COLORS.purple,
    icon: '🏛️',
  },
  {
    title: 'Cross-Chain Anchoring',
    desc: 'One registry, every chain — X Layer as trust layer',
    tag: 'Expansion',
    tagColor: COLORS.cyan,
    icon: '🔗',
  },
  {
    title: 'Agent Economy Loop',
    desc: 'On-chain reputation drives capital allocation',
    tag: 'Vision',
    tagColor: COLORS.brightGreen,
    icon: '♾️',
  },
];

export const Roadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const fadeOut = interpolate(frame, [140, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          width: '100%',
          textAlign: 'center',
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.dim, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 12 }}>
          WHAT&apos;S NEXT
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 42, fontWeight: 800, color: COLORS.white }}>
          The roadmap goes <span style={{ color: COLORS.brightGreen }}>deeper</span>
        </div>
      </div>

      {/* Cards in a row */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -30%)',
          display: 'flex',
          gap: 24,
          width: 1400,
          padding: '0 40px',
        }}
      >
        {ROADMAP_ITEMS.map((item, i) => {
          const delay = 20 + i * 15;
          const cardY = interpolate(frame, [delay, delay + 15], [80, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const cardOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          // Subtle hover-like glow
          const isActive = frame > delay + 20 && frame < delay + 50;
          const glowIntensity = isActive
            ? interpolate(frame, [delay + 20, delay + 30, delay + 45, delay + 50], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 0;

          return (
            <div
              key={item.title}
              style={{
                flex: 1,
                transform: `translateY(${cardY}px)`,
                opacity: cardOpacity,
              }}
            >
              <div
                style={{
                  padding: '32px 24px',
                  borderRadius: 16,
                  border: `1.5px solid ${item.tagColor}${glowIntensity > 0.5 ? '50' : '20'}`,
                  backgroundColor: COLORS.bgLight,
                  height: 240,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: 'absolute',
                    top: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 200,
                    height: 80,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${item.tagColor}15 0%, transparent 70%)`,
                    opacity: glowIntensity,
                  }}
                />

                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 18, fontWeight: 700, color: COLORS.white }}>
                    {item.title}
                  </div>
                </div>

                <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.gray, lineHeight: 1.5, flex: 1 }}>
                  {item.desc}
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    padding: '4px 12px',
                    borderRadius: 6,
                    backgroundColor: `${item.tagColor}10`,
                    border: `1px solid ${item.tagColor}30`,
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    color: item.tagColor,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.tag}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
