<template>
  <div class="login-container">
    <div class="login-card card">
      <h1>Welcome Back</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="isLoading"
            placeholder="Enter your email"
            class="form-input"
          />
          <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="isLoading"
            placeholder="Enter your password"
            class="form-input"
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <button type="submit" :disabled="isLoading" class="btn btn-primary login-btn">
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>

        <div v-if="errors.general" class="error-message">
          {{ errors.general }}
        </div>
      </form>

      <p class="signup-link">
        Don't have an account? <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, makeAuthenticatedRequest } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const isLoading = ref(false)

const clearErrors = () => {
  errors.email = ''
  errors.password = ''
  errors.general = ''
}

const handleLogin = async () => {
  clearErrors()
  isLoading.value = true

  try {
    const response = await makeAuthenticatedRequest(`${import.meta.env.VITE_API_BASE_URL}/auth/browser/v1/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    const data = await response.json()

    if (response.ok) {
      // Success - save user data and redirect to cards
      login(data)
      router.push('/cards')
    } else {
      // Handle different error scenarios
      if (response.status === 400) {
        // Validation errors
        if (data.email) errors.email = Array.isArray(data.email) ? data.email[0] : data.email
        if (data.password) errors.password = Array.isArray(data.password) ? data.password[0] : data.password
        if (data.non_field_errors) errors.general = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors
        if (!data.email && !data.password && !data.non_field_errors) errors.general = 'Invalid email or password.'
      } else if (response.status === 401) {
        errors.general = 'Please verify your email or complete two-factor authentication.'
      } else if (response.status === 409) {
        errors.general = 'You are already logged in.'
      } else {
        errors.general = 'Something went wrong. Please try again.'
      }
    }
  } catch (error) {
    errors.general = 'Network error. Please check your connection and try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gray-900), var(--gray-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-message {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: var(--error-500);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #fecaca;
  margin-top: 0.5rem;
}

.login-btn {
  padding: 14px 24px;
  margin-top: 0.5rem;
  font-size: 15px;
}

.signup-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--gray-600);
  font-size: 14px;
}

.signup-link a {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.signup-link a:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }

  .login-card h1 {
    font-size: 1.75rem;
  }
}
</style>