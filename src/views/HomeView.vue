<template>
  <div>
    <NavBar />
    <div class="home-container">
      <div class="home-content card">
        <h1>Welcome to Bizzi!</h1>
        <p class="logged-in-message">✅ You are logged in</p>
        
        <div class="user-info" v-if="user">
          <h2>Your Profile</h2>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import NavBar from '../components/NavBar.vue'

const { user } = useAuth()
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
}

.home-content {
  width: 100%;
  max-width: 600px;
  padding: 3rem;
  text-align: center;
}

.home-content h1 {
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gray-900), var(--gray-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
}

.logged-in-message {
  color: var(--success-500);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.user-info {
  background: linear-gradient(135deg, var(--gray-50), white);
  padding: 2rem;
  border-radius: var(--radius-xl);
  margin-bottom: 2rem;
  text-align: left;
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-md);
}

.user-info h2 {
  color: var(--gray-800);
  margin-bottom: 1rem;
  font-size: 1.375rem;
  font-weight: 600;
}

.user-info p {
  color: var(--gray-600);
  margin: 0.75rem 0;
  font-size: 15px;
}

@media (max-width: 640px) {
  .home-container {
    padding: 1rem;
  }
  
  .home-content {
    padding: 2rem;
  }

  .home-content h1 {
    font-size: 2rem;
  }

  .logged-in-message {
    font-size: 1.125rem;
  }

  .user-info {
    padding: 1.5rem;
  }
}
</style>