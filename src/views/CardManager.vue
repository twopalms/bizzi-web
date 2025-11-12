<script setup lang="ts">
import { computed, ref } from 'vue'
import CardList from '../components/CardList.vue'
import CardEditArea from '../components/CardEditArea.vue'

// TODO: bring back router urls when selecting cards

const cards = ref([])
const activeCardIndex = ref(null)

const activeCard = computed({
  get() {
    if (activeCardIndex.value === null) return null
    return cards.value[activeCardIndex.value]
  },
  set(newCard) {
    cards.value[activeCardIndex.value] = newCard
  },
})

async function deleteCard() {
  cards.value.splice(activeCardIndex.value, 1)
  activeCardIndex.value = null
}
</script>

<template>
  <div class="flex h-full w-full">
    <CardList v-model:cards="cards" v-model:activeCardIndex="activeCardIndex" />
    <CardEditArea v-model="activeCard" @submit-delete="deleteCard" />
  </div>
</template>
