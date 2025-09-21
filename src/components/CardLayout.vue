<script setup lang="ts">
import { onMounted } from 'vue'
import { useCardManager } from '../composables/useCardManager.ts'
import CardList from '../components/CardList.vue'

const { activeCardIndex, cardList, fetchCards, isRoot } = useCardManager()

onMounted(async () => {
  fetchCards()
})
</script>

<template>
  <CardList
    :activeCardIndex="activeCardIndex"
    :cardList="cardList"
    :class="`${isRoot() ? '' : 'hidden'} sm:block bg-gray-100`"
  />
  <div v-if="activeCardIndex === null" class="flex flex-1 justify-center items-center text-2xl">
    <h4>Select a card to get started</h4>
  </div>
  <router-view />
</template>
