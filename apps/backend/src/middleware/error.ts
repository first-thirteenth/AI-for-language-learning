// apps/backend/src/middleware/error.ts
import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const isDev = process.env.NODE_ENV === 'development'
  const message = statusCode === 500 && !isDev ? 'Internal server error' : err.message

  console.error(`[Error] ${err.message}`, err.stack)

  res.status(statusCode).json({
    success: false,
    error: message,
  })
}
