import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts', 'src/index.ts'],
  format: ['esm'],
  noExternal: ['@bench/shared', '@bench/db'],
  target: 'node22',
  clean: true,
  platform: 'node',
  banner: {
    js: `import{createRequire}from'module';const require=createRequire(import.meta.url);`,
  },
});
