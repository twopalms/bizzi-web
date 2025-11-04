<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LeftNav from './components/LeftNav.vue'

const route = useRoute()

const showNav = computed(() => {
  return !['login', 'signup', 'directory-detail'].includes(route.name)
})
</script>

<template>
  <router-view v-if="!showNav" />
  <div v-else class="h-screen flex font-custom overflow-hidden">
    <LeftNav v-if="showNav" />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
