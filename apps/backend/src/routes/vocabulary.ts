// apps/backend/src/routes/vocabulary.ts
import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { supabase } from '../utils/supabase'
import { authMiddleware } from '../middleware/auth'
import { VocabularyItem } from '../models/database'

const router = Router()

const addVocabularySchema = z.object({
  word: z.string().min(1, 'Word is required'),
  translation: z.string().min(1, 'Translation is required'),
  language: z.string().min(1, 'Language is required'),
})

// GET /api/vocabulary — get user's vocabulary list
router.get(
  '/',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false })

    if (error) {
      next(error)
      return
    }

    res.status(200).json({ success: true, data: data as VocabularyItem[] })
  }
)

// POST /api/vocabulary — add a new word
router.post(
  '/',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = addVocabularySchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues })
      return
    }

    const { word, translation, language } = parsed.data

    const { data, error } = await supabase
      .from('vocabulary')
      .insert({
        user_id: req.user!.id,
        word,
        translation,
        language,
      })
      .select()
      .single()

    if (error) {
      next(error)
      return
    }

    res.status(201).json({ success: true, data: data as VocabularyItem })
  }
)

// DELETE /api/vocabulary/:id — delete a word (verifies ownership)
router.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params

    // Verify ownership before deleting
    const { data: existing, error: fetchError } = await supabase
      .from('vocabulary')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      res.status(404).json({ success: false, error: 'Vocabulary item not found' })
      return
    }

    if (existing.user_id !== req.user!.id) {
      res.status(403).json({ success: false, error: 'Forbidden' })
      return
    }

    const { error: deleteError } = await supabase
      .from('vocabulary')
      .delete()
      .eq('id', id)

    if (deleteError) {
      next(deleteError)
      return
    }

    res.status(200).json({ success: true, data: null })
  }
)

export default router
