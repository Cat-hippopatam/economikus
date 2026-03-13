import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'
import tailwindcss from '@tailwindcss/vite' // Импортируем новый плагин

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Добавляем в список плагинов
    devServer({
      entry: 'server/index.ts', // Точка входа твоего Hono
      exclude: [/^\/(?!api).*/], // Обрабатывать только запросы на /api
    }),
  ],
})
