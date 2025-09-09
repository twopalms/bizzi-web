import { computed, ref } from 'vue'
import { useAuth } from '../composables/useAuth.ts'

const { makeAuthenticatedRequest } = useAuth()

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

export function useCards() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL

  const card = ref<Card>(null)
  const loading = ref<bool>(false)
  const error = ref<string>(null)

  async function fetchCard(id): Card {
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

  const hasContactInfo = computed(() => {
    return card.value.email || card.value.phone_fmt || card.value.website
  })

  return { card, loading, error, fetchCard, hasContactInfo }
}
