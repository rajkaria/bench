import { AbsoluteFill, Sequence } from 'remotion';
import { Hook } from './scenes/Hook';
import { Problem } from './scenes/Problem';
import { Solution } from './scenes/Solution';
import { LiveProduct } from './scenes/LiveProduct';
import { Stack } from './scenes/Stack';
import { CTA } from './scenes/CTA';

export const BenchDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0f' }}>
      {/* 0-4s: Hook */}
      <Sequence from={0} durationInFrames={120}>
        <Hook />
      </Sequence>

      {/* 4-10s: Problem */}
      <Sequence from={120} durationInFrames={180}>
        <Problem />
      </Sequence>

      {/* 10-18s: Solution */}
      <Sequence from={300} durationInFrames={240}>
        <Solution />
      </Sequence>

      {/* 18-24s: Live Product */}
      <Sequence from={540} durationInFrames={180}>
        <LiveProduct />
      </Sequence>

      {/* 24-28s: Stack */}
      <Sequence from={720} durationInFrames={120}>
        <Stack />
      </Sequence>

      {/* 28-30s: CTA */}
      <Sequence from={840} durationInFrames={60}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
