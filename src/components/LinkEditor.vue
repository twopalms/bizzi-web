<script setup lang="ts">
import { computed, ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import FormField from '../components/FormField.vue'

const emit = defineEmits(['submitDelete', 'submitDone'])

const editing = defineModel('editing', { default: false })
const name = defineModel('name')
const url = defineModel('url')
const favicon = defineModel('favicon')

const showError = ref(false)

watchDebounced(
  url,
  (newUrl) => {
    if (newUrl && !newUrl.startsWith('http')) {
      newUrl = 'https://' + url.value
    }

    favicon.value = getFaviconURL(newUrl)
  },
  { immediate: true },
)

function getFaviconURL(url: string) {
  try {
    const u = new URL(url)
    const newUrl = `${u.origin}/favicon.ico`
    return newUrl
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

const linkError = computed(() => {
  return isValidUrl(url.value) ? '' : 'Invalid URL'
})
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
    <FormField label="Name">
      <input v-model.trim="name" placeholder="Instagram" type="text" />
    </FormField>
    <FormField label="URL" :error="linkError" :showError="showError">
      <input
        @input="showError = false"
        v-model.trim="url"
        placeholder="https://instagram.com"
        type="url"
      />
    </FormField>
  </div>
</template>
