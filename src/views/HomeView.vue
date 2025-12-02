<script setup lang="ts">
import { useAuth } from '../composables/useAuth.ts'

const { user } = useAuth()

const now = new Date()
const isoString = now.toISOString().slice(0, 10)
</script>

<template>
  <div class="flex flex-col w-full p-8 gap-8">
    <div class="flex justify-between">
      <h2 class="text-xl">
        Hello, <span class="font-semibold">{{ user.data.user.display }}</span>
      </h2>
      <div class="flex flex-col gap-2">
        <p class="font-semibold text-right">Today</p>
        <hr />
        <p>{{ isoString }}</p>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4 bg-sky-500/20 rounded-lg">
      <button class="rounded-lg border border-black">
        <router-link to="/cards" class="underline text-blue-500 hover:cursor-pointer">
          Cards
        </router-link>
      </button>
    </div>
  </div>
</template>
