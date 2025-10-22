<script setup lang="ts">
import { computed } from 'vue'
import ActionButton from '../components/ActionButton.vue'

const file = defineModel<File | null>()

// const preview = ref('Upload')
async function handleFileChange() {
  const target = event.target as HTMLInputElement
  const selected = target.files?.[0]
  file.value = selected
}

const preview = computed(() => {
  if (typeof file.value === 'object') {
    return file.value.name
  } else {
    return 'Upload'
  }
})
</script>

<template>
  <ActionButton bgColor="#d1d1d1" hoverColor="#e1e1e1" class="relative h-10 border-gray-500 border">
    <span class="absolute inset-0 flex items-center justify-center">{{ preview }}</span>
    <input
      @change="handleFileChange"
      type="file"
      accept="image/*"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </ActionButton>
</template>
