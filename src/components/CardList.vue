<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../composables/useAuth.ts'
import AirButton from '../components/AirButton.vue'
import CardPreview from '../components/CardPreview.vue'
import FocusModal from '../components/FocusModal.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const { makeAuthenticatedRequest, user } = useAuth()

const showPaywall = ref(false)
const loadingCards = ref(true) // TODO: update

const cards = defineModel('cards', { default: [] })
const activeCardIndex = defineModel('activeCardIndex', { default: null })

async function fetchCards() {
  // TODO: handle response codes

  try {
    const currentUser = user.value
    const userId = currentUser?.data?.user?.id

    if (!userId) {
      loadingCards.value = false
      return
    }

    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/?user_id=${userId}`, {
      limit: 10,
    })

    return await response.json()
  } catch (err) {
    console.error(err)
  } finally {
    loadingCards.value = false
  }
}

async function createCard(options = {}) {
  // loading.value = true

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/`, {
      method: 'POST',
      body: JSON.stringify({}),
      ...options,
    })

    if (response.ok) {
      return await response.json()
    } else {
      error.value = (await response.json()).detail
      return { success: false, error: 'Failed to create card' }
    }
  } catch (err) {
    console.error(err)
    error.value = err.toString()
  } finally {
    // loading.value = false
  }
}

async function handleCreateCard() {
  // TODO: check user's payment plan
  if (cards.value.length == 2) {
    showPaywall.value = true
    return
  }
  const newCard = await createCard()
  cards.value.push(newCard)
  activeCardIndex.value += 1
  // activeCardIndex.value = cardList.value.indexOf(newCard)
}

function handlePreviewClick(index) {
  activeCardIndex.value = index
}

onMounted(async () => {
  const resp = await fetchCards()
  cards.value = resp.items
})
</script>
<template>
  <div class="h-full border-r-2 border-gray-300 bg-gray-100 sm:min-w-60">
    <div v-if="loadingCards" class="flex justify-center items-center h-full">
      <LoadingSpinner />
    </div>
    <template v-else>
      <div v-if="cards.length === 0" class="flex flex-col p-4 justify-around">
        <div class="text-center space-y-4 mx-6">
          <h3 class="text-md">You have no cards</h3>
          <AirButton @click="handleCreateCard">Create New Card</AirButton>
        </div>
      </div>

      <div v-else class="flex flex-col p-4 gap-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl text-gray-600 font-semibold">My Cards</h2>
          <AirButton @click="handleCreateCard">+ Add</AirButton>
        </div>

        <ul>
          <li
            v-for="(card, index) in cards"
            :key="card"
            @click="handlePreviewClick(index)"
            class="mb-4"
          >
            <CardPreview
              :card="card"
              :isActive="index === activeCardIndex"
              class="hover:cursor-pointer"
            />
          </li>
        </ul>
      </div>
    </template>

    <FocusModal v-model="showPaywall">
      <div class="text-center flex flex-col gap-5">
        <p>Oh no! Free plans only support up to 2 cards.</p>
        <h3 class="text-lg font-bold">Let's get Bizzi</h3>
        <p>Subscribe now to create up to 10 business cards</p>
        <div class="flex-shrink">
          <a href="https://google.com" target="_blank">
            <AirButton>Compare Plans</AirButton>
          </a>
        </div>
      </div>
    </FocusModal>
  </div>
</template>
