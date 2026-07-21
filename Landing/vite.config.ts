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
        enHome: resolve(__dirname, 'en/index.html'),
        viHome: resolve(__dirname, 'vi/index.html'),
        communityIndex: resolve(__dirname, 'community/index.html'),
        communityEn: resolve(__dirname, 'community/en/index.html'),
        communityVi: resolve(__dirname, 'community/vi/index.html'),
        blogIndex: resolve(__dirname, 'blog/index.html'),
        blogPromoCode: resolve(__dirname, 'blog/bc-game-promo-code-2026/index.html'),
        blogProvablyFair: resolve(__dirname, 'blog/provably-fair-explained/index.html'),
        blogReviews: resolve(__dirname, 'blog/bc-game-otzyvy/index.html'),
        blogStrategy: resolve(__dirname, 'blog/crash-plinko-strategiya/index.html'),
        blogNoKyc: resolve(__dirname, 'blog/no-kyc-crypto-casino/index.html'),
        blogLuckySpin: resolve(__dirname, 'blog/bc-game-lucky-spin/index.html'),
        blogVipRakeback: resolve(__dirname, 'blog/bc-game-vip-rakeback/index.html'),
        blogEnIndex: resolve(__dirname, 'blog/en/index.html'),
        blogEnPromoCode: resolve(__dirname, 'blog/en/bc-game-promo-code-2026/index.html'),
        blogEnReviews: resolve(__dirname, 'blog/en/bc-game-otzyvy/index.html'),
        blogEnStrategy: resolve(__dirname, 'blog/en/crash-plinko-strategiya/index.html'),
        blogEnNoKyc: resolve(__dirname, 'blog/en/no-kyc-crypto-casino/index.html'),
        blogEnProvablyFair: resolve(__dirname, 'blog/en/provably-fair-explained/index.html'),
        blogEnLuckySpin: resolve(__dirname, 'blog/en/bc-game-lucky-spin/index.html'),
        blogEnVipRakeback: resolve(__dirname, 'blog/en/bc-game-vip-rakeback/index.html'),
        blogViIndex: resolve(__dirname, 'blog/vi/index.html'),
        blogViPromoCode: resolve(__dirname, 'blog/vi/bc-game-promo-code-2026/index.html'),
        blogViReviews: resolve(__dirname, 'blog/vi/bc-game-otzyvy/index.html'),
        blogViStrategy: resolve(__dirname, 'blog/vi/crash-plinko-strategiya/index.html'),
        blogViNoKyc: resolve(__dirname, 'blog/vi/no-kyc-crypto-casino/index.html'),
        blogViProvablyFair: resolve(__dirname, 'blog/vi/provably-fair-explained/index.html'),
        blogViLuckySpin: resolve(__dirname, 'blog/vi/bc-game-lucky-spin/index.html'),
        blogViVipRakeback: resolve(__dirname, 'blog/vi/bc-game-vip-rakeback/index.html'),
      },
    },
  },
});