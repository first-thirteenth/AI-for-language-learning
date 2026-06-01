// apps/mobile/app/(auth)/register.tsx
import { useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../../utils/supabase'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setIsLoading(false)

    if (error) {
      Alert.alert('Registration failed', error.message)
    } else {
      Alert.alert('Check your email', 'We sent you a confirmation link!')
    }
  }

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <Text className="text-4xl font-bold text-text mb-2">Get started 🚀</Text>
      <Text className="text-text-muted mb-10">Create your account to start learning</Text>

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
        placeholder="Password (min. 6 characters)"
        placeholderTextColor="#94a3b8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Password input"
      />

      <Pressable
        className="bg-primary rounded-xl py-4 items-center mb-4"
        onPress={handleRegister}
        disabled={isLoading}
        accessibilityLabel="Create account button"
      >
        {isLoading
          ? <ActivityIndicator color="white" />
          : <Text className="text-white font-semibold text-base">Create Account</Text>
        }
      </Pressable>

      <View className="flex-row justify-center">
        <Text className="text-text-muted">Already have an account? </Text>
        <Link href="/(auth)/login">
          <Text className="text-primary font-semibold">Sign In</Text>
        </Link>
      </View>
    </View>
  )
}
