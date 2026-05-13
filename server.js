import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Anthropic Proxy
app.use('/anthropic', createProxyMiddleware({
  target: 'https://api.anthropic.com',
  changeOrigin: true,
  pathRewrite: { '^/anthropic': '' },
  on: {
    proxyReq: (proxyReq, req, res) => {
      proxyReq.removeHeader('origin');
      proxyReq.setHeader('x-api-key', process.env.VITE_ANTHROPIC_KEY || '');
      proxyReq.setHeader('anthropic-version', '2023-06-01');
    }
  }
}));

// ElevenLabs Proxy
app.use('/elevenlabs', createProxyMiddleware({
  target: 'https://api.elevenlabs.io',
  changeOrigin: true,
  pathRewrite: { '^/elevenlabs': '' },
  on: {
    proxyReq: (proxyReq, req, res) => {
      proxyReq.removeHeader('origin');
      proxyReq.setHeader('xi-api-key', process.env.VITE_ELEVENLABS_KEY || '');
    }
  }
}));

// Deepgram Proxy
app.use('/deepgram', createProxyMiddleware({
  target: 'https://api.deepgram.com',
  changeOrigin: true,
  pathRewrite: { '^/deepgram': '' },
  on: {
    proxyReq: (proxyReq, req, res) => {
      proxyReq.removeHeader('origin');
      proxyReq.setHeader('Authorization', `Token ${process.env.VITE_DEEPGRAM_KEY || ''}`);
    }
  }
}));

// Servir ficheiros estáticos da pasta dist/
app.use(express.static(path.join(__dirname, 'dist')));

// Redirecionar todos os outros pedidos para o index.html (React SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de produção a correr na porta ${PORT}`);
});
