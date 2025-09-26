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
})
</script>

<template>
  <button
    class="bg-[var(--bgColor)] hover:bg-[var(--hoverColor)] hover:cursor-pointer text-white font-bold py-2 px-3 rounded-lg"
    :style="`--bgColor: ${bgColor}; --hoverColor: ${hoverColor}`"
  >
    <slot></slot>
  </button>
</template>
