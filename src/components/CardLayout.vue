<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCards } from '../composables/useCards.ts'
import CardList from '../components/CardList.vue'

const { card } = useCards()
const route = useRoute()

function isRoot() {
  return route.path == '/cards'
}

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (isRoot()) {
      card.value = null
    }
  },
  { immediate: true },
)
</script>

<template>
  <CardList :class="`${isRoot() ? '' : 'hidden'} sm:block`" />
  <router-view />
</template>
