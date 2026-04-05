export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Глобальный обработчик в index.ts:
// app.onError((err, c) => {
//   if (err instanceof AppError) {
//     return c.json({ error: err.message, code: err.code }, err.statusCode)
//   }
//   console.error(err)
//   return c.json({ error: 'Internal server error' }, 500)
// })