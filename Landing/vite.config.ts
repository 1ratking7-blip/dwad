import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      // Static multi-page blog (see Landing/blog/README.md) — plain HTML/CSS, no React,
      // so each new post's index.html must be added here or Vite won't build/emit it.
      input: {
        main: resolve(__dirname, 'index.html'),
        blogIndex: resolve(__dirname, 'blog/index.html'),
        blogPromoCode: resolve(__dirname, 'blog/bc-game-promo-code-2026/index.html'),
        blogProvablyFair: resolve(__dirname, 'blog/provably-fair-explained/index.html'),
        blogReviews: resolve(__dirname, 'blog/bc-game-otzyvy/index.html'),
        blogStrategy: resolve(__dirname, 'blog/crash-plinko-strategiya/index.html'),
        blogNoKyc: resolve(__dirname, 'blog/no-kyc-crypto-casino/index.html'),
      },
    },
  },
});