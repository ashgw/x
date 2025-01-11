import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    exclude: ['**/e2e/**'],
  },
  resolve: {
    alias: {
      // @see https://stackoverflow.com/questions/73022020/vitest-not-recognizing-absolute-import
      '~/lib': path.resolve(__dirname, './src/lib/'),
    },
  },
});
