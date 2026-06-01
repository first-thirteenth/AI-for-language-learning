// apps/backend/src/utils/openai.ts
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY!

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY env variable')
}

export const openai = new OpenAI({ apiKey })
