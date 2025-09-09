<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCards } from '../composables/useCards.ts'

defineProps({
  color: {
    type: String,
    default: 'emerald-800',
  },
})

const { card, loading, fetchCard, hasContactInfo } = useCards()
const route = useRoute()

watch(() => route.params.id, fetchCard, { immediate: true })

function getFavicon(url: string) {
  try {
    const u = new URL(url)
    return `${u.origin}/favicon.ico`
  } catch {
    return null
  }
}
</script>

<template>
  <div v-if="!loading" class="flex flex-col max-w-120 rounded-lg shadow-lg shadow-black/40">
    <div :class="`bg-${color} flex items-center justify-end min-h-36 max-h-36 rounded-t-lg`">
      <img :src="card.picture" :alt="card.name" class="rounded-full w-auto h-36 m-4 p-4" />
    </div>
    <div class="p-6">
      <h3 v-if="card.name" class="text-4xl font-semibold">{{ card.name }}</h3>
      <div v-if="card.job_title" class="text-3xl mb-4">{{ card.job_title }}</div>
      <div v-if="card.company" class="text-2xl">{{ card.company }}</div>
      <div v-if="card.location" class="text-xl">{{ card.location }}</div>
      <div v-if="card.bio" class="italic border-l-2 border-gray-950/30 my-6 pl-4 py-2">
        {{ card.bio }}
      </div>
      <div v-if="hasContactInfo">
        <div :class="`flex flex-col bg-${color} h-0.5 my-4`" />
        <div class="ml-4">
          <div v-if="card.email" :class="`flex py-2 items-center hover:bg-${color}`">
            <i class="pi pi-envelope text-sm mr-4"></i>
            {{ card.email }}
          </div>
          <div v-if="card.phone_fmt" class="flex py-2 items-center">
            <i class="pi pi-phone text-sm mr-4"></i>
            {{ card.phone_fmt }}
          </div>
          <div v-if="card.website" class="flex py-2 items-center">
            <i class="pi pi-globe text-sm mr-4"></i>
            <a :href="card.website" target="_blank" class="hover:text-blue-800 hover:underline">{{
              card.website
            }}</a>
          </div>
        </div>
      </div>
      <div v-if="card.links.length !== 0">
        <div :class="`flex flex-col bg-${color} h-0.5 my-4`" />
        <div class="ml-4">
          <ol>
            <li v-for="link in card.links" :key="link" class="mb-4">
              <div class="flex py-2 items-center">
                <img height="16" width="16" class="shrink-0 mr-4" :src="getFavicon(link.url)" />
                <a :href="link.url" target="_blank" class="hover:text-blue-800 hover:underline">{{
                  link.url
                }}</a>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
