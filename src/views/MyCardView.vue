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

        <!-- Right Content Area -->
        <div class="content-area" :class="{ 'edit-mode-active': editMode || isCreatingNew }">
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

          <!-- Card Display (existing cards in view mode) -->
          <CardDisplay
            v-else-if="!editMode && !isCreatingNew && selectedCard"
            :card="selectedCard"
            @upload-picture="handleUploadPicture"
          />

          <!-- Card Edit (create new or edit existing) -->
          <CardEdit
            v-else-if="(editMode || isCreatingNew)"
            :card="selectedCard"
            :is-creating-new="isCreatingNew"
            :is-deleting-picture="isDeletingPicture"
            @update-form="handleFormUpdate"
            @upload-picture="handleUploadPicture"
            @delete-picture="handleDeletePicture"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCards } from '../composables/useCards'
import NavBar from '../components/NavBar.vue'
import CardsList from '../components/CardsList.vue'
import CardDisplay from '../components/CardDisplay.vue'
import CardEdit from '../components/CardEdit.vue'

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
  uploadPicture,
} = useCards()

// Local state
const editMode = ref(false)
const isCreatingNew = ref(false)
const isEditingSlug = ref(false)
const isUpdatingSlug = ref(false)
const isUpdatingVisibility = ref(false)
const isDeletingPicture = ref(false)
const slugError = ref('')
const editableSlug = ref('')
const originalSlug = ref('')
const editFormData = ref<Record<string, any>>({})
const pendingPictureFile = ref<File | null>(null)

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
}

// Cancel editing
const cancelEdit = () => {
  if (isCreatingNew.value) {
    isCreatingNew.value = false
    editMode.value = false
    pendingPictureFile.value = null // Clear pending file
    selectedCard.value = cards.value.length > 0 ? cards.value[0] : null
  } else {
    editMode.value = false
  }
}

// Handle form updates from CardEdit component
const handleFormUpdate = (formData: Record<string, any>) => {
  editFormData.value = formData
}

// Save card changes
const handleSaveCard = async () => {
  const result = await saveCard(editFormData.value, pendingPictureFile.value || undefined)
  
  if (result?.success) {
    if (isCreatingNew.value) {
      isCreatingNew.value = false
    }
    editMode.value = false
    pendingPictureFile.value = null // Clear pending file after save
    
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
  if (isCreatingNew.value) {
    // For new cards, store the file for later upload
    const result = await uploadPicture(file, true)
    if (result?.success && result.pendingFile) {
      pendingPictureFile.value = result.pendingFile
    }
  } else {
    // For existing cards, upload immediately
    await uploadPicture(file)
  }
}

// Handle picture deletion
const handleDeletePicture = async () => {
  isDeletingPicture.value = true
  
  try {
    await deletePicture()
  } finally {
    isDeletingPicture.value = false
  }
}

// Initialize
onMounted(() => {
  fetchCards()
})
</script>