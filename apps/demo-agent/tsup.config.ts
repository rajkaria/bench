import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/agent.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  noExternal: ['@bench/shared', '@bench/skill'],
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});
