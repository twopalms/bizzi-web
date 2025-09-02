<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <div class="brand-link">
          <h1>Bizzi</h1>
        </div>
      </div>

      <div class="nav-links">
      </div>
      
      <div class="nav-profile">
        <button @click="toggleDropdown" class="profile-button" ref="profileButton">
          <svg class="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </button>
        
        <div v-if="showDropdown" class="dropdown-menu" ref="dropdown">
          <div class="dropdown-header">
            <p class="user-email">{{ user?.email }}</p>
          </div>
          <div class="dropdown-divider"></div>
          <button @click="handleLogout" class="dropdown-item logout-item" :disabled="isLoggingOut">
            <svg class="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

const showDropdown = ref(false)
const isLoggingOut = ref(false)
const profileButton = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = (event: MouseEvent) => {
  if (profileButton.value && dropdown.value) {
    if (!profileButton.value.contains(event.target as Node) && 
        !dropdown.value.contains(event.target as Node)) {
      showDropdown.value = false
    }
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true
  showDropdown.value = false
  
  try {
    await logout()
    router.push('/signup')
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 4rem;
}

.brand-link {
  text-decoration: none;
  transition: transform 0.2s ease;
}

.brand-link:hover {
  transform: translateY(-1px);
}

.nav-brand h1 {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
  cursor: default;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-600);
  background: var(--primary-50);
}

.nav-link.router-link-active {
  color: var(--primary-600);
  background: var(--primary-100);
}

.nav-profile {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gray-100), var(--gray-50));
  border: 1.5px solid var(--gray-200);
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-button:hover {
  background: linear-gradient(135deg, var(--gray-200), var(--gray-100));
  border-color: var(--gray-300);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.profile-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--gray-600);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.75rem;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  min-width: 14rem;
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--gray-50), var(--primary-50));
  border-bottom: 1px solid var(--gray-200);
}

.user-email {
  font-size: 14px;
  color: var(--gray-700);
  font-weight: 500;
  margin: 0;
  word-break: break-word;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--gray-200);
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-item:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--gray-50), var(--gray-25));
}

.dropdown-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-item {
  color: var(--error-500);
}

.logout-item:hover:not(:disabled) {
  background: linear-gradient(135deg, #fee2e2, #fef2f2);
  color: var(--error-600);
}

.logout-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-brand h1 {
    font-size: 1.25rem;
  }
  
  .dropdown-menu {
    min-width: 12rem;
  }
}
</style>