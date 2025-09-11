<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavList from './NavList.vue'

const mainNav = [
  { icon: 'pi-id-card', url: '/cards', label: 'Cards' },
  { icon: 'pi-inbox', url: '/contacts', label: 'Contacts' },
]
const bottomNav = [{ icon: 'pi-user', url: '/account', label: 'Account' }]

const route = useRoute()
const expanded = ref(true)

function toggleExpanded() {
  expanded.value = !expanded.value
}

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    expanded.value = false
  },
)
</script>

<template>
  <div class="sticky top-0 z-50 sm:flex sm:h-screen">
    <aside
      :class="`bg-blue-950 text-gray-100 flex flex-col sm:px-4 sm:py-8 sm:gap-10 ${
        expanded ? 'sm:min-w-48' : ''
      }`"
    >
      <div class="flex justify-between items-center min-h-12 px-3">
        <button @click="toggleExpanded" class="pi pi-bars hover:cursor-pointer" />
        <!-- TODO: Replace with Logo -->
        <header
          :class="`text-xl sm:text-4xl font-bold text-center  ${
            expanded ? 'sm:block' : 'sm:hidden'
          }`"
        >
          Bizzi
        </header>
      </div>
      <div :class="`${expanded ? '' : 'hidden'} mb-2 sm:flex sm:flex-1 sm:flex-col`">
        <NavList
          v-model="expanded"
          :navLinks="mainNav"
          class="flex flex-1 flex-col justify-center"
        />
        <div class="min-h-0.5 bg-gray-200/10 my-4 sm:my-8" />
        <NavList v-model="expanded" :navLinks="bottomNav" />
      </div>
    </aside>
  </div>
</template>
