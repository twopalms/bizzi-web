<template>
  <div class="cards-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">My Cards</h2>

      <!-- Show create button -->
      <div v-if="!isCreatingNew" class="header-buttons">
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

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '../composables/useCards'

interface Props {
  cards: Card[]
  selectedCard: Card | null
  cardLimitError: string
  isCreatingNew: boolean
}

defineProps<Props>()

defineEmits<{
  toggleEdit: []
  startCreating: []
  cancel: []
  save: []
  clearError: []
  selectCard: [card: Card]
}>()
</script>