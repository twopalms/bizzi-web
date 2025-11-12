<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: 'border-blue-500',
    required: false,
  },
})
</script>

<template>
  <div class="flex flex-col gap-3 justify-center items-center">
    <div>Loading...</div>
    <div class="animate-spin rounded-lg h-8 w-4 border-4" :class="color"></div>
  </div>
</template>
