<template>
  <div class="card-edit-form">
    <div class="edit-form-header">
      <h3>{{ isCreatingNew ? 'Create Card' : 'Edit Card' }}</h3>
      <div class="form-actions">
        <button @click="$emit('cancel')" class="cancel-btn">Cancel</button>
        <button @click="$emit('save')" class="save-btn">Save</button>
      </div>
    </div>

    <div class="edit-form-content">
      <div class="form-section">
        <h4 class="section-title">Profile Picture</h4>
        
        <div class="picture-upload-section">
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
        <h4 class="section-title">Basic Information</h4>
        
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

      <div class="form-section">
        <h4 class="section-title">Contact Information</h4>

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
          <div class="phone-input-container">
            <span class="country-prefix">+1</span>
            <input
              v-model="localForm.phoneNumber"
              @input="formatPhoneNumber"
              class="form-input phone-input"
              placeholder="(555) 123-4567"
              type="tel"
              maxlength="14"
            />
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import type { Card } from '../composables/useCards'

interface Props {
  card: Card | null
  isCreatingNew: boolean
  isPictureMarkedForDeletion: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateForm: [formData: Record<string, any>]
  uploadPicture: [file: File]
  deletePicture: []
  save: []
  cancel: []
}>()

const pictureUploadInput = ref<HTMLInputElement | null>(null)
const previewImageUrl = ref<string | null>(null)

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
  } else if (props.isCreatingNew) {
    // Clear form for new card
    Object.keys(localForm).forEach(key => {
      localForm[key as keyof typeof localForm] = ''
    })
    // Clear preview image
    if (previewImageUrl.value) {
      URL.revokeObjectURL(previewImageUrl.value)
      previewImageUrl.value = null
    }
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

// Phone number formatting
const formatPhoneNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove all non-digits

  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{3})/, '($1) $2')
  } else if (value.length > 0) {
    value = value.replace(/(\d{3})/, '($1)')
  }

  localForm.phoneNumber = value
}

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