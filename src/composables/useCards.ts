import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

export type Card = {
  uuid: string
  name?: string
  job_title?: string
  company?: string
  email?: string
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
  const { makeAuthenticatedRequest, user } = useAuth()

  // DRY API Helper Functions
  const API_BASE = import.meta.env.VITE_API_BASE_URL

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    return makeAuthenticatedRequest(`${API_BASE}${endpoint}`, options)
  }

  const cardRequest = async (
    uuid: string | null,
    method: string,
    data: Record<string, unknown> | null = null,
  ) => {
    const endpoint = uuid ? `/api/cards/${uuid}/` : '/api/cards/'
    const options: Record<string, unknown> = { method }

    if (data) {
      options.body = JSON.stringify(data)
    }

    return apiRequest(endpoint, options)
  }

  // State
  const cards = ref<Card[]>([])
  const selectedCard = ref<Card | null>(null)
  const isLoading = ref(true)
  const cardLimitError = ref('')

  // Computed
  const card = computed(() => selectedCard.value)

  // Actions
  const fetchCards = async () => {
    try {
      const currentUser = user.value
      const userId = currentUser?.data?.user?.id
      if (!userId) {
        console.error('No user ID available. User data:', currentUser)
        isLoading.value = false
        return
      }

      const response = await apiRequest(`/api/cards/?user_id=${userId}`, { method: 'GET' })

      if (response.ok) {
        const data = await response.json()

        if (data && data.items && Array.isArray(data.items)) {
          cards.value = data.items

          if (cards.value.length > 0) {
            selectedCard.value = cards.value[0]
          }
        }
      } else {
        console.error('Cards API returned error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error)
    } finally {
      isLoading.value = false
    }
  }

  const selectCard = (cardItem: Card) => {
    selectedCard.value = cardItem
  }

  const saveCard = async (formData: Record<string, any>, pendingPictureFile?: File) => {
    try {
      // Handle phone number formatting
      if (formData.phoneNumber) {
        formData.phone = `+1${formData.phoneNumber.replace(/\D/g, '')}`
      }
      delete formData.phoneNumber

      // Filter out empty string fields (but keep the pendingPictureFile separate)
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== '' && key !== 'pendingPictureFile'),
      )

      const isCreating = !card.value?.uuid
      const response = await cardRequest(
        isCreating ? null : card.value.uuid,
        isCreating ? 'POST' : 'PATCH',
        filteredData,
      )

      if (response.ok) {
        const updatedCard = await response.json()

        if (isCreating) {
          cards.value.push(updatedCard)
          selectedCard.value = updatedCard
          
          // If there's a pending picture file, upload it now
          if (pendingPictureFile) {
            try {
              const formData = new FormData()
              formData.append('file', pendingPictureFile)

              // Get CSRF token
              const cookies = document.cookie.split(';')
              let csrfToken = ''
              for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=')
                if (name === 'csrftoken') {
                  csrfToken = value
                  break
                }
              }

              const picResponse = await fetch(`${API_BASE}/api/cards/${updatedCard.uuid}/picture/`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                  'X-CSRFToken': csrfToken,
                },
                body: formData,
              })

              if (picResponse.ok) {
                const picData = await picResponse.json()
                updatedCard.picture = picData.url
                if (selectedCard.value) {
                  selectedCard.value.picture = picData.url
                }
              } else {
                console.error('Failed to upload picture during card creation')
              }
            } catch (error) {
              console.error('Picture upload error during card creation:', error)
            }
          }
        } else {
          const index = cards.value.findIndex((p) => p.uuid === updatedCard.uuid)
          if (index !== -1) {
            cards.value[index] = updatedCard
          }
          selectedCard.value = updatedCard
          
          // If there's a pending picture file for existing card, upload it now
          if (pendingPictureFile) {
            try {
              const formData = new FormData()
              formData.append('file', pendingPictureFile)

              // Get CSRF token
              const cookies = document.cookie.split(';')
              let csrfToken = ''
              for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=')
                if (name === 'csrftoken') {
                  csrfToken = value
                  break
                }
              }

              const picResponse = await fetch(`${API_BASE}/api/cards/${updatedCard.uuid}/picture/`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                  'X-CSRFToken': csrfToken,
                },
                body: formData,
              })

              if (picResponse.ok) {
                const picData = await picResponse.json()
                updatedCard.picture = picData.url
                if (selectedCard.value) {
                  selectedCard.value.picture = picData.url
                }
                // Update the cards array as well
                if (index !== -1) {
                  cards.value[index].picture = picData.url
                }
              } else {
                console.error('Failed to upload picture during card update')
              }
            } catch (error) {
              console.error('Picture upload error during card update:', error)
            }
          }
        }

        console.log(isCreating ? 'Card created successfully' : 'Card updated successfully')
        return { success: true, card: updatedCard }
      } else {
        console.error(
          `Failed to ${isCreating ? 'create' : 'update'} card:`,
          response.status,
          response.statusText,
        )
        return { success: false, error: 'Failed to save card' }
      }
    } catch (error) {
      console.error(`Network error ${card.value?.uuid ? 'updating' : 'creating'} card:`, error)
      return { success: false, error: 'Network error' }
    }
  }

  const setVisibility = async (isPublic: boolean) => {
    if (!card.value?.uuid || card.value.public === isPublic) return { success: true }

    const previousValue = card.value.public
    card.value.public = isPublic // Optimistically update UI

    try {
      const response = await cardRequest(card.value.uuid, 'PATCH', { public: isPublic })

      if (response.ok) {
        const updatedCard = await response.json()
        selectedCard.value = updatedCard
        console.log('Card visibility updated successfully to:', isPublic ? 'public' : 'private')
        return { success: true }
      } else {
        console.error('Failed to update card visibility:', response.status, response.statusText)
        card.value.public = previousValue // Revert the change on error
        return { success: false, error: 'Failed to update visibility' }
      }
    } catch (error) {
      console.error('Network error updating card visibility:', error)
      card.value.public = previousValue // Revert the change on error
      return { success: false, error: 'Network error' }
    }
  }

  const updateSlug = async (newSlug: string) => {
    if (!card.value?.uuid || !newSlug) return { success: false, error: 'Invalid input' }

    if (newSlug === card.value.slug) {
      return { success: true }
    }

    // Basic slug validation
    const slugRegex = /^[a-zA-Z0-9-]+$/
    if (!slugRegex.test(newSlug)) {
      return { success: false, error: 'Only letters, numbers, and hyphens are allowed.' }
    }

    try {
      const response = await cardRequest(card.value.uuid, 'PATCH', { slug: newSlug })

      if (response.ok) {
        const updatedCard = await response.json()
        selectedCard.value = updatedCard
        console.log('Slug updated successfully')
        return { success: true }
      } else if (response.status === 400) {
        return { success: false, error: 'This URL is already taken. Please try a different one.' }
      } else {
        return { success: false, error: 'Failed to update URL. Please try again.' }
      }
    } catch (error) {
      console.error('Network error updating slug:', error)
      return { success: false, error: 'Network error. Please check your connection and try again.' }
    }
  }

  const deletePicture = async () => {
    if (!card.value?.uuid) return { success: false }

    try {
      const response = await apiRequest(`/api/cards/${card.value.uuid}/picture/`, {
        method: 'DELETE',
      })

      if (response.ok) {
        card.value.picture = null
        console.log('Card picture deleted successfully')
        return { success: true }
      } else {
        console.error('Failed to delete card picture:', response.status, response.statusText)
        return { success: false, error: 'Failed to delete picture' }
      }
    } catch (error) {
      console.error('Network error deleting card picture:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const uploadPicture = async (file: File, isCreating = false) => {
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Profile picture must be less than 10MB' }
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Please select an image file' }
    }

    // If creating a new card, store the file for later upload
    if (isCreating || !card.value?.uuid) {
      return { success: true, pendingFile: file }
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Get CSRF token
      const cookies = document.cookie.split(';')
      let csrfToken = ''
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'csrftoken') {
          csrfToken = value
          break
        }
      }

      const response = await fetch(`${API_BASE}/api/cards/${card.value.uuid}/picture/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        card.value.picture = data.url
        return { success: true }
      } else {
        return { success: false, error: 'Failed to upload picture. Please try again.' }
      }
    } catch (error) {
      console.error('Picture upload error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  return {
    // State
    cards,
    selectedCard,
    card,
    isLoading,
    cardLimitError,
    
    // Actions
    fetchCards,
    selectCard,
    saveCard,
    setVisibility,
    updateSlug,
    deletePicture,
    uploadPicture,
  }
}