import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [react(), libInjectCss(), dts({ tsconfigPath: 'tsconfig.lib.json', outDirs: ['dist'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: '@ioanatu/component-library',
      formats: ['es'],
    },
    // Lib mode emits everything flat into dist/, so assets are not nested
    // under an assets/ dir - keep relative URL computation in sync with that.
    assetsDir: '',
    cssCodeSplit: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } },
    },
    copyPublicDir: false,
  },
  // Emit asset URLs relative to the built CSS so fonts resolve inside the
  // consumer's bundle rather than against their site root.
  experimental: {
    renderBuiltUrl: () => ({ relative: true }),
  },
  css: {
    modules: { generateScopedName: '[name]_[local]_[hash:base64:7]', localsConvention: 'dashes' },
  },
});
