<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AuthForm from '../components/AuthForm.vue'

const { fetchCsrfToken, login, makeAuthenticatedRequest } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

async function handleSignUp() {
  loading.value = true

  try {
    const response = await makeAuthenticatedRequest(
      `${import.meta.env.VITE_API_BASE_URL}/auth/browser/v1/auth/signup`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      },
    )

    if (response.ok) {
      const data = await response.json()
      // Success - save user data and redirect to cards
      login(data)
      router.push('/cards')
    } else {
      // Handle different error scenarios
      // if (response.status === 400) {
      //   // Validation errors
      //   if (data.email) errors.email = Array.isArray(data.email) ? data.email[0] : data.email
      //   if (data.password)
      //     errors.password = Array.isArray(data.password) ? data.password[0] : data.password
      //   if (!data.email && !data.password) errors.general = 'Please check your input and try again.'
      // } else if (response.status === 401) {
      //   errors.general = 'Please verify your email before continuing.'
      // } else if (response.status === 403) {
      //   errors.general = 'Account registration is currently closed.'
      // } else if (response.status === 409) {
      //   errors.general = 'An account with this email already exists.'
      // } else {
      //   errors.general = 'Something went wrong. Please try again.'
      // }
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-full w-full flex flex-col gap-8 items-center justify-center">
    <h1 class="text-2xl text-center">Create Account</h1>
    <AuthForm
      @submit="handleSignUp"
      v-model:email="email"
      v-model:password="password"
      label="Sign Up"
    />
    <p>
      Already have an account?
      <router-link to="/login" class="underline text-blue-500 hover:cursor-pointer"
        >Sign in</router-link
      >
      instead.
    </p>
  </div>
</template>
