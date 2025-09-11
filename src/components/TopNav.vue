<script setup lang="ts">
import { ref } from 'vue'
import NavList from './NavList.vue'

const mainNav = [
  { icon: 'pi-id-card', url: '/cards', label: 'Cards' },
  { icon: 'pi-inbox', url: '/contacts', label: 'Contacts' },
]

const expanded = ref(true)

const bottomNav = [{ icon: 'pi-user', url: '/account', label: 'Account' }]

function toggleExpanded() {
  expanded.value = !expanded.value
  console.log(expanded.value)
}
</script>

<template>
  <div class="flex flex-1 h-screen">
    <aside
      v-if="!expanded"
      class="bg-blue-950 text-gray-100 flex flex-col px-4 pb-8 pt-8 gap-10 sm:min-w-10"
    >
      <div class="flex justify-center min-h-12">
        <button @click="toggleExpanded" class="pi pi-bars hover:cursor-pointer" />
      </div>

      <NavList v-model="expanded" :navLinks="mainNav" class="flex flex-1 flex-col justify-center" />
      <div class="min-h-0.5 bg-gray-200/10 my-8" />
      <NavList v-model="expanded" :navLinks="bottomNav" />
    </aside>
    <aside v-else class="bg-blue-950 min-w-42 text-gray-100 flex flex-col px-4 pb-8 pt-8 gap-10">
      <!-- TODO: Replace with Logo -->
      <div class="flex justify-between items-center min-h-12 px-3">
        <button @click="toggleExpanded" class="pi pi-bars hover:cursor-pointer" />
        <header class="text-4xl font-bold text-center">Bizzi</header>
      </div>

      <NavList v-model="expanded" :navLinks="mainNav" class="flex flex-1 flex-col justify-center" />
      <div class="min-h-0.5 bg-gray-200/10 my-8" />
      <NavList v-model="expanded" :navLinks="bottomNav" />
    </aside>
  </div>
</template>
