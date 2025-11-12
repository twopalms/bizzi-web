<script setup lang="ts">
import { computed } from 'vue'
import parsePhoneNumber from 'libphonenumber-js'
import BizziCardUnit from '../components/BizziCardUnit.vue'

// TODO: figure out if we want to show the favicon for a website or not.
// Maybe make it optional?

const props = defineProps({
  card: Object,
  color: {
    type: String,
    default: '#065f46',
  },
})

const cleanWebsite = computed(() => {
  if (!props.card.website) return props.card.website
  if (!props.card.website.startsWith('http')) {
    return 'https://' + props.card.website
  }
  return props.card.website
})

function formatPhone(value: string) {
  if (!value) return ''

  try {
    const parsed = parsePhoneNumber(value)
    const parsedUS = parsePhoneNumber(value, 'US')

    const target = parsed ? parsed : parsedUS

    if (target.isValid()) {
      return `+${target.countryCallingCode} ${target.formatNational()}`
    } else {
      return value
    }
  } catch {
    return value
  }
}

const hasContactInfo = computed(() => {
  if (props.card) {
    return Boolean(props.card.email || props.card.phone || props.card.website)
  }
  return false
})

function getFavicon(url: string) {
  // TODO: figure out how to properly determine if favicon exists
  try {
    const u = new URL(url)
    return `${u.origin}/favicon.ico`
  } catch {
    return null
  }
}

function displayProfilePicture(value: string | object) {
  if (!value) return

  if (typeof value === 'string') {
    return value
  } else if (typeof value === 'object') {
    return URL.createObjectURL(value)
  } else {
    console.error('Bad profile picture object')
  }
}
</script>

<template>
  <div class="flex flex-col rounded-lg bg-white border border-black">
    <div
      class="bg-[var(--cardColor)] flex items-center justify-end min-h-36 max-h-36 rounded-t-lg"
      :style="`--cardColor: ${color}`"
    >
      <img :src="displayProfilePicture(card.picture)" class="rounded-full w-auto h-36 m-4 p-4" />
    </div>
    <div class="p-6">
      <!-- Basic Info --->
      <div v-if="card.name" class="text-4xl font-semibold">{{ card.name }}</div>
      <div v-if="card.job_title" class="text-3xl mb-4">{{ card.job_title }}</div>
      <div v-if="card.company" class="text-2xl">{{ card.company }}</div>
      <div v-if="card.location" class="text-xl">{{ card.location }}</div>
      <div v-if="card.bio" class="italic border-l-2 border-gray-950/30 my-6 pl-4 py-2">
        {{ card.bio }}
      </div>
      <div v-if="hasContactInfo">
        <div
          class="flex flex-col bg-[var(--cardColor)] h-0.5 my-4"
          :style="`--cardColor: ${color}`"
        />

        <!-- Contact Info --->
        <BizziCardUnit v-if="card.email" :color="color" :copyValue="card.email">
          <div class="flex gap-3 items-center px-2">
            <i class="pi pi-envelope" />
            <span>{{ card.email }}</span>
          </div>
        </BizziCardUnit>
        <BizziCardUnit v-if="card.phone" :color="color" :copyValue="card.phone">
          <div class="flex gap-3 items-center px-2">
            <i class="pi pi-phone" />
            <span>{{ formatPhone(card.phone) }}</span>
          </div>
        </BizziCardUnit>
        <BizziCardUnit v-if="cleanWebsite" :color="color" :copyValue="cleanWebsite">
          <div class="flex gap-3 items-center px-2">
            <i class="pi pi-globe" />
            <a :href="cleanWebsite" target="_blank" class="hover:text-blue-800 hover:underline">
              {{ card.website }}
            </a>
          </div>
        </BizziCardUnit>
      </div>

      <!-- Links --->
      <div v-if="card.links.length !== 0">
        <div
          class="flex flex-col bg-[var(--cardColor)] h-0.5 my-4"
          :style="`--cardColor: ${color}`"
        />
        <ol>
          <li v-for="(link, index) in card.links" :key="index">
            <BizziCardUnit :color="color" :copyValue="link.url">
              <div class="flex gap-3 items-center px-2">
                <img height="16" width="16" :src="getFavicon(link.url)" />
                <a
                  v-on:click.stop
                  :href="link.url"
                  target="_blank"
                  class="hover:text-blue-800 hover:underline"
                  >{{ link.name }}</a
                >
              </div>
            </BizziCardUnit>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
