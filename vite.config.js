import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv lê o .env e expõe TODAS as variáveis ao processo Node do proxy
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
              proxyReq.setHeader('x-api-key', env.VITE_ANTHROPIC_KEY || '');
              proxyReq.setHeader('anthropic-version', '2023-06-01');
            });
          },
        },
        '/elevenlabs': {
          target: 'https://api.elevenlabs.io',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/elevenlabs/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
              proxyReq.setHeader('xi-api-key', env.VITE_ELEVENLABS_KEY || '');
            });
          },
        },
        '/deepgram': {
          target: 'https://api.deepgram.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/deepgram/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
              proxyReq.setHeader('Authorization', `Token ${env.VITE_DEEPGRAM_KEY || ''}`);
            });
          },
        },
      },
    },
  }
})
