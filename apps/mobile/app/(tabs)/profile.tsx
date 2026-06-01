// apps/mobile/app/(tabs)/profile.tsx
import { View, Text, Pressable, Alert } from 'react-native'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../stores/authStore'

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuthStore()

  async function handleSignOut() {
    await supabase.auth.signOut()
    signOut()
  }

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <Text className="text-text text-3xl font-bold mb-8">Profile 👤</Text>

      <View className="bg-surface rounded-2xl p-5 mb-4">
        <Text className="text-text-muted text-sm mb-1">Email</Text>
        <Text className="text-text text-base">{user?.email}</Text>
      </View>

      <View className="bg-surface rounded-2xl p-5 mb-4 flex-row justify-between">
        <View>
          <Text className="text-text-muted text-sm mb-1">Learning</Text>
          <Text className="text-text text-base font-semibold">
            {profile?.target_language?.toUpperCase() ?? '—'}
          </Text>
        </View>
        <View>
          <Text className="text-text-muted text-sm mb-1">Level</Text>
          <Text className="text-text text-base font-semibold capitalize">
            {profile?.level ?? '—'}
          </Text>
        </View>
        <View>
          <Text className="text-text-muted text-sm mb-1">Streak</Text>
          <Text className="text-text text-base font-semibold">
            {profile?.streak_days ?? 0} 🔥
          </Text>
        </View>
      </View>

      <Pressable
        className="bg-error rounded-2xl py-4 items-center mt-4"
        onPress={handleSignOut}
        accessibilityLabel="Sign out button"
      >
        <Text className="text-white font-semibold text-base">Sign Out</Text>
      </Pressable>
    </View>
  )
}
