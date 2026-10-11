import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' keeps asset paths relative so the build works on GitHub Pages
// under any project subpath without extra configuration.
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: { port: 5173, open: false },
})
