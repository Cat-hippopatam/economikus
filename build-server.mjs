import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Убедимся, что директория dist-server существует
if (!existsSync('dist-server')) {
  mkdirSync('dist-server', { recursive: true });
}

// Копируем prisma schema в dist-server
copyFileSync(
  resolve(__dirname, 'prisma/schema.prisma'),
  resolve(__dirname, 'dist-server/schema.prisma')
);

// Сборка сервера
await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outfile: 'dist-server/index.js',
  format: 'esm',
  external: [
    '@prisma/client',
    'bcryptjs',
    '.prisma/client',
    'dotenv'
  ],
  sourcemap: true,
  minify: false,
});

console.log('Server built successfully!');
