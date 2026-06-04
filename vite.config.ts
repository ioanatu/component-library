import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'unplugin-dts/vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), libInjectCss(), dts({ tsconfigPath: 'tsconfig.build.json' })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: { globals: { react: 'React' } },
    },
    copyPublicDir: false,
  },
  css: {
    modules: { generateScopedName: '[name]_[local]_[hash:base64:7]', localsConvention: 'dashes' },
  },
});
