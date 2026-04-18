import { Composition } from 'remotion';
import { BenchDemo } from './Video';

export const Root: React.FC = () => {
  return (
    <Composition
      id="BenchDemo"
      component={BenchDemo}
      durationInFrames={1410}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
