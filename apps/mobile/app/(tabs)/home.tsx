// apps/mobile/app/(tabs)/home.tsx
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../stores/authStore'

export default function HomeScreen() {
  const { profile } = useAuthStore()
  const router = useRouter()

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-6 pt-16 pb-8">
      <Text className="text-text-muted text-base">Good day 👋</Text>
      <Text className="text-text text-3xl font-bold mb-8">
        {profile?.username ?? 'Learner'}
      </Text>

      {/* Streak card */}
      <View className="bg-surface rounded-2xl p-5 mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-text-muted text-sm mb-1">Daily Streak</Text>
          <Text className="text-text text-2xl font-bold">{profile?.streak_days ?? 0} days 🔥</Text>
        </View>
        <View>
          <Text className="text-text-muted text-sm mb-1">Total XP</Text>
          <Text className="text-secondary text-2xl font-bold">{profile?.total_xp ?? 0} ⚡</Text>
        </View>
      </View>

      {/* Start learning button */}
      <Pressable
        className="bg-primary rounded-2xl p-5 mb-4"
        onPress={() => router.push('/(tabs)/chat')}
        accessibilityLabel="Start AI conversation"
      >
        <Text className="text-white text-lg font-bold mb-1">Practice with AI 🤖</Text>
        <Text className="text-indigo-200 text-sm">Have a conversation in your target language</Text>
      </Pressable>

      {/* Vocabulary button */}
      <Pressable
        className="bg-surface rounded-2xl p-5"
        onPress={() => router.push('/(tabs)/vocabulary')}
        accessibilityLabel="Go to vocabulary"
      >
        <Text className="text-text text-lg font-bold mb-1">My Vocabulary 📚</Text>
        <Text className="text-text-muted text-sm">Review and practice saved words</Text>
      </Pressable>
    </ScrollView>
  )
}
