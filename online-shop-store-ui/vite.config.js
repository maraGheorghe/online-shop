import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  modules: 'es2020',
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  esModuleInterop: true,
  server: {
    host: true,
    port: 5174,
  },
})
