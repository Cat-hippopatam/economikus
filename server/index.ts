// server/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import authRoutes from './routes/auth.routes'
import 'dotenv/config'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))

// API роуты
app.route('/api/auth', authRoutes)

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT) || 3000

console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

export default app