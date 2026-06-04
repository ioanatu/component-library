import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'unplugin-dts/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: 'tsconfig.build.json' })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: { globals: { react: 'React' } },
    },
  },
  css: {
    modules: { generateScopedName: '[name]_[local]_[hash:base64:7]', localsConvention: 'dashes' },
  },
});
