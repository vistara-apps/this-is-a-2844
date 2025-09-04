import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress all warnings for ox library circular dependencies
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        // Suppress comment warnings
        if (warning.code === 'PLUGIN_WARNING' && warning.message.includes('/*#__PURE__*/')) {
          return;
        }
        // Suppress all warnings related to ox library
        if (warning.message && warning.message.includes('ox/_esm/')) {
          return;
        }
        // Suppress annotation warnings
        if (warning.message && warning.message.includes('annotation that Rollup cannot interpret')) {
          return;
        }
        warn(warning);
      }
    },
    target: 'esnext',
    minify: false
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      process: "process/browser",
      buffer: "buffer",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify",
      url: "url"
    }
  }
})
