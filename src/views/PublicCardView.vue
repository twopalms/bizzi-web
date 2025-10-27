<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'
import BizziCard from '../components/BizziCard.vue'

// TODO: handle 404
// TODO: remove left nav - make singular view
// TODO: if the card owner has a paid account, remove branding
const API_BASE = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const { makeAuthenticatedRequest } = useAuth()

const card = ref(null)

async function fetchPublicCard() {
  const slug = route.params.slug
  const url = `${API_BASE}/api/cards/?slug=${slug}`

  try {
    const resp = await makeAuthenticatedRequest(url, { method: 'GET' })

    if (resp.ok) {
      const data = await resp.json()
      if (data.count == 0) {
        console.error('Error page should show')
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
  }
}

onMounted(async () => {
  card.value = await fetchPublicCard()
})
</script>

<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <BizziCard v-if="card" color="#4fd4d6" :card="card" />
    <a href="https://www.bizzicard.com" target="blank">
      <div class="border border-blue-400 bg-blue-200 rounded-md mt-6 p-3">
        Made with
        <span class="font-bold">Bizzi</span>. Get <span class="font-bold">Bizzi</span> now.
      </div>
    </a>
  </div>
</template>
