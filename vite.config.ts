import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/d-id': {
          target: 'https://api.d-id.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/d-id/, ''),
          headers: {
            Origin: 'https://studio.d-id.com',
            Referer: 'https://studio.d-id.com/',
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Origin', 'https://studio.d-id.com');
              proxyReq.setHeader('Referer', 'https://studio.d-id.com/');
            });
          },
        },
      },
    },
  };
});
