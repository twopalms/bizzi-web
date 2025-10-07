<script setup lang="ts">
const show = defineModel<boolean>()
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
          @click="show = false"
        >
          ✕
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
