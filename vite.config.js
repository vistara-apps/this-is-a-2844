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
        warn(warning);
      }
    }
  }
})
