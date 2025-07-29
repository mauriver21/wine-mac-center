import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import checker from 'vite-plugin-checker';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        'reactjs-ui-core.css': resolve(
          __dirname,
          'node_modules/reactjs-ui-core/dist/reactjs-ui-core.css'
        )
      }
    },
    plugins: [
      react(),
      checker({
        typescript: {
          tsconfigPath: './tsconfig.web.json' // Specify your custom tsconfig path
        },
        overlay: false
      }),
      tsconfigPaths(),
      EnvironmentPlugin('all')
    ]
  }
});
