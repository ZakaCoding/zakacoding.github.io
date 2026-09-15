import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/chat-api': {
        target: env.CHAT_PROXY_TARGET || env.VITE_CHAT_API_URL || 'https://ws-chat-zakacoding.fly.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chat-api/, ''),
      },
    },
  },
  };
})
