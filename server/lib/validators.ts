// import { z } from 'zod'

// export const CourseCreateSchema = z.object({
//   title: z.string().min(3).max(255),
//   slug: z.string().regex(/^[a-z0-9-]+$/),
//   description: z.string().max(2000).optional(),
//   difficultyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
//   isPremium: z.boolean().default(false),
//   tags: z.array(z.string()).optional(),
// })

// // Использование в роуте:
// const result = CourseCreateSchema.safeParse(await c.req.json())
// if (!result.success) {
//   return c.json({ error: 'Validation failed', details: result.error.errors }, 400)
// }