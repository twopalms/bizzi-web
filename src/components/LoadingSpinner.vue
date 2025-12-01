<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Loading...',
  },
  color: {
    type: String,
    default: 'border-blue-500',
  },
})
</script>

<template>
  <div class="flex flex-col gap-3 justify-center items-center">
    <span v-if="text">{{ text }}</span>
    <div class="animate-spin rounded-lg h-8 w-4 border-4" :class="color"></div>
  </div>
</template>
