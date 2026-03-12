import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [
    react(),
    devServer({
      entry: 'server/index.ts', // Точка входа твоего Hono
      exclude: [/^\/(?!api).*/], // Обрабатывать только запросы на /api
    }),
  ],
})
