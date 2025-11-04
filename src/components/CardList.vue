<script setup lang="ts">
import { ref } from 'vue'
import { useCardManager } from '../composables/useCardManager.ts'
import AirButton from '../components/AirButton.vue'
import CardPreview from '../components/CardPreview.vue'
import FocusModal from '../components/FocusModal.vue'

const showPaywall = ref(false)
const { activeCardIndex, cardList, createCard, error, loading, setActiveCard, setError } =
  useCardManager()

async function handleCreateCard() {
  // TODO: check user's payment plan
  if (cardList.value.length == 2) {
    showPaywall.value = true
    return
  }
  await createCard()
}
</script>

<template>
  <div class="h-full border-r-2 border-gray-300 sm:min-w-60">
    <div v-if="!loading && cardList.length === 0" class="flex flex-col p-4 justify-around">
      <div class="text-center space-y-4 mx-6">
        <h3 class="text-md">You have no cards</h3>
        <AirButton @click="handleCreateCard">Create New Card</AirButton>
      </div>
    </div>

    <div v-else class="flex flex-col p-4 gap-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl text-gray-600 font-semibold">My Cards</h2>
        <AirButton @click="handleCreateCard">+ Add</AirButton>
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
  <FocusModal v-model="showPaywall">
    <!-- TODO: add branding and replace google with pricing page -->
    <div class="text-center flex flex-col gap-5">
      <p>Oh no! Free plans only support up to 2 cards.</p>
      <h3 class="text-lg font-bold">Let's get Bizzi</h3>
      <p>Subscribe now to create up to 10 business cards</p>
      <div class="flex-shrink">
        <a href="https://google.com" target="_blank">
          <AirButton> Compare Plans </AirButton>
        </a>
      </div>
    </div>
  </FocusModal>
</template>
