import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  await esbuild.build({
    entryPoints: ['server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22',
    outfile: 'dist/server.cjs',
    format: 'cjs',
    external: ['vite'],
  });
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
