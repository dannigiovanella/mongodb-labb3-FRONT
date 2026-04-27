import { defineConfig } from 'vite';
import { resolve } from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        add: resolve(__dirname, "add.html"),
        about: resolve(__dirname, "about.html"),
      }
    }
  },
  plugins: [
    ViteImageOptimizer({

      webp:{
        quality: 80
      }

    })
  ]

  });