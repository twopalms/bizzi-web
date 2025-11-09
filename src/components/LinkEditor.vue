<script setup lang="ts">
import { computed, ref } from 'vue'
import InputContainer from '../components/InputContainer.vue'

const emit = defineEmits(['submitDelete', 'submitDone', 'faviconReady'])
const editing = defineModel('editing', { default: false })
const name = defineModel('name')
const url = defineModel('url')
const showError = ref(false)
const favicon = computed(() => {
  return getFaviconURL(url.value)
})

function getFaviconURL(url: string) {
  try {
    const u = new URL(url)
    emit('faviconReady')
    return `${u.origin}/favicon.ico`
  } catch {
    return null
  }
}

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function handleSubmitDone() {
  let val = url.value

  if (val && !val.startsWith('http')) {
    val = 'https://' + url.value
  }

  if (!isValidUrl(val)) {
    showError.value = true
  } else {
    showError.value = false
    url.value = val
    editing.value = false
    emit('submitDone')
  }
}

function handleSubmitDelete() {
  editing.value = false
  emit('submitDelete')
}

// import { watchDebounced } from '@vueuse/core'

// watchDebounced(
//   url,
//   (newUrl) => {
//     favicon.value = getFaviconURL(newUrl)
//   },
//   { initial: true, debounce: 500 },
// )
</script>

<template>
  <div class="flex justify-between items-center">
    <div v-if="!editing" class="w-full flex gap-3 items-center">
      <img v-if="favicon" width="16" :src="favicon" />
      <label class="font-medium truncate">{{ name }}</label>
    </div>

    <div v-if="editing" class="flex flex-grow justify-between items-center mb-4">
      <button @click="handleSubmitDelete" class="text-red-800 hover:cursor-pointer">
        Remove Link
      </button>
      <button @click="handleSubmitDone" class="hover:cursor-pointer">
        {{ 'Done' }}
      </button>
    </div>

    <button v-else @click="editing = true" class="hover:cursor-pointer">
      {{ 'Edit' }}
    </button>
  </div>
  <div v-if="editing" class="flex flex-col gap-3">
    <InputContainer v-model="name" label="Name" placeholder="Instagram" element="input" />
    <InputContainer
      v-model="url"
      label="URL"
      placeholder="https://instagram.com"
      element="input"
      :validator="(val) => (isValidUrl(val) ? '' : 'Invalid URL')"
      :showError="showError"
    />
  </div>
</template>
