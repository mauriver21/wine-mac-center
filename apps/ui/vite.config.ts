import fs from 'fs';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { defineConfig, LibraryOptions } from 'vite';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const { dependencies = {}, peerDependencies = {}, devDependencies = {} } = packageJson;

const externalDeps = [
  ...Object.keys(dependencies),
  ...Object.keys(peerDependencies),
  ...Object.keys(devDependencies)
];

const ENTRY_POINTS: Record<string, string> = {
  'app-launcher/index': 'src/renderer/src/externals/app-launcher/index.ts',
  'public-api/index': 'src/renderer/src/public-api/index.ts'
};

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      dts({
        tsconfigPath: 'tsconfig.web.json',
        exclude: ['**/*.stories.ts', '**/*.stories.tsx'],
        outDir: 'dist/app-launcher',
        entryRoot: 'src/renderer/src/externals/app-launcher'
      }),
      dts({
        tsconfigPath: 'tsconfig.web.json',
        include: [
          'src/renderer/src/components/EnvProvider',
          'src/renderer/src/public-api',
          'src/renderer/src/store',
          'src/renderer/src/hooks/useEnv'
        ],
        exclude: ['**/*.stories.ts', '**/*.stories.tsx'],
        outDir: 'dist',
        entryRoot: 'src/renderer/src'
      })
    ],
    build: {
      minify: false,
      lib: {
        entry: ENTRY_POINTS,
        formats: ['es']
      } as LibraryOptions,
      rollupOptions: {
        external: (id) => {
          if (externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`))) {
            return true;
          }
          return false;
        },
        output: {
          assetFileNames: 'styles.css'
        }
      },
      emptyOutDir: true
    }
  };
});
