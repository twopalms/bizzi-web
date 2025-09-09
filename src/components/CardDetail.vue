<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

// interface Props {
//   color: string
// }

defineProps({
  color: {
    type: String,
    default: 'bg-blue-950',
  },
})

const { makeAuthenticatedRequest } = useAuth()

const route = useRoute()

const loading = ref(false)
const card = ref(null)
const error = ref(null)

const hasContactInfo = computed(() => {
  return card.value.email || card.value.phone_fmt || card.value.website
})

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
  <div v-if="!loading" class="flex flex-col max-w-140 rounded-lg shadow-lg shadow-black/40">
    <div :class="`${color} flex items-center justify-end min-h-36 max-h-36 rounded-t-lg`">
      <img :src="card.picture" :alt="card.name" class="rounded-full w-auto h-36 m-4 p-4" />
    </div>
    <div class="p-6">
      <h3 v-if="card.name" class="text-4xl font-semibold">{{ card.name }}</h3>
      <div v-if="card.job_title" class="text-3xl mb-4">{{ card.job_title }}</div>
      <div v-if="card.company" class="text-2xl">{{ card.company }}</div>
      <div v-if="card.location" class="text-xl">{{ card.location }}</div>
      <div v-if="card.bio" class="italic border-l-2 border-gray-950/30 my-6 pl-4 py-2">
        {{ card.bio }}
      </div>
      <div v-if="hasContactInfo">
        <div :class="`flex flex-col ${color} h-0.5 my-4`" />
        <div v-if="card.email" class="flex ml-4 py-2 items-center text-l justify-start">
          <i class="pi pi-envelope text-sm mr-4"></i>
          {{ card.email }}
        </div>
        <div v-if="card.phone_fmt" class="flex ml-4 py-2 items-center text-l justify-start">
          <i class="pi pi-phone text-sm mr-4"></i>
          {{ card.phone_fmt }}
        </div>
        <div v-if="card.website" class="flex ml-4 py-2 items-center text-l justify-start">
          <i class="pi pi-globe text-sm mr-4"></i>
          <a :href="card.website" target="_blank" class="hover:text-blue-800">{{ card.website }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
