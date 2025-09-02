<template>
  <div class="card-edit-mode">
    <div class="profile-header">
      <div class="profile-info">
        <input
          v-model="editForm.name"
          class="edit-input edit-name"
          placeholder="Your Name"
        />
        <div class="title-company">
          <div class="job-company-edit">
            <input
              v-model="editForm.job_title"
              class="edit-input edit-job"
              placeholder="Job Title"
            />
            <span class="separator" v-if="editForm.job_title && editForm.company"
              >,
            </span>
            <input
              v-model="editForm.company"
              class="edit-input edit-company"
              placeholder="Company"
            />
          </div>
          <input
            v-model="editForm.location"
            class="edit-input edit-location"
            placeholder="Location"
          />
        </div>
      </div>

      <div class="profile-avatar" :class="{ uploading: isUploadingPicture }">
        <input
          ref="pictureUploadInput"
          type="file"
          accept="image/*"
          @change="handleProfilePictureUpload"
          class="hidden-file-input"
        />
        <div class="avatar-placeholder" v-if="!card?.picture && !previewImageUrl">
          <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <div class="avatar-overlay">
            <button @click="triggerPictureUpload" class="overlay-btn" title="Add picture">
              <svg class="overlay-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-else class="avatar-image-container">
          <img :src="previewImageUrl || card?.picture || ''" :alt="card?.name || ''" class="avatar-image" />
          <div class="avatar-overlay">
            <div class="overlay-icons">
              <button
                @click="triggerPictureUpload"
                class="overlay-btn"
                title="Change picture"
              >
                <svg class="overlay-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                v-if="!isCreatingNew"
                @click.stop="$emit('deletePicture')"
                :disabled="isDeletingPicture"
                class="overlay-btn delete-btn"
                title="Delete picture"
              >
                <svg class="overlay-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                v-else-if="previewImageUrl"
                @click.stop="clearPreviewImage"
                class="overlay-btn delete-btn"
                title="Remove picture"
              >
                <svg class="overlay-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-if="isUploadingPicture" class="upload-spinner">
          <div class="spinner"></div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="bio-section">
        <textarea
          v-model="editForm.bio"
          class="edit-textarea edit-bio"
          placeholder="Tell people about yourself..."
          rows="3"
        ></textarea>
      </div>

      <div class="contact-section">
        <div class="contact-grid">
          <!-- Email -->
          <div class="contact-item">
            <div class="contact-icon-wrapper">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="contact-details">
              <span class="contact-label">Email</span>
              <input
                v-model="editForm.email"
                class="edit-input edit-contact"
                placeholder="john@example.com"
                type="email"
              />
            </div>
          </div>

          <!-- Phone -->
          <div class="contact-item">
            <div class="contact-icon-wrapper">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div class="contact-details">
              <span class="contact-label">Phone</span>
              <div class="phone-field-container">
                <span class="country-prefix">+1</span>
                <input
                  v-model="editForm.phoneNumber"
                  @input="formatPhoneNumber"
                  class="edit-input edit-contact phone-edit"
                  placeholder="(555) 123-4567"
                  type="tel"
                  maxlength="14"
                />
              </div>
            </div>
          </div>

          <!-- Website -->
          <div class="contact-item">
            <div class="contact-icon-wrapper">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 919-9"
                />
              </svg>
            </div>
            <div class="contact-details">
              <span class="contact-label">Website</span>
              <input
                v-model="editForm.website"
                class="edit-input edit-contact"
                placeholder="https://www.example.com"
                type="url"
              />
            </div>
          </div>
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
  isDeletingPicture: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateForm: [formData: Record<string, any>]
  uploadPicture: [file: File]
  deletePicture: []
}>()

const isUploadingPicture = ref(false)
const pictureUploadInput = ref<HTMLInputElement | null>(null)
const previewImageUrl = ref<string | null>(null)

// Edit form for live preview
const editForm = reactive({
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
    editForm.name = newCard.name || ''
    editForm.job_title = newCard.job_title || ''
    editForm.company = newCard.company || ''
    editForm.email = newCard.email || ''
    editForm.phoneNumber = newCard.phone_fmt || newCard.phone_raw || ''
    editForm.location = newCard.location || ''
    editForm.website = newCard.website || ''
    editForm.bio = newCard.bio || ''
  } else if (props.isCreatingNew) {
    // Clear form for new card
    Object.keys(editForm).forEach(key => {
      editForm[key as keyof typeof editForm] = ''
    })
  }
}, { immediate: true })

// Watch for form changes and emit updates
watch(editForm, (newForm) => {
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

  editForm.phoneNumber = value
}

const triggerPictureUpload = () => {
  if (pictureUploadInput.value) {
    pictureUploadInput.value.click()
  }
}

const handleProfilePictureUpload = async (event: Event) => {
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

  // Create preview URL for immediate display
  if (props.isCreatingNew) {
    // Clean up any existing preview URL
    if (previewImageUrl.value) {
      URL.revokeObjectURL(previewImageUrl.value)
    }
    previewImageUrl.value = URL.createObjectURL(file)
  }

  isUploadingPicture.value = true
  
  try {
    emit('uploadPicture', file)
  } finally {
    isUploadingPicture.value = false
    if (target) target.value = ''
  }
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