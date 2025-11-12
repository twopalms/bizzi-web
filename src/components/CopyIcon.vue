<script setup lang="ts">
defineProps({
  showSuccess: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div v-if="showSuccess" class="flex gap-3 items-center">
    <span>Copied!</span>
    <i class="pi pi-check text-green-600" />
  </div>
  <i v-else class="pi pi-copy" />
</template>
