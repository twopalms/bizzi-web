<script setup lang="ts">
import { useRoute } from 'vue-router'
import LeftNav from './components/LeftNav.vue'

const route = useRoute()
</script>

<template>
  <router-view v-if="['login', 'signup', 'directory-detail'].includes(route.name)" />
  <div v-else class="h-screen flex font-custom overflow-hidden">
    <LeftNav class="shrink-0" />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
