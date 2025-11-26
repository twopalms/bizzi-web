<script setup lang="ts">
import { computed, ref } from 'vue'
import AirButton from '../components/AirButton.vue'

const emit = defineEmits(['change'])
const file = ref(null)

async function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  const selected = target.files?.[0]
  emit('change', selected)
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
    <div class="flex gap-2 items-center justify-center">
      <i class="pi pi-cloud-upload" />
      <span class="text-ellipses">{{ preview }}</span>
    </div>
    <input @change="handleChange" type="file" ref="pictureUpload" accept="image/*" class="hidden" />
  </AirButton>
</template>
