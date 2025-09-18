<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'

const { checkAuth, logout, user } = useAuth()
const router = useRouter()

async function logoutAndRedirect() {
  await logout()
  router.push('/login')
}

onMounted(() => {
  // refresh user details on page load
  checkAuth({ forceRefresh: true })
})
</script>

<template>
  <div v-if="user" class="flex flex-1 flex-col justify-center items-center">
    <header class="text-lg">Hello, {{ user.data.user.email }}</header>
    <button
      @click="logoutAndRedirect"
      class="text-red-700 mt-8 hover:underline hover:cursor-pointer"
    >
      Log out
    </button>
  </div>
</template>
