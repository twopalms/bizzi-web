<template>
  <div>
    <NavBar />
    <div class="card-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-card card">
        <div class="loading-content">
          <div class="spinner"></div>
          <p>Loading your cards...</p>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div v-else class="main-layout">
        <!-- Left Sidebar - Cards List -->
        <CardsList
          :cards="cards"
          :selected-card="selectedCard"
          :card-limit-error="cardLimitError"
          :is-creating-new="isCreatingNew"
          @start-creating="startCreatingCard"
          @save="handleSaveCard"
          @clear-error="cardLimitError = ''"
          @select-card="selectCard"
        />

        <!-- Middle Content Area - Card Preview -->
        <div class="content-area">
          <!-- Show message when no card is selected -->
          <div v-if="!selectedCard && !isCreatingNew" class="no-selection">
            <div class="no-selection-content">
              <div class="no-selection-icon">
                <i class="pi pi-id-card" style="font-size: 2rem"></i>
              </div>
              <h3>Select a card to view or edit</h3>
              <p>Choose a card from the list or create a new one to get started.</p>
            </div>
          </div>

          <!-- Card Display - Always show preview -->
          <CardDisplay
            v-else-if="previewCard"
            :card="previewCard"
          />
        </div>

        <!-- Right Sidebar - Edit Form -->
        <CardEditForm
          :card="selectedCard"
          :is-creating-new="isCreatingNew"
          :is-picture-marked-for-deletion="isPictureMarkedForDeletion"
          :save-error="saveError"
          :has-pending-changes="hasPendingChanges"
          :show-save-success="showSaveSuccess"
          @update-form="handleFormUpdate"
          @upload-picture="handleUploadPicture"
          @delete-picture="handleDeletePicture"
          @save="handleSaveCard"
          @clear-save-error="saveError = ''"
          @delete-card="handleDeleteCard"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCards } from '../composables/useCards'
import NavBar from '../components/NavBar.vue'
import CardsList from '../components/CardsList.vue'
import CardDisplay from '../components/CardDisplay.vue'
import CardEditForm from '../components/CardEditForm.vue'

// Use the cards composable
const {
  cards,
  selectedCard,
  card,
  isLoading,
  cardLimitError,
  fetchCards,
  selectCard: selectCardFromComposable,
  saveCard,
  setVisibility,
  updateSlug,
  deletePicture,
  deleteCard,
} = useCards()

// Local state
const isCreatingNew = ref(false)
const editFormData = ref<Record<string, any>>({})
const pendingPictureFile = ref<File | null>(null)
const isPictureMarkedForDeletion = ref(false)
const saveError = ref('')
const showSaveSuccess = ref(false)

// Check if there are pending changes to save
const hasPendingChanges = computed(() => {
  if (isCreatingNew.value) {
    // For new cards, check if any field has content or there's a pending picture
    const hasFormData = Object.values(editFormData.value).some(value => 
      value !== null && value !== undefined && value !== ''
    )
    return hasFormData || pendingPictureFile.value !== null
  }
  
  // If no card is selected and not creating new, disable save button
  if (!selectedCard.value) return false
  
  // If editFormData is empty (initial state), no changes
  if (Object.keys(editFormData.value).length === 0) return false
  
  // Check if there's a pending picture or deletion
  if (pendingPictureFile.value || isPictureMarkedForDeletion.value) return true
  
  // Compare form data with current card data
  const formPhone = editFormData.value.phoneNumber || ''
  const cardPhone = selectedCard.value.phone_fmt || selectedCard.value.phone_raw || ''
  
  return (
    (editFormData.value.name || '') !== (selectedCard.value.name || '') ||
    (editFormData.value.job_title || '') !== (selectedCard.value.job_title || '') ||
    (editFormData.value.company || '') !== (selectedCard.value.company || '') ||
    (editFormData.value.email || '') !== (selectedCard.value.email || '') ||
    formPhone !== cardPhone ||
    (editFormData.value.location || '') !== (selectedCard.value.location || '') ||
    (editFormData.value.website || '') !== (selectedCard.value.website || '') ||
    (editFormData.value.bio || '') !== (selectedCard.value.bio || '') ||
    Boolean(editFormData.value.public) !== Boolean(selectedCard.value.public) ||
    (editFormData.value.slug || '') !== (selectedCard.value.slug || '')
  )
})

