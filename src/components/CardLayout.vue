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
  <router-view />
</template>
