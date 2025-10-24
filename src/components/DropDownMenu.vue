<script setup lang="ts">
import { computed, ref } from 'vue'

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

const index = defineModel<integer>()
const expanded = ref(false)

const value = computed(() => {
  return props.choices[index.value]
})

function handleSelect(ix) {
  index.value = ix
  expanded.value = false
}
</script>

<template>
  <div>
    <div @click="() => (expanded = !expanded)" class="flex items-center gap-2 px-4">
      <span :style="{ width: `${width}px` }">{{ value }}</span>
      <i class="pi pi-sort-down-fill" />
    </div>
    <div class="relative">
      <div
        v-if="expanded"
        class="flex flex-col absolute top-3 z-10 bg-gray-100 border border-gray-200 w-[80%] justify-center"
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
