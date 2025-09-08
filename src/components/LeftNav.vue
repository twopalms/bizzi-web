<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const items = ref([
  { label: 'Cards', url: '/cards' },
  { label: 'Contacts', url: '/contacts' },
])

const account = ref({ label: 'Account', url: '/account' })

const isActive = (url: string) => {
  return route.path === url
}

const route = useRoute()

const navStatic = 'px-3 py-2 rounded-md hover:bg-blue-900 hover:text-white'
const navActive = 'bg-blue-900 text-white'
</script>

<template>
  <aside class="w-60 bg-blue-950 text-gray-100 flex flex-col justify-between text-center">
    <!-- TODO: Replace with Logo -->
    <p class="p-4 text-4xl font-bold">Bizzi</p>

    <!-- Nav links -->
    <nav class="flex flex-col space-y-1 px-4">
      <router-link
        v-for="item in items"
        :activeClass="navActive"
        :key="item"
        :to="item.url"
        :class="navStatic"
      >
        {{ item.label }}
      </router-link>
    </nav>
    <div class="py-4 my-8 border-t border-gray-700">
      <nav class="flex flex-col space-y-1 px-4">
        <router-link
          :to="account.url"
          :activeClass="navActive"
          :class="[navStatic, isActive(account.url) ? navActive : '']"
        >
          My Account
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<style></style>
