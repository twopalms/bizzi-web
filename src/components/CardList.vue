<script setup lang="ts">
import { useCardManager } from '../composables/useCardManager.ts'
import ActionButton from '../components/ActionButton.vue'
import CardPreview from '../components/CardPreview.vue'

const { createCard, error, loading, setActiveCard, setError } = useCardManager()

defineProps({
  activeCardIndex: Number,
  cardList: Array,
})
</script>

<template>
  <div class="sm:min-w-60">
    <div v-if="!loading && cardList.length === 0" class="flex flex-col p-4 justify-around">
      <div class="text-center space-y-4 mx-6">
        <h3 class="text-md">You have no cards</h3>
        <ActionButton @click="createCard">Create New Card"</ActionButton>
      </div>
    </div>

    <div v-else class="flex flex-col p-4 gap-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl text-gray-600 font-semibold">My Cards</h2>
        <ActionButton @click="createCard">+ Add</ActionButton>
      </div>

      <div
        v-if="error"
        class="flex flex-grow bg-red-500/30 rounded-lg p-2 text-sm border-2 border-red-800 justify-between items-center"
      >
        <span>{{ error }}</span>
        <button
          @click="setError(null)"
          class="pi pi-times hover:cursor-pointer hover:bg-red-800/50 p-1 rounded-sm"
        />
      </div>

      <ul>
        <li
          @click="setActiveCard(index)"
          v-for="(card, index) in cardList"
          :key="card"
          class="mb-4"
        >
          <router-link :to="{ name: 'card-detail', params: { id: card.uuid } }">
            <CardPreview :card="card" :isActive="index == activeCardIndex" />
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
