<script setup lang="ts">
import { computed, ref } from 'vue'
import AirButton from '../components/AirButton.vue'

const file = defineModel<File | null>()

async function handleFileChange() {
  const target = event.target as HTMLInputElement
  const selected = target.files?.[0]
  file.value = selected
}

const preview = computed(() => {
  if (!file.value) return 'Upload'

  if (typeof file.value === 'object') {
    const fileLength = file.value.name.length
    if (fileLength > 25) {
      return '...' + file.value.name.slice(-22)
    }
    return file.value.name
  } else {
    return 'Upload'
  }
})
</script>

<template>
  <AirButton @click="$refs.pictureUpload.click()" class="w-full">
    <span class="text-ellipses">{{ preview }}</span>
    <input
      @change="handleFileChange"
      type="file"
      ref="pictureUpload"
      accept="image/*"
      class="hidden"
    />
  </AirButton>
</template>
