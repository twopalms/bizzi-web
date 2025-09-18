import { computed, ref } from 'vue'
import { useAuth } from '../composables/useAuth.ts'

const { makeAuthenticatedRequest, user } = useAuth()

export interface CardLink {
  name: string
  url: string
}

export interface Card {
  uuid: string
  name?: string
  job_title?: string
  company?: string
  email?: string
  links: CardLink[]
  phone_fmt?: string
  phone_raw?: string
  location?: string
  website?: string
  bio?: string
  picture?: string | null
  slug?: string
  public?: boolean
}

const card = ref<Card>(null)
const cards = ref<Card[]>([])
const cardCount = ref<integer>(0)
const loading = ref<boolean>(false)
const error = ref<string>(null)

export function useCards() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL

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
        card.value = await response.json()
        fetchCards()
      } else {
        console.error('Failed to create card:', response.status, response.statusText)
        return { success: false, error: 'Failed to create card' }
      }
    } catch (err) {
      console.log(err)
      error.value = err.toString()
    } finally {
      loading.value = false
    }
  }

  const fetchCard = async (id: string): Card => {
    error.value = card.value = null
    loading.value = true

    // TODO: handle response codes
    // TODO: make generic fetch composable

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/`)
      card.value = await response.json()
    } catch (err) {
      error.value = err.toString()
    } finally {
      loading.value = false
    }
  }

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

  const deleteCard = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/`, {
        method: 'DELETE',
      })

      if (response.ok) {
        card.value = null
        return { success: true }
      } else {
        console.error('Failed to delete card:', response.status, response.statusText)
        return { success: false, error: 'Failed to delete card' }
      }
    } catch (error) {
      console.error('Network error deleting card:', error)
      return { success: false, error: 'Network error' }
    } finally {
      fetchCards()
    }
  }

  const hasContactInfo = computed(() => {
    return card.value.email || card.value.phone_fmt || card.value.website
  })

  return {
    card,
    cards,
    createCard,
    deleteCard,
    error,
    fetchCard,
    fetchCards,
    hasContactInfo,
    loading,
  }
}
