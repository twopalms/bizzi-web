<script setup lang="ts">
import { ref } from 'vue'

const expanded = ref(false)

function toggleExpanded() {
  expanded.value = !expanded.value
}

defineProps({
  title: String,
})
</script>

<template>
  <div class="p-2">
    <div @click="toggleExpanded" class="flex flex-1 gap-4 items-center hover:cursor-pointer">
      <i
        class="pi pi-angle-right transition-transform duration-300"
        :class="{ 'rotate-90': expanded }"
      />
      <div class="flex flex-grow border-b border-gray-300 py-2">
        <h4 class="font-semibold text-md">{{ title }}</h4>
      </div>
    </div>
    <div v-if="expanded" class="pt-4 mx-2">
      <div class="flex flex-col gap-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
