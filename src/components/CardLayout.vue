<script setup lang="ts">
import { useCardManager } from '../composables/useCardManager.ts'
import CardList from '../components/CardList.vue'

const { isRoot } = useCardManager()
</script>

<template>
  <CardList :class="`${isRoot() ? '' : 'hidden'} sm:block`" />
  <router-view />
</template>
