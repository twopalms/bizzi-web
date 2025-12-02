<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

const target = useTemplateRef<HTMLElement>('target')
const expanded = defineModel('expanded', { default: false })
const index = defineModel('index')

const props = defineProps({
  choices: {
    type: Array<Any>,
    default: [],
  },
  width: {
    type: Number,
    default: 20,
  },
})

const value = computed(() => {
  return props.choices[index.value]
})

function handleSelect(ix) {
  index.value = ix
  expanded.value = false
}

onClickOutside(target, () => (expanded.value = false))
</script>

<template>
  <div ref="target">
    <div class="flex items-center gap-2 px-4">
      <span :style="{ width: `${width}px` }">{{ value }}</span>
      <i class="pi pi-sort-down-fill" />
    </div>
    <div class="relative">
      <div
        v-if="expanded"
        class="flex flex-col absolute top-3 bg-gray-100 border border-gray-200 w-[80%] justify-center shadow-lg"
      >
        <div
          @click="handleSelect(i)"
          v-for="(choice, i) in choices"
          :key="i"
          class="px-4 py-2 text-sm text-gray-800 hover:bg-blue-200"
        >
          <span>{{ choice }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
