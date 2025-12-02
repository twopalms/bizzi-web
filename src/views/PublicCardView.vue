<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Head } from '@unhead/vue/components'
import { useAuth } from '../composables/useAuth.ts'
import AirButton from '../components/AirButton.vue'
import BizziCard from '../components/BizziCard.vue'
import NotFound from '../components/NotFound.vue'
import ContactForm from '../components/ContactForm.vue'
import ShareCardForm from '../components/ShareCardForm.vue'
import FocusModal from '../components/FocusModal.vue'

// TODO: if the card owner has a paid account, remove branding
// TODO: make contact CTA configurable
// TODO: if active user has a bizzi account, allow option to share with one click
const API_BASE = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const { makeAuthenticatedRequest } = useAuth()

const card = ref(null)
const color = '#4fd4d6'
const loading = ref(true)
const notFound = ref(false)
const showContactForm = ref(false)
const showShareForm = ref(false)

async function fetchPublicCard() {
  const slug = route.params.slug
  const url = `${API_BASE}/cards/?slug=${slug}`

  try {
    const resp = await makeAuthenticatedRequest(url, { method: 'GET' })

    if (resp.ok) {
      const data = await resp.json()
      if (data.count == 0) {
        notFound.value = true
        return null
      } else if (data.count == 1) {
        return data.items[0]
      } else {
        console.error('I did something wrong')
      }
    } else {
      console.warn('Error loading card')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function handleClickContactForm() {
  showContactForm.value = !showContactForm.value
}

function handleClickShareForm() {
  showShareForm.value = !showShareForm.value
}

async function closeModal() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  showContactForm.value = false
  showShareForm.value = false
}

onMounted(async () => {
  card.value = await fetchPublicCard()
})
</script>

<template>
  <Head>
    <title>{{ card?.name ? `${card.name} - Bizzi` : 'Loading Card...' }}</title>
    <meta name="description" :content="`${card?.name} - Bizzi Card`" />
  </Head>
  <NotFound v-if="notFound" />
  <FocusModal v-model="showContactForm">
    <ContactForm @submit="closeModal" :cardUUID="card.uuid" :name="card?.name" />
  </FocusModal>
  <FocusModal v-model="showShareForm">
    <ShareCardForm @submit="closeModal" :cardUUID="card.uuid" />
  </FocusModal>
  <div
    v-if="!loading"
    class="flex flex-col flex-grow items-center min-h-screen pb-12"
    :style="`background-color: ${card.color}20`"
  >
    <header
      class="w-full sticky top-0 bg-blue-300 border-b text-center text-gray-700 text-sm py-2 z-10"
    >
      <a href="https://www.bizzicard.com" target="blank" class="hover:underline">
        Made with
        <span class="font-bold">Bizzi</span>. Get <span class="font-bold">Bizzi</span> now.
      </a>
    </header>
    <div class="flex flex-1 flex-col justify-center">
      <div class="min-h-12" />
      <div class="flex justify-center mb-4 gap-4">
        <AirButton @click="handleClickShareForm">
          <div class="flex items-center gap-3">
            <i class="pi pi-upload" />
            <span>Share this card</span>
          </div>
        </AirButton>
        <AirButton @click="handleClickContactForm">
          <div class="flex items-center gap-3">
            <i class="pi pi-pen-to-square" />
            <span
              >Share my info with <span class="font-semibold">{{ card?.name }}</span></span
            >
          </div>
        </AirButton>
      </div>
      <BizziCard
        v-if="card"
        :color="color"
        :card="card"
        class="w-120 max-w-120 max-h-[70vh] overflow-y-auto"
      />
    </div>
  </div>
</template>
