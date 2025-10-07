<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  element: {
    type: String,
    default: 'input',
  },
  label: String,
  placeholder: String,
  validator: {
    type: Function,
    default: () => '',
  },
  formatter: {
    type: Function,
    default: (value) => value,
  },
  debounce: {
    type: Number,
    default: 1000,
  },
})

const text = defineModel<string>()

// const error = ref('')

function handleBlur() {
  text.value = text.value.trim()
}

const formatted = computed(() => {
  return props.formatter(text.value)
})

const error = computed(() => {
  return props.validator(text.value)
})

// watch(text, (newValue) => {
//   error.value = props.validator(newValue)
// })
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="font-medium">{{ label }}</label>
    <input
      @blur="handleBlur"
      v-if="element == 'input'"
      type="text"
      class="flex flex-grow bg-white rounded p-2 shadow-sm"
      v-model="text"
      :placeholder="placeholder"
    />
    <textarea
      @blur="handleBlur"
      rows="5"
      v-else-if="element == 'textarea'"
      class="flex flex-grow bg-white rounded p-2 shadow-sm"
      v-model="text"
      :placeholder="placeholder"
    />
  </div>
  <small v-if="error" class="text-red-800">{{ error }}</small>
</template>
