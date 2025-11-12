<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import CopyIcon from '../components/CopyIcon.vue'

const props = defineProps({
  color: String,
  copyValue: {},
})

const { copy } = useClipboard()

const showCopyIcon = ref(false)
const showCopySuccess = ref(false)

function handleCopy() {
  copy(props.copyValue)
  showCopySuccess.value = true

  setTimeout(() => {
    showCopySuccess.value = false
    showCopyIcon.value = false
  }, 750)
}

function handleMouseLeave() {
  if (!showCopySuccess.value) {
    showCopyIcon.value = false
  }
}
</script>

<template>
  <div
    @click="handleCopy"
    @mouseover="showCopyIcon = true"
    @mouseleave="handleMouseLeave"
    class="flex justify-between items-center p-2 hover:ring-1 hover:ring-[var(--borderColor)] hover:bg-[var(--bgColor)] rounded-lg hover:cursor-pointer"
    :style="`--borderColor: ${color}80; --bgColor: ${color}10`"
  >
    <slot></slot>
    <CopyIcon v-if="showCopyIcon && copyValue" :showSuccess="showCopySuccess" />
  </div>
</template>
