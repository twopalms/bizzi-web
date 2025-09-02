<template>
  <div class="card-edit-form">
    <div class="edit-form-header">
      <div class="header-top">
        <h3>{{ isCreatingNew ? 'Create Card' : 'Edit Card' }}</h3>
        <div class="form-actions">
          <span v-if="showSaveSuccess" class="save-success">Card saved</span>
          <button @click="$emit('save')" :disabled="!hasPendingChanges" class="save-btn">Save</button>
        </div>
      </div>
      
      <!-- Save Error Display -->
      <div v-if="saveError" class="save-error">
        <span>{{ saveError }}</span>
        <button @click="$emit('clearSaveError')" class="error-close-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="edit-form-content">
      <div class="form-section">
        <h4 class="section-title collapsible" @click="sectionsOpen.picture = !sectionsOpen.picture">
          <span>Profile Picture</span>
          <svg class="collapse-icon" :class="{ 'rotate': sectionsOpen.picture }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </h4>

        <div v-if="sectionsOpen.picture" class="picture-upload-section">
          <input
            ref="pictureUploadInput"
            type="file"
            accept="image/*"
            @change="handlePictureUpload"
            class="hidden-file-input"
          />

          <div v-if="!previewImageUrl && (!card?.picture || isPictureMarkedForDeletion)" class="upload-placeholder">
            <div class="upload-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p class="upload-text">Upload profile picture</p>
            <button @click="triggerPictureUpload" class="upload-btn">Choose File</button>
          </div>

          <div v-else-if="!isPictureMarkedForDeletion" class="picture-preview">
            <img
              :src="previewImageUrl || card?.picture || ''"
              :alt="localForm.name || 'Profile picture'"
              class="preview-image"
            />
            <div class="picture-actions">
              <button @click="triggerPictureUpload" class="change-btn">Change</button>
              <button
                v-if="!isCreatingNew && card?.picture"
                @click="$emit('deletePicture')"
                class="delete-btn"
              >
                Delete
              </button>
              <button
                v-else-if="previewImageUrl"
                @click="clearPreviewImage"
                class="delete-btn"
              >
                Remove
              </button>
            </div>
          </div>

        </div>
      </div>

      <div class="form-section">
        <h4 class="section-title collapsible" @click="sectionsOpen.basic = !sectionsOpen.basic">
          <span>Basic Information</span>
          <svg class="collapse-icon" :class="{ 'rotate': sectionsOpen.basic }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </h4>

        <div v-if="sectionsOpen.basic">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input
            v-model="localForm.name"
            class="form-input"
            placeholder="Enter your full name"
            type="text"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Job Title</label>
          <input
            v-model="localForm.job_title"
            class="form-input"
            placeholder="Software Engineer, Designer, etc."
            type="text"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Company</label>
          <input
            v-model="localForm.company"
            class="form-input"
            placeholder="Company name"
            type="text"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Location</label>
          <input
            v-model="localForm.location"
            class="form-input"
            placeholder="City, State or Country"
            type="text"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Bio</label>
          <textarea
            v-model="localForm.bio"
            class="form-textarea"
            placeholder="Tell people about yourself..."
            rows="4"
          ></textarea>
        </div>
        </div>
      </div>

      <div class="form-section">
        <h4 class="section-title collapsible" @click="sectionsOpen.contact = !sectionsOpen.contact">
          <span>Contact Information</span>
          <svg class="collapse-icon" :class="{ 'rotate': sectionsOpen.contact }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </h4>

        <div v-if="sectionsOpen.contact">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="localForm.email"
            class="form-input"
            placeholder="john@example.com"
            type="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input
            v-model="localForm.phoneNumber"
            class="form-input"
            placeholder="555-123-4567"
            type="tel"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Website</label>
          <input
            v-model="localForm.website"
            class="form-input"
            placeholder="https://www.example.com"
            type="url"
          />
        </div>
        </div>
      </div>

      <div class="form-section">
        <h4 class="section-title collapsible" @click="sectionsOpen.options = !sectionsOpen.options">
          <span>Card Options</span>
          <svg class="collapse-icon" :class="{ 'rotate': sectionsOpen.options }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </h4>

        <div v-if="sectionsOpen.options" class="section-content">
          <!-- Public URL Section -->
          <div class="form-group">
            <label class="form-label">Public URL</label>
            <div class="url-input-container">
              <div class="url-input-wrapper">
                <span class="url-prefix">{{ urlPrefix }}</span>
                <input
                  v-model="localForm.slug"
                  class="form-input slug-input"
                  placeholder="your-custom-url"
                />
              </div>
              <div class="url-preview" v-if="localForm.slug">
                <span class="preview-label">Preview: </span>
                <a :href="`${urlPrefix}${localForm.slug}`" target="_blank" class="url-link">
                  {{ urlPrefix }}{{ localForm.slug }}
                </a>
              </div>
            </div>
          </div>

          <!-- Visibility Section -->
          <div class="form-group">
            <label class="form-label">Visibility</label>
            <div class="visibility-options">
              <div class="visibility-toggle">
                <div
                  class="toggle-option"
                  :class="{ active: !localForm.public }"
                  @click="localForm.public = false"
                >
                  <input
                    type="radio"
                    :checked="!localForm.public"
                    class="toggle-radio"
                  />
                  <span class="toggle-label">Private</span>
                </div>
                <div
                  class="toggle-option"
                  :class="{ active: localForm.public }"
                  @click="localForm.public = true"
                >
                  <input
                    type="radio"
                    :checked="localForm.public"
                    class="toggle-radio"
                  />
                  <span class="toggle-label">Public</span>
                </div>
              </div>
              <div class="visibility-description">
                <span v-if="localForm.public" class="description-text">Your card is visible to everyone.</span>
                <span v-else class="description-text">Only you can see this card.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount, computed } from 'vue'
