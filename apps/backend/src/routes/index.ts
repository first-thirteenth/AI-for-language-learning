// apps/backend/src/routes/index.ts
import { Router } from 'express'
import chatRouter from './chat'
import vocabularyRouter from './vocabulary'

const router = Router()

router.use('/chat', chatRouter)
router.use('/vocabulary', vocabularyRouter)

export default router
