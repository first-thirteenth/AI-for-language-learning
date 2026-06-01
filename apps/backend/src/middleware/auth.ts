// apps/backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { supabase } from '../utils/supabase'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string }
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing or invalid authorization header' })
    return
  }

  const token = authHeader.slice(7)

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
    return
  }

  req.user = {
    id: data.user.id,
    email: data.user.email ?? '',
  }

  next()
}
