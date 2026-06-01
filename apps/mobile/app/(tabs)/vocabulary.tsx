// apps/mobile/app/(tabs)/vocabulary.tsx
import { View, Text } from 'react-native'

export default function VocabularyScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-5xl mb-4">📚</Text>
      <Text className="text-text text-2xl font-bold mb-2">My Words</Text>
      <Text className="text-text-muted text-center">
        Your saved vocabulary will appear here.{'\n'}Coming soon!
      </Text>
    </View>
  )
}
