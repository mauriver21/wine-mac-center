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
  'redux-store/index': 'src/renderer/src/store/index.ts'
};

export default defineConfig(({ command }) => {
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
        exclude: ['**/*.stories.ts', '**/*.stories.tsx'],
        outDir: 'dist/redux-store',
        entryRoot: 'src/renderer/src/store'
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
