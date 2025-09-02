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
      <div v-else :class="['main-layout', { 'two-column': !editMode && !isCreatingNew }]">
        <!-- Left Sidebar - Cards List -->
        <CardsList
          :cards="cards"
          :selected-card="selectedCard"
          :card-limit-error="cardLimitError"
          :is-creating-new="isCreatingNew"
          :edit-mode="editMode"
          :is-editing-slug="isEditingSlug"
          :is-updating-slug="isUpdatingSlug"
          :is-updating-visibility="isUpdatingVisibility"
          :slug-error="slugError"
          @toggle-edit="toggleEditMode"
          @start-creating="startCreatingCard"
          @cancel="cancelEdit"
          @save="handleSaveCard"
          @clear-error="cardLimitError = ''"
          @select-card="selectCard"
          @update-slug="handleUpdateSlug"
          @set-visibility="handleSetVisibility"
          @start-editing-slug="startEditingSlug"
          @cancel-editing-slug="cancelEditingSlug"
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

        <!-- Right Sidebar - Edit Form (only show when editing/creating) -->
        <CardEditForm
          v-if="editMode || isCreatingNew"
          :card="selectedCard"
          :is-creating-new="isCreatingNew"
          :is-picture-marked-for-deletion="isPictureMarkedForDeletion"
          @update-form="handleFormUpdate"
          @upload-picture="handleUploadPicture"
          @delete-picture="handleDeletePicture"
          @save="handleSaveCard"
          @cancel="cancelEdit"
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
} = useCards()

// Local state
const editMode = ref(false)
const isCreatingNew = ref(false)
const isEditingSlug = ref(false)
const isUpdatingSlug = ref(false)
const isUpdatingVisibility = ref(false)
const slugError = ref('')
const editableSlug = ref('')
const originalSlug = ref('')
const editFormData = ref<Record<string, any>>({})
const pendingPictureFile = ref<File | null>(null)
const isPictureMarkedForDeletion = ref(false)

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
  
  // If we're not editing, just return the selected card
  if (!editMode.value && !isCreatingNew.value) {
    return baseCard
  }
  
  // Merge with form data for live preview
  const previewCardData = {
    ...baseCard,
    ...editFormData.value,
    // Convert phoneNumber to phone_fmt for display
    phone_fmt: editFormData.value.phoneNumber || baseCard.phone_fmt,
    phone_raw: editFormData.value.phoneNumber?.replace(/\D/g, '') || baseCard.phone_raw,
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
  editMode.value = false
  isCreatingNew.value = false
  editableSlug.value = cardItem.slug || ''
  originalSlug.value = cardItem.slug || ''
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
  editMode.value = true
  editFormData.value = {}
  pendingPictureFile.value = null // Clear any pending file
}

// Toggle edit mode
const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (editMode.value) {
    // Reset flags when entering edit mode
    isPictureMarkedForDeletion.value = false
    pendingPictureFile.value = null
  }
}

// Cancel editing
const cancelEdit = () => {
  if (isCreatingNew.value) {
    isCreatingNew.value = false
    editMode.value = false
    pendingPictureFile.value = null // Clear pending file
    isPictureMarkedForDeletion.value = false // Reset deletion flag
    selectedCard.value = cards.value.length > 0 ? cards.value[0] : null
  } else {
    editMode.value = false
    pendingPictureFile.value = null // Clear any pending changes including picture
    isPictureMarkedForDeletion.value = false // Reset deletion flag
  }
}

// Handle form updates from CardEditForm component
const handleFormUpdate = (formData: Record<string, any>) => {
  editFormData.value = formData
}

// Save card changes
const handleSaveCard = async () => {
  // If picture is marked for deletion, delete it first (for existing cards)
  if (isPictureMarkedForDeletion.value && selectedCard.value && !isCreatingNew.value) {
    try {
      await deletePicture()
    } catch (error) {
      console.error('Failed to delete picture:', error)
    }
  }
  
  const result = await saveCard(editFormData.value, pendingPictureFile.value || undefined)
  
  if (result?.success) {
    if (isCreatingNew.value) {
      isCreatingNew.value = false
    }
    editMode.value = false
    pendingPictureFile.value = null // Clear pending file after save
    isPictureMarkedForDeletion.value = false // Reset deletion flag after save
    
    // Update slug references if this is a new card
    if (result.card?.slug) {
      editableSlug.value = result.card.slug
      originalSlug.value = result.card.slug
    }
  }
}

// Handle visibility change
const handleSetVisibility = async (isPublic: boolean) => {
  if (!selectedCard.value) return
  
  isUpdatingVisibility.value = true
  
  try {
    await setVisibility(isPublic)
  } finally {
    isUpdatingVisibility.value = false
  }
}

// Handle slug update
const handleUpdateSlug = async (newSlug: string) => {
  isUpdatingSlug.value = true
  slugError.value = ''
  
  try {
    const result = await updateSlug(newSlug)
    
    if (result?.success) {
      originalSlug.value = newSlug
      isEditingSlug.value = false
    } else if (result?.error) {
      slugError.value = result.error
    }
  } finally {
    isUpdatingSlug.value = false
  }
}

// Start editing slug
const startEditingSlug = () => {
  isEditingSlug.value = true
  originalSlug.value = selectedCard.value?.slug || ''
  editableSlug.value = selectedCard.value?.slug || ''
  slugError.value = ''
}

// Cancel editing slug
const cancelEditingSlug = () => {
  isEditingSlug.value = false
  editableSlug.value = originalSlug.value
  slugError.value = ''
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

// Initialize
onMounted(() => {
  fetchCards()
})
</script>