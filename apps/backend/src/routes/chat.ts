// apps/backend/src/routes/chat.ts
import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { openai } from '../utils/openai'
import { authMiddleware } from '../middleware/auth'

const router = Router()

const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  language: z.string().min(1, 'Language is required'),
  conversationId: z.string().uuid().optional(),
})

// TODO: Add per-user rate limiting (e.g. express-rate-limit with Redis store)
// to control OpenAI API costs before going to production.
router.post(
  '/message',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = messageSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues })
      return
    }

    const { message, language, conversationId } = parsed.data

    const systemPrompt = `You are a helpful language tutor helping the user learn ${language}. Keep responses concise and educational.`

    const completion = await openai.chat.completions
      .create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      })
      .catch((err: unknown) => {
        next(err)
        return null
      })

    if (!completion) return

    const reply = completion.choices[0]?.message?.content ?? ''

    res.status(200).json({
      success: true,
      data: {
        reply,
        conversationId: conversationId ?? randomUUID(),
      },
    })
  }
)

export default router
