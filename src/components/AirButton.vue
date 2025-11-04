<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits(['click'])

const props = defineProps({
  bgColor: { type: String, default: '#bfdbfe' },
  shadowColor: { type: String, default: '#4b5563' },
  enabled: { type: Boolean, default: true },
})

const isPressed = ref(false)
const isHovered = ref(false)
const clickStart = ref(0)
const clickEnd = ref(0)

function handlePressStart() {
  clickStart.value = Date.now()
  isPressed.value = true
}

async function handlePressEnd() {
  clickEnd.value = Date.now()
  const clickTime = clickEnd.value - clickStart.value

  if (clickTime < 75) {
    await new Promise((resolve) => setTimeout(resolve, 75))
  }

  if (isPressed.value && isHovered.value) emit('click')
  isPressed.value = false
}

function handleEnter() {
  isHovered.value = true
}

function handleLeave() {
  isHovered.value = false
  isPressed.value = false
}

// optional: computed classes for disabled state
const buttonClasses = computed(() => [
  'relative border p-2 rounded-lg transition-transform duration-75 z-10',
  isPressed.value ? 'translate-y-0.5' : '-translate-y-0.2',
  props.enabled
    ? 'hover:cursor-pointer'
    : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none',
])

const shadowClasses = computed(() => [
  'absolute inset-0 translate-y-[2px] rounded-lg z-[-1]',
  props.enabled ? '' : 'bg-gray-200',
])
</script>

<template>
  <button
    :disabled="!props.enabled"
    class="relative inline-block select-none z-0"
    @mousedown="handlePressStart"
    @mouseup="handlePressEnd"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <span
      :class="shadowClasses"
      :style="props.enabled ? { backgroundColor: shadowColor } : {}"
    ></span>

    <div :class="buttonClasses" :style="props.enabled ? { backgroundColor: bgColor } : {}">
      <slot></slot>
    </div>
  </button>
</template>