// Create a preview card that merges selected card with form data
const previewCard = computed(() => {
  if (!selectedCard.value && !isCreatingNew.value) return null
  
  // Start with selected card or empty card for new creation
  const baseCard = selectedCard.value || {
    uuid: 'preview',
    name: '',
    job_title: '',
    company: '',
    email: '',
    phone_fmt: '',
    phone_raw: '',
    location: '',
    website: '',
    bio: '',
    picture: null,
    slug: '',
    public: false,
  }
  
  // Always merge with form data for live preview
  
  // Merge with form data for live preview
  const previewCardData = {
    ...baseCard,
    ...editFormData.value,
    // Use phoneNumber for both formatted and raw display
    phone_fmt: editFormData.value.phoneNumber || baseCard.phone_fmt,
    phone_raw: editFormData.value.phoneNumber || baseCard.phone_raw,
  }
  
  // If there's a pending picture file, create a preview URL for it
  if (pendingPictureFile.value) {
    previewCardData.picture = URL.createObjectURL(pendingPictureFile.value)
  }
  
  // If picture is marked for deletion, hide it in preview
  if (isPictureMarkedForDeletion.value) {
    previewCardData.picture = null
  }
  
  return previewCardData
})

// Mobile detection
const isMobileDevice = () => {
  return (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    'ontouchstart' in window ||
    window.innerWidth <= 768
  )
}

// Select a card from the list
const selectCard = (cardItem: any) => {
  selectCardFromComposable(cardItem)
  isCreatingNew.value = false
  // Reset flags when selecting a different card
  isPictureMarkedForDeletion.value = false
  pendingPictureFile.value = null
}

// Start creating a new card
const startCreatingCard = () => {
  // Check if user already has 2 cards (free tier limit)
  if (cards.value.length >= 2) {
    cardLimitError.value = 'Free users can only create up to 2 cards. Upgrade to create more cards.'
    return
  }

  // Clear any previous errors and state
  cardLimitError.value = ''
  selectedCard.value = null
  isCreatingNew.value = true
  editFormData.value = {}
  pendingPictureFile.value = null // Clear any pending file
}



// Handle form updates from CardEditForm component
const handleFormUpdate = (formData: Record<string, any>) => {
  editFormData.value = formData
}

// Save card changes
const handleSaveCard = async () => {
  // Don't save if there are no pending changes
  if (!hasPendingChanges.value) return
  
  // Clear any previous save errors
  saveError.value = ''
  
  // If picture is marked for deletion, delete it first (for existing cards)
  if (isPictureMarkedForDeletion.value && selectedCard.value && !isCreatingNew.value) {
    try {
      await deletePicture()
    } catch (error) {
      console.error('Failed to delete picture:', error)
      saveError.value = 'Failed to delete picture. Please try again.'
      return
    }
  }
  
  const result = await saveCard(editFormData.value, pendingPictureFile.value || undefined)
  
  if (result?.success) {
    if (isCreatingNew.value) {
      isCreatingNew.value = false
    }
    pendingPictureFile.value = null // Clear pending file after save
    isPictureMarkedForDeletion.value = false // Reset deletion flag after save
    editFormData.value = {} // Clear form data so hasPendingChanges becomes false
    
    // Show success message for 1 second
    showSaveSuccess.value = true
    setTimeout(() => {
      showSaveSuccess.value = false
    }, 1000)
  } else {
    // Handle save errors
    saveError.value = result?.error || 'Failed to save card. Please try again.'
  }
}


// Handle picture upload
const handleUploadPicture = async (file: File) => {
  // Always just store the file for upload on save, don't upload immediately
  pendingPictureFile.value = file
  isPictureMarkedForDeletion.value = false // Clear deletion flag when uploading new picture
}

// Handle picture deletion
const handleDeletePicture = async () => {
  // Mark picture for deletion (don't actually delete until save)
  isPictureMarkedForDeletion.value = true
  pendingPictureFile.value = null // Clear any pending upload
}

// Handle card deletion
const handleDeleteCard = async () => {
  const result = await deleteCard()
  if (result?.success) {
    // Card successfully deleted, no need to do anything else
    // The composable already handles removing from list and clearing selection
  } else {
    saveError.value = result?.error || 'Failed to delete card'
  }
}

// Initialize
onMounted(() => {
  fetchCards()
})
</script>