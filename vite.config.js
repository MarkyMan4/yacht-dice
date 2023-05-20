import { defineConfig } from 'vite';

export default defineConfig({
  base: "/yacht-dice/",
  build: {
    rollupOptions: {
        input: {
            index: './index.html',
            yacht: './yacht.html',
        }
    }
  }
});

