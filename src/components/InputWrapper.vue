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
  required: Boolean,
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
  showError: {
    type: Boolean,
    default: true,
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
    <div class="flex gap-2 items-center">
      <label class="font-medium">{{ label }}</label>
      <span v-if="required" class="text-xs">(required)</span>
    </div>
    <slot></slot>
  </div>

  <small v-if="showError && error" class="text-red-800">{{ error }}</small>
</template>
