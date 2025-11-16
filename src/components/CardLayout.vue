<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth.ts'
import CardList from '../components/CardList.vue'
import CardEditArea from '../components/CardEditArea.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL

// TODO: bring back router urls when selecting cards

const { makeAuthenticatedRequest, user } = useAuth()

const cards = ref([])
const count = ref(0)
const loading = ref(true)

const activeCard = ref(null)
const activeCardIndex = ref(null)

watch(activeCardIndex, (index) => {
  if (activeCardIndex.value !== null) {
    activeCard.value = cards.value[index]
  } else {
    activeCard.value = null
  }
})

async function fetchCards() {
  // TODO: handle response codes

  try {
    const currentUser = user.value
    const userId = currentUser?.data?.user?.id

    if (!userId) {
      loading.value = false
      return
    }

    const response = await makeAuthenticatedRequest(`${API_BASE}/cards/?user_id=${userId}`, {
      limit: 10,
    })

    return await response.json()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function deleteCard() {
  cards.value.splice(activeCardIndex.value, 1)
  activeCardIndex.value = null
}

onMounted(async () => {
  const resp = await fetchCards()
  cards.value = resp.items
  count.value = resp.count
})
</script>

<template>
  <div class="flex h-full w-full">
    <CardList v-model:cards="cards" v-model:activeCardIndex="activeCardIndex" />
    <CardEditArea v-model="activeCard" @submit-delete="deleteCard" />
  </div>
</template>
