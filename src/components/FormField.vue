<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  showError: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex gap-2 items-center">
      <label class="font-medium">{{ label }}</label>
      <span v-if="required" class="text-xs">(required)</span>
    </div>
    <slot></slot>
  </div>

  <small v-if="showError && error" class="text-red-800">{{ error }}</small>
</template>