import type { Card } from '../composables/useCards'

interface Props {
  card: Card | null
  isCreatingNew: boolean
  isPictureMarkedForDeletion: boolean
  saveError: string
  hasPendingChanges: boolean
  showSaveSuccess: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateForm: [formData: Record<string, any>]
  uploadPicture: [file: File]
  deletePicture: []
  save: []
  clearSaveError: []
}>()

const pictureUploadInput = ref<HTMLInputElement | null>(null)
const previewImageUrl = ref<string | null>(null)

// Section collapse state - all closed by default
const sectionsOpen = reactive({
  picture: false,
  basic: false,
  contact: false,
  options: false,
})

// Local form state
const localForm = reactive({
  name: '',
  job_title: '',
  company: '',
  email: '',
  phoneNumber: '',
  location: '',
  website: '',
  bio: '',
  public: false,
  slug: '',
})

// Computed properties for URL handling
const urlPrefix = computed(() => {
  return `${window.location.origin}/cards/`
})

const publicCardUrl = computed(() => {
  if (!props.card?.slug) return ''
  return `${window.location.origin}/cards/${props.card.slug}`
})


// Initialize form when card changes
watch(() => props.card, (newCard) => {
  if (newCard) {
    localForm.name = newCard.name || ''
    localForm.job_title = newCard.job_title || ''
    localForm.company = newCard.company || ''
    localForm.email = newCard.email || ''
    localForm.phoneNumber = newCard.phone_fmt || newCard.phone_raw || ''
    localForm.location = newCard.location || ''
    localForm.website = newCard.website || ''
    localForm.bio = newCard.bio || ''
    localForm.public = newCard.public || false
    localForm.slug = newCard.slug || ''
  } else if (props.isCreatingNew) {
    // Clear form for new card
    localForm.name = ''
    localForm.job_title = ''
    localForm.company = ''
    localForm.email = ''
    localForm.phoneNumber = ''
    localForm.location = ''
    localForm.website = ''
    localForm.bio = ''
    localForm.public = false
    localForm.slug = ''
    // Clear preview image
    if (previewImageUrl.value) {
      URL.revokeObjectURL(previewImageUrl.value)
      previewImageUrl.value = null
    }
  } else {
    // No card selected and not creating new - clear form to initial state
    localForm.name = ''
    localForm.job_title = ''
    localForm.company = ''
    localForm.email = ''
    localForm.phoneNumber = ''
    localForm.location = ''
    localForm.website = ''
    localForm.bio = ''
    localForm.public = false
    localForm.slug = ''
  }
}, { immediate: true })

// Clear preview image when not in edit mode or creating new
watch(() => [props.card, props.isCreatingNew], ([newCard, isCreating]) => {
  if (!isCreating && newCard && previewImageUrl.value) {
    URL.revokeObjectURL(previewImageUrl.value)
    previewImageUrl.value = null
  }
})

// Watch for form changes and emit updates
watch(localForm, (newForm) => {
  emit('updateForm', { ...newForm })
}, { deep: true })

const triggerPictureUpload = () => {
  if (pictureUploadInput.value) {
    pictureUploadInput.value.click()
  }
}

const handlePictureUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    console.error('Profile picture must be less than 10MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    console.error('Please select an image file')
    return
  }

  // Always create preview URL for immediate display (don't upload until save)
  if (previewImageUrl.value) {
    URL.revokeObjectURL(previewImageUrl.value)
  }
  previewImageUrl.value = URL.createObjectURL(file)

  // Emit the file to parent for storage until save
  emit('uploadPicture', file)

  // Clear the input
  if (target) target.value = ''
}

const clearPreviewImage = () => {
  if (previewImageUrl.value) {
    URL.revokeObjectURL(previewImageUrl.value)
    previewImageUrl.value = null
  }
}

// Clean up preview URL when component is unmounted
onBeforeUnmount(() => {
  if (previewImageUrl.value) {
    URL.revokeObjectURL(previewImageUrl.value)
  }
})
</script>
