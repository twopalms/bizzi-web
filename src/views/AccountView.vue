<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'

const { checkAuth, logout, user } = useAuth()
const router = useRouter()

async function logoutAndRedirect() {
  await logout()
  router.push('/login')
}

const dateJoined = computed(() => {
  const date = new Date(user.value.data.user.created_at)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
})

onMounted(() => {
  // refresh user details on page load
  checkAuth({ forceRefresh: true })
})
</script>

<template>
  <div v-if="user" class="flex flex-col gap-5 p-16">
    <h2 class="text-xl font-semibold">My Account</h2>
    <hr />
    <div class="grid grid-cols-2 gap-3">
      <label class="font-semibold">Name</label>
      <p>{{ user.data.user.display }}</p>
      <label class="font-semibold">Email</label>
      <p>{{ user.data.user.email }}</p>
      <label class="font-semibold">Date Joined</label>
      <p>{{ dateJoined }}</p>
    </div>
    <hr />
    <button
      @click="logoutAndRedirect"
      class="text-red-700 hover:underline hover:cursor-pointer w-fit"
    >
      Log out
    </button>
  </div>
</template>
