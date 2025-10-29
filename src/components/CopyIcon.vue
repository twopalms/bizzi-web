<script setup lang="ts">
defineProps({
  showSuccess: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <i v-if="showSuccess" class="pi pi-check" />
  <i v-else class="pi pi-copy" />
</template>
