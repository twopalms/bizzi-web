<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCardManager } from '../composables/useCardManager.ts'
import CardList from '../components/CardList.vue'

const route = useRoute()
const { activeCardIndex, cardList, fetchCards, isRoot, setActiveCard } = useCardManager()

onMounted(async () => {
  fetchCards()
})

watch(
  () => route.path,
  () => {
    if (isRoot()) {
      setActiveCard(null)
    }
  },
)
</script>

<template>
  <CardList
    :activeCardIndex="activeCardIndex"
    :cardList="cardList"
    :class="`${isRoot() ? '' : 'hidden'} sm:block`"
  />
  <div v-if="activeCardIndex === null" class="flex flex-1 justify-center items-center text-2xl">
    <h4>Select a card to get started</h4>
  </div>
  <router-view />
</template>
