import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { ColdOpen } from './scenes/ColdOpen';
import { Problem } from './scenes/Problem';
import { LogoReveal } from './scenes/LogoReveal';
import { FanOut } from './scenes/FanOut';
import { Consensus } from './scenes/Consensus';
import { Certificate } from './scenes/Certificate';
import { OnChain } from './scenes/OnChain';
import { ProductShot } from './scenes/ProductShot';
import { Stats } from './scenes/Stats';
import { Roadmap } from './scenes/Roadmap';
import { CTA } from './scenes/CTA';

// Scene-synced SFX cue. `from` = start frame, `file` = /public/sfx/<file>.mp3
const sfx = (file: string, from: number, volume = 0.8) => (
  <Sequence key={`${file}-${from}`} from={from} durationInFrames={120}>
    <Audio src={staticFile(`sfx/${file}.mp3`)} volume={volume} />
  </Sequence>
);

export const BenchDemo: React.FC = () => {
  const TOTAL = 1410;

  return (
    <AbsoluteFill style={{ backgroundColor: '#09090B' }}>
      {/* ────────────── BACKGROUND MUSIC ──────────────
          "Volatile Reaction" by Kevin MacLeod (incompetech.com) — CC BY 3.0
          Slightly ducked under SFX so cues punch through. */}
      <Audio
        src={staticFile('music.mp3')}
        volume={(f) => {
          const fadeIn = Math.min(1, f / 30);              // 1s fade-in
          const fadeOut = Math.min(1, (TOTAL - f) / 60);   // 2s fade-out
          // Duck music during the logo hit (frames 210-270) and final impact (1260-1320)
          const duckLogo = f >= 210 && f <= 270 ? 0.35 : 1;
          const duckEnd = f >= 1260 && f <= 1320 ? 0.45 : 1;
          return Math.max(0, Math.min(fadeIn, fadeOut)) * 0.42 * duckLogo * duckEnd;
        }}
      />

      {/* ────────────── SCENE-SYNCED SFX ──────────────
          All SFX sourced from Mixkit (royalty-free, no attribution required). */}

      {/* ColdOpen (0-3s): glitch stutter + typewriter */}
      {sfx('glitch', 0, 0.9)}
      {sfx('typing', 20, 0.5)}

      {/* Problem (3-7s): alert ping as the single-source failure hits */}
      {sfx('alert', 95, 0.7)}
      {sfx('glitch', 150, 0.5)}

      {/* LogoReveal (7-10s): whoosh in → impact on reveal */}
      {sfx('whoosh', 210, 0.9)}
      {sfx('impact', 225, 1.0)}

      {/* FanOut (10-16s): 13 beeps staggered for the 13 sources firing out */}
      {sfx('beep', 305, 0.5)}
      {sfx('beep', 320, 0.5)}
      {sfx('beep', 335, 0.5)}
      {sfx('beep', 355, 0.5)}
      {sfx('beep', 380, 0.5)}
      {sfx('beep', 410, 0.5)}
      {sfx('swoosh', 440, 0.7)}

      {/* Consensus (16-20s): ticks as bars converge → lock when consensus snaps */}
      {sfx('tick', 485, 0.6)}
      {sfx('tick', 510, 0.6)}
      {sfx('tick', 540, 0.6)}
      {sfx('lock', 575, 0.9)}

      {/* Certificate (20-24s): stamp impact + success chime */}
      {sfx('whoosh', 605, 0.6)}
      {sfx('impact', 640, 0.8)}
      {sfx('success', 675, 0.7)}

      {/* OnChain (24-28s): data transfer beeps → confirmation chime */}
      {sfx('beep', 725, 0.5)}
      {sfx('beep', 745, 0.5)}
      {sfx('swoosh', 770, 0.6)}
      {sfx('chime', 805, 0.8)}

      {/* ProductShot (28-33s): subtle UI hover as explorer renders */}
      {sfx('hover', 845, 0.6)}
      {sfx('hover', 900, 0.5)}

      {/* Stats (33-37s): pop for each number counter landing */}
      {sfx('pop', 995, 0.7)}
      {sfx('pop', 1025, 0.7)}
      {sfx('pop', 1055, 0.7)}
      {sfx('pop', 1085, 0.7)}

      {/* Roadmap (37-42s): 4 card fly-ins = 4 swooshes */}
      {sfx('swoosh', 1115, 0.7)}
      {sfx('swoosh', 1150, 0.7)}
      {sfx('swoosh', 1185, 0.7)}
      {sfx('swoosh', 1220, 0.7)}

      {/* CTA (42-47s): final cinematic impact + resolution chime */}
      {sfx('impact', 1265, 1.0)}
      {sfx('success', 1330, 0.6)}

      {/* ────────────── VISUALS ────────────── */}

      {/* 0-3s: Cold Open — glitch hook */}
      <Sequence from={0} durationInFrames={90}>
        <ColdOpen />
      </Sequence>

      {/* 3-7s: Problem — single source failure */}
      <Sequence from={90} durationInFrames={120}>
        <Problem />
      </Sequence>

      {/* 7-10s: Logo Reveal — particle burst */}
      <Sequence from={210} durationInFrames={90}>
        <LogoReveal />
      </Sequence>

      {/* 10-16s: Fan Out — 13 sources radial */}
      <Sequence from={300} durationInFrames={180}>
        <FanOut />
      </Sequence>

      {/* 16-20s: Consensus — convergence animation */}
      <Sequence from={480} durationInFrames={120}>
        <Consensus />
      </Sequence>

      {/* 20-24s: Certificate — BEC v2 stamp */}
      <Sequence from={600} durationInFrames={120}>
        <Certificate />
      </Sequence>

      {/* 24-28s: On-Chain — X Layer anchoring */}
      <Sequence from={720} durationInFrames={120}>
        <OnChain />
      </Sequence>

      {/* 28-33s: Product Shot — explorer UI */}
      <Sequence from={840} durationInFrames={150}>
        <ProductShot />
      </Sequence>

      {/* 33-37s: Stats — number counters */}
      <Sequence from={990} durationInFrames={120}>
        <Stats />
      </Sequence>

      {/* 37-42s: Roadmap — card fly-ins */}
      <Sequence from={1110} durationInFrames={150}>
        <Roadmap />
      </Sequence>

      {/* 42-47s: CTA — closing */}
      <Sequence from={1260} durationInFrames={150}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
