import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const { makeAuthenticatedRequest, user } = useAuth()

async function fetchCard(id: string): Card {
  error.value = null
  loading.value = true

  // TODO: handle response codes

  let data = null

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/`)
    data = await response.json()
  } catch (err) {
    console.error(err)
    // error.value = err.toString()
  } finally {
    // loading.value = false
  }

  return data
}

const loading = ref(false)
const error = ref(null)

const cardList = ref([])
const activeCard = ref(null)
const activeCardIndex = ref(null)

watchEffect(async () => {
  if (activeCardIndex.value === null) {
    activeCard.value = null
    return
  }

  const cardId = cardList.value[activeCardIndex.value].uuid
  activeCard.value = await fetchCard(cardId)
})

export function useCardManager() {
  const route = useRoute()

  function isRoot() {
    return route.path == '/cards'
  }

  function setActiveCard(index) {
    activeCardIndex.value = index
  }

  function setError(value) {
    error.value = value
  }

  async function fetchCards() {
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
      cardList.value = data.items
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

      if (response.ok) {
        // TODO: handle response codes: 403
        const newCard = await response.json()
        cardList.value.push(newCard)
        activeCardIndex.value = cardList.value.indexOf(newCard)
      } else {
        error.value = (await response.json()).detail
        return { success: false, error: 'Failed to create card' }
      }
    } catch (err) {
      console.error(err)
      error.value = err.toString()
    } finally {
      loading.value = false
    }
  }

  return {
    activeCard,
    activeCardIndex,
    cardList,
    createCard,
    error,
    fetchCards,
    isRoot,
    loading,
    setActiveCard,
    setError,
  }
}
