<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import parsePhoneNumber from 'libphonenumber-js'
import CopyIcon from '../components/CopyIcon.vue'

const props = defineProps({
  card: Object,
  color: {
    type: String,
    default: '#065f46',
  },
})

// TODO: display "copied" text when a copy is successful
const { copy } = useClipboard()

const contactItemIndex = ref(null)
const showCopyContactItemSuccessIndex = ref(null)
const linkItemIndex = ref(null)
const showCopyLinkItemSuccessIndex = ref(null)

async function handleCopy(text: string) {
  copy(text)

  showCopyContactItemSuccessIndex.value = contactItemIndex.value
  showCopyLinkItemSuccessIndex.value = linkItemIndex.value

  await new Promise((r) => setTimeout(r, 1000))

  showCopyContactItemSuccessIndex.value = null
  showCopyLinkItemSuccessIndex.value = null
}

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
  try {
    const u = new URL(url)
    return `${u.origin}/favicon.ico`
  } catch {
    return null
  }
}

function cleanContactInfo(data) {
  const output = []

  if (data.email) {
    const obj = { name: 'email', icon: 'pi-envelope', value: data.email }
    output.push(obj)
  }

  if (data.phone) {
    const obj = {
      name: 'phone',
      icon: 'pi-phone',
      value: formatPhone(data.phone),
    }
    output.push(obj)
  }

  if (data.website) {
    const obj = { name: 'website', icon: 'pi-globe', value: data.website }
    output.push(obj)
  }

  return output
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

// TODO: make size passable as props
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
      <h3 v-if="card.name" class="text-4xl font-semibold">{{ card.name }}</h3>
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
        <div
          @click="handleCopy(item.value)"
          @mouseover="contactItemIndex = index"
          @mouseleave="contactItemIndex = null"
          v-for="(item, index) in cleanContactInfo(card)"
          :key="index"
          class="flex py-2 items-center hover:ring-1 hover:ring-[var(--borderColor)] hover:bg-[var(--bgColor)] rounded-lg cursor-pointer"
          :style="`--borderColor: ${color}80; --bgColor: ${color}10`"
        >
          <i :class="`pi ${item.icon} text-sm mx-4`"></i>
          <div class="flex flex-1 justify-between items-center mr-4">
            <a
              v-if="item.name == 'website'"
              :href="item.value"
              target="_blank"
              class="hover:text-blue-800 hover:underline"
            >
              {{ item.value }}
            </a>
            <a v-else>{{ item.value }}</a>
            <CopyIcon
              v-if="contactItemIndex == index"
              :showSuccess="showCopyContactItemSuccessIndex == contactItemIndex"
            />
          </div>
        </div>
      </div>
      <div v-if="card.links.length !== 0">
        <div
          class="flex flex-col bg-[var(--cardColor)] h-0.5 my-4"
          :style="`--cardColor: ${color}`"
        />
        <ol>
          <li
            @click="handleCopy(link.url)"
            @mouseover="linkItemIndex = index"
            @mouseleave="linkItemIndex = null"
            v-for="(link, index) in card.links"
            :key="index"
            class="flex py-2 items-center hover:ring-1 hover:ring-[var(--borderColor)] hover:bg-[var(--bgColor)] rounded-lg cursor-pointer"
            :style="`--borderColor: ${color}80; --bgColor: ${color}10`"
          >
            <img height="16" width="16" class="shrink-0 mx-4" :src="getFavicon(link.url)" />
            <a :href="link.url" target="_blank" class="hover:text-blue-800 hover:underline">{{
              link.url
            }}</a>
            <CopyIcon
              v-if="linkItemIndex == index"
              :showSuccess="showCopyLinkItemSuccessIndex == linkItemIndex"
            />
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
