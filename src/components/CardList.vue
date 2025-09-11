<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ActionButton from '../components/ActionButton.vue'
import CardPreview from '../components/CardPreview.vue'

const router = useRouter()
const { makeAuthenticatedRequest, user } = useAuth()

const loading = ref(false)
const activeCard = ref(null)
const cards = ref([])
const cardCount = ref(0)
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

async function createCard(options: RequestInit = {}) {
  loading.value = true

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/`, {
      method: 'POST',
      body: JSON.stringify({}),
      ...options,
    })

    // TODO: handle response codes: 403
    activeCard.value = await response.json()
    fetchCards()
  } catch (err) {
    console.log(err)
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}

watch(activeCard, (newCard, oldCard) => {
  console.log(newCard.uuid)
  if (!newCard || !newCard.uuid) return
  router.push({ name: 'card-detail', params: { id: newCard.uuid } })
})

onMounted(async () => {
  await router.isReady()
  fetchCards()
})
</script>

<!-- TODO: Make spinner reusable component  -->

<template>
  <div class="sm:min-w-60">
    <div v-if="cards.length === 0 && !loading" class="flex flex-col p-4 justify-around">
      <div class="text-center space-y-4 mx-6">
        <h3 class="text-md">You have no cards</h3>
        <ActionButton @click="createCard()" text="Create New Card" />
      </div>
    </div>

    <div v-else class="flex flex-col p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl text-gray-600 font-semibold">My Cards</h2>
        <ActionButton @click="createCard()" text="+ Add" />
      </div>

      <ul>
        <li v-for="card in cards" :key="card" class="mb-4">
          <router-link :to="{ name: 'card-detail', params: { id: card.uuid } }">
            <CardPreview :card="card" />
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
