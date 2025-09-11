<script setup lang="ts">
import NavLink from './NavLink.vue'

defineProps({
  navLinks: Array<NavLink>,
})

const model = defineModel()
</script>

<template>
  <nav>
    <ul class="flex flex-col justify-center gap-2">
      <li v-for="item in navLinks" :key="item" class="flex flex-1">
        <NavLink v-if="model" :icon="item.icon" :url="item.url" :label="item.label" />
        <NavLink v-else :icon="item.icon" :url="item.url" />
      </li>
    </ul>
  </nav>
</template>
