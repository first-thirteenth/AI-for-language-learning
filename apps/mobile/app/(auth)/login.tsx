// apps/mobile/app/(auth)/login.tsx
import { useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { supabase } from '../../utils/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)

    if (error) {
      Alert.alert('Login failed', error.message)
    } else {
      router.replace('/(tabs)/home')
    }
  }

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <Text className="text-4xl font-bold text-text mb-2">Welcome back 👋</Text>
      <Text className="text-text-muted mb-10">Sign in to continue learning</Text>

      <TextInput
        className="bg-surface text-text rounded-xl px-4 py-4 mb-4 text-base"
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        accessibilityLabel="Email input"
      />

      <TextInput
        className="bg-surface text-text rounded-xl px-4 py-4 mb-6 text-base"
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Password input"
      />

      <Pressable
        className="bg-primary rounded-xl py-4 items-center mb-4"
        onPress={handleLogin}
        disabled={isLoading}
        accessibilityLabel="Sign in button"
      >
        {isLoading
          ? <ActivityIndicator color="white" />
          : <Text className="text-white font-semibold text-base">Sign In</Text>
        }
      </Pressable>

      <View className="flex-row justify-center">
        <Text className="text-text-muted">Don't have an account? </Text>
        <Link href="/(auth)/register">
          <Text className="text-primary font-semibold">Sign Up</Text>
        </Link>
      </View>
    </View>
  )
}
