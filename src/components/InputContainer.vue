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
      v-if="element === 'input'"
      type="text"
      v-model.trim="formatted"
      :placeholder="placeholder"
      class="flex flex-grow bg-white rounded-lg p-2 border border-black shadow-[inset_0_2px_0_0_#9ca3af,inset_0_-2px_0_0_#ffffff] focus:outline-none focus:ring-0"
    />

    <PhoneInput
      v-else-if="element === 'phone'"
      v-model:text="text"
      v-model:error="error"
      :initial="text"
    />

    <textarea
      v-else-if="element === 'textarea'"
      rows="5"
      v-model.trim="formatted"
      :placeholder="placeholder"
      class="flex flex-grow bg-white rounded-lg p-2 border border-black shadow-[inset_0_2px_0_0_#9ca3af,inset_0_-2px_0_0_#ffffff] focus:outline-none focus:ring-0"
    />
  </div>

  <small v-if="error" class="text-red-800">{{ error }}</small>
</template>
