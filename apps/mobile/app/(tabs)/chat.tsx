// apps/mobile/app/(tabs)/chat.tsx
import { View, Text } from "react-native";

export default function ChatScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-5xl mb-4">💬</Text>
      <Text className="text-text text-2xl font-bold mb-2">AI Chat</Text>
      <Text className="text-text-muted text-center">
        Practice conversations with your AI language tutor.{"\n"}Coming soon!
      </Text>
    </View>
  );
}
