import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command,mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    build: {
      chunkSizeWarningLimit: 1000
    },
    plugins: [react()],
    define: {
      API_KEY: JSON.stringify(env.SHOPIFY_API_KEY)
    },
  }
})
