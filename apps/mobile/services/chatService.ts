// apps/mobile/services/chatService.ts
import { apiClient } from './api'

interface ChatMessageRequest {
  message: string
  language: string
  conversationId?: string
}

interface ChatMessageResponse {
  success: boolean
  data: {
    reply: string
    conversationId: string
  }
}

export async function sendChatMessage(
  request: ChatMessageRequest,
): Promise<ChatMessageResponse> {
  return apiClient.post<ChatMessageResponse>('/api/chat/message', request)
}
