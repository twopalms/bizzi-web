<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'

const API_BASE = import.meta.env.VITE_API_BASE_URL

// interface Card {
//   uuid: string
//   name?: string
//   job_title?: string
//   company?: string
//   email?: string
//   phone_fmt?: string
//   phone_raw?: string
//   location?: string
//   website?: string
//   bio?: string
//   picture?: string | null
//   slug?: string
//   public?: boolean
// }

const { makeAuthenticatedRequest } = useAuth()

const route = useRoute()

const loading = ref(false)
const card = ref(null)
const error = ref(null)

watch(() => route.params.id, fetchCard, { immediate: true })

async function fetchCard(id) {
  error.value = card.value = null
  loading.value = true

  // TODO: handle response codes

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/`)
    card.value = await response.json()
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="!loading" class="bg-green-400 rounded-lg p-6 flex flex-col">
    <h3 class="text-4xl font-semibold">{{ card.name }}</h3>
    <div class="text-3xl">{{ card.job_title }}</div>
  </div>
</template>
