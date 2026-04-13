import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  noExternal: ['@bench/shared', '@bench/db'],
  target: 'es2022',
  clean: true,
});
