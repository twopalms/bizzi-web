<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavList from './NavList.vue'

const mainNav = [
  // { icon: 'pi-home', url: '/home', label: 'Home' },
  { icon: 'pi-id-card', url: '/cards', label: 'Cards' },
  { icon: 'pi-phone', url: '/contacts', label: 'Contacts' },
  // { icon: 'pi-sparkles', url: '/directory', label: 'Directory' },
]
const bottomNav = [{ icon: 'pi-user', url: '/account', label: 'Account' }]

const route = useRoute()
const expanded = ref(false)

function toggleExpanded() {
  expanded.value = !expanded.value
}

function handleFocusOut() {
  expanded.value = false
}

watch(
  () => route.fullPath,
  () => {
    expanded.value = false
  },
)
</script>

<template>
  <div class="sticky top-0 h-10 bg-blue-950 flex sm:hidden">
    <div class="flex flex-grow items-center justify-between px-3">
      <button @click="toggleExpanded" class="pi pi-bars hover:cursor-pointer text-white" />
      <header class="text-xl sm:text-4xl font-bold text-white">Bizzi</header>
    </div>
  </div>
  <aside
    v-if="expanded"
    @focusout="handleFocusOut"
    tabindex="0"
    class="bg-blue-950 absolute inset-y-0 left-0 z-10 text-white w-2/3 sm:hidden"
  >
    <button
      @click="toggleExpanded"
      class="pi pi-bars hover:cursor-pointer text-white mx-3 mt-3 mb-12"
    />
    <NavList v-model="expanded" :navLinks="mainNav" class="flex flex-1 flex-col justify-center" />
    <div class="min-h-0.5 bg-gray-200/10 my-4 sm:my-8" />
    <NavList v-model="expanded" :navLinks="bottomNav" />
  </aside>
  <div class="z-50 hidden sm:flex sm:h-screen">
    <aside class="bg-blue-950 text-gray-100 flex flex-col sm:px-4 sm:py-8 sm:gap-10 sm:min-w-48">
      <div class="flex justify-between items-center min-h-12 px-3">
        <!-- <button @click="toggleExpanded" class="pi pi-bars hover:cursor-pointer" /> -->
        <!-- TODO: Replace with Logo -->
        <header class="text-xl sm:text-4xl font-bold text-center">Bizzi</header>
      </div>
      <NavList v-model="expanded" :navLinks="mainNav" class="flex flex-1 flex-col justify-center" />
      <div class="min-h-0.5 bg-gray-200/10 my-4 sm:my-8" />
      <NavList v-model="expanded" :navLinks="bottomNav" />
    </aside>
  </div>
</template>
