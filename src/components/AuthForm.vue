<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const emit = defineEmits(['submit'])

interface Form {
  email: string
  password: string
}

interface ErrorMap {
  email: string
  password: string
  general: string
}

const props = defineProps<{
  form: Ref<Form>
  errors: Ref<ErrorMap>
  isLoading: Ref<boolean>
}>()

const handleSubmit = async () => {
  emit('submit')
}
</script>

<template>
  <div class="login-container">
    <div class="login-card card">
      <h1 v-if="route.path === '/login'">Sign In</h1>
      <h1 v-else-if="route.path === '/signup'">Create Account</h1>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            <!-- // v-model="form.value.email" -->
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
            <!-- v-model="props.form.value.password" -->
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

      <p v-if="route.path === '/login'" class="signup-link">
        Don't have an account? <router-link to="/signup">Sign up</router-link>
      </p>
      <p v-else-if="route.path === '/signup'" class="signup-link">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

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
