// apps/mobile/app/(tabs)/home.tsx
import { View, Text, ScrollView, Pressable, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../stores/authStore'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getUsernameFromEmail(email: string): string {
  return email.split('@')[0]
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface StreakCardProps {
  streak: number
}

function StreakCard({ streak }: StreakCardProps) {
  const motivationalText =
    streak === 0
      ? 'Start your streak today!'
      : streak < 7
      ? 'Keep it going!'
      : streak < 30
      ? "You're on fire!"
      : 'Unstoppable! 🏆'

  return (
    <View
      className="bg-surface rounded-2xl p-5 mb-6"
      accessibilityLabel={`Daily streak: ${streak} days`}
    >
      <View className="flex-row items-center mb-3">
        <Text className="text-3xl mr-2">🔥</Text>
        <View>
          <Text className="text-text text-2xl font-bold">{streak}</Text>
          <Text className="text-text-muted text-xs">Day streak</Text>
        </View>
      </View>
      <Text className="text-text-muted text-sm">{motivationalText}</Text>
    </View>
  )
}

interface QuickActionCardProps {
  emoji: string
  label: string
  onPress: () => void
  accessibilityLabel: string
  variant?: 'primary' | 'surface'
}

function QuickActionCard({
  emoji,
  label,
  onPress,
  accessibilityLabel,
  variant = 'surface',
}: QuickActionCardProps) {
  const bgClass = variant === 'primary' ? 'bg-primary' : 'bg-surface'
  const textClass = variant === 'primary' ? 'text-white' : 'text-text'

  return (
    <Pressable
      className={`${bgClass} rounded-2xl p-4 flex-1 items-center justify-center min-h-[96px]`}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Text className="text-3xl mb-2">{emoji}</Text>
      <Text className={`${textClass} text-sm font-semibold text-center`}>{label}</Text>
    </Pressable>
  )
}

interface QuickAction {
  emoji: string
  label: string
  onPress: () => void
  accessibilityLabel: string
  variant?: 'primary' | 'surface'
}

interface QuickActionsGridProps {
  actions: QuickAction[]
}

function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  const rows: QuickAction[][] = []
  for (let i = 0; i < actions.length; i += 2) {
    rows.push(actions.slice(i, i + 2))
  }

  return (
    <View className="mb-6">
      <Text className="text-text text-lg font-bold mb-3">Quick Actions</Text>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-3 mb-3">
          {row.map((action) => (
            <QuickActionCard key={action.label} {...action} />
          ))}
        </View>
      ))}
    </View>
  )
}

function ContinueLearningSection() {
  const router = useRouter()

  return (
    <View className="mb-8">
      <Text className="text-text text-lg font-bold mb-3">Continue Learning</Text>
      <View className="bg-surface rounded-2xl p-5 items-center">
        <Text className="text-4xl mb-3">📖</Text>
        <Text className="text-text text-base font-semibold mb-1">No lessons yet</Text>
        <Text className="text-text-muted text-sm text-center mb-4">
          Start your first lesson and begin your language journey!
        </Text>
        <Pressable
          className="bg-primary rounded-xl px-6 py-3"
          onPress={() => router.push('/(tabs)/chat')}
          accessibilityLabel="Start your first lesson in AI chat"
          accessibilityRole="button"
        >
          <Text className="text-white text-sm font-bold">Start First Lesson</Text>
        </Pressable>
      </View>
    </View>
  )
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { user, profile } = useAuthStore()
  const router = useRouter()

  const displayName =
    profile?.username ??
    (user?.email ? getUsernameFromEmail(user.email) : 'Learner')

  const greeting = getGreeting()
  const streak = profile?.streak_days ?? 0

  const quickActions: QuickAction[] = [
    {
      emoji: '💬',
      label: 'AI Chat',
      onPress: () => router.push('/(tabs)/chat'),
      accessibilityLabel: 'Open AI Chat',
      variant: 'primary',
    },
    {
      emoji: '📚',
      label: 'Vocabulary',
      onPress: () => router.push('/(tabs)/vocabulary'),
      accessibilityLabel: 'Open Vocabulary',
    },
    {
      emoji: '🎯',
      label: 'Daily Goal',
      onPress: () => Alert.alert('Daily Goal', 'Daily goals coming soon!'),
      accessibilityLabel: 'View Daily Goal',
    },
    {
      emoji: '📊',
      label: 'Progress',
      onPress: () => Alert.alert('Progress', 'Progress tracking coming soon!'),
      accessibilityLabel: 'View Progress',
    },
  ]

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-6 pt-16 pb-8"
    >
      {/* Header */}
      <Text className="text-text-muted text-base mb-1">{greeting} 👋</Text>
      <Text className="text-text text-3xl font-bold mb-6">{displayName}!</Text>

      {/* Streak */}
      <StreakCard streak={streak} />

      {/* Quick Actions */}
      <QuickActionsGrid actions={quickActions} />

      {/* Continue Learning */}
      <ContinueLearningSection />
    </ScrollView>
  )
}
