import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'


// https://vite.dev/config/
export default defineConfig({
  base: "/pixash/",
  plugins: [tailwindcss(), vue()],
  test: {
    environment: "happy-dom",
    setupFiles: ["src/tests/setup.ts"]
  }
})
