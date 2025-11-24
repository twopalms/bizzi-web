<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth.ts'

const { user } = useAuth()

console.log()

const now = new Date()
const isoString = now.toISOString().slice(0, 10)
</script>

<template>
  <div class="flex flex-grow p-8 justify-between">
    <h2 class="text-xl">
      Hello, <span class="font-semibold">{{ user.data.user.display }}</span>
    </h2>
    <div class="flex flex-col gap-2">
      <p class="font-semibold text-right">Today</p>
      <hr />
      <p>{{ isoString }}</p>
    </div>
  </div>
</template>
