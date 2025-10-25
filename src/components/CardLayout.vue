<script setup lang="ts">
import { onMounted } from 'vue'
import { useCardManager } from '../composables/useCardManager.ts'
import CardList from '../components/CardList.vue'

const { activeCardIndex, fetchCards, isRoot } = useCardManager()

onMounted(async () => {
  fetchCards()
})
</script>

<template>
  <div class="relative flex h-full w-full">
    <div
      class="absolute inset-0 -z-10 bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] bg-[size:10px_10px]"
    />

    <div :class="`${isRoot() ? '' : 'hidden'} sm:block bg-gray-100`">
      <CardList />
    </div>

    <div v-if="activeCardIndex === null" class="flex flex-1 justify-center items-center text-2xl">
      <h4>Select a card to get started</h4>
    </div>

    <router-view />
  </div>
</template>
