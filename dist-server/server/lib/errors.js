export class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
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
//# sourceMappingURL=errors.js.map