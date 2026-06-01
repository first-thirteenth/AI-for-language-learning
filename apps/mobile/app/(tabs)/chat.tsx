// apps/mobile/app/(tabs)/chat.tsx
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useCallback, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { sendChatMessage } from '../../services/chatService'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const ERROR_MESSAGE = "Sorry, I couldn't connect to the server. Please try again. 🔌"

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useChatMessages(selectedLanguage: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const conversationIdRef = useRef<string | undefined>(undefined)

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        createdAt: new Date(),
      }

      setMessages((prev) => [userMessage, ...prev])
      setIsLoading(true)

      try {
        const response = await sendChatMessage({
          message: trimmed,
          language: selectedLanguage,
          conversationId: conversationIdRef.current,
        })
        conversationIdRef.current = response.data.conversationId
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: response.data.reply,
          createdAt: new Date(),
        }
        setMessages((prev) => [assistantMessage, ...prev])
      } catch (err) {
        console.error('Chat error:', err)
        Alert.alert('Debug', err instanceof Error ? err.message : String(err))
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: ERROR_MESSAGE,
          createdAt: new Date(),
        }
        setMessages((prev) => [errorMessage, ...prev])
      } finally {
        setIsLoading(false)
      }
    },
    [selectedLanguage],
  )

  return { messages, isLoading, sendMessage }
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <View className={`mb-3 px-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser ? 'bg-primary rounded-tr-sm' : 'bg-surface rounded-tl-sm'
        }`}
      >
        <Text className={`text-base leading-snug ${isUser ? 'text-white' : 'text-text'}`}>
          {message.content}
        </Text>
      </View>
      <Text className="text-text-muted text-xs mt-1 px-1">
        {formatTime(message.createdAt)}
      </Text>
    </View>
  )
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <View className="mb-3 px-4 items-start">
      <View className="bg-surface rounded-2xl rounded-tl-sm px-4 py-3 flex-row items-center gap-1">
        <ActivityIndicator size="small" color="#94a3b8" />
        <Text className="text-text-muted text-sm ml-2">AI Tutor is typing…</Text>
      </View>
    </View>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View
      className="flex-1 items-center justify-center px-8"
      style={{ transform: [{ scaleY: -1 }] }}
    >
      <Text className="text-5xl mb-4">💬</Text>
      <Text className="text-text text-lg font-semibold text-center mb-2">
        Start a conversation!
      </Text>
      <Text className="text-text-muted text-center text-sm leading-relaxed">
        Ask me anything about language learning 💬
      </Text>
    </View>
  )
}

// ─── ChatInput ────────────────────────────────────────────────────────────────

interface ChatInputProps {
  isLoading: boolean
  onSend: (text: string) => void
}

function ChatInput({ isLoading, onSend }: ChatInputProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<TextInput>(null)

  const canSend = text.trim().length > 0 && !isLoading

  const handleSend = useCallback(() => {
    if (!canSend) return
    onSend(text)
    setText('')
    inputRef.current?.focus()
  }, [canSend, text, onSend])

  return (
    <View className="bg-surface border-t border-surface-light px-3 py-2">
      <View className="flex-row items-end gap-2">
        <TextInput
          ref={inputRef}
          className="flex-1 bg-background text-text rounded-2xl px-4 py-3 text-base max-h-24"
          placeholder="Type a message…"
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={1}
          style={{ maxHeight: 96 }}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message to the AI tutor"
          returnKeyType="default"
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          accessibilityLabel="Send message"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSend }}
          className={`w-11 h-11 rounded-full items-center justify-center ${
            canSend ? 'bg-primary' : 'bg-surface-light'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#f1f5f9" />
          ) : (
            <Text className={`text-xl ${canSend ? 'text-white' : 'text-text-muted'}`}>
              ↑
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}

// ─── ChatHeader ───────────────────────────────────────────────────────────────

interface ChatHeaderProps {
  selectedLanguage: string
  onLanguagePress: () => void
}

function ChatHeader({ selectedLanguage, onLanguagePress }: ChatHeaderProps) {
  return (
    <View className="bg-surface border-b border-surface-light px-4 py-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <View className="w-9 h-9 rounded-full bg-primary items-center justify-center">
          <Text className="text-white text-base">🤖</Text>
        </View>
        <View>
          <Text className="text-text font-semibold text-base">AI Tutor</Text>
          <Text className="text-text-muted text-xs">Always here to help</Text>
        </View>
      </View>
      <Pressable
        onPress={onLanguagePress}
        accessibilityLabel="Select language"
        accessibilityRole="button"
        className="bg-background px-3 py-1.5 rounded-full border border-surface-light"
      >
        <Text className="text-text-muted text-xs">🌐 {selectedLanguage}</Text>
      </Pressable>
    </View>
  )
}

// ─── ChatScreen ───────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const { messages, isLoading, sendMessage } = useChatMessages(selectedLanguage)

  const handleLanguagePress = useCallback(() => {
    Alert.alert('Language selection coming soon!')
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ChatHeader selectedLanguage={selectedLanguage} onLanguagePress={handleLanguagePress} />

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          inverted
          contentContainerStyle={
            messages.length === 0 ? { flexGrow: 1 } : { paddingVertical: 12 }
          }
          ListEmptyComponent={<EmptyState />}
          ListHeaderComponent={isLoading ? <TypingIndicator /> : null}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        <ChatInput isLoading={isLoading} onSend={sendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
