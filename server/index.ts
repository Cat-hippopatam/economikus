// server/index.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hono говорит: Привет из Vite 6!' })
})

export default app
