<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import ActionButton from '../components/ActionButton.vue'
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

  // TODO: handle response codes

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
  <div class="flex flex-col min-w-60 p-4 bg-gray-300 border-r border-gray-400">
    <!-- <div v-if="cards.length === 0 && !loading" class="justify-center items-center mb-36"> -->
    <!--   <div class="flex flex-col justify-between items-center min-h-24"> -->
    <!--     <h3 class="text-2xl">Create a card to get started!</h3> -->
    <!--     <ActionButton text="Create New Card" /> -->
    <!--   </div> -->
    <!-- </div> -->
    <div class="flex items-center justify-between mb-4 px-4">
      <h2 class="text-2xl text-gray-600 font-semibold">My Cards</h2>
      <ActionButton text="+" />
    </div>

    <!-- <div v-if="loading" class="flex justify-center items-center"> -->
    <!--   <div -->
    <!--     class="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-ping" -->
    <!--   ></div> -->
    <!-- </div> -->

    <ul>
      <li v-for="card in cards" :key="card" class="mb-4">
        <router-link :to="{ name: 'card-detail', params: { id: card.uuid } }">
          <CardPreview :card="card" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
