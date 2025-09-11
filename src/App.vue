<script setup lang="ts">
import LeftNav from './components/LeftNav.vue'
</script>

<template>
  <div class="sm:flex font-custom">
    <LeftNav />
    <router-view />
  </div>
</template>
