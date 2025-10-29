<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'
import BizziCard from '../components/BizziCard.vue'
import NotFound from '../components/NotFound.vue'

// TODO: if the card owner has a paid account, remove branding
// TODO: add color to the card options - color ref is placeholder
// TODO: make contact CTA configurable
const API_BASE = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const { makeAuthenticatedRequest } = useAuth()

const card = ref(null)
const color = '#4fd4d6'
const loading = ref(true)
const notFound = ref(false)

async function fetchPublicCard() {
  const slug = route.params.slug
  const url = `${API_BASE}/api/cards/?slug=${slug}`

  try {
    const resp = await makeAuthenticatedRequest(url, { method: 'GET' })

    if (resp.ok) {
      const data = await resp.json()
      if (data.count == 0) {
        notFound.value = true
        return null
      } else if (data.count == 1) {
        return data.items[0]
      } else {
        console.error('I did something wrong')
      }
    } else {
      console.warn('Error loading card')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  card.value = await fetchPublicCard()
})
</script>

<template>
  <NotFound v-if="notFound" />
  <div
    v-else-if="!loading"
    class="flex flex-col min-h-screen justify-center items-center"
    :style="`background-color: ${color}20`"
  >
    <main class="flex flex-col justify-center items-center flex-grow">
      <BizziCard v-if="card" :color="color" :card="card" />
      <div
        class="border border-blue-400 bg-blue-200 mt-6 p-3 rounded-lg hover:bg-blue-300 hover:cursor-pointer"
      >
        <span>Share My Contact Info</span>
      </div>
    </main>

    <footer class="w-full text-center py-2 text-gray-700 text-sm">
      <a href="https://www.bizzicard.com" target="blank" class="hover:underline">
        Made with
        <span class="font-bold">Bizzi</span>. Get <span class="font-bold">Bizzi</span> now.
      </a>
    </footer>
  </div>
</template>
