<script setup lang="ts">
import LeftNav from './components/LeftNav.vue'
</script>

<template>
  <div class="flex flex-1 font-custom h-screen">
    <LeftNav />
    <router-view />
  </div>
</template>

<style scoped></style>
