<template>
  <div class="cards-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">My Cards</h2>

      <!-- Show plus and edit buttons when not creating/editing -->
      <div v-if="!isCreatingNew && !editMode" class="header-buttons">
        <button v-if="selectedCard" @click="$emit('toggleEdit')" class="edit-card-btn">
          <svg class="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button @click="$emit('startCreating')" class="create-card-btn">
          <svg class="plus-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      <!-- Show cancel/save buttons when creating/editing -->
      <div v-else class="header-actions">
        <button @click="$emit('cancel')" class="cancel-btn">Cancel</button>
        <button @click="$emit('save')" class="save-btn">Save</button>
      </div>
    </div>

    <!-- Cards List -->
    <div class="cards-list">
      <!-- Card Limit Error -->
      <div v-if="cardLimitError" class="card-limit-error">
        <span>{{ cardLimitError }}</span>
        <button @click="$emit('clearError')" class="error-close-btn">
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

      <!-- Empty State -->
      <div v-if="cards.length === 0 && !isCreatingNew" class="empty-state">
        <div class="empty-icon">
          <i class="pi pi-id-card" style="font-size: 1.75rem"></i>
        </div>
        <p class="empty-text">No cards yet</p>
        <p class="empty-subtext">Click the + button to create your first card</p>
      </div>

      <!-- Creating New Card Item -->
      <div v-if="isCreatingNew" class="card-item active">
        <div class="card-preview">
          <div class="card-title">New Card</div>
          <div class="card-subtitle">Creating...</div>
        </div>
      </div>

      <!-- Existing Cards -->
      <div
        v-for="cardItem in cards"
        :key="cardItem.uuid"
        @click="$emit('selectCard', cardItem)"
        :class="['card-item', { active: selectedCard?.uuid === cardItem.uuid }]"
      >
        <div class="card-preview">
          <div class="card-title">{{ cardItem.name || 'Untitled Card' }}</div>
          <div class="card-subtitle">
            <template v-if="cardItem.job_title && cardItem.company">
              {{ cardItem.job_title }}, {{ cardItem.company }}
            </template>
            <template v-else-if="cardItem.job_title">
              {{ cardItem.job_title }}
            </template>
            <template v-else-if="cardItem.company">
              {{ cardItem.company }}
            </template>
            <template v-else> No job title </template>
          </div>
        </div>
      </div>

      <!-- Card Options - Show in left sidebar when editing -->
      <CardOptions
        v-if="(editMode || isCreatingNew) && selectedCard"
        :card="selectedCard"
        :is-editing-slug="isEditingSlug"
        :is-updating-slug="isUpdatingSlug"
        :is-updating-visibility="isUpdatingVisibility"
        :slug-error="slugError"
        @update-slug="$emit('updateSlug', $event)"
        @set-visibility="$emit('setVisibility', $event)"
        @start-editing-slug="$emit('startEditingSlug')"
        @cancel-editing-slug="$emit('cancelEditingSlug')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '../composables/useCards'
import CardOptions from './CardOptions.vue'

interface Props {
  cards: Card[]
  selectedCard: Card | null
  cardLimitError: string
  isCreatingNew: boolean
  editMode: boolean
  isEditingSlug: boolean
  isUpdatingSlug: boolean
  isUpdatingVisibility: boolean
  slugError: string
}

defineProps<Props>()

defineEmits<{
  toggleEdit: []
  startCreating: []
  cancel: []
  save: []
  clearError: []
  selectCard: [card: Card]
  updateSlug: [slug: string]
  setVisibility: [isPublic: boolean]
  startEditingSlug: []
  cancelEditingSlug: []
}>()
</script>