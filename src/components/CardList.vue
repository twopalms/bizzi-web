<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCards } from '../composables/useCards.ts'
import ActionButton from '../components/ActionButton.vue'
import CardPreview from '../components/CardPreview.vue'

const router = useRouter()

const { card, cards, createCard, fetchCards, loading } = useCards()

watch(card, (newCard, oldCard) => {
  if (!newCard || !newCard.uuid) return
  router.push({ name: 'card-detail', params: { id: newCard.uuid } })
})

onMounted(async () => {
  await router.isReady()
  fetchCards()
})
</script>

<template>
  <div class="sm:min-w-60">
    <div v-if="cards.length === 0 && !loading" class="flex flex-col p-4 justify-around">
      <div class="text-center space-y-4 mx-6">
        <h3 class="text-md">You have no cards</h3>
        <ActionButton @click="createCard()" text="Create New Card" />
      </div>
    </div>

    <div v-else class="flex flex-col p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl text-gray-600 font-semibold">My Cards</h2>
        <ActionButton @click="createCard()" text="+ Add" />
      </div>

      <ul>
        <li v-for="card in cards" :key="card" class="mb-4">
          <router-link :to="{ name: 'card-detail', params: { id: card.uuid } }">
            <CardPreview :card="card" />
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
