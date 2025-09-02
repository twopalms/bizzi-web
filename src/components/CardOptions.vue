<template>
  <div class="card-options-sidebar">
    <div class="card-options">
      <h3 class="sidebar-title">Card Options</h3>

      <!-- Public URL Section -->
      <div class="option-group">
        <div class="option-header">
          <label class="option-label">Public URL</label>
          <div class="option-actions">
            <button v-if="!isEditingSlug" @click="$emit('startEditingSlug')" class="edit-btn">
              <svg class="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <div v-else class="edit-actions-inline">
              <button
                @click="$emit('cancelEditingSlug')"
                class="cancel-btn-inline"
                :disabled="isUpdatingSlug"
              >
                Cancel
              </button>
              <button
                @click="saveSlug"
                class="save-btn-inline"
                :disabled="isUpdatingSlug"
              >
                {{ isUpdatingSlug ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </div>
        </div>

        <div class="url-container">
          <!-- Display Mode -->
          <div v-if="!isEditingSlug" class="url-display">
            <a :href="publicCardUrl" target="_blank" class="url-link">{{
              publicCardUrl
            }}</a>
          </div>

          <!-- Edit Mode -->
          <div v-else class="url-edit-mode">
            <div class="url-edit-display">
              <span class="url-prefix">{{ urlPrefix }}</span>
              <input
                v-model="editableSlug"
                :disabled="isUpdatingSlug"
                class="slug-input-simple"
                placeholder="your-slug"
                @keydown.enter="saveSlug"
                @keydown.escape="$emit('cancelEditingSlug')"
              />
            </div>
            <div v-if="slugError" class="slug-error">{{ slugError }}</div>
          </div>
        </div>
      </div>

      <!-- Public/Private Toggle -->
      <div class="option-group">
        <div class="option-header">
          <label class="option-label">Visibility</label>
        </div>
        <div class="visibility-toggle">
          <div
            class="toggle-option"
            :class="{ active: !card.public }"
            @click="$emit('setVisibility', false)"
          >
            <input
              type="radio"
              :checked="!card.public"
              :disabled="isUpdatingVisibility"
              class="toggle-radio"
            />
            <span class="toggle-label">Private</span>
          </div>
          <div
            class="toggle-option"
            :class="{ active: card.public }"
            @click="$emit('setVisibility', true)"
          >
            <input
              type="radio"
              :checked="card.public"
              :disabled="isUpdatingVisibility"
              class="toggle-radio"
            />
            <span class="toggle-label">Public</span>
          </div>
        </div>
        <div class="visibility-description">
          <span v-if="card.public" class="description-text"
            >Your card is visible to everyone.</span
          >
          <span v-else class="description-text">Only you can see this card.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Card } from '../composables/useCards'

interface Props {
  card: Card
  isEditingSlug: boolean
  isUpdatingSlug: boolean
  isUpdatingVisibility: boolean
  slugError: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateSlug: [slug: string]
  setVisibility: [isPublic: boolean]
  startEditingSlug: []
  cancelEditingSlug: []
}>()

const editableSlug = ref('')

// Update editableSlug when card changes or when starting to edit
watch(() => props.card?.slug, (newSlug) => {
  if (newSlug) {
    editableSlug.value = newSlug
  }
}, { immediate: true })

// Computed property for URL prefix
const urlPrefix = computed(() => {
  return `${window.location.origin}/cards/`
})

// Computed property for public card URL
const publicCardUrl = computed(() => {
  if (!props.card?.slug) return ''
  return `${window.location.origin}/cards/${props.card.slug}`
})

const saveSlug = () => {
  if (editableSlug.value) {
    emit('updateSlug', editableSlug.value)
  }
}
</script>