<script setup lang="ts">
import { computed } from 'vue'
import PhoneInput from '../components/PhoneInput.vue'

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
  parser: {
    type: Function,
    default: (value: string) => value,
  },
  formatter: {
    type: Function,
    default: (value: string) => value,
  },
})

const text = defineModel<string>()

const formatted = computed({
  get() {
    return props.formatter(text.value)
  },
  set(value: string) {
    text.value = props.parser(value)
  },
})

const error = computed(() => props.validator(text.value))
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="font-medium">{{ label }}</label>
    <input
      v-if="element == 'input'"
      type="text"
      class="flex flex-grow bg-white rounded p-2 shadow-sm"
      v-model.trim="formatted"
      :placeholder="placeholder"
    />
    <PhoneInput
      v-else-if="element == 'phone'"
      v-model:text="text"
      v-model:error="error"
      :initial="text"
    />
    <textarea
      rows="5"
      v-else-if="element == 'textarea'"
      class="flex flex-grow bg-white rounded p-2 shadow-sm"
      v-model.trim="formatted"
      :placeholder="placeholder"
    />
  </div>
  <small v-if="error" class="text-red-800">{{ error }}</small>
</template>
