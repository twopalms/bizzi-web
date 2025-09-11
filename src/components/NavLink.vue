<script setup lang="ts">
defineProps({
  icon: String,
  url: String,
  label: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <router-link
    :to="url"
    class="w-full px-3 py-2 rounded-md hover:bg-blue-900 hover:text-white"
    activeClass="bg-blue-900 text-white"
  >
    <i :class="`pi ${icon}`"></i>
    <span v-if="label" class="ml-4">{{ label }}</span>
  </router-link>
</template>
