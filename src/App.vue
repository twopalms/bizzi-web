<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LeftNav from './components/LeftNav.vue'

const route = useRoute()
const showNav = computed(() => {
  if (!route.name) return false
  return !['login', 'signup', 'directory-detail'].includes(route.name)
})
</script>

<template>
  <router-view v-if="!showNav" class="h-screen font-[Quicksand]" />
  <div v-else class="h-screen flex font-[Quicksand] overflow-hidden">
    <LeftNav v-if="showNav" />
    <router-view />
  </div>
</template>
