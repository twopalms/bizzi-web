<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import CardPreview from '../components/CardPreview.vue'

const { makeAuthenticatedRequest, user } = useAuth()

const loading = ref(false)
const cards = ref([])
const cardCount = ref(null)
const error = ref(null)

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function fetchCards() {
  error.value = null
  loading.value = true

  try {
    const currentUser = user.value
    const userId = currentUser?.data?.user?.id

    if (!userId) {
      console.error('No user ID available. User data:', currentUser)
      loading.value = false
      return
    }

    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/?user_id=${userId}`, {
      limit: 10,
    })

    const data = await response.json()
    cards.value = data.items
    cardCount.value = data.count
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCards()
})
</script>

<!-- TODO: Make spinner reusable component  -->

<template>
  <main class="flex flex-col p-5">
    <h2 class="w-full text-2xl text-gray-600 pb-6 text-left font-semibold">My Cards</h2>
    <!-- <div v-if="loading" class="flex justify-center items-center py-10"> -->
    <!--   <div -->
    <!--     class="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-ping" -->
    <!--   ></div> -->
    <!-- </div> -->

    <div
      v-if="cards.length === 0 && !loading"
      class="flex flex-1 justify-center items-center mb-36"
    >
      <div class="flex flex-col justify-between items-center min-h-24">
        <h3 class="text-2xl">Create a card to get started!</h3>
        <button
          class="w-fit bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-lg"
        >
          Create New Card
        </button>
      </div>
    </div>
    <div v-else class="flex flex-col w-xs">
      <ul>
        <li v-for="card in cards" :key="card" class="mb-4">
          <router-link :to="{ name: 'card-detail', params: { id: card.uuid } }">
            <CardPreview :card="card" />
          </router-link>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped></style>
