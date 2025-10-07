<script setup lang="ts">
defineProps({
  bgColor: {
    type: String,
    default: '#20265c',
  },
  hoverColor: {
    type: String,
    default: '#353b78',
  },
  enabled: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <button
    :disabled="!enabled"
    :class="[
      'text-white font-bold py-2 px-3 rounded-lg',
      enabled
        ? 'bg-[var(--bgColor)] hover:bg-[var(--hoverColor)] hover:cursor-pointer'
        : 'bg-gray-400 cursor-not-allowed opacity-60',
    ]"
    :style="`--bgColor: ${bgColor}; --hoverColor: ${hoverColor}`"
  >
    <slot></slot>
  </button>
</template>
