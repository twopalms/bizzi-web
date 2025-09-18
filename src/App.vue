<script setup lang="ts">
import { useRoute } from 'vue-router'
import LeftNav from './components/LeftNav.vue'

const route = useRoute()
</script>

<template>
  <router-view v-if="['/login', '/signup'].includes(route.fullPath)" />
  <div v-else class="sm:flex font-custom">
    <LeftNav />
    <router-view />
  </div>
</template>
