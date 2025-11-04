<script setup lang="ts">
import { computed } from 'vue'

const file = defineModel<File | null>()

async function handleFileChange() {
  const target = event.target as HTMLInputElement
  const selected = target.files?.[0]
  file.value = selected
}

const preview = computed(() => {
  if (!file.value) return 'Upload'

  if (typeof file.value === 'object') {
    return file.value.name
  } else {
    return 'Upload'
  }
})
</script>

<template>
  <div class="relative h-8 border-gray-500 border">
    <span class="absolute inset-0 flex items-center justify-center">{{ preview }}</span>
    <input
      @change="handleFileChange"
      type="file"
      accept="image/*"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>
</template>
