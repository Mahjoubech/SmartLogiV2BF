import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: false, // Allow fallback to next port but we prefer 5173
    host: true, // Listen on all addresses
    hmr: {
        // If you are behind a proxy, you might need to set this. 
        // For now, let's keep it default or 'clientPort' if needed.
        // clientPort: 5173 
    }
  }
})
