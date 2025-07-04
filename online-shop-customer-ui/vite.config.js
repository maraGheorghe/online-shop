import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  lib: "es2020",
  server: {
    host: true,
    port: 5173,
  },
})
